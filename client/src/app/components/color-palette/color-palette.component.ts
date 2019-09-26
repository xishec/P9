import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { ColorToolService } from 'src/app/services/tools/color-tool/color-tool.service';
import { Color } from '../../../classes/Color';
import { ColorType } from '../../services/constants';

@Component({
    selector: 'app-color-palette',
    templateUrl: './color-palette.component.html',
    styleUrls: ['./color-palette.component.scss'],
})
export class ColorPaletteComponent implements OnInit {
    colorPaletteForm: FormGroup;
    formBuilder: FormBuilder;

    selectedColor: ColorType = ColorType.primaryColor;
    previewColor: Color = new Color();

    constructor(formBuilder: FormBuilder, private colorToolService: ColorToolService) {
        this.formBuilder = formBuilder;
        this.initializeForm();
    }

    ngOnInit(): void {
        this.updateWithColorToolService();
        this.colorToolService.currentSelectedColor.subscribe(() => {
            this.updateWithColorToolService();
        });
        this.colorToolService.currentPreviewColor.subscribe((previewColor: Color) => {
            this.previewColor = previewColor;
            this.setColorNumericValues();
        });
    }

    updateWithColorToolService() {
        this.previewColor.hex = this.colorToolService.getColorOnFocus();
        this.setColorNumericValues();
    }

    initializeForm(): void {
        this.colorPaletteForm = this.formBuilder.group({
            hex: ['000000', [Validators.pattern('^([A-Fa-f0-9]{3}$)|([A-Fa-f0-9]{6}$)')]],
            R: ['0', [Validators.required, Validators.min(0), Validators.max(255)]],
            G: ['0', [Validators.required, Validators.min(0), Validators.max(255)]],
            B: ['0', [Validators.required, Validators.min(0), Validators.max(255)]],
            A: [1, [Validators.required, Validators.min(0), Validators.max(1)]],
        });
    }

    changeColor(colorHex: string): void {
        this.previewColor.hex = colorHex;
        this.setColorNumericValues();
        // this.colorToolService.addColorToQueue(this.previewColor);
    }

    setColorNumericValues(): void {
        this.setHexValues();
        this.setRGBValues();
    }

    setHexValues(): void {
        this.colorPaletteForm.controls.hex.setValue(this.previewColor.hex);
    }

    setRGBValues(): void {
        this.colorPaletteForm.controls.R.setValue(parseInt(this.previewColor.hex.slice(0, 2), 16));
        this.colorPaletteForm.controls.G.setValue(parseInt(this.previewColor.hex.slice(2, 4), 16));
        this.colorPaletteForm.controls.B.setValue(parseInt(this.previewColor.hex.slice(4, 6), 16));
    }

    onUserHexInput(): void {
        this.changeColor(this.colorPaletteForm.value.hex);
    }

    onUserColorRGBInput(): void {
        const newColorinHex = this.translateRGBToHex();
        this.changeColor(newColorinHex);
    }

    translateRGBToHex(): string {
        let r = Number(this.colorPaletteForm.value.R).toString(16);
        let g = Number(this.colorPaletteForm.value.G).toString(16);
        let b = Number(this.colorPaletteForm.value.B).toString(16);
        if (r.length === 1) {
            r = '0' + r;
        }
        if (g.length === 1) {
            g = '0' + g;
        }
        if (b.length === 1) {
            b = '0' + b;
        }
        return r + g + b;
    }

    onClickColorQueueButton(color: Color): void {
        this.changeColor(color.hex);
    }
    onCancel(): void {
        this.colorToolService.changeCurrentShowColorPalette(false);
    }
    onSubmit(): void {
        this.colorToolService.changeColorOnFocus(this.previewColor);
        this.colorToolService.changeCurrentShowColorPalette(false);
    }

    getUserColorIcon(): IconStyle {
        return { backgroundColor: '#' + this.previewColor.hex };
    }
}
interface IconStyle {
    backgroundColor: string;
}
