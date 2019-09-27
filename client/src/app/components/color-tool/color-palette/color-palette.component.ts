import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
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
    @Output() changeColorEvent = new EventEmitter<string>();

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

    changeColor(hex: string): void {
        this.changeColorEvent.emit(hex);
    }

    onUserHexInput(): void {
        this.changeColor(this.myForm.value.hex);
    }

    onUserColorRGBInput(): void {
        const newColorinHex = this.translateRGBToHex();
        this.changeColor(newColorinHex);
    }

    translateRGBToHex(): string {
        let r = Number(this.myForm.value.R).toString(16);
        let g = Number(this.myForm.value.G).toString(16);
        let b = Number(this.myForm.value.B).toString(16);
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
}
