import { Component, OnInit } from '@angular/core';

import { ColorToolService } from 'src/app/services/tools/color-tool/color-tool.service';
import { ColorType } from 'src/constants/color-constants';
import { Color } from '../../../classes/Color';

interface IconStyle {
    backgroundColor: string;
}

@Component({
    selector: 'app-color-palette',
    templateUrl: './color-palette.component.html',
    styleUrls: ['./color-palette.component.scss'],
})
export class ColorPaletteComponent implements OnInit {
    selectedColor: ColorType = ColorType.primaryColor;
    previewColor = new Color().hex;

    constructor(private colorToolService: ColorToolService) {}

    ngOnInit(): void {
        this.colorToolService.previewColor.subscribe((previewColor) => {
            this.previewColor = previewColor;
        });

        this.colorToolService.selectedColor.subscribe((selectedColor) => {
            if (selectedColor) {
                this.selectedColor = selectedColor;
            }
        });
    }
    onClickColorQueueButton(color: string): void {
        this.changeColor(color);
    }

    changeColor(previewColor: string): void {
        this.previewColor = previewColor.slice(0, 6);
    }

    // onSubmit(): void {
    //     const alphaValue: number = this.colorNumericValuesForm.value.A;
    //     this.colorToolService.changeColorOnFocus(this.previewColor + this.colorToolService.getOpacity(alphaValue));
    //     this.colorToolService.addColorToQueue(this.previewColor + this.colorToolService.getOpacity(alphaValue));
    //     this.colorToolService.changeCurrentShowColorPalette(false);
    //     this.colorToolService.changeSelectedColor(undefined);
    // }

    onCancel(): void {
        this.colorToolService.changeCurrentShowColorPalette(false);
        this.colorToolService.changeSelectedColor(undefined);
    }

    getUserColorIcon(): IconStyle {
        return {
            backgroundColor: '#' + this.previewColor.slice(0, 6) + this.colorToolService.getPreviewColorOpacity(),
        };
    }
}
