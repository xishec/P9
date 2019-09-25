import { Component, OnInit } from '@angular/core';

import { Color } from '../../../../../classes/Color';
import { ColorType } from 'src/app/services/constants';

@Component({
    selector: 'app-color-attributes',
    templateUrl: './color-attributes.component.html',
    styleUrls: ['./color-attributes.component.scss'],
})
export class ColorAttributesComponent implements OnInit {
    selectedColor: ColorType = ColorType.primaryColor;
    primaryColor: Color = new Color();
    secondaryColor: Color = new Color();

    constructor() {}

    ngOnInit() {}

    onClickPrimaryColor(): void {
        this.selectedColor = ColorType.primaryColor;
    }

    onClickSecondaryColor(): void {
        this.selectedColor = ColorType.secondaryColor;
    }

    getBackgroundColorIcon() {
        return {
            backgroundColor: '#' + this.secondaryColor.hex,
        };
    }
    getPrimaryColorIcon() {
        return {
            backgroundColor: '#' + this.secondaryColor.hex,
        };
    }
    getSecondaryColorIcon() {
        return {
            backgroundColor: '#' + this.secondaryColor.hex,
        };
    }
}
