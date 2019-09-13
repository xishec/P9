import { Component, HostListener, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Color } from '../../../../classes/Color';
import { DrawingInfo } from '../../../../classes/DrawingInfo';
import { DrawingModalWindow } from '../../../services/drawing-modal-window/drawing-modal-window.service';

import { CONSTANTS } from '../CONSTANTS';

@Component({
    selector: 'app-drawing-modal-window',
    templateUrl: './drawing-modal-window.component.html',
    styleUrls: ['./drawing-modal-window.component.scss'],
})
export class DrawingModalWindowComponent implements OnInit {
    drawingModalWindow: DrawingModalWindow;

    myForm: FormGroup;
    formBuilder: FormBuilder;

    colors: Color[];
    activeColor: Color;
    submitCount: number = 0;
    ifShowWindow: boolean;

    constructor(formBuilder: FormBuilder, drawingModalWindow: DrawingModalWindow) {
        this.formBuilder = formBuilder;
        this.drawingModalWindow = drawingModalWindow;
        this.colors = drawingModalWindow.colors;
        this.activeColor = drawingModalWindow.colors[0];
    }

    ngOnInit(): void {
        this.initializeForm();
        this.drawingModalWindow.currentIfShowWindow.subscribe((ifShowWindow) => {
            this.ifShowWindow = ifShowWindow;
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
            width: [
                window.innerWidth - CONSTANTS.SIDEBAR_WIDTH,
                [Validators.required, Validators.min(0), Validators.max(10000)],
            ],
            height: [window.innerHeight, [Validators.required, Validators.min(0), Validators.max(10000)]],
        });
    }

    onSubmit() {
        const drawingInfo: DrawingInfo = {
            width: this.myForm.value.width,
            height: this.myForm.value.height,
            color: this.activeColor,
            opacity: this.myForm.value.A,
        };
        this.drawingModalWindow.changeInfo(drawingInfo);
        this.drawingModalWindow.changeIfShowWindow(false);

        this.submitCount++;
        this.initializeForm();
        this.activeColor = { hex: 'ffffff' };
    }

    @HostListener('window:resize', ['$event'])
    onResize() {
        if (!this.myForm.controls.width.dirty && !this.myForm.controls.height.dirty) {
            this.myForm.controls.width.setValue(window.innerWidth - CONSTANTS.SIDEBAR_WIDTH);
            this.myForm.controls.height.setValue(window.innerHeight);
        }
    }

    changeColor(i: number) {
        this.activeColor = this.colors[i];
        this.setHex();
        this.setRGBFromHex();
    }

    onUserColorHex() {
        this.activeColor = { hex: this.myForm.value.hex };
        this.setRGBFromHex();
    }
    onUserColorRGB() {
        let newHex = this.rgbToHex();
        this.activeColor = { hex: newHex };
        this.setHex();
    }

    setHex() {
        this.myForm.controls.hex.setValue(this.activeColor.hex);
    }
    setRGBFromHex() {
        this.myForm.controls.R.setValue(parseInt(this.activeColor.hex.slice(0, 2), 16));
        this.myForm.controls.G.setValue(parseInt(this.activeColor.hex.slice(2, 4), 16));
        this.myForm.controls.B.setValue(parseInt(this.activeColor.hex.slice(4, 6), 16));
    }

    getColorIcon(color: Color) {
        return { 'background-color': '#' + color.hex };
    }
    getUserColorIcon() {
        return { 'background-color': '#' + this.activeColor.hex, opacity: String(this.myForm.value.A) };
    }

    cancel() {
        this.ifShowWindow = false;
    }

    setWindowHeight() {
        if (this.submitCount === 0) {
            return { height: '450px' };
        } else {
            return { height: '500px' };
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
