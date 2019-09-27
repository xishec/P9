import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { ShortcutManagerService } from 'src/app/services/shortcut-manager/shortcut-manager.service';
import { ColorToolService } from 'src/app/services/tools/color-tool/color-tool.service';
import { ColorType } from 'src/constants/color-constants';
import { Color } from '../../../classes/Color';

@Component({
    selector: 'app-color-palette',
    templateUrl: './color-palette.component.html',
    styleUrls: ['./color-palette.component.scss'],
})
export class ColorPaletteComponent implements OnInit {
    colorPaletteForm: FormGroup;
    formBuilder: FormBuilder;

    selectedColor: ColorType = ColorType.primaryColor;
    previewColor = new Color().hex;

    constructor(
        formBuilder: FormBuilder,
        private colorToolService: ColorToolService,
        private shortcutManagerService: ShortcutManagerService,
    ) {
        this.formBuilder = formBuilder;
        this.initializeForm();
    }

    ngOnInit(): void {
        this.updateWithColorToolService();
        this.colorToolService.currentSelectedColor.subscribe(() => {
            this.updateWithColorToolService();
        });
        this.colorToolService.currentPreviewColor.subscribe((previewColor: string) => {
            this.changeColor(previewColor);
        });
    }

    updateWithColorToolService() {
        this.previewColor = this.colorToolService.getColorOnFocus();
        this.setColorNumericValues(this.previewColor);
    }

    initializeForm(): void {
        this.colorPaletteForm = this.formBuilder.group({
            hex: ['000000', [Validators.pattern('^([A-Fa-f0-9]{3}$)|([A-Fa-f0-9]{6}$)')]],
            R: [0, [Validators.required, Validators.min(0), Validators.max(255)]],
            G: [0, [Validators.required, Validators.min(0), Validators.max(255)]],
            B: [0, [Validators.required, Validators.min(0), Validators.max(255)]],
            A: [1, [Validators.required, Validators.min(0), Validators.max(1)]],
        });
    }

    changeColor(previewColor: string): void {
        this.previewColor = previewColor.slice(0, 6);
        this.setColorNumericValues(previewColor);
    }

    setColorNumericValues(previewColor: string): void {
        this.setHexValues(previewColor);
        this.setRGBValues(previewColor);
    }

    setHexValues(previewColor: string): void {
        this.colorPaletteForm.controls.hex.setValue(previewColor.slice(0, 6));
    }

    setRGBValues(previewColor: string): void {
        this.colorPaletteForm.controls.R.setValue(parseInt(previewColor.slice(0, 2), 16));
        this.colorPaletteForm.controls.G.setValue(parseInt(previewColor.slice(2, 4), 16));
        this.colorPaletteForm.controls.B.setValue(parseInt(previewColor.slice(4, 6), 16));
        if (previewColor.length === 8) {
            this.colorPaletteForm.controls.A.setValue((parseInt(previewColor.slice(6, 8), 16) / 255).toFixed(1));
        }
    }

    getOpacity(): string {
        let color = Math.round(this.colorPaletteForm.value.A * 255).toString(16);
        if (color.length === 1) {
            color += '0';
        }
        return color;
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

    onClickColorQueueButton(color: string): void {
        this.changeColor(color);
    }
    onCancel(): void {
        this.colorToolService.changeCurrentShowColorPalette(false);
        this.colorToolService.changeSelectedColor(undefined);
    }
    onSubmit(): void {
        this.colorToolService.changeColorOnFocus(this.previewColor + this.getOpacity());
        this.colorToolService.addColorToQueue(this.previewColor + this.getOpacity());
        this.colorToolService.changeCurrentShowColorPalette(false);
        this.colorToolService.changeSelectedColor(undefined);
    }

    getUserColorIcon(): IconStyle {
        return {
            backgroundColor: '#' + this.previewColor + this.getOpacity(),
        };
    }

    onFocus() {
        this.shortcutManagerService.changeIsOnInput(true);
    }
    onFocusOut() {
        this.shortcutManagerService.changeIsOnInput(false);
    }
}
interface IconStyle {
    backgroundColor: string;
}
