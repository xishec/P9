import { Component, OnInit } from '@angular/core';

import { Color } from '../../../../../classes/Color';
import { ColorType, COLORS } from 'src/app/services/constants';
import { ColorToolService } from '../../../../services/tools/color-tool/color-tool.service';

interface ColorStyle {
    backgroundColor: string;
    border?: string;
}
@Component({
    selector: 'app-color-attributes',
    templateUrl: './color-attributes.component.html',
    styleUrls: ['./color-attributes.component.scss'],
})
export class ColorAttributesComponent implements OnInit {
    selectedColor: ColorType | undefined = undefined;
    showColorPalette = false;

    backgroundColor: Color = COLORS[0];
    primaryColor: Color = COLORS[1];
    secondaryColor: Color = COLORS[2];

    constructor(private colorToolService: ColorToolService) {}

    ngOnInit() {
        this.backgroundColor = this.colorToolService.backgroundColor;
        this.primaryColor = this.colorToolService.primaryColor;
        this.secondaryColor = this.colorToolService.secondaryColor;
        this.colorToolService.currentSelectedColor.subscribe((selectedColor: ColorType | undefined) => {
            this.selectedColor = selectedColor;
        });
    }

    onClickBackgroundColor(): void {
        this.colorToolService.changeSelectedColor(ColorType.backgroundColor);
        this.showColorPalette = true;
    }
    onClickPrimaryColor(): void {
        this.colorToolService.changeSelectedColor(ColorType.primaryColor);
        this.showColorPalette = true;
    }
    onClickSecondaryColor(): void {
        this.colorToolService.changeSelectedColor(ColorType.secondaryColor);
        this.showColorPalette = true;
    }

    getBackgroundColorIcon(): ColorStyle {
        if (this.selectedColor === ColorType.backgroundColor) {
            return {
                backgroundColor: '#' + this.backgroundColor.hex,
                border: 'solid 1px black',
            };
        }
        return {
            backgroundColor: '#' + this.backgroundColor.hex,
        };
    }
    getPrimaryColorIcon(): ColorStyle {
        if (this.selectedColor === ColorType.primaryColor) {
            return {
                backgroundColor: '#' + this.primaryColor.hex,
                border: 'solid 1px black',
            };
        }
        return {
            backgroundColor: '#' + this.primaryColor.hex,
        };
    }
    getSecondaryColorIcon(): ColorStyle {
        if (this.selectedColor === ColorType.secondaryColor) {
            return {
                backgroundColor: '#' + this.secondaryColor.hex,
                border: 'solid 1px black',
            };
        }
        return {
            backgroundColor: '#' + this.secondaryColor.hex,
        };
    }

    switchColors() {
        this.showColorPalette = false;
    }
}
