/*
oled.c
1.3寸 128x64 OLED 的 I2C 驱动和文字显示。

本驱动默认按 SH1106 配置(1.3 寸模块基本都是这颗芯片)；想换回 0.96 寸的
SSD1306，把下面的 OLED_CTRL_SH1106 宏改成 0 即可。

SH1106 和 SSD1306 的关键区别(换屏时最容易踩的两个坑)
  1. SH1106 没有 SSD1306 的 0x8D 电荷泵命令，它用 0xAD 控制内部 DC-DC 升压：
     OledCmd(0xAD); OledCmd(0x8B);  少了这两条屏幕不会亮。
  2. SH1106 只支持"页寻址"，没有 0x20/0x21/0x22 这套水平/垂直寻址命令；
     而且它片内显存是 132 列，可见的 128 列从第 2 列开始。
     所以刷新时一页一页地设列/页地址，列地址还要加 2 的偏移(OLED_COL_OFFSET)。

接线(不对屏幕就不亮或花屏)
  OLED SCL -> GPIO1       OLED SDA -> GPIO0
  OLED VCC -> 3.3V        OLED GND -> GND
  默认 7 位 I2C 地址是 0x3C，写地址就是 0x3C<<1 = 0x78。
  如果你的屏地址是 0x3D，改下面 OLED_ADDR_7BIT 宏即可。

为什么用 I2C1 而不用 I2C0
  I2C0 的 SCL 占 GPIO14，而 GPIO14 正好是你 E53 板上灯用的脚，会冲突。
  I2C1 用的是 GPIO0/GPIO1，没有冲突，所以驱动固定走 I2C1。

显示原理
  屏幕内部有一块显存，每一字节代表某一列上连续的 8 个点(8 行算一页，共 8 页)，
  可见画面是 128x64、共 1024 字节(SH1106 片内有 132 列，多出的 2 列不显示)。
  本驱动在内存里也存一份同样大小的缓冲 gFb。画任何东西(点、字符、汉字、
  清屏)都先画在这份缓冲里，画完再调一次 OledRefresh()，把整份缓冲推给屏幕。
  好处是写屏集中在刷新一处，不会因为频繁发 I2C 而闪烁。

坐标和行
  x 向右 0..127，y 向下 0..63，左上角是原点。
  文字按 16 像素高的行排列，一共 4 行：
    行0 是 y0..15，行1 是 y16..31，行2 是 y32..47，行3 是 y48..63
  ASCII 半宽字占 8x16(一行最多16个)，汉字全宽占 16x16(一行最多8个)。
  中英文可以混排，超出右边界的内容自动不画。

汉字字模格式(用 PCtoLCD2002 取模时看这段)
  每个汉字 32 字节，按列存放，16 列、每列两个字节：
    hz[col*2]   = 第 col 列 行0..7，最高位 bit7 是这一段的第0行
    hz[col*2+1] = 第 col 列 行8..15，最高位 bit7 是这一段的第0行
  对应取模选项：阴码 / 逐列式 / 字节高位在前。
*/

#include <stdint.h>
#include <string.h>

#include "wifiiot_gpio.h"
#include "wifiiot_gpio_ex.h"
#include "wifiiot_i2c.h"
#include "wifiiot_i2c_ex.h"

#include "oled.h"
#include "oled_font.h"

/* 一、可配置项：硬件参数基本只改这里 */
#define OLED_I2C_IDX     WIFI_IOT_I2C_IDX_1     /* 用 I2C1 总线 */
#define OLED_SDA_GPIO    WIFI_IOT_IO_NAME_GPIO_0 /* SDA = GPIO0 */
#define OLED_SCL_GPIO    WIFI_IOT_IO_NAME_GPIO_1 /* SCL = GPIO1 */
#define OLED_I2C_SPEED   400000                  /* I2C 速率 400k */
#define OLED_ADDR_7BIT   0x3C                    /* 屏的 7 位地址 */

#define OLED_CTRL_SH1106 1                       /* 1=SH1106(1.3寸)；0=SSD1306(0.96寸) */

#define OLED_W           128                     /* 屏宽，像素 */
#define OLED_SCREEN_H    64                      /* 屏高，像素 */
#define OLED_PAGES       (OLED_SCREEN_H / 8)     /* 页数 64/8=8 */
#define OLED_TXT_LINES   (OLED_SCREEN_H / 16)    /* 文本行数 64/16=4 */

