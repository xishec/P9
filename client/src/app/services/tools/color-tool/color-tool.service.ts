import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { ColorType, DEFAULT_WHITE, DEFAULT_GRAY_0, DEFAULT_GRAY_1 } from 'src/constants/color-constants';

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
        if (this.colorQueue.value.length < 10) {
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
                console.warn('color selection undefined');
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

    translateRGBToHex(R: number, G: number, B: number, A?: number): string {
        let r = Number(Math.ceil(R)).toString(16);
        let g = Number(Math.ceil(G)).toString(16);
        let b = Number(Math.ceil(B)).toString(16);

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

    getPreviewColorOpacityHex(): string {
        return this.previewColor.value.slice(6, 8);
    }

    getPreviewColorOpacityDecimal(): string {
        let opacityHex = this.getPreviewColorOpacityHex();
        let opacity = (parseInt(opacityHex, 16) / 255).toFixed(1).toString();
        if (opacity === '1.0') return '1';
        return opacity;
    }

    switchPrimarySecondary() {
        const temp: string = this.primaryColor.value;
        this.primaryColor.next(this.secondaryColor.value);
        this.secondaryColor.next(temp);
    }
}
