import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ColorToolService } from 'src/app/services/tools/color-tool/color-tool.service';
import { Color } from '../../../classes/Color';
import { /*COLORS,*/ ColorType } from '../../services/constants';

@Component({
    selector: 'app-color-tool',
    templateUrl: './color-tool.component.html',
    styleUrls: ['./color-tool.component.scss'],
})
export class ColorToolComponent implements OnInit {
    myForm: FormGroup;
    formBuilder: FormBuilder;

    selectedColor: ColorType = ColorType.primaryColor;
    primaryColor: Color = new Color();
    secondaryColor: Color = new Color();

    // lastTenColorsQueue: Color[] = [];

    constructor(formBuilder: FormBuilder, private colorToolService: ColorToolService) {
        this.formBuilder = formBuilder;
        this.initializeForm();
    }

    ngOnInit(): void {
        this.primaryColor = this.colorToolService.primaryColor;
        this.secondaryColor = this.colorToolService.secondaryColor;
        this.setHexValues();
    }

    initializeForm() {
        this.myForm = this.formBuilder.group({
            hex: ['000000', [Validators.pattern('^([A-Fa-f0-9]{3}$)|([A-Fa-f0-9]{6}$)')]],
            R: ['0', [Validators.required, Validators.min(0), Validators.max(255)]],
            G: ['0', [Validators.required, Validators.min(0), Validators.max(255)]],
            B: ['0', [Validators.required, Validators.min(0), Validators.max(255)]],
            A: [1, [Validators.required, Validators.min(0), Validators.max(1)]],
        });
    }

    changeColor(colorHex: string): void {
        const newColor = new Color(colorHex);
        this.setColor(newColor);
        // this.addColorToColorList(color);
        this.setColorNumericValues();
    }

    setColor(color: Color): void {
        if (this.selectedColor === ColorType.primaryColor) {
            this.colorToolService.changeColor(color, ColorType.primaryColor);
            this.primaryColor = color;
        } else if (this.selectedColor === ColorType.secondaryColor) {
            this.colorToolService.changeColor(color, ColorType.secondaryColor);
            this.secondaryColor = color;
        }
    }

<<<<<<< HEAD
    setColorNumericValues() {
        this.setHexValues();
        this.setRGBValues();
    }

    setHexValues() {
=======
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
    setHexValues() {
        this.setHex();
        this.setRGBFromHex();
    }

    // GOOD
    onUserHexInput(): void {
        if (this.selectedColor === ColorType.primaryColor) {
            this.changeColor(this.myForm.value.hex);
        } else if (this.selectedColor === ColorType.secondaryColor) {
            this.changeColor(this.myForm.value.hex);
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

    // GOOD
    setHex() {
>>>>>>> 51f43d5b0dd733ea0214f0017938a2337a4dc8fd
        if (this.selectedColor === ColorType.primaryColor) {
            this.myForm.controls.hex.setValue(this.primaryColor.hex);
        } else if (this.selectedColor === ColorType.secondaryColor) {
            this.myForm.controls.hex.setValue(this.secondaryColor.hex);
        }
    }

<<<<<<< HEAD
    setRGBValues() {
=======
    // GOOD
    setRGBFromHex() {
>>>>>>> 51f43d5b0dd733ea0214f0017938a2337a4dc8fd
        if (this.selectedColor === ColorType.primaryColor) {
            this.myForm.controls.R.setValue(parseInt(this.primaryColor.hex.slice(0, 2), 16));
            this.myForm.controls.G.setValue(parseInt(this.primaryColor.hex.slice(2, 4), 16));
            this.myForm.controls.B.setValue(parseInt(this.primaryColor.hex.slice(4, 6), 16));
        } else if (this.selectedColor === ColorType.secondaryColor) {
            this.myForm.controls.R.setValue(parseInt(this.secondaryColor.hex.slice(0, 2), 16));
            this.myForm.controls.G.setValue(parseInt(this.secondaryColor.hex.slice(2, 4), 16));
            this.myForm.controls.B.setValue(parseInt(this.secondaryColor.hex.slice(4, 6), 16));
        }
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

    onUserHexInput(): void {
        this.changeColor(this.myForm.value.hex);
    }

    onUserColorRGBInput(): void {
        const newColorinHex = this.translateRGBToHex();
        this.changeColor(newColorinHex);
    }

    onClickPrimaryColorStyle() {
<<<<<<< HEAD
=======
        console.log('Color ', this.selectedColor);
>>>>>>> 51f43d5b0dd733ea0214f0017938a2337a4dc8fd
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

    onClickPrimaryColor() {
        this.selectedColor = ColorType.primaryColor;
        this.setColorNumericValues();
    }

    onClickSecondaryColor() {
        this.selectedColor = ColorType.secondaryColor;
        this.setColorNumericValues();
    }

<<<<<<< HEAD
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
=======
    // }

    // interface ColorIconStyle {
    //     backgroundColor: string;
    //     opacity: number;
    //     border: string;
    // }

    // interface ColorButtonStyle {
    //     backgroundColor: string;
    // }
>>>>>>> 51f43d5b0dd733ea0214f0017938a2337a4dc8fd
}
