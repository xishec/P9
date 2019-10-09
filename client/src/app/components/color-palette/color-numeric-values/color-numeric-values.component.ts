import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { ShortcutManagerService } from 'src/app/services/shortcut-manager/shortcut-manager.service';
import { ColorToolService } from 'src/app/services/tools/color-tool/color-tool.service';
import { DEFAULT_WHITE } from '../../../../constants/color-constants';

@Component({
    selector: 'app-color-numeric-values',
    templateUrl: './color-numeric-values.component.html',
    styleUrls: ['./color-numeric-values.component.scss'],
})
export class ColorNumericValuesComponent implements OnInit {
    colorNumericValuesForm: FormGroup;
    formBuilder: FormBuilder;
    previewColor = DEFAULT_WHITE;

    constructor(
        formBuilder: FormBuilder,
        private colorToolService: ColorToolService,
        private shortcutManagerService: ShortcutManagerService,
    ) {
        this.formBuilder = formBuilder;
        this.initializeForm();
    }

    ngOnInit() {
        this.colorToolService.selectedColorType.subscribe(() => {
            this.previewColor = this.colorToolService.getColorOnFocus();
            this.setColorNumericValues();
        });
        this.colorToolService.previewColor.subscribe((previewColor: string) => {
            this.previewColor = previewColor;
            this.setColorNumericValues();
        });
    }

    initializeForm(): void {
        this.colorNumericValuesForm = this.formBuilder.group({
            hex: ['000000', [Validators.pattern('^([A-Fa-f0-9]{6}$)')]],
            R: [0, [Validators.required, Validators.min(0), Validators.max(255)]],
            G: [0, [Validators.required, Validators.min(0), Validators.max(255)]],
            B: [0, [Validators.required, Validators.min(0), Validators.max(255)]],
            A: [1, [Validators.required, Validators.min(0), Validators.max(1)]],
        });
    }

    setColorNumericValues(): void {
        this.setHexValues();
        this.setRGBValues();
    }

    setHexValues(): void {
        this.colorNumericValuesForm.controls.hex.setValue(this.previewColor.slice(0, 6));
    }

    setRGBValues(): void {
        this.colorNumericValuesForm.controls.R.setValue(parseInt(this.previewColor.slice(0, 2), 16));
        this.colorNumericValuesForm.controls.G.setValue(parseInt(this.previewColor.slice(2, 4), 16));
        this.colorNumericValuesForm.controls.B.setValue(parseInt(this.previewColor.slice(4, 6), 16));
        this.colorNumericValuesForm.controls.A.setValue((parseInt(this.previewColor.slice(6, 8), 16) / 255).toFixed(1));
    }

    onUserHexInput(): void {
        if (this.colorNumericValuesForm.valid) {
            const opacity = this.colorToolService.getPreviewColorOpacityHex();
            this.previewColor = this.colorNumericValuesForm.value.hex + opacity;
            this.setColorNumericValues();
            this.colorToolService.changePreviewColor(this.previewColor);
        } else {
            this.setHexValues();
        }
    }

    onUserColorRGBInput(): void {
        const previewColor = this.colorToolService.translateRGBToHex(
            this.colorNumericValuesForm.value.R,
            this.colorNumericValuesForm.value.G,
            this.colorNumericValuesForm.value.B,
            this.colorNumericValuesForm.value.A,
        );
        this.previewColor = previewColor;
        this.setColorNumericValues();
        this.colorToolService.changePreviewColor(this.previewColor);
    }

    onFocus() {
        this.shortcutManagerService.changeIsOnInput(true);
    }

    onFocusOut() {
        this.shortcutManagerService.changeIsOnInput(false);
    }
}
