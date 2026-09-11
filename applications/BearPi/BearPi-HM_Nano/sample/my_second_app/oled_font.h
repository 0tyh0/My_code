/*
 * oled_font.h -- 字库对外声明
 *
 * 字库数据都在 oled_font.c 里（ASCII 部分自动生成；汉字 16x16 目前为占位）。
 */
#ifndef OLED_FONT_H
#define OLED_FONT_H

#ifdef __cplusplus
extern "C" {
#endif

/* ASCII 8x16 字库，下标 = 字符 - 0x20（0x20 ' ' ~ 0x7E '~'，共 95 个） */
extern const unsigned char gAsc2_1608[95][16];

/* 16x16 汉字字模表项 */
typedef struct {
    unsigned int cp;          /* Unicode 码点（UTF-8 解码后） */
    const unsigned char *glyph; /* 32 字节字模 */
} HanziGlyph;

/* 本工程会用到的汉字字模表（未取模前 glyph 指向全 0 占位） */
extern const HanziGlyph gHanziTab[];
extern const int gHanziTabLen;

#ifdef __cplusplus
}
#endif

#endif /* OLED_FONT_H */
