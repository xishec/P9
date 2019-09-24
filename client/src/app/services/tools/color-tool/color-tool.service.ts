import { Injectable } from '@angular/core';

import { Color } from '../../../../classes/Color';
import { COLORS, ColorType } from '../../../services/constants';

@Injectable({
    providedIn: 'root',
})
export class ColorToolService {
    readonly colors: Color[] = COLORS;

    primaryColor: Color = new Color();
    secondaryColor: Color = new Color('000000');

    changeColor(color: Color, colorType: ColorType) {
      if (colorType === ColorType.primaryColor) {
        this.primaryColor = color;
      } else if (colorType === ColorType.secondaryColor) {
        this.secondaryColor = color;
      }
    }
}
