import { Injectable } from '@angular/core';

import { BehaviorSubject } from 'rxjs';
import { Color } from '../../../../classes/Color';
import { COLORS, ColorType } from '../../../services/constants';

@Injectable({
    providedIn: 'root',
})
export class ColorToolService {
    readonly colors: Color[] = COLORS;

    backgroundColor: Color = COLORS[0];
    primaryColor: Color = COLORS[1];
    secondaryColor: Color = COLORS[2];
    selectedColor: ColorType | undefined = undefined;
    showColorPalette: false;

    currentBackgroundColor: BehaviorSubject<Color> = new BehaviorSubject<Color>(COLORS[0]);
    currentPrimaryColor: BehaviorSubject<Color> = new BehaviorSubject<Color>(COLORS[1]);
    currentSecondaryColor: BehaviorSubject<Color> = new BehaviorSubject<Color>(COLORS[2]);
    currentSelectedColor: BehaviorSubject<ColorType | undefined> = new BehaviorSubject<ColorType | undefined>(
        undefined,
    );
    currentShowColorPalette: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

    colorQueue: Color[] = [];
    colorQueueBSubject = new BehaviorSubject(this.colorQueue);

    changeColor(color: Color, colorType: ColorType): void {
        if (colorType === ColorType.primaryColor) {
            this.primaryColor = color;
        } else if (colorType === ColorType.secondaryColor) {
            this.secondaryColor = color;
        }
    }

    addColorToQueue(color: Color): void {
        if (this.colorQueue.length < 10) {
            this.colorQueue.push(color);
        } else {
            this.colorQueue.shift();
            this.colorQueue.push(color);
        }
        this.colorQueueBSubject.next(this.colorQueue);
    }

    changeColorOnFocus(colorOnFocus: Color) {
        switch (this.currentSelectedColor.value) {
            case ColorType.backgroundColor:
                this.currentBackgroundColor.next(colorOnFocus);
                this.changeCurrentShowColorPalette(false);
                break;
            case ColorType.primaryColor:
                this.currentPrimaryColor.next(colorOnFocus);
                this.changeCurrentShowColorPalette(false);
                break;
            case ColorType.secondaryColor:
                this.currentSecondaryColor.next(colorOnFocus);
                this.changeCurrentShowColorPalette(false);
                break;
            default:
                console.warn('color selection undefined');
                break;
        }
    }
    changeSelectedColor(selectedColor: ColorType | undefined) {
        this.currentSelectedColor.next(selectedColor);
    }
    changeCurrentShowColorPalette(showColorPalette: boolean) {
        this.currentShowColorPalette.next(showColorPalette);
    }

    getColorOnFocus(): Color {
        switch (this.currentSelectedColor.value) {
            case ColorType.backgroundColor:
                return this.currentBackgroundColor.value;
            case ColorType.primaryColor:
                return this.currentPrimaryColor.value;
            case ColorType.secondaryColor:
                return this.currentSecondaryColor.value;
            default:
                return new Color();
        }
    }
}
