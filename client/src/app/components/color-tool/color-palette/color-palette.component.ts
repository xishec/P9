import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Color } from 'src/classes/Color';

@Component({
    selector: 'app-color-palette',
    templateUrl: './color-palette.component.html',
    styleUrls: ['./color-palette.component.scss'],
})
export class ColorPaletteComponent implements OnChanges {
    myForm: FormGroup;
    formBuilder: FormBuilder;

    @Input() currentColor: Color = new Color();

    constructor(formBuilder: FormBuilder) {
        this.formBuilder = formBuilder;
        this.initializeForm();
    }

    ngOnChanges(changes: SimpleChanges): void {
      this.setColorNumericValues(this.currentColor);
    }

    initializeForm(): void {
        this.myForm = this.formBuilder.group({
            hex: ['000000', [Validators.pattern('^([A-Fa-f0-9]{3}$)|([A-Fa-f0-9]{6}$)')]],
            R: ['0', [Validators.required, Validators.min(0), Validators.max(255)]],
            G: ['0', [Validators.required, Validators.min(0), Validators.max(255)]],
            B: ['0', [Validators.required, Validators.min(0), Validators.max(255)]],
            A: [1, [Validators.required, Validators.min(0), Validators.max(1)]],
        });
    }

    setColorNumericValues(color: Color): void {
        this.setHexValues(color);
        this.setRGBValues(color);
    }

    setHexValues(color: Color): void {
        this.myForm.controls.hex.setValue(color.hex);
    }

    setRGBValues(color: Color): void {
        this.myForm.controls.R.setValue(parseInt(color.hex.slice(0, 2), 16));
        this.myForm.controls.G.setValue(parseInt(color.hex.slice(2, 4), 16));
        this.myForm.controls.B.setValue(parseInt(color.hex.slice(4, 6), 16));
    }
}
