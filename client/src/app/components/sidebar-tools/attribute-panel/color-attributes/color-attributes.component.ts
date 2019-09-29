import { Component, OnInit } from '@angular/core';

import { ColorType, DEFAULT_GRAY_0, DEFAULT_GRAY_1, DEFAULT_WHITE } from 'src/constants/color-constants';
import { ColorToolService } from '../../../../services/tools/color-tool/color-tool.service';

interface ColorStyle {
    backgroundColor: string;
    border?: string;
    transform?: string;
}
@Component({
    selector: 'app-color-attributes',
    templateUrl: './color-attributes.component.html',
    styleUrls: ['./color-attributes.component.scss'],
})
export class ColorAttributesComponent implements OnInit {
    backgroundColor = DEFAULT_WHITE;
    primaryColor = DEFAULT_GRAY_0;
    secondaryColor = DEFAULT_GRAY_1;
    selectedColorType: ColorType | undefined = undefined;

    constructor(private colorToolService: ColorToolService) {}

    ngOnInit() {
        this.colorToolService.backgroundColor.subscribe((backgroundColor: string) => {
            this.backgroundColor = backgroundColor;
        });
        this.colorToolService.primaryColor.subscribe((primaryColor: string) => {
            this.primaryColor = primaryColor;
        });
        this.colorToolService.secondaryColor.subscribe((secondaryColor: string) => {
            this.secondaryColor = secondaryColor;
        });
        this.colorToolService.selectedColorType.subscribe((selectedColorType: ColorType | undefined) => {
            this.selectedColorType = selectedColorType;
        });
    }

    onClickBackgroundColor(): void {
        this.colorToolService.changeSelectedColorType(ColorType.backgroundColor);
        this.colorToolService.changShowColorPalette(true);
    }
    onClickPrimaryColor(): void {
        this.colorToolService.changeSelectedColorType(ColorType.primaryColor);
        this.colorToolService.changShowColorPalette(true);
    }
    onClickSecondaryColor(): void {
        this.colorToolService.changeSelectedColorType(ColorType.secondaryColor);
        this.colorToolService.changShowColorPalette(true);
    }

    getBackgroundColorIcon(): ColorStyle {
        if (this.selectedColorType === ColorType.backgroundColor) {
            return {
                backgroundColor: '#' + this.backgroundColor,
                border: 'solid 1px black',
                transform: 'scale(1.3)',
            };
        }
        return {
            backgroundColor: '#' + this.backgroundColor,
        };
    }
    getPrimaryColorIcon(): ColorStyle {
        if (this.selectedColorType === ColorType.primaryColor) {
            return {
                backgroundColor: '#' + this.primaryColor,
                border: 'solid 1px black',
                transform: 'scale(1.3)',
            };
        }
        return {
            backgroundColor: '#' + this.primaryColor,
        };
    }
    getSecondaryColorIcon(): ColorStyle {
        if (this.selectedColorType === ColorType.secondaryColor) {
            return {
                backgroundColor: '#' + this.secondaryColor,
                border: 'solid 1px black',
                transform: 'scale(1.3)',
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
