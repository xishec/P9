import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Color } from '../../../classes/Color';
import { COLORS } from '../../services/constants';

@Component({
    selector: 'app-color-tool',
    templateUrl: './color-tool.component.html',
    styleUrls: ['./color-tool.component.scss'],
})
export class ColorToolComponent implements OnInit {
    myForm: FormGroup;
    formBuilder: FormBuilder;
    readonly colors: Color[] = [];
    primaryColor: Color = new Color();
    secondaryColor: Color = new Color();
    lastTenColorsQueue: Color[] = [];

    colorToolOn = false;
    displayColorWheel = false;
    indexOfTenColorArray = 0;

    lastPrimaryOpacity = 1;
    // lastSecondaryOpacity = 1;
    // primaryColorClicked = true;
    // secondaryColorClicked = false;

    constructor(formBuilder: FormBuilder) {
        this.formBuilder = formBuilder;

        // this.addColorToColorList(COLORS[3]);
        // this.addColorToColorList(COLORS[1]);
        this.initializeForm();
    }

    ngOnInit(): void {
        this.primaryColor = this.colorToolService.primaryColor;
        this.secondaryColor = this.colorToolService.secondaryColor;
    }

    initializeForm() {
        this.myForm = this.formBuilder.group({
            hex: ['000000', [Validators.pattern('^[0-9A-Fa-f]{6}$')]],
            R: ['0', [Validators.required, Validators.min(0), Validators.max(255)]],
            G: ['0', [Validators.required, Validators.min(0), Validators.max(255)]],
            B: ['0', [Validators.required, Validators.min(0), Validators.max(255)]],
            A: [1, [Validators.required, Validators.min(0), Validators.max(1)]],
        });
    }

    showColorOptions() {
        this.colorToolOn = !this.colorToolOn;
    }

    onClickColorWheel() {
        this.displayColorWheel = !this.displayColorWheel;
    }

    addColorToColorList(color: Color) {
        if (this.lastTenColorsQueue.length < 10) {
            this.lastTenColorsQueue.push(color);
        } else {
            this.lastTenColorsQueue.shift();
            this.lastTenColorsQueue.push(color);
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

     // switchColors() {
    //     let temporaryColor: Color = new Color();
    //     temporaryColor = this.primaryColor;
    //     this.primaryColor = this.secondaryColor;
    //     this.secondaryColor = temporaryColor;
    //     this.setHexValues();
    // }

    // addColorToColorList(color: Color) {
    //     if (this.lastTenColorsQueue.length < 10) {
    //         this.lastTenColorsQueue.push(color);
    //     } else {
    //         this.lastTenColorsQueue.shift();
    //         this.lastTenColorsQueue.push(color);
    //     }
    // }

    // rgbToHex(): string {
    //     let r = Number(this.myForm.value.R).toString(16);
    //     let g = Number(this.myForm.value.G).toString(16);
    //     let b = Number(this.myForm.value.B).toString(16);
    //     if (r.length === 1) {
    //         r = '0' + r;
    //     }
    //     if (g.length === 1) {
    //         g = '0' + g;
    //     }
    //     if (b.length === 1) {
    //         b = '0' + b;
    //     }
    //     return r + g + b;
    // }

        // GOOD
    onClickColorWheel() {
        this.displayColorWheel = !this.displayColorWheel;
    }

        // GOOD
        this.displayColorWheel = !this.displayColorWheel;
    setHexValues() {
        this.setHex();
        this.setRGBFromHex();
    }

    onUserColorHex() {
        if (this.primaryColorOn) {
            this.primaryColor = { hex: this.myForm.value.hex };
            this.onChangeColor(this.primaryColor);
        } else {
            this.secondaryColor = { hex: this.myForm.value.hex };
            this.onChangeColor(this.secondaryColor);
        }
        this.setRGBFromHex();
    }

    //     // GOOD
    // onUserColorRGBInput() {
    //     const newHex = this.rgbToHex();
    //     if (this.primaryColorOn) {
    //         this.primaryColor = { hex: newHex };
    //         this.onChangeColor(this.primaryColor);
    //     } else {
    //         this.secondaryColor = { hex: newHex };
    //         this.onChangeColor(this.secondaryColor);
    //     }
    //     this.setHex();
    // }

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

    // getColorIcon(color: Color): ColorButtonStyle {
    //     return { backgroundColor: '#' + color.hex };
    // }

    onClickPrimaryColorStyle() {
        console.log("Color ", this.selectedColor);
        if (this.selectedColor === ColorType.primaryColor) {
            return {
                backgroundColor: '#' + this.primaryColor.hex,
                border: 'solid 1px black',
            };
        }

        return {
            backgroundColor: '#' + this.primaryColor.hex,
        };
    }

    onClickSecondaryColorStyle() {
        if (this.selectedColor === ColorType.secondaryColor) {
            return {
                backgroundColor: '#' + this.secondaryColor.hex,
                border: 'solid 1px black',
            };
        }

        return {
            backgroundColor: '#' + this.secondaryColor.hex,
        };
    }

    chosePrimaryColor() {
        this.primaryColorOn = true;
        this.secondaryColorOn = false;
        this.setHexValues();
    }

    choseSecondaryColor() {
        this.primaryColorOn = false;
        this.secondaryColorOn = true;
        this.setHexValues();
    }

    switchColors() {
        let temporaryColor: Color = new Color();
        temporaryColor = this.primaryColor;
        this.primaryColor = this.secondaryColor;
        this.secondaryColor = temporaryColor;
        this.setHexValues();
    }

// }

// interface ColorIconStyle {
//     backgroundColor: string;
//     opacity: number;
//     border: string;
// }

// interface ColorButtonStyle {
//     backgroundColor: string;
// }
}
