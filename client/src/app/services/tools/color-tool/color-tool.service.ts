import { Injectable } from '@angular/core';

import { BehaviorSubject } from 'rxjs';
import { COLORS, ColorType } from 'src/constants/color-constants';
import { Color } from '../../../../classes/Color';

@Injectable({
    providedIn: 'root',
})
export class ColorToolService {
    readonly colors: Color[] = COLORS;

    previewColor: BehaviorSubject<string> = new BehaviorSubject<string>(COLORS[0].hex);
    backgroundColor: BehaviorSubject<string> = new BehaviorSubject<string>(COLORS[0].hex);
    primaryColor: BehaviorSubject<string> = new BehaviorSubject<string>(COLORS[1].hex);
    secondaryColor: BehaviorSubject<string> = new BehaviorSubject<string>(COLORS[2].hex);
    selectedColor: BehaviorSubject<ColorType | undefined> = new BehaviorSubject<ColorType | undefined>(undefined);
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
        switch (this.selectedColor.value) {
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

    changeSelectedColor(selectedColor: ColorType | undefined) {
        this.selectedColor.next(selectedColor);
    }

    changeCurrentShowColorPalette(showColorPalette: boolean) {
        this.showColorPalette.next(showColorPalette);
    }

    getColorOnFocus(): string {
        switch (this.selectedColor.value) {
            case ColorType.backgroundColor:
                return this.backgroundColor.value;
            case ColorType.primaryColor:
                return this.primaryColor.value;
            case ColorType.secondaryColor:
                return this.secondaryColor.value;
            default:
                return new Color().hex;
        }
    }

    rgbToHex(R: number, G: number, B: number): string {
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
        return r + g + b;
    }

    getOpacity(alphaValue: number): string {
        let color = Math.round(alphaValue * 255).toString(16);
        if (color.length === 1) {
            color += '0';
        }
        return color;
    }

    switchPrimarySecondary() {
        const temp: string = this.primaryColor.value;
        this.primaryColor.next(this.secondaryColor.value);
        this.secondaryColor.next(temp);
    }
}
