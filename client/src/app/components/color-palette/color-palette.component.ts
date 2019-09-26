import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { ColorToolService } from 'src/app/services/tools/color-tool/color-tool.service';
import { Color } from '../../../classes/Color';
import { ColorType } from '../../services/constants';
import { ShortcutsManagerService } from 'src/app/services/shortcuts-manager/shortcuts-manager.service';

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
        private shortcutsManagerService: ShortcutsManagerService,
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

    changeColor(previewColor: string): void {
        this.previewColor = previewColor;
        this.setColorNumericValues();
        this.colorToolService.addColorToQueue(this.previewColor);
    }

    setColorNumericValues(): void {
        this.setHexValues();
        this.setRGBValues();
    }

    setHexValues(): void {
        this.colorPaletteForm.controls.hex.setValue(this.previewColor);
    }

    setRGBValues(): void {
        this.colorPaletteForm.controls.R.setValue(parseInt(this.previewColor.slice(0, 2), 16));
        this.colorPaletteForm.controls.G.setValue(parseInt(this.previewColor.slice(2, 4), 16));
        this.colorPaletteForm.controls.B.setValue(parseInt(this.previewColor.slice(4, 6), 16));
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
    }
    onSubmit(): void {
        this.colorToolService.changeColorOnFocus(this.previewColor);
        this.colorToolService.changeCurrentShowColorPalette(false);
    }

    getUserColorIcon(): IconStyle {
        return { backgroundColor: '#' + this.previewColor };
    }

    onFocus() {
        this.shortcutsManagerService.changeIsOnInput(true);
    }
    onFocusOut() {
        this.shortcutsManagerService.changeIsOnInput(false);
    }
}
interface IconStyle {
    backgroundColor: string;
}
