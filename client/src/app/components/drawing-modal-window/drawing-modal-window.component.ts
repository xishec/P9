import { Component, HostListener, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Color } from '../../../classes/Color';
import { DrawingInfo } from '../../../classes/DrawingInfo';
import { DrawingModalWindowService } from '../../services/drawing-modal-window/drawing-modal-window.service';

import { COLORS, DEFAULT_COLOR, SIDEBAR_WIDTH } from '../../services/constants';

@Component({
    selector: 'app-drawing-modal-window',
    templateUrl: './drawing-modal-window.component.html',
    styleUrls: ['./drawing-modal-window.component.scss'],
})
export class DrawingModalWindowComponent implements OnInit {
    drawingModalWindowService: DrawingModalWindowService;

    myForm: FormGroup;
    formBuilder: FormBuilder;

    colors: Color[] = [];
    activeColor: Color = new Color();
    submitCount = 0;
    displayNewDrawingModalWindow = false;

    constructor(formBuilder: FormBuilder, drawingModalWindowService: DrawingModalWindowService) {
        this.formBuilder = formBuilder;
        this.drawingModalWindowService = drawingModalWindowService;
        this.colors = COLORS;
        this.activeColor = COLORS[0];
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
            color: this.activeColor,
            opacity: this.myForm.value.A,
        };
        this.drawingModalWindowService.changeInfo(drawingInfo);
        this.drawingModalWindowService.changeIfShowWindow(false);

        this.submitCount++;
        this.initializeForm();
        this.activeColor = { hex: DEFAULT_COLOR };
    }

    @HostListener('window:resize', ['$event'])
    onResize() {
        if (!this.myForm.controls.width.dirty && !this.myForm.controls.height.dirty) {
            this.myForm.controls.width.setValue(window.innerWidth - SIDEBAR_WIDTH);
            this.myForm.controls.height.setValue(window.innerHeight);
        }
    }
    onChangeColor(i: number) {
        this.activeColor = this.colors[i];
        this.setHex();
        this.setRGBFromHex();
    }
    onCancel() {
        this.displayNewDrawingModalWindow = false;
    }
    onUserColorHex() {
        this.activeColor = { hex: this.myForm.value.hex };
        this.setRGBFromHex();
    }
    onUserColorRGB() {
        const newHex = this.rgbToHex();
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

    getColorIcon(color: Color): IconStyle {
        return { backgroundColor: '#' + color.hex, opacity: '1' };
    }
    getUserColorIcon(): IconStyle {
        return { backgroundColor: '#' + this.activeColor.hex, opacity: String(this.myForm.value.A) };
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

interface IconStyle {
    backgroundColor: string;
    opacity: string;
}
