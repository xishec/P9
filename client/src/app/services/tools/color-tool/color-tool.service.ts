import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { ColorType, DEFAULT_GRAY_0, DEFAULT_GRAY_1, DEFAULT_WHITE } from 'src/constants/color-constants';
import { BehaviorSubject, Observable } from 'rxjs';
import {
    COLORS,
    ColorType,
    MAX_RGB_NUMBER,
    MIN_RGB_NUMBER,
    MAX_NUMBER_OF_LAST_COLORS,
} from 'src/constants/color-constants';
import { Color } from '../../../../classes/Color';

@Injectable({
    providedIn: 'root',
})
export class ColorToolService {
    previewColor: BehaviorSubject<string> = new BehaviorSubject<string>(DEFAULT_WHITE);
    backgroundColor: BehaviorSubject<string> = new BehaviorSubject<string>(DEFAULT_WHITE);
    primaryColor: BehaviorSubject<string> = new BehaviorSubject<string>(DEFAULT_GRAY_0);
    secondaryColor: BehaviorSubject<string> = new BehaviorSubject<string>(DEFAULT_GRAY_1);

    selectedColorType: BehaviorSubject<ColorType | undefined> = new BehaviorSubject<ColorType | undefined>(undefined);
    showColorPalette: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    colorQueue: BehaviorSubject<string[]> = new BehaviorSubject<string[]>([]);

    addColorToQueue(color: string): void {
        if (this.colorQueue.value.length < MAX_NUMBER_OF_LAST_COLORS) {
            this.colorQueue.value.push(color);
        } else {
            this.colorQueue.value.shift();
            this.colorQueue.value.push(color);
        }
        this.colorQueue.next(this.colorQueue.value);
    }

    changePreviewColor(previewColor: string) {
        this.previewColor.next(previewColor);
    }

    changeBackgroundColor(backgroundColor: string) {
        this.backgroundColor.next(backgroundColor);
    }

    changeColorOnFocus(colorOnFocus: string) {
        switch (this.selectedColorType.value) {
            case ColorType.backgroundColor:
                this.backgroundColor.next(colorOnFocus);
                break;
            case ColorType.primaryColor:
                this.primaryColor.next(colorOnFocus);
                break;
            case ColorType.secondaryColor:
                this.secondaryColor.next(colorOnFocus);
                break;
            default:
                break;
        }
    }

    changeSelectedColorType(selectedColorType: ColorType | undefined) {
        this.selectedColorType.next(selectedColorType);
    }

    changShowColorPalette(showColorPalette: boolean) {
        this.showColorPalette.next(showColorPalette);
    }

    getColorOnFocus(): string {
        switch (this.selectedColorType.value) {
            case ColorType.backgroundColor:
                return this.backgroundColor.value;
            case ColorType.primaryColor:
                return this.primaryColor.value;
            case ColorType.secondaryColor:
                return this.secondaryColor.value;
            default:
                return DEFAULT_WHITE;
        }
    }

    rgbToHex(R: number, G: number, B: number): string {
        let r: string = this.correctRGB(R);
        let g: string = this.correctRGB(G);
        let b: string = this.correctRGB(B);

        if (r.length === 1) {
            r = '0' + r;
        }
        if (g.length === 1) {
            g = '0' + g;
        }
        if (b.length === 1) {
            b = '0' + b;
        }
        if (A !== undefined) {
            let a = Number(Math.ceil(A * 255)).toString(16);
            if (a.length === 1) {
                a = '0' + a;
            }
            return r + g + b + a;
        }
        return r + g + b;
    }

    correctRGB(RGBNumber: number): string {
        let correctedRGBNumber: string = '';
        if (RGBNumber > MAX_RGB_NUMBER) {
            correctedRGBNumber = 'ff';
        } else if (RGBNumber < MIN_RGB_NUMBER) {
            correctedRGBNumber = '00';
        } else {
            correctedRGBNumber = Number(Math.ceil(RGBNumber)).toString(16);
        }
        return correctedRGBNumber;
    }

    getPreviewColorOpacityHex(): string {
        return this.previewColor.value.slice(6, 8);
    }

    getPreviewColorOpacityDecimal(): string {
        const opacityHex = this.getPreviewColorOpacityHex();
        const opacity = (parseInt(opacityHex, 16) / 255).toFixed(1).toString();
        if (opacity === '1.0') { return '1'; }
        return opacity;
    }

    switchPrimarySecondary() {
        const temp: string = this.primaryColor.value;
        this.primaryColor.next(this.secondaryColor.value);
        this.secondaryColor.next(temp);
    }
}
