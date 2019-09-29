import { Component, HostListener, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material';

import { ColorType } from 'src/constants/color-constants';
import { SIDEBAR_WIDTH } from 'src/constants/constants';
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

    previewColor: string;
    blankWorkZone = true;
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

        this.previewColor = this.colorToolService.backgroundColor.value;

        this.drawingModalWindowService.currentDisplayNewDrawingModalWindow.subscribe((displayNewDrawingModalWindow) => {
            this.displayNewDrawingModalWindow = displayNewDrawingModalWindow;
        });
        this.colorToolService.previewColor.subscribe((previewColor) => {
            this.previewColor = previewColor;
        });
        this.drawingModalWindowService.currentBlankDrawingZone.subscribe((blankWorkZone) => {
            this.blankWorkZone = blankWorkZone;
            this.drawingModalForm.controls.confirm.setValue(blankWorkZone);
        });
    }

    initializeForm(): void {
        this.drawingModalForm = this.formBuilder.group({
            confirm: this.blankWorkZone,
            width: [window.innerWidth - SIDEBAR_WIDTH, [Validators.required, Validators.min(0), Validators.max(10000)]],
            height: [window.innerHeight, [Validators.required, Validators.min(0), Validators.max(10000)]],
        });
    }

    onSubmit() {
        this.drawingModalWindowService.changeDrawingInfoWidthHeight(
            this.drawingModalForm.value.width,
            this.drawingModalForm.value.height,
        );
        this.drawingModalWindowService.changeDisplayNewDrawingModalWindow(false);
        this.colorToolService.changeBackgroundColor(this.previewColor);
        this.drawingModalWindowService.setBlankDrawingZone(false);
        this.colorToolService.addColorToQueue(this.previewColor);
    }

    @HostListener('window:resize', ['$event'])
    onResize(): void {
        if (!this.drawingModalForm.controls.width.dirty && !this.drawingModalForm.controls.height.dirty) {
            this.drawingModalForm.controls.width.setValue(window.innerWidth - SIDEBAR_WIDTH);
            this.drawingModalForm.controls.height.setValue(window.innerHeight);
        }
    }

    onCancel(): void {
        this.dialogRef.close();
    }

    getUserColorIcon(): IconStyle {
        return { backgroundColor: '#' + this.previewColor, opacity: String(this.drawingModalForm.value.A) };
    }

    onClickColorQueueButton(previewColor: string): void {
        this.previewColor = previewColor;
    }
}

interface IconStyle {
    backgroundColor: string;
    opacity: string;
}
