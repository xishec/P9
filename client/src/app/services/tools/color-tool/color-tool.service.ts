import { Injectable } from '@angular/core';

import { BehaviorSubject, Observable } from 'rxjs';
import { Color } from '../../../../classes/Color';
import { COLORS, ColorType } from '../../../services/constants';

@Injectable({
    providedIn: 'root',
})
export class ColorToolService {
    readonly colors: Color[] = COLORS;

    private previewColor: BehaviorSubject<Color> = new BehaviorSubject<Color>(COLORS[0]);
    private backgroundColor: BehaviorSubject<Color> = new BehaviorSubject<Color>(COLORS[0]);
    private primaryColor: BehaviorSubject<Color> = new BehaviorSubject<Color>(COLORS[1]);
    private secondaryColor: BehaviorSubject<Color> = new BehaviorSubject<Color>(COLORS[2]);
    private selectedColor: BehaviorSubject<ColorType | undefined> = new BehaviorSubject<ColorType | undefined>(
        undefined,
    );
    private showColorPalette: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

    currentPreviewColor: Observable<Color> = this.previewColor.asObservable();
    currentBackgroundColor: Observable<Color> = this.backgroundColor.asObservable();
    currentPrimaryColor: Observable<Color> = this.primaryColor.asObservable();
    currentSecondaryColor: Observable<Color> = this.secondaryColor.asObservable();
    currentSelectedColor: Observable<ColorType | undefined> = this.selectedColor.asObservable();
    currentShowColorPalette: Observable<boolean> = this.showColorPalette.asObservable();

    colorQueue: Color[] = [];
    colorQueueBSubject = new BehaviorSubject(this.colorQueue);

    // addColorToQueue(color: Color): void {
    //     if (this.colorQueue.length < 10) {
    //         this.colorQueue.push(color);
    //     } else {
    //         this.colorQueue.shift();
    //         this.colorQueue.push(color);
    //     }
    //     this.colorQueueBSubject.next(this.colorQueue);
    // }

    changePreviewColor(previewColor: Color) {
        this.previewColor.next(previewColor);
    }
    changeColorOnFocus(colorOnFocus: Color) {
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
                return this.backgroundColor.value.hex;
            case ColorType.primaryColor:
                return this.primaryColor.value.hex;
            case ColorType.secondaryColor:
                return this.secondaryColor.value.hex;
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
}
