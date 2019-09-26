import { Component, HostListener, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Color } from '../../../classes/Color';
import { DrawingInfo } from '../../../classes/DrawingInfo';
import { DrawingModalWindowService } from '../../services/drawing-modal-window/drawing-modal-window.service';
import { ColorToolService } from '../../services/tools/color-tool/color-tool.service';

import { COLORS, DEFAULT_COLOR, SIDEBAR_WIDTH } from '../../services/constants';

@Component({
    selector: 'app-drawing-modal-window',
    templateUrl: './drawing-modal-window.component.html',
    styleUrls: ['./drawing-modal-window.component.scss'],
})
export class DrawingModalWindowComponent implements OnInit {
    drawingModalForm: FormGroup;
    formBuilder: FormBuilder;

    colors: Color[] = [];
    activeColor: Color = new Color();
    submitCount = 0;
    displayNewDrawingModalWindow = false;
    displayColorWheel = false;

    constructor(
        formBuilder: FormBuilder,
        private drawingModalWindowService: DrawingModalWindowService,
        private colorToolService: ColorToolService,
    ) {
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
        this.drawingModalWindowService.currentActiveColor.subscribe((activeColor) => {
            this.activeColor = activeColor;
        });
    }

    initializeForm(): void {
        this.drawingModalForm = this.formBuilder.group({
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
            width: this.drawingModalForm.value.width,
            height: this.drawingModalForm.value.height,
            color: this.activeColor,
            opacity: this.drawingModalForm.value.A,
        };
        this.drawingModalWindowService.changeInfo(drawingInfo);
        this.drawingModalWindowService.changeDisplayNewDrawingModalWindow(false);

        this.submitCount++;
        this.initializeForm();
        this.activeColor = { hex: DEFAULT_COLOR };
    }

    @HostListener('window:resize', ['$event'])
    onResize(): void {
        if (!this.drawingModalForm.controls.width.dirty && !this.drawingModalForm.controls.height.dirty) {
            this.drawingModalForm.controls.width.setValue(window.innerWidth - SIDEBAR_WIDTH);
            this.drawingModalForm.controls.height.setValue(window.innerHeight);
        }
    }
    onChangeColor(i: number): void {
        this.activeColor = this.colors[i];
        this.setHex();
        this.setRGBFromHex();
    }
    onClickColorPicker(): void {
        if (this.activeColor.hex === undefined) {
            return;
        }
        this.setHex();
        this.setRGBFromHex();
    }
    onCancel(): void {
        this.displayNewDrawingModalWindow = false;
    }
    onUserColorHex(): void {
        this.activeColor = { hex: this.drawingModalForm.value.hex };
        this.setRGBFromHex();
    }
    onUserColorRGB(): void {
        const newHex = this.colorToolService.rgbToHex(
            this.drawingModalForm.value.R,
            this.drawingModalForm.value.G,
            this.drawingModalForm.value.B,
        );
        this.activeColor = { hex: newHex };
        this.setHex();
    }

    setHex(): void {
        this.drawingModalForm.controls.hex.setValue(this.activeColor.hex);
    }
    setRGBFromHex(): void {
        this.drawingModalForm.controls.R.setValue(parseInt(this.activeColor.hex.slice(0, 2), 16));
        this.drawingModalForm.controls.G.setValue(parseInt(this.activeColor.hex.slice(2, 4), 16));
        this.drawingModalForm.controls.B.setValue(parseInt(this.activeColor.hex.slice(4, 6), 16));
    }

    getColorIcon(color: Color): IconStyle {
        return { backgroundColor: '#' + color.hex, opacity: '1' };
    }
    getUserColorIcon(): IconStyle {
        return { backgroundColor: '#' + this.activeColor.hex, opacity: String(this.drawingModalForm.value.A) };
    }

    setWindowHeight(): HeightStyle {
        if (this.submitCount === 0) {
            if (this.displayColorWheel) {
                return { height: '650px' };
            }
            return { height: '450px' };
        } else {
            if (this.displayColorWheel) {
                return { height: '750px' };
            }
            return { height: '510px' };
        }
    }

    onClickColorWheel() {
        this.displayColorWheel = !this.displayColorWheel;
    }
}

interface IconStyle {
    backgroundColor: string;
    opacity: string;
}
interface HeightStyle {
    height: string;
}