/* SH1106 片内显存 132 列，可见区从第 2 列开始，写数据时要把列地址偏 2；
   SSD1306 的 128 列显存与可见区对齐，偏移为 0。 */
#if OLED_CTRL_SH1106
#define OLED_COL_OFFSET  2
#else
#define OLED_COL_OFFSET  0
#endif

/* 二、底层 I2C 收发
   屏发数据时第一字节是"控制字节"(SSD1306/SH1106 一样)：
     0x00 表示后面跟的是命令，0x40 表示后面跟的是数据。 */

/* 给屏发一条命令。
   有些命令还带参数，参数本身也要作为命令发出去，
   所以配寄存器时连续多调几次本函数即可。 */
static void OledCmd(uint8_t cmd)
{
    uint8_t buf[2] = { 0x00, cmd };           /* buf[0]=控制字节, buf[1]=命令 */
    WifiIotI2cData d = { 0 };
    d.sendBuf = buf;                          /* 要发的内容 */
    d.sendLen = 2;                            /* 共 2 字节 */
    I2cWrite(OLED_I2C_IDX, (uint16_t)(OLED_ADDR_7BIT << 1) | 0x00, &d);
}

/* 给屏发图像数据，用来刷新显存。
   整屏数据较多，I2C 一次别发太多，这里拆成 32 字节一包发，
   每包前补一个 0x40 控制字节。屏内部的写指针会自动接着写，不怕分包。 */
static void OledData(const uint8_t *p, uint16_t len)
{
    while (len) {
        uint16_t n = (len > 32) ? 32 : len;   /* 本包最多 32 字节 */
        uint8_t buf[33];
        buf[0] = 0x40;                        /* 数据控制字节 */
        memcpy(&buf[1], p, n);                /* 复制这一包的数据 */
        WifiIotI2cData d = { 0 };
        d.sendBuf = buf;
        d.sendLen = (uint16_t)(n + 1);
        I2cWrite(OLED_I2C_IDX, (uint16_t)(OLED_ADDR_7BIT << 1) | 0x00, &d);
        p += n;
        len -= n;
    }
}

/* 三、显存缓冲和画点
   gFb[页号][x] 表示屏幕第 x 列、某一页里那 8 个点(每个 bit 一个点)。 */
static uint8_t gFb[OLED_PAGES][OLED_W];       /* 整幅画面缓冲，8x128=1024B */

/* 在 (x,y) 处画或擦一个点：on=1 点亮，on=0 熄灭，越界的自动忽略 */
static void OledSetPixel(int16_t x, int16_t y, int on)
{
    if (x < 0 || x >= OLED_W || y < 0 || y >= OLED_SCREEN_H) {
        return;                               /* 在屏幕外，不处理 */
    }
    uint8_t page = (uint8_t)(y >> 3);         /* y/8：这个点属于哪一页 */
    uint8_t bit  = (uint8_t)(1u << (y & 7));  /* y%8：页内的第几位 */
    if (on) {
        gFb[page][x] |= bit;                  /* 对应位置 1 */
    } else {
        gFb[page][x] &= (uint8_t)~bit;        /* 对应位清 0 */
    }
}

/* 四、字符和汉字的绘制 */

/* 画一个 ASCII 字符(8 宽 x 16 高)。
   字模每个字符 16 字节：
     bytes[0..7] 存 8 列的 行0..7，最低位 bit0 是行0
     bytes[8..15]存 8 列的 行8..15 */
static void OledDrawAscii(uint8_t x, uint8_t y, unsigned char ch)
{
    if (ch < 0x20 || ch > 0x7E) {             /* 只画可见字符 0x20~0x7E */
        return;
    }
    const uint8_t *d = gAsc2_1608[ch - 0x20]; /* 取出这个字符的 16 字节字模 */
    for (uint8_t col = 0; col < 8; col++) {   /* 一列一列画 */
        uint8_t top = d[col];                 /* 本列上半段 行0..7 */
        uint8_t bot = d[col + 8];             /* 本列下半段 行8..15 */
        for (uint8_t r = 0; r < 8; r++) {
            if (top & (1u << r)) {
                OledSetPixel(x + col, y + r, 1);      /* 画上半段的点 */
            }
            if (bot & (1u << r)) {
                OledSetPixel(x + col, y + r + 8, 1);  /* 画下半段的点 */
            }
        }
    }
}

