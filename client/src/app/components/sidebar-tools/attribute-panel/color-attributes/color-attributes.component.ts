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
    showColorPalette = false;
    backgroundColor: Color = COLORS[0];
    primaryColor: Color = COLORS[1];
    secondaryColor: Color = COLORS[2];
    selectedColor: ColorType | undefined = undefined;

    constructor(private colorToolService: ColorToolService) {}

    ngOnInit() {
        this.colorToolService.currentShowColorPalette.subscribe((showColorPalette: boolean) => {
            this.showColorPalette = showColorPalette;
        });
        this.colorToolService.currentBackgroundColor.subscribe((backgroundColor: Color) => {
            this.backgroundColor = backgroundColor;
        });
        this.colorToolService.currentPrimaryColor.subscribe((primaryColor: Color) => {
            this.primaryColor = primaryColor;
        });
        this.colorToolService.currentSecondaryColor.subscribe((secondaryColor: Color) => {
            this.secondaryColor = secondaryColor;
        });
        this.colorToolService.currentSelectedColor.subscribe((selectedColor: ColorType | undefined) => {
            this.selectedColor = selectedColor;
        });
    }

    onClickBackgroundColor(): void {
        if (this.selectedColor === ColorType.backgroundColor) {
            this.colorToolService.changeSelectedColor(undefined);
            this.colorToolService.changeCurrentShowColorPalette(false);
        } else {
            this.colorToolService.changeSelectedColor(ColorType.backgroundColor);
            this.colorToolService.changeCurrentShowColorPalette(true);
        }
    }
    onClickPrimaryColor(): void {
        if (this.selectedColor === ColorType.primaryColor) {
            this.colorToolService.changeSelectedColor(undefined);
            this.colorToolService.changeCurrentShowColorPalette(false);
        } else {
            this.colorToolService.changeSelectedColor(ColorType.primaryColor);
            this.colorToolService.changeCurrentShowColorPalette(true);
        }
    }
    onClickSecondaryColor(): void {
        if (this.selectedColor === ColorType.secondaryColor) {
            this.colorToolService.changeSelectedColor(undefined);
            this.colorToolService.changeCurrentShowColorPalette(false);
        } else {
            this.colorToolService.changeSelectedColor(ColorType.secondaryColor);
            this.colorToolService.changeCurrentShowColorPalette(true);
        }
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
        this.colorToolService.changeCurrentShowColorPalette(false);
    }
}
