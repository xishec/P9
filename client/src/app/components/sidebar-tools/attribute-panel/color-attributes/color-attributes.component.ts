import { Component, OnInit } from '@angular/core';

import { Color } from '../../../../../classes/Color';
import { ColorType, COLORS } from 'src/app/services/constants';
import { ColorToolService } from '../../../../services/tools/color-tool/color-tool.service';

@Component({
    selector: 'app-color-attributes',
    templateUrl: './color-attributes.component.html',
    styleUrls: ['./color-attributes.component.scss'],
})
export class ColorAttributesComponent implements OnInit {
    selectedColor: ColorType = ColorType.primaryColor;
    showColorPalette = false;

    backgroundColor: Color = COLORS[0];
    primaryColor: Color = COLORS[1];
    secondaryColor: Color = COLORS[2];

    constructor(private colorToolService: ColorToolService) {}

    ngOnInit() {
        this.backgroundColor = this.colorToolService.backgroundColor;
        this.primaryColor = this.colorToolService.primaryColor;
        this.secondaryColor = this.colorToolService.secondaryColor;
    }

    onClickPrimaryColor(): void {
        this.selectedColor = ColorType.primaryColor;
    }

    onClickSecondaryColor(): void {
        this.selectedColor = ColorType.secondaryColor;
    }

    getBackgroundColorIcon() {
        return {
            backgroundColor: '#' + this.backgroundColor.hex,
        };
    }
    getPrimaryColorIcon() {
        return {
            backgroundColor: '#' + this.primaryColor.hex,
        };
    }
    getSecondaryColorIcon() {
        return {
            backgroundColor: '#' + this.secondaryColor.hex,
        };
    }

    switchColors() {
        this.showColorPalette = !this.showColorPalette;
    }
}