/* 画一个汉字(16 宽 x 16 高)，字模格式见文件开头说明 */
static void OledDrawHanzi(uint8_t x, uint8_t y, const uint8_t *hz)
{
    for (uint8_t col = 0; col < 16; col++) {  /* 汉字共 16 列 */
        uint8_t top = hz[col * 2];            /* 第 col 列 行0..7 */
        uint8_t bot = hz[col * 2 + 1];        /* 第 col 列 行8..15 */
        for (uint8_t r = 0; r < 8; r++) {
            /* 注意：汉字字模最高位(bit7)是这一段的第一行 */
            if (top & (0x80u >> r)) {
                OledSetPixel(x + col, y + r, 1);      /* 上半段 */
            }
            if (bot & (0x80u >> r)) {
                OledSetPixel(x + col, y + r + 8, 1);  /* 下半段 */
            }
        }
    }
}

/* 把字符串当前字符按 UTF-8 解码成一个码点，并让 *next 指向下一个字符。
   返回 <0x80 是 ASCII；>=0x80 一般是汉字(3 字节 UTF-8)。
   例：汉字"底"的 UTF-8 是三字节，解码后得到码点 0x5E95。 */
static unsigned OledDecodeUtf8(const char *s, const char **next)
{
    uint8_t b0 = (uint8_t)s[0];
    if (b0 < 0x80) {                          /* 1 字节：ASCII */
        *next = s + 1;
        return b0;
    }
    if ((b0 & 0xE0) == 0xC0 && (s[1] & 0xC0) == 0x80) {   /* 2 字节 */
        *next = s + 2;
        return ((b0 & 0x1F) << 6) | ((uint8_t)s[1] & 0x3F);
    }
    if ((b0 & 0xF0) == 0xE0 && (s[1] & 0xC0) == 0x80 &&
        (s[2] & 0xC0) == 0x80) {                          /* 3 字节(汉字) */
        *next = s + 3;
        return ((b0 & 0x0F) << 12) | (((uint8_t)s[1] & 0x3F) << 6) |
               ((uint8_t)s[2] & 0x3F);
    }
    *next = s + 1;                            /* 其它情况按 1 字节处理 */
    return b0;
}

/* 按码点在汉字表里找字模，找到返回 32 字节，找不到返回空(那格空白) */
static const uint8_t *OledFindHanzi(unsigned cp)
{
    for (int i = 0; i < gHanziTabLen; i++) {
        if (gHanziTab[i].cp == cp) {
            return gHanziTab[i].glyph;
        }
    }
    return NULL;
}

/* 五、对外接口(在 oled.h 里声明) */

/* 初始化屏幕。
   先把 GPIO0/GPIO1 复用成 I2C1，初始化 I2C，再按 SH1106 手册推荐的顺序
   发一串命令把屏配好，最后清屏并刷新一次。
   如果画面上下颠倒，把下面命令里的 0xA1 和 0xA0、0xC8 和 0xC0 对调即可。 */
void OledInit(void)
{
    /* 1) 引脚复用成 I2C1 */
    IoSetFunc(OLED_SDA_GPIO, WIFI_IOT_IO_FUNC_GPIO_0_I2C1_SDA);
    IoSetFunc(OLED_SCL_GPIO, WIFI_IOT_IO_FUNC_GPIO_1_I2C1_SCL);

    /* 2) 打开 I2C1，速度 400k */
    I2cInit(OLED_I2C_IDX, OLED_I2C_SPEED);
    I2cSetBaudrate(OLED_I2C_IDX, OLED_I2C_SPEED);

    /* 3) 初始化命令序列，按顺序发 */
    OledCmd(0xAE);       /* 关显示 */

#if OLED_CTRL_SH1106
    OledCmd(0xAD);       /* SH1106 内部 DC-DC 升压开关 */
    OledCmd(0x8B);       /* 0x8B 打开(必须)，0x8A 关闭 */
#else
    OledCmd(0x8D);       /* SSD1306 电荷泵开关 */
    OledCmd(0x14);
#endif

    OledCmd(0xD5);       /* 内部时钟分频 */
    OledCmd(0x80);
    OledCmd(0xA8);       /* 多路复用比，128x64 屏用 64(0x3F) */
    OledCmd(0x3F);
    OledCmd(0xD3);       /* 显示偏移量 */
    OledCmd(0x00);
    OledCmd(0x40);       /* 起始显示行 */
    OledCmd(0xA1);       /* 段重映射，0xA0 可左右镜像 */
    OledCmd(0xC8);       /* COM 扫描方向，0xC0 可上下翻转 */
    OledCmd(0xDA);       /* COM 引脚配置 */
    OledCmd(0x12);
    OledCmd(0x81);       /* 对比度 */
    OledCmd(0xCF);
    OledCmd(0xD9);       /* 预充电周期 */
    OledCmd(0xF1);
    OledCmd(0xDB);       /* VCOMH 电压 */
    OledCmd(0x40);
    OledCmd(0xA6);       /* 正常显示，不用反色 */
    OledCmd(0xA4);       /* 恢复显示显存内容 */
    OledCmd(0x2E);       /* 关闭滚动 */
    OledCmd(0xAF);       /* 开显示 */

    /* 4) 先清屏再刷新，保证上电画面干净 */
    OledClear(0);
    OledRefresh();
}

