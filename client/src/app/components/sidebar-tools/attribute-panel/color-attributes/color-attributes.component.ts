import { Component, OnInit } from '@angular/core';

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
    backgroundColor = COLORS[0].hex;
    primaryColor = COLORS[1].hex;
    secondaryColor = COLORS[2].hex;
    selectedColor: ColorType | undefined = undefined;

    constructor(private colorToolService: ColorToolService) {}

    ngOnInit() {
        this.colorToolService.currentShowColorPalette.subscribe((showColorPalette: boolean) => {
            this.showColorPalette = showColorPalette;
        });
        this.colorToolService.currentBackgroundColor.subscribe((backgroundColor: string) => {
            this.backgroundColor = backgroundColor;
        });
        this.colorToolService.currentPrimaryColor.subscribe((primaryColor: string) => {
            this.primaryColor = primaryColor;
        });
        this.colorToolService.currentSecondaryColor.subscribe((secondaryColor: string) => {
            this.secondaryColor = secondaryColor;
        });
        this.colorToolService.currentSelectedColor.subscribe((selectedColor: ColorType | undefined) => {
            this.selectedColor = selectedColor;
        });
    }

    onClickBackgroundColor(): void {
        this.colorToolService.changeSelectedColor(ColorType.backgroundColor);
        this.colorToolService.changeCurrentShowColorPalette(true);
    }
    onClickPrimaryColor(): void {
        this.colorToolService.changeSelectedColor(ColorType.primaryColor);
        this.colorToolService.changeCurrentShowColorPalette(true);
    }
    onClickSecondaryColor(): void {
        this.colorToolService.changeSelectedColor(ColorType.secondaryColor);
        this.colorToolService.changeCurrentShowColorPalette(true);
    }

    getBackgroundColorIcon(): ColorStyle {
        if (this.selectedColor === ColorType.backgroundColor) {
            return {
                backgroundColor: '#' + this.backgroundColor,
                border: 'solid 1px black',
            };
        }
        return {
            backgroundColor: '#' + this.backgroundColor,
        };
    }
    getPrimaryColorIcon(): ColorStyle {
        if (this.selectedColor === ColorType.primaryColor) {
            return {
                backgroundColor: '#' + this.primaryColor,
                border: 'solid 1px black',
            };
        }
        return {
            backgroundColor: '#' + this.primaryColor,
        };
    }
    getSecondaryColorIcon(): ColorStyle {
        if (this.selectedColor === ColorType.secondaryColor) {
            return {
                backgroundColor: '#' + this.secondaryColor,
                border: 'solid 1px black',
            };
        }
        return {
            backgroundColor: '#' + this.secondaryColor,
        };
    }

    switchColors() {
        this.colorToolService.switchPrimarySecondary();
    }
}
