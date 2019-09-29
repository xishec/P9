import { Component, HostListener, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material';

import { COLORS, ColorType } from 'src/constants/color-constants';
import { SIDEBAR_WIDTH } from 'src/constants/constants';
import { Color } from '../../../classes/Color';
import { DrawingInfo } from '../../../classes/DrawingInfo';
import { DrawingModalWindowService } from '../../services/drawing-modal-window/drawing-modal-window.service';
import { ColorToolService } from '../../services/tools/color-tool/color-tool.service';

@Component({
    selector: 'app-drawing-modal-window',
    templateUrl: './drawing-modal-window.component.html',
    styleUrls: ['./drawing-modal-window.component.scss'],
})
export class DrawingModalWindowComponent implements OnInit {
    drawingModalForm: FormGroup;
    formBuilder: FormBuilder;

    readonly colors: Color[] = COLORS;
    previewColor: Color = new Color();

    submitCount = 0;
    displayNewDrawingModalWindow = false;

    constructor(
        formBuilder: FormBuilder,
        private dialogRef: MatDialogRef<DrawingModalWindowComponent>,
        private drawingModalWindowService: DrawingModalWindowService,
        private colorToolService: ColorToolService,
    ) {
        this.formBuilder = formBuilder;
    }

    ngOnInit(): void {
        this.initializeForm();
        this.colorToolService.changeSelectedColor(ColorType.backgroundColor);
        this.drawingModalWindowService.currentDisplayNewDrawingModalWindow.subscribe((displayNewDrawingModalWindow) => {
            this.displayNewDrawingModalWindow = displayNewDrawingModalWindow;
        });
        this.colorToolService.backgroundColor.subscribe((backgroundColor) => {
            this.previewColor.hex = backgroundColor;
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
            color: this.previewColor,
            opacity: this.drawingModalForm.value.A,
        };
        this.drawingModalWindowService.changeInfo(drawingInfo);
        this.drawingModalWindowService.changeDisplayNewDrawingModalWindow(false);
        this.colorToolService.changeBackgroundColor(this.previewColor.hex);

        this.submitCount++;

        this.colorToolService.changeColorOnFocus(this.previewColor.hex);
        this.colorToolService.addColorToQueue(this.previewColor.hex);
        this.colorToolService.changeSelectedColor(undefined);
    }

    @HostListener('window:resize', ['$event'])
    onResize(): void {
        if (!this.drawingModalForm.controls.width.dirty && !this.drawingModalForm.controls.height.dirty) {
            this.drawingModalForm.controls.width.setValue(window.innerWidth - SIDEBAR_WIDTH);
            this.drawingModalForm.controls.height.setValue(window.innerHeight);
        }
    }

    onCancel(): void {
        this.colorToolService.changeCurrentShowColorPalette(false);
        this.colorToolService.changeSelectedColor(undefined);
        this.displayNewDrawingModalWindow = false;
        this.dialogRef.close();
    }

    getColorIcon(color: Color): IconStyle {
        return { backgroundColor: '#' + color.hex, opacity: '1' };
    }

    getUserColorIcon(): IconStyle {
        return { backgroundColor: '#' + this.previewColor.hex, opacity: String(this.drawingModalForm.value.A) };
    }

    setWindowHeight(): HeightStyle {
        if (this.submitCount === 0) {
            return { height: '450px' };
        } else {
            return { height: '510px' };
        }
    }

    onClickColorQueueButton(color: string): void {
        this.changeColor(color);
    }

    changeColor(previewColor: string): void {
        this.previewColor.hex = previewColor.slice(0, 6);
    }
}

interface IconStyle {
    backgroundColor: string;
    opacity: string;
}
interface HeightStyle {
    height: string;
}
