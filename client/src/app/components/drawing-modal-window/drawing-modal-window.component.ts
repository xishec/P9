import { Component, HostListener, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ColorType, SIDEBAR_WIDTH } from 'src/app/services/constants';
import { ColorToolService } from 'src/app/services/tools/color-tool/color-tool.service';
import { Color } from 'src/classes/Color';

import { DrawingInfo } from '../../../classes/DrawingInfo';
import { SIDEBAR_WIDTH } from '../../services/constants';
import { DrawingModalWindowService } from '../../services/drawing-modal-window/drawing-modal-window.service';

@Component({
    selector: 'app-drawing-modal-window',
    templateUrl: './drawing-modal-window.component.html',
    styleUrls: ['./drawing-modal-window.component.scss'],
})
export class DrawingModalWindowComponent implements OnInit {
    drawingModalForm: FormGroup;
    formBuilder: FormBuilder;

    drawingZoneColor = new Color();

    constructor(formBuilder: FormBuilder, private drawingModalWindowService: DrawingModalWindowService) {
        private colorToolService: ColorToolService,
        this.formBuilder = formBuilder;
        this.drawingModalWindowService = drawingModalWindowService;
    }

    ngOnInit(): void {
        this.initializeForm();
        this.colorToolService.primaryColor.subscribe((primaryColor) => {
            this.drawingZoneColor = primaryColor;
        });
    }

    initializeForm(): void {
        this.drawingModalForm = this.formBuilder.group({
            confirm: this.submitCount === 0,
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
        this.submitCount++;
        this.initializeForm();
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
