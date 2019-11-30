import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import {
    COLOR_TYPE,
    DEFAULT_GRAY_0,
    DEFAULT_GRAY_1,
    DEFAULT_WHITE,
    MAX_NUMBER_OF_LAST_COLORS,
    MAX_RGB_NUMBER,
    MIN_RGB_NUMBER,
} from 'src/constants/color-constants';

@Injectable({
    providedIn: 'root',
})
export class ColorToolService {
    previewColor: BehaviorSubject<string> = new BehaviorSubject<string>(DEFAULT_WHITE);
    backgroundColor: BehaviorSubject<string> = new BehaviorSubject<string>(DEFAULT_WHITE);
    primaryColor: BehaviorSubject<string> = new BehaviorSubject<string>(DEFAULT_GRAY_0);
    secondaryColor: BehaviorSubject<string> = new BehaviorSubject<string>(DEFAULT_GRAY_1);

    selectedColorType: BehaviorSubject<COLOR_TYPE | undefined> = new BehaviorSubject<COLOR_TYPE | undefined>(undefined);
    showColorPalette: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    colorQueue: BehaviorSubject<string[]> = new BehaviorSubject<string[]>([DEFAULT_WHITE]);

    addColorToQueue(color: string): void {
        if (this.colorQueue.value.length < MAX_NUMBER_OF_LAST_COLORS) {
            this.colorQueue.value.push(color);
        } else {
            this.colorQueue.value.shift();
            this.colorQueue.value.push(color);
        }
        this.colorQueue.next(this.colorQueue.value);
    }

    changePrimaryColor(primaryColor: string): void {
        this.primaryColor.next(primaryColor);
    }

    changeSecondaryColor(secondaryColor: string): void {
        this.secondaryColor.next(secondaryColor);
    }

    changePreviewColor(previewColor: string) {
        this.previewColor.next(previewColor);
    }

    changeBackgroundColor(backgroundColor: string) {
        this.backgroundColor.next(backgroundColor);
    }

    changeColorOnFocus(colorOnFocus: string) {
        switch (this.selectedColorType.value) {
            case COLOR_TYPE.backgroundColor:
                this.backgroundColor.next(colorOnFocus);
                break;
            case COLOR_TYPE.primaryColor:
                this.primaryColor.next(colorOnFocus);
                break;
            case COLOR_TYPE.secondaryColor:
                this.secondaryColor.next(colorOnFocus);
                break;
            default:
                break;
        }
    }

    changeSelectedColorType(selectedColorType: COLOR_TYPE | undefined) {
        this.selectedColorType.next(selectedColorType);
    }

    changeShowColorPalette(showColorPalette: boolean) {
        this.showColorPalette.next(showColorPalette);
    }

    getColorOnFocus(): string {
        switch (this.selectedColorType.value) {
            case COLOR_TYPE.backgroundColor:
                return this.backgroundColor.value;
            case COLOR_TYPE.primaryColor:
                return this.primaryColor.value;
            case COLOR_TYPE.secondaryColor:
                return this.secondaryColor.value;
            default:
                return DEFAULT_WHITE;
        }
    }

    translateRGBToHex(R: number, G: number, B: number, A?: number): string {
        const r: string = this.decimalToHex(R);
        const g: string = this.decimalToHex(G);
        const b: string = this.decimalToHex(B);
        if (A !== undefined) {
            const a = this.decimalToHex(A * 255);
            return r + g + b + a;
        }
        return r + g + b;
    }

    decimalToHex(RGBNumber: number): string {
        let correctedRGBNumber = '';
        if (RGBNumber > MAX_RGB_NUMBER) {
            correctedRGBNumber = 'ff';
        } else if (RGBNumber < MIN_RGB_NUMBER) {
            correctedRGBNumber = '00';
        } else {
            correctedRGBNumber = Number(Math.ceil(RGBNumber)).toString(16);
            if (correctedRGBNumber.length === 1) {
                correctedRGBNumber = '0' + correctedRGBNumber;
            }
        }
        return correctedRGBNumber;
    }

    getPreviewColorOpacityHex(): string {
        return this.previewColor.value.slice(6, 8);
    }

    getPreviewColorOpacityDecimal(): string {
        const opacityHex = this.getPreviewColorOpacityHex();
        const opacity = (parseInt(opacityHex, 16) / 255).toFixed(1).toString();
        if (opacity === '1.0') {
            return '1';
        } else if (opacity === '0.0') {
            return '0';
        }
        return opacity;
    }

    switchPrimarySecondary() {
        const temp: string = this.primaryColor.value;
        this.primaryColor.next(this.secondaryColor.value);
        this.secondaryColor.next(temp);
    }
}
