#include "ohos_init.h"
#include "ohos_types.h"

#include"unistd.h"
#include <stdio.h>

#define name "谭亚亨"
#define num "202340700105"
#define sex "男"
#define class "物联网一班"
void MyHello(void)
{
    int i=1;
    while(1)
    {
        printf("第%d次,姓名 %s, 学号 %s, 班级 %s, 性别 %s.\n", i, name, num, class, class, sex);
        usleep(3000000);
        i++;
    }  
}



SYS_RUN(MyHello);
