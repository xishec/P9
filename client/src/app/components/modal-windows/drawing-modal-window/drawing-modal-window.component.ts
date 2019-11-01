import { Component, HostListener, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material';

import { ModalManagerService } from 'src/app/services/modal-manager/modal-manager.service';
import { DrawingLoaderService } from 'src/app/services/server/drawing-loader/drawing-loader.service';
import { UndoRedoerService } from 'src/app/services/undo-redoer/undo-redoer.service';
import { DrawingInfo } from 'src/classes/DrawingInfo';
import { SIDEBAR_WIDTH } from 'src/constants/constants';
import { DrawingModalWindowService } from '../../../services/drawing-modal-window/drawing-modal-window.service';
import { ShortcutManagerService } from '../../../services/shortcut-manager/shortcut-manager.service';
import { ColorToolService } from '../../../services/tools/color-tool/color-tool.service';

@Component({
    selector: 'app-drawing-modal-window',
    templateUrl: './drawing-modal-window.component.html',
    styleUrls: ['./drawing-modal-window.component.scss'],
})
export class DrawingModalWindowComponent implements OnInit {
    drawingModalForm: FormGroup;
    formBuilder: FormBuilder;

    previewColor: string;
    emptyDrawStack = true;

    constructor(
        formBuilder: FormBuilder,
        private dialogRef: MatDialogRef<DrawingModalWindowComponent>,
        private drawingModalWindowService: DrawingModalWindowService,
        private colorToolService: ColorToolService,
        private shortcutManagerService: ShortcutManagerService,
        private modalManagerService: ModalManagerService,
        private drawingLoaderService: DrawingLoaderService,
        private undoRedoerService: UndoRedoerService,
    ) {
        this.formBuilder = formBuilder;
    }

    ngOnInit(): void {
        this.colorToolService.previewColor.subscribe((previewColor) => {
            this.previewColor = previewColor;
        });

        this.drawingLoaderService.emptyDrawStack.subscribe((emptyDrawStack) => {
            this.emptyDrawStack = emptyDrawStack;
        });

        this.initializeForm();
    }

    initializeForm(): void {
        this.drawingModalForm = this.formBuilder.group({
            confirm: this.emptyDrawStack,
            width: [window.innerWidth - SIDEBAR_WIDTH, [Validators.required, Validators.min(0), Validators.max(10000)]],
            height: [window.innerHeight, [Validators.required, Validators.min(0), Validators.max(10000)]],
        });
    }

    onSubmit() {

        this.undoRedoerService.initializeStacks();

        this.drawingModalWindowService.changeDrawingInfo(
            this.drawingModalForm.value.width,
            this.drawingModalForm.value.height,
            this.previewColor,
        );
        this.drawingLoaderService.currentDrawing.next({
            name: '',
            labels: [],
            svg: '',
            idStack: [],
            drawingInfo: new DrawingInfo(0, 0, ''),
        });
        this.colorToolService.changeBackgroundColor(this.previewColor);
        this.colorToolService.addColorToQueue(this.previewColor);
        this.modalManagerService.setModalIsDisplayed(false);
    }

    @HostListener('window:resize')
    onResize(): void {
        if (!this.drawingModalForm.controls.width.dirty && !this.drawingModalForm.controls.height.dirty) {
            this.drawingModalForm.controls.width.setValue(window.innerWidth - SIDEBAR_WIDTH);
            this.drawingModalForm.controls.height.setValue(window.innerHeight);
        }
    }

    onCancel(): void {
        this.dialogRef.close();
        this.modalManagerService.setModalIsDisplayed(false);
    }

    getUserColorIcon(): IconStyle {
        return { backgroundColor: '#' + this.previewColor };
    }

    onClickColorQueueButton(previewColor: string): void {
        this.previewColor = previewColor;
    }

    onFocus(): void {
        this.shortcutManagerService.changeIsOnInput(true);
    }
    onFocusOut(): void {
        this.shortcutManagerService.changeIsOnInput(false);
    }
}

interface IconStyle {
    backgroundColor: string;
}
