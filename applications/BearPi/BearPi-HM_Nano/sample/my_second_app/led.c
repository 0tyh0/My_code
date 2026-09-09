
#include <stdio.h>
#include <unistd.h>

#include "ohos_init.h"
#include "cmsis_os2.h"
#include "wifiiot_gpio.h"
#include "wifiiot_gpio_ex.h"

#define HM_LED_GPIO 2
#define E53_LED_GPIO  14

volatile int hm_led_state = 0;
volatile int e53_led_state = 0;

void led_toggle(WifiIotGpioIdx id)
{
    WifiIotGpioValue val;
    GpioGetOutputVal(id,&val);
    GpioSetOutputVal(id, val == 0 ? 1 : 0);
}

static void F1_Pressed(char *arg)
{
    (void)arg;
    hm_led_state = !hm_led_state;
}
static void F2_Pressed(char *arg)
{
    (void)arg;
    e53_led_state = !e53_led_state;

}
static void ButtonExampleEntry(void)
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

    while(1)
    {
        if(hm_led_state != 0)
        {
            led_toggle(HM_LED_GPIO);
            osDelay(2);
            led_toggle(HM_LED_GPIO);
            hm_led_state = 0;
        }
        osDelay(2);
        if(e53_led_state != 0)
        {
            led_toggle(E53_LED_GPIO);
            osDelay(2);
            led_toggle(E53_LED_GPIO);
            e53_le