import { Component, HostListener, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Color } from '../../../classes/Color';
import { DrawingInfo } from '../../../classes/DrawingInfo';
import { DrawingModalWindowService } from '../../services/drawing-modal-window/drawing-modal-window.service';

import { COLORS, DEFAULT_COLOR, SIDEBAR_WIDTH } from '../../services/constants';

@Component({
    selector: 'app-color-tool',
    templateUrl: './color-tool.component.html',
    styleUrls: ['./color-tool.component.scss'],
})
export class ColorToolComponent implements OnInit {
    drawingModalWindowService: DrawingModalWindowService;

    myForm: FormGroup;
    formBuilder: FormBuilder;

    colors: Color[] = [];
    primaryColor: Color = new Color();
    secondaryColor: Color = new Color();
    submitCount = 0;
    displayNewDrawingModalWindow = false;

    colorToolOn: boolean = false;
    showColorOptions() {
        if (!this.colorToolOn) {
            this.colorToolOn = true;
        } else {
            this.colorToolOn = false;
        }
    }

    ColorPaletteShown: boolean = false;
    showColorPalette() {
        if (!this.ColorPaletteShown) {
            this.ColorPaletteShown = true;
        } else {
            this.ColorPaletteShown = false;
        }
    }

    constructor(formBuilder: FormBuilder, drawingModalWindowService: DrawingModalWindowService) {
        this.formBuilder = formBuilder;
        this.drawingModalWindowService = drawingModalWindowService;
        this.colors = COLORS;
        this.primaryColor = COLORS[3];
    }

    ngOnInit(): void {
        this.initializeForm();
        this.drawingModalWindowService.currentDisplayNewDrawingModalWindow.subscribe((displayNewDrawingModalWindow) => {
            this.displayNewDrawingModalWindow = displayNewDrawingModalWindow;
        });
    }

    initializeForm() {
        this.myForm = this.formBuilder.group({
            hex: ['ffffff', [Validators.pattern('^[0-9A-Fa-f]{6}$')]],
            R: ['255', [Validators.required, Validators.min(0), Validators.max(255)]],
            G: ['255', [Validators.required, Validators.min(0), Validators.max(255)]],
            B: ['255', [Validators.required, Validators.min(0), Validators.max(255)]],
            A: [1, [Validators.required, Validators.min(0), Validators.max(1)]],
            confirm: this.submitCount === 0,
            width: [window.innerWidth - SIDEBAR_WIDTH, [Validators.required, Validators.min(0), Validators.max(10000)]],
            height: [window.innerHeight, [Validators.required, Validators.min(0), Validators.max(10000)]],
        });
    }

    onSubmit() {
        const drawingInfo: DrawingInfo = {
            width: this.myForm.value.width,
            height: this.myForm.value.height,
            color: this.primaryColor,
            opacity: this.myForm.value.A,
        };
        this.drawingModalWindowService.changeInfo(drawingInfo);
        this.drawingModalWindowService.changeIfShowWindow(false);

        this.submitCount++;
        this.initializeForm();
        this.primaryColor = { hex: DEFAULT_COLOR };
    }

    @HostListener('window:resize', ['$event'])
    onResize() {
        if (!this.myForm.controls.width.dirty && !this.myForm.controls.height.dirty) {
            this.myForm.controls.width.setValue(window.innerWidth - SIDEBAR_WIDTH);
            this.myForm.controls.height.setValue(window.innerHeight);
        }
    }
    onChangeColor(i: number) {
        if (this.primaryColorOn) {
            this.primaryColor = this.colors[i];
        } else {
            this.secondaryColor = this.colors[i];
        }
        this.setHex();
        this.setRGBFromHex();
    }
    onCancel() {
        this.displayNewDrawingModalWindow = false;
    }
    onUserColorHex() {
        this.primaryColor = { hex: this.myForm.value.hex };
        this.setRGBFromHex();
    }
    onUserColorRGB() {
        const newHex = this.rgbToHex();
        this.primaryColor = { hex: newHex };
        this.setHex();
    }

    setHex() {
        this.myForm.controls.hex.setValue(this.primaryColor.hex);
    }
    setRGBFromHex() {
        this.myForm.controls.R.setValue(parseInt(this.primaryColor.hex.slice(0, 2), 16));
        this.myForm.controls.G.setValue(parseInt(this.primaryColor.hex.slice(2, 4), 16));
        this.myForm.controls.B.setValue(parseInt(this.primaryColor.hex.slice(4, 6), 16));
    }

    getColorIcon(color: Color) {
        return { backgroundColor: '#' + color.hex };
    }
    getPrimaryColor() {
        return { backgroundColor: '#' + this.primaryColor.hex, opacity: String(this.myForm.value.A) };
    }
    getSecondaryColor() {
        return { backgroundColor: '#' + this.secondaryColor.hex, opacity: String(this.myForm.value.A) };
    }

    primaryColorOn: boolean = true;
    secondaryColorOn: boolean = false;
    chosePrimaryColor() {
        this.primaryColorOn = true;
        this.secondaryColorOn = false;
    }
    choseSecondaryColor() {
        this.primaryColorOn = false;
        this.secondaryColorOn = true;
    }

    setWindowHeight() {
        if (this.submitCount === 0) {
            return { height: '450px' };
        } else {
            return { height: '510px' };
        }
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
