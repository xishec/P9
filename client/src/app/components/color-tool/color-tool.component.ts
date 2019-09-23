import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Color } from '../../../classes/Color';
import { COLORS } from '../../services/constants';

@Component({
    selector: 'app-color-tool',
    templateUrl: './color-tool.component.html',
    styleUrls: ['./color-tool.component.scss'],
    //hangeDetection: ChangeDetectionStrategy.OnPush,
})
export class ColorToolComponent implements OnInit {
    myForm: FormGroup;
    formBuilder: FormBuilder;
    readonly colors: Color[] = [];
    primaryColor: Color = new Color();
    secondaryColor: Color = new Color();
    lastTenColors: Color[] = [];

    constructor(formBuilder: FormBuilder) {
        this.formBuilder = formBuilder;
        this.colors = COLORS;
        this.primaryColor = COLORS[3];
        this.addColorToColorList(COLORS[3]);
        this.secondaryColor = COLORS[1];
        this.addColorToColorList(COLORS[1]);
        this.initializeForm();
    }

    ngOnInit(): void {}

    initializeForm() {
        this.myForm = this.formBuilder.group({
            hex: ['000000', [Validators.pattern('^[0-9A-Fa-f]{6}$')]],
            R: ['0', [Validators.required, Validators.min(0), Validators.max(255)]],
            G: ['0', [Validators.required, Validators.min(0), Validators.max(255)]],
            B: ['0', [Validators.required, Validators.min(0), Validators.max(255)]],
            A: [1, [Validators.required, Validators.min(0), Validators.max(1)]],
        });
    }

    colorToolOn: boolean = false;
    showColorOptions() {
        this.colorToolOn = !this.colorToolOn;
    }

    displayColorWheel: boolean = false;
    onClickColorWheel() {
        this.displayColorWheel = !this.displayColorWheel;
    }

    indexOfTenColorArray: number = 0;
    addColorToColorList(color: Color) {
        if (this.lastTenColors.length < 10) {
            this.lastTenColors.push(color);
        } else {
            if (this.indexOfTenColorArray >= 10) {
                this.indexOfTenColorArray = 0;
            }
            this.lastTenColors[this.indexOfTenColorArray.valueOf()] = color;
            this.indexOfTenColorArray++;
        }
    }

    onChangeColor(color: Color) {
        if (this.primaryColorOn) {
            this.primaryColor = color;
        } else {
            this.secondaryColor = color;
        }
        this.addColorToColorList(color);
        this.setHexValues();
    }

    setHexValues() {
        this.setHex();
        this.setRGBFromHex();
    }

    // onCancel() {
    //     this.displayNewDrawingModalWindow = false;
    // }

    onUserColorHex() {
        if (this.primaryColorOn) {
            this.primaryColor = { hex: this.myForm.value.hex };
        } else {
            this.secondaryColor = { hex: this.myForm.value.hex };
        }
        this.setRGBFromHex();
    }

    onUserColorRGB() {
        const newHex = this.rgbToHex();
        if (this.primaryColorOn) {
            this.primaryColor = { hex: newHex };
        } else {
            this.secondaryColor = { hex: newHex };
        }
        this.setHex();
    }

    setHex() {
        if (this.primaryColorOn) {
            this.myForm.controls.hex.setValue(this.primaryColor.hex);
        } else {
            this.myForm.controls.hex.setValue(this.secondaryColor.hex);
        }
    }

    setRGBFromHex() {
        if (this.primaryColorOn) {
            this.myForm.controls.R.setValue(parseInt(this.primaryColor.hex.slice(0, 2), 16));
            this.myForm.controls.G.setValue(parseInt(this.primaryColor.hex.slice(2, 4), 16));
            this.myForm.controls.B.setValue(parseInt(this.primaryColor.hex.slice(4, 6), 16));
        } else {
            this.myForm.controls.R.setValue(parseInt(this.secondaryColor.hex.slice(0, 2), 16));
            this.myForm.controls.G.setValue(parseInt(this.secondaryColor.hex.slice(2, 4), 16));
            this.myForm.controls.B.setValue(parseInt(this.secondaryColor.hex.slice(4, 6), 16));
        }
    }

    getColorIcon(color: Color): ColorButtonStyle {
        return { backgroundColor: '#' + color.hex };
    }

    lastPrimaryOpacity: number = 1;
    lastSecondaryOpacity: number = 1;
    primaryColorOn: boolean = true;
    secondaryColorOn: boolean = false;
    selectedColor: Color = this.primaryColor;

    primaryColorClicked: boolean = true;
    secondaryColorClicked: boolean = false;
    getPrimaryColor(): ColorIconStyle {
        if (this.primaryColorOn) {
            this.secondaryColorClicked = false;
            if (this.primaryColorClicked) {
                this.lastPrimaryOpacity = this.myForm.value.A;
            }
            this.primaryColorClicked = true;
            this.myForm.controls.A.setValue(this.lastPrimaryOpacity);

            return {
                backgroundColor: '#' + this.primaryColor.hex,
                opacity: this.lastPrimaryOpacity,
                border: 'solid 1px black',
            };
        }

        return { backgroundColor: '#' + this.primaryColor.hex, opacity: this.lastPrimaryOpacity, border: 'solid 0px' };
    }

    getSecondaryColor(): ColorIconStyle {
        if (this.secondaryColorOn) {
            this.primaryColorClicked = false;
            if (this.secondaryColorClicked) {
                this.lastSecondaryOpacity = this.myForm.value.A;
            }
            this.secondaryColorClicked = true;
            this.myForm.controls.A.setValue(this.lastSecondaryOpacity);

            return {
                backgroundColor: '#' + this.secondaryColor.hex,
                opacity: this.lastSecondaryOpacity,
                border: 'solid 1px black',
            };
        }

        return {
            backgroundColor: '#' + this.secondaryColor.hex,
            opacity: this.lastSecondaryOpacity,
            border: 'solid 0px',
        };
    }

    chosePrimaryColor() {
        this.primaryColorOn = true;
        this.secondaryColorOn = false;
        this.myForm.value.A = this.lastPrimaryOpacity;
        this.setHexValues();
    }
    choseSecondaryColor() {
        this.primaryColorOn = false;
        this.secondaryColorOn = true;
        this.myForm.value.A = this.lastSecondaryOpacity;
        this.setHexValues();
    }

    switchColors() {
        let temporaryColor: Color = new Color();
        temporaryColor = this.primaryColor;
        this.primaryColor = this.secondaryColor;
        this.secondaryColor = temporaryColor;
        this.setHex();
        this.setRGBFromHex();
    }

    rgbToHex(): string {
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

interface ColorIconStyle {
    backgroundColor: string;
    opacity: number;
    border: string;
}

interface ColorButtonStyle {
    backgroundColor: string;
}
