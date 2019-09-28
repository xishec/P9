import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { ShortcutManagerService } from 'src/app/services/shortcut-manager/shortcut-manager.service';
import { ColorToolService } from 'src/app/services/tools/color-tool/color-tool.service';
import { Color } from 'src/classes/Color';

@Component({
    selector: 'app-color-numeric-values',
    templateUrl: './color-numeric-values.component.html',
    styleUrls: ['./color-numeric-values.component.scss'],
})
export class ColorNumericValuesComponent implements OnInit {
    colorNumericValuesForm: FormGroup;
    formBuilder: FormBuilder;
    previewColor = new Color().hex;

    constructor(
        formBuilder: FormBuilder,
        private colorToolService: ColorToolService,
        private shortcutManagerService: ShortcutManagerService,
    ) {
        this.formBuilder = formBuilder;
        this.initializeForm();
    }

    ngOnInit() {
        this.setColorNumericValues(this.previewColor);
        this.colorToolService.selectedColor.subscribe(() => {
            this.setColorNumericValues(this.previewColor);
        });
        this.colorToolService.previewColor.subscribe((previewColor: string) => {
            this.changeColor(previewColor);
        });
    }

    initializeForm(): void {
        this.colorNumericValuesForm = this.formBuilder.group({
            hex: ['000000', [Validators.pattern('^([A-Fa-f0-9]{3}$)|([A-Fa-f0-9]{6}$)')]],
            R: [0, [Validators.required, Validators.min(0), Validators.max(255)]],
            G: [0, [Validators.required, Validators.min(0), Validators.max(255)]],
            B: [0, [Validators.required, Validators.min(0), Validators.max(255)]],
            A: [1, [Validators.required, Validators.min(0), Validators.max(1)]],
        });
    }

    changeColor(previewColor: string): void {
        if (previewColor.length === 6) {
            previewColor += '00';
        }
        this.setColorNumericValues(previewColor);
    }

    setColorNumericValues(previewColor: string): void {
        this.setHexValues(previewColor);
        this.setRGBValues(previewColor);
    }

    setHexValues(previewColor: string): void {
        this.colorNumericValuesForm.controls.hex.setValue(previewColor.slice(0, 6));
    }

    setRGBValues(previewColor: string): void {
        this.colorNumericValuesForm.controls.R.setValue(parseInt(previewColor.slice(0, 2), 16));
        this.colorNumericValuesForm.controls.G.setValue(parseInt(previewColor.slice(2, 4), 16));
        this.colorNumericValuesForm.controls.B.setValue(parseInt(previewColor.slice(4, 6), 16));
        if (previewColor.length === 8) {
            this.colorNumericValuesForm.controls.A.setValue((parseInt(previewColor.slice(6, 8), 16) / 255).toFixed(1));
        }
    }

    onUserHexInput(): void {
        this.changeColor(this.colorNumericValuesForm.value.hex);
    }

    onUserColorRGBInput(): void {
        const newColorinHex = this.colorToolService.translateRGBToHex(
            this.colorNumericValuesForm.value.R,
            this.colorNumericValuesForm.value.G,
            this.colorNumericValuesForm.value.B,
            this.colorNumericValuesForm.value.A,
        );
        this.changeColor(newColorinHex);
    }

    onFocus() {
        this.shortcutManagerService.changeIsOnInput(true);
    }

    onFocusOut() {
        this.shortcutManagerService.changeIsOnInput(false);
    }
}
