import { Injectable } from '@angular/core';

import { BehaviorSubject, Observable } from 'rxjs';
import { Color } from '../../../../classes/Color';
import { COLORS, ColorType } from '../../../services/constants';

@Injectable({
    providedIn: 'root',
})
export class ColorToolService {
    readonly colors: Color[] = COLORS;

    private previewColor: BehaviorSubject<string> = new BehaviorSubject<string>(COLORS[0].hex);
    private backgroundColor: BehaviorSubject<string> = new BehaviorSubject<string>(COLORS[0].hex);
    private primaryColor: BehaviorSubject<string> = new BehaviorSubject<string>(COLORS[1].hex);
    private secondaryColor: BehaviorSubject<string> = new BehaviorSubject<string>(COLORS[2].hex);
    private selectedColor: BehaviorSubject<ColorType | undefined> = new BehaviorSubject<ColorType | undefined>(
        undefined,
    );
    private showColorPalette: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    private colorQueue: BehaviorSubject<string[]> = new BehaviorSubject<string[]>([]);

    currentPreviewColor: Observable<string> = this.previewColor.asObservable();
    currentBackgroundColor: Observable<string> = this.backgroundColor.asObservable();
    currentPrimaryColor: Observable<string> = this.primaryColor.asObservable();
    currentSecondaryColor: Observable<string> = this.secondaryColor.asObservable();
    currentSelectedColor: Observable<ColorType | undefined> = this.selectedColor.asObservable();
    currentShowColorPalette: Observable<boolean> = this.showColorPalette.asObservable();
    currentColorQueue: Observable<string[]> = this.colorQueue.asObservable();

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
}
