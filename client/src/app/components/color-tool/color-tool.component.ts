import { Component, OnInit } from '@angular/core';

import { ColorToolService } from 'src/app/services/tools/color-tool/color-tool.service';
import { Color } from '../../../classes/Color';
import { ColorType } from '../../services/constants';

interface ColorStyle {
    backgroundColor: string;
    border?: string;
}
@Component({
    selector: 'app-color-tool',
    templateUrl: './color-tool.component.html',
    styleUrls: ['./color-tool.component.scss'],
})
export class ColorToolComponent implements OnInit {
    selectedColor: ColorType = ColorType.primaryColor;
    primaryColor: Color = new Color();
    secondaryColor: Color = new Color();

    constructor(private colorToolService: ColorToolService) {}

    ngOnInit(): void {
        this.colorToolService.primaryColor.subscribe((primaryColor) => {
            this.primaryColor = primaryColor;
        });
        this.colorToolService.secondaryColor.subscribe((secondaryColor) => {
            this.secondaryColor = secondaryColor;
        });
    }

    changeColor(colorHex: string): void {
        const newColor = new Color(colorHex);
        this.setColor(newColor);
        this.colorToolService.addColorToQueue(newColor);
    }

    setColor(color: Color): void {
        if (this.selectedColor === ColorType.primaryColor) {
            this.colorToolService.changeColor(color, ColorType.primaryColor);
        } else if (this.selectedColor === ColorType.secondaryColor) {
            this.colorToolService.changeColor(color, ColorType.secondaryColor);
        }
    }

    switchColors(): void {
        let temporaryColor: Color = new Color();
        temporaryColor = this.primaryColor;

        this.colorToolService.changeColor(this.secondaryColor, ColorType.primaryColor);
        this.colorToolService.changeColor(temporaryColor, ColorType.secondaryColor);
    }

    onClickPrimaryColorStyle(): ColorStyle {
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

    onClickSecondaryColorStyle(): ColorStyle {
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

    onClickPrimaryColor(): void {
        this.selectedColor = ColorType.primaryColor;
    }

    onClickSecondaryColor(): void {
        this.selectedColor = ColorType.secondaryColor;
    }

    onClickColorQueueButton(color: Color): void {
        this.changeColor(color.hex);
    }

    currentColor(): Color {
        if (this.selectedColor === ColorType.primaryColor) {
            return this.primaryColor;
        } else if (this.selectedColor === ColorType.secondaryColor) {
            return this.secondaryColor;
        }
        throw Error('Wrong color selected!');
    }
}
