/*
oled.h
1.3寸 SH1106 OLED(128x64) 驱动的对外接口。

驱动默认按 SH1106 配置。若换成 0.96 寸的 SSD1306，只需把 oled.c 顶部的
OLED_CTRL_SH1106 宏改成 0，本头文件里的接口不用动。

接线(改引脚到 oled.c 顶部宏)
  SCL -> GPIO1    SDA -> GPIO0
  VCC -> 3.3V     GND -> GND
  默认 7 位地址 0x3C。

坐标系和行
  x 向右 0..127，y 向下 0..63，原点在左上角。
  文字按 16 像素高的行排，共 4 行：
    行0=y0..15  行1=y16..31  行2=y32..47  行3=y48..63
  ASCII 半宽字 8x16(一行最多16个)，汉字全宽 16x16(一行最多8个)。

用法示例
  OledInit();                   先初始化
  OledShowLine(0, "用户:谭亚亨");  往第0行写内容(中英可混排)
  OledShowLine(1, "底板灯亮");
  OledRefresh();                把整屏内容刷到屏幕上

注意：显示函数只画进内部缓冲，最后要调一次 OledRefresh() 屏幕才会更新。
*/

#ifndef OLED_H
#define OLED_H

#include <stdint.h>

#ifdef __cplusplus
extern "C" {
#endif

/* 初始化屏幕：把 GPIO0/GPIO1 配成 I2C1、初始化 I2C、发配置命令、
   最后清屏并刷新。程序启动时调用一次即可。 */
void OledInit(void);

/* 全屏清屏。fill=1 全亮，fill=0 全灭(一般传 0)。 */
void OledClear(int fill);

/* 点亮或熄灭 (x,y) 起的一块 w*h 的矩形区域。on=1 亮，on=0 灭。
   可用 OledFillRect(0, y, 128, 16, 0) 擦掉一整行。 */
void OledFillRect(uint8_t x, uint8_t y, uint8_t w, uint8_t h, int on);

/* 在 (x,y) 显示字符串，支持中英混排。
   ASCII 按 8x16 画，汉字按 UTF-8 解码后在字模表里找 16x16 字模画，
   找不到的字会留空白。
   注意：源码要存成 UTF-8(无BOM)，否则汉字对不上字模。 */
void OledShowString(uint8_t x, uint8_t y, const char *str);

/* 清空并重画某一文本行(line=0~3，每行 16px 高)。 */
void OledShowLine(uint8_t line, const char *str);

/* 把整幅内部缓冲刷到屏幕。凡改过画面，最后都调它一次才会看到新内容。 */
void OledRefresh(void);

#ifdef __cplusplus
}
#endif

#endif /* OLED_H */
