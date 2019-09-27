import { Component, HostListener, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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

    submitCount = 0;

    constructor(formBuilder: FormBuilder, private drawingModalWindowService: DrawingModalWindowService) {
        this.formBuilder = formBuilder;
        this.drawingModalWindowService = drawingModalWindowService;
    }

    ngOnInit(): void {
        this.initializeForm();
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

    setWindowHeight(): HeightStyle {
        if (this.submitCount === 0) {
            return { height: '450px' };
        } else {
            return { height: '510px' };
        }
    }

}
interface HeightStyle {
    height: string;
}
