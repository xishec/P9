import { Injectable } from '@angular/core';

import { BehaviorSubject } from 'rxjs';
import { Color } from '../../../../classes/Color';
import { COLORS, ColorType } from '../../../services/constants';

@Injectable({
    providedIn: 'root',
})
export class ColorToolService {
    readonly colors: Color[] = COLORS;

    primaryColor: Color = new Color();
    secondaryColor: Color = new Color('000000');
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
}
