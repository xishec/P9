import { Renderer2 } from '@angular/core';
import { FontInfo } from 'src/classes/FontInfos';
import { HTMLAttribute } from 'src/constants/tool-constants';

export class TextStyle {
    fontInfo: FontInfo = new FontInfo();
    renderer: Renderer2;

    textBox: SVGTextElement;

    setTextStyle() {
        this.renderer.setAttribute(this.textBox, HTMLAttribute.font_family, this.fontInfo.fontType);
        this.renderer.setAttribute(this.textBox, HTMLAttribute.font_size, this.fontInfo.fontSize);
        this.renderer.setAttribute(this.textBox, HTMLAttribute.font_style, this.fontInfo.fontStyle);
        this.renderer.setAttribute(this.textBox, HTMLAttribute.font_weight, this.fontInfo.fontWeight);
        this.renderer.setAttribute(this.textBox, HTMLAttribute.text_anchor, this.fontInfo.fontAlign);
        this.renderer.setAttribute(this.textBox, HTMLAttribute.fill, this.fontInfo.fontColor);
    }
}