/* 全屏清屏。fill=1 全亮，fill=0 全灭(一般用 0) */
void OledClear(int fill)
{
    uint8_t v = fill ? 0xFF : 0x00;
    memset(gFb, v, sizeof(gFb));
}

/* 把 (x,y) 起、w*h 的矩形区域全部点亮(on=1)或熄灭(on=0)。
   常用来先擦掉一整行再写新内容。 */
void OledFillRect(uint8_t x, uint8_t y, uint8_t w, uint8_t h, int on)
{
    for (uint8_t yy = y; yy < (uint8_t)(y + h) && yy < OLED_SCREEN_H; yy++) {
        for (uint8_t xx = x; xx < (uint8_t)(x + w) && xx < OLED_W; xx++) {
            OledSetPixel(xx, yy, on);
        }
    }
}

/* 在 (x,y) 显示一段字符串。
   ASCII 半宽显示；汉字按 UTF-8 解码后在汉字表里找 16x16 字模来画。
   表里没有的字会留 16 像素空白继续往后画，不会出错。 */
void OledShowString(uint8_t x, uint8_t y, const char *str)
{
    uint8_t cx = x;                           /* 当前画到的 x 位置 */
    while (*str && cx < OLED_W) {             /* 没到结尾也没超右边界就继续 */
        const char *next;
        unsigned cp = OledDecodeUtf8(str, &next);

        if (cp < 0x80) {                      /* ASCII，占半宽 8px */
            OledDrawAscii(cx, y, (unsigned char)cp);
            cx += 8;
        } else {                              /* 汉字等，占全宽 16px */
            const uint8_t *glyph = OledFindHanzi(cp);
            if (glyph) {
                OledDrawHanzi(cx, y, glyph);
            }
            cx += 16;                         /* 没有字模也前进，保证对齐 */
        }
        str = next;                           /* 换到下一个字符 */
    }
}

/* 刷新某一文本行，line 是 0~3。
   先整行擦黑(清掉旧内容)，再从行首画新的。适合局部更新一行。 */
void OledShowLine(uint8_t line, const char *str)
{
    if (line >= OLED_TXT_LINES) {
        return;
    }
    OledFillRect(0, (uint8_t)(line * 16), OLED_W, 16, 0); /* 整行先擦黑 */
    OledShowString(0, (uint8_t)(line * 16), str);
}

/* 把整份缓冲推给屏幕。
   SH1106 只支持页寻址：一页一页地"设列地址 -> 设页地址 -> 发这一页 128 字节"，
   每页发完屏内列指针会自动回到该页开头，所以每页都要重新设一次列地址。
   列地址分高低两个半字节发：0x00|低4位 和 0x10|高4位，页地址是 0xB0|页号。 */
void OledRefresh(void)
{
#if OLED_CTRL_SH1106
    for (uint8_t page = 0; page < OLED_PAGES; page++) {
        OledCmd((uint8_t)(0x00 | (OLED_COL_OFFSET & 0x0F)));        /* 列地址低 4 位 */
        OledCmd((uint8_t)(0x10 | ((OLED_COL_OFFSET >> 4) & 0x0F))); /* 列地址高 4 位 */
        OledCmd((uint8_t)(0xB0 | page));                             /* 页地址 */
        OledData(gFb[page], OLED_W);                                 /* 这一页 128 字节 */
    }
#else
    OledCmd(0x21); OledCmd(0x00); OledCmd(0x7F);   /* 列范围 0~127 */
    OledCmd(0x22); OledCmd(0x00); OledCmd(0x07);   /* 页范围 0~7 */
    OledData((const uint8_t *)gFb, (uint16_t)sizeof(gFb));
#endif
}
