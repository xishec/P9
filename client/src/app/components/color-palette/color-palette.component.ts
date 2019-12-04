import { Component, OnInit } from '@angular/core';

import { ColorToolService } from 'src/app/services/tools/color-tool/color-tool.service';
import { COLOR_TYPE, DEFAULT_WHITE } from 'src/constants/color-constants';

interface IconStyle {
    backgroundColor: string;
}

@Component({
    selector: 'app-color-palette',
    templateUrl: './color-palette.component.html',
    styleUrls: ['./color-palette.component.scss'],
})
export class ColorPaletteComponent implements OnInit {
    selectedColorType: COLOR_TYPE = COLOR_TYPE.PrimaryColor;
    previewColor = DEFAULT_WHITE;

    constructor(private colorToolService: ColorToolService) {}

    ngOnInit(): void {
        this.colorToolService.previewColor.subscribe((previewColor) => {
            this.previewColor = previewColor;
        });

        this.colorToolService.selectedColorType.subscribe((selectedColorType) => {
            if (selectedColorType) {
                this.selectedColorType = selectedColorType;
                this.previewColor = this.colorToolService.getColorOnFocus();
            }
        });
    }
    onClickColorQueueButton(color: string): void {
        this.previewColor = color;
    }

    onSubmit(): void {
        this.colorToolService.changeColorOnFocus(this.previewColor);
        this.colorToolService.addColorToQueue(this.previewColor);
        this.colorToolService.changeShowColorPalette(false);
        this.colorToolService.changeSelectedColorType(undefined);
    }

    onCancel(): void {
        this.colorToolService.changeShowColorPalette(false);
        this.colorToolService.changeSelectedColorType(undefined);
    }

    getUserColorIcon(): IconStyle {
        return {
            backgroundColor: '#' + this.previewColor,
        };
    }
}
