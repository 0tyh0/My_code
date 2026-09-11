
#include <stdio.h>
#include <unistd.h>

#include "ohos_init.h"
#include "cmsis_os2.h"
#include "wifiiot_gpio.h"
#include "wifiiot_gpio_ex.h"

#include "oled.h"            /* ===== [OLED 新增] ===== */

#define HM_LED_GPIO 2
#define E53_LED_GPIO  14
#define DEBOUNCE_MS   50u     /* 消抖时间阈值（ms）——原为 50，补 u 仅为避免编译告警，数值不变 */

#define myname "谭亚亨"
#define num "202340700105"

static volatile uint8_t hm_led_state = 0;
static volatile uint8_t e53_led_state = 0;

// 记录每个按键上次触发的时间（系统 tick）
static volatile uint64_t last_f1_time = 0;
static volatile uint64_t last_f2_time = 0;

/* ===== [OLED 新增] 显示函数：按两灯的当前电平刷新 OLED（中文显示） ===== */
static void OledDisplay(void)
{
    WifiIotGpioValue bv = WIFI_IOT_GPIO_VALUE0;
    WifiIotGpioValue ev = WIFI_IOT_GPIO_VALUE0;

    GpioGetOutputVal((WifiIotGpioIdx)HM_LED_GPIO, &bv);
    GpioGetOutputVal((WifiIotGpioIdx)E53_LED_GPIO, &ev);

    /* 行0：用户信息（名字；编码注意存成 UTF-8 无 BOM） */
    OledShowLine(0, "用户:" myname);
    /* 行1：Key1/底板/下 LED 状态 */
    OledShowLine(1, (bv == WIFI_IOT_GPIO_VALUE1) ? "底板灯亮" : "底板灯灭");
    /* 行2：Key2/E53/上 LED 状态 */
    OledShowLine(2, (ev == WIFI_IOT_GPIO_VALUE1) ? "E53灯亮" : "E53灯灭");

    /* 行3 清空：避免与行1/行2 重复 */
    OledShowLine(3, "");

    OledRefresh();
}

void led_toggle(WifiIotGpioIdx id)
{
    WifiIotGpioValue val;
    GpioGetOutputVal(id,&val);
    GpioSetOutputVal(id, val == 0 ? 1 : 0);
}

static void F1_Pressed(char *arg)
{
    (void)arg;

    uint64_t now = osKernelGetTickCount();          // 获取当前系统 tick（ms）
    if (now - last_f1_time > DEBOUNCE_MS) {         // 间隔足够，有效按下
        hm_led_state = !hm_led_state;
    }
    last_f1_time = now;
}
static void F2_Pressed(char *arg)
{
    (void)arg;
    uint64_t now = osKernelGetTickCount();          // 获取当前系统 tick（ms）
    if (now - last_f2_time > DEBOUNCE_MS) {         // 间隔足够，有效按下
        e53_led_state = !e53_led_state;
    }
    last_f2_time = now;
}
static void Key_BlinkyLed_task(void)
{
    GpioInit();

    //初始化LED灯
    IoSetFunc(HM_LED_GPIO, WIFI_IOT_IO_FUNC_GPIO_2_GPIO);
    IoSetFunc(E53_LED_GPIO, WIFI_IOT_IO_FUNC_GPIO_14_GPIO);

    GpioSetDir(HM_LED_GPIO, WIFI_IOT_GPIO_DIR_OUT);
    GpioSetDir(E53_LED_GPIO, WIFI_IOT_GPIO_DIR_OUT);

    //初始化F1按键，设置为下降沿触发中断
    IoSetFunc(WIFI_IOT_IO_NAME_GPIO_11, WIFI_IOT_IO_FUNC_GPIO_11_GPIO);

    GpioSetDir(WIFI_IOT_IO_NAME_GPIO_11, WIFI_IOT_GPIO_DIR_IN);
    IoSetPull(WIFI_IOT_IO_NAME_GPIO_11, WIFI_IOT_IO_PULL_UP);
    GpioRegisterIsrFunc(WIFI_IOT_IO_NAME_GPIO_11, WIFI_IOT_INT_TYPE_EDGE, WIFI_IOT_GPIO_EDGE_FALL_LEVEL_LOW, F1_Pressed, NULL);

    //初始化F2按键，设置为下降沿触发中断
    IoSetFunc(WIFI_IOT_IO_NAME_GPIO_12, WIFI_IOT_IO_FUNC_GPIO_12_GPIO);

    GpioSetDir(WIFI_IOT_IO_NAME_GPIO_12, WIFI_IOT_GPIO_DIR_IN);
    IoSetPull(WIFI_IOT_IO_NAME_GPIO_12, WIFI_IOT_IO_PULL_UP);
    GpioRegisterIsrFunc(WIFI_IOT_IO_NAME_GPIO_12, WIFI_IOT_INT_TYPE_EDGE, WIFI_IOT_GPIO_EDGE_FALL_LEVEL_LOW, F2_Pressed, NULL);

    //初始化 OLED，并显示首屏 
    OledInit();
    OledDisplay();
    printf("dev: %s  %s\r\n", myname, num);   /* 串口：开发者信息 */

    while(1)
    {
        if(hm_led_state != 0)
        {
            led_toggle(HM_LED_GPIO);
            printf("底板灯亮\n");
            OledDisplay();          /* OLED：底板灯 亮 */
            osDelay(50);
            printf("底板灯灭\n");
            led_toggle(HM_LED_GPIO);
            OledDisplay();          /* OLED：底板灯 灭 */
        }
        if(e53_led_state != 0)
        {
            led_toggle(E53_LED_GPIO);
            printf("E53灯亮\n");
            OledDisplay();          /* OLED：E53灯 亮 */
            osDelay(50);
            printf("E53灯灭\n");
            led_toggle(E53_LED_GPIO);
            OledDisplay();          /* OLED：E53灯 灭 */
        }
        osDelay(300);
    }

}

static void  Key_BlinkyLed(void)
{
    osThreadAttr_t attr;

    attr.name = "LedTask";
    attr.attr_bits = 0U;
    attr.cb_mem = NULL;
    attr.cb_size = 0U;
    attr.stack_mem = NULL;
    attr.stack_size = 2048;    /* 原为512；加了OLED后给大些防栈溢出（不影响逻辑） */
    attr.priority = 25;

    if (osThreadNew((osThreadFunc_t)Key_BlinkyLed_task, NULL, &attr) == NULL)
    {
        printf("Falied to create LedTask!\n");
    }
}

APP_FEATURE_INIT(Key_BlinkyLed);
