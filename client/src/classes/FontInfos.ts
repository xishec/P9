import { FONT_ALIGN, FONT_STYLE, FONT_WEIGHT } from 'src/constants/tool-constants';

export interface FontInfo {
    fontFamily: string;
    fontSize: string;
    fontAlign: FONT_ALIGN;
    fontStyle: FONT_STYLE;
    fontWeight: FONT_WEIGHT;
    fontColor: string;
}
