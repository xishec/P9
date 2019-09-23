import { Injectable } from '@angular/core';

import { Color } from '../../../../classes/Color';

@Injectable({
  providedIn: 'root',
})
export class ColorToolService {

  primaryColor: Color = new Color();
  secondaryColor: Color = new Color();
  lastTenColorsQueue: Color[] = [];

  constructor() { }
}
