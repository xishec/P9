import { Component, HostListener, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material';

import { ColorType, SIDEBAR_WIDTH } from 'src/app/services/constants';
import { DrawingModalWindowService } from 'src/app/services/drawing-modal-window/drawing-modal-window.service';
import { ColorToolService } from 'src/app/services/tools/color-tool/color-tool.service';
import { Color } from 'src/classes/Color';
import { DrawingInfo } from 'src/classes/DrawingInfo';

interface ColorStyle {
    backgroundColor: string;
    border: string;
}
@Component({
    selector: 'app-drawing-modal-window',
    templateUrl: './drawing-modal-window.component.html',
    styleUrls: ['./drawing-modal-window.component.scss'],
})
export class DrawingModalWindowComponent implements OnInit {
    drawingModalForm: FormGroup;
    formBuilder: FormBuilder;

    drawingZoneColor = new Color();
    blankWorkZone = true;
    modalDisplayed = false;

    constructor(
        formBuilder: FormBuilder,
        private dialogRef: MatDialogRef<DrawingModalWindowComponent>,
        private colorToolService: ColorToolService,
        private drawingModalWindowService: DrawingModalWindowService,
    ) {
        this.formBuilder = formBuilder;
    }

    ngOnInit(): void {
        this.initializeForm();
        this.colorToolService.primaryColor.subscribe((primaryColor) => {
            this.drawingZoneColor = primaryColor;
        });
        this.drawingModalWindowService.blankDrawingZone.subscribe((isBlank) => {
            this.blankWorkZone = isBlank;
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
        const drawingInfo: DrawingInfo = {
            color: new Color(),
            opacity: 1,
            width: this.drawingModalForm.value.width,
            height: this.drawingModalForm.value.height,
        };
        this.drawingModalWindowService.changeInfo(drawingInfo);
        this.modalDisplayed = true;
        this.drawingModalWindowService.updateDrawingZoneState(false);
    }

    @HostListener('window:resize', ['$event'])
    onResize(): void {
        if (!this.drawingModalForm.controls.width.dirty && !this.drawingModalForm.controls.height.dirty) {
            this.drawingModalForm.controls.width.setValue(window.innerWidth - SIDEBAR_WIDTH);
            this.drawingModalForm.controls.height.setValue(window.innerHeight);
        }
    }

    currentColor(): Color {
        return this.drawingZoneColor;
    }

    changeColor(colorHex: string): void {
        const newColor = new Color(colorHex);
        this.colorToolService.changeColor(newColor, ColorType.primaryColor);
        this.colorToolService.addColorToQueue(newColor);
    }

    colorButtonStyle(): ColorStyle {
        return {
            backgroundColor: '#' + this.drawingZoneColor.hex,
            border: 'solid 1px black',
        };
    }

    onClickColorQueueButton(color: Color): void {
        this.changeColor(color.hex);
    }
}
