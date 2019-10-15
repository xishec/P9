import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material';

import { DrawingFileInfo } from 'src/classes/DrawingFileInfo';
import { ModalManagerService } from 'src/app/services/modal-manager/modal-manager.service';

@Component({
    selector: 'app-open-file-modal-window',
    templateUrl: './open-file-modal-window.component.html',
    styleUrls: ['./open-file-modal-window.component.scss'],
})
export class OpenFileModalWindowComponent implements OnInit {
    openFileModalForm: FormGroup;
    formBuilder: FormBuilder;

    drawingFileInfos: DrawingFileInfo[] = [
        { name: 'animal drawing', labels: ['tiger', 'lion'], thumbnail: 'thumbnail1' },
        { name: 'food drawing', labels: ['hamburger', 'poutine'], thumbnail: 'thumbnail2' },
        { name: 'countries drawing', labels: ['Canada', 'USA', 'Italy'], thumbnail: 'thumbnail3' },
    ];
    selectedOption: string = '';

    constructor(
        formBuilder: FormBuilder,
        private dialogRef: MatDialogRef<OpenFileModalWindowComponent>,
        private modalManagerService: ModalManagerService,
    ) {
        this.formBuilder = formBuilder;
    }

    ngOnInit() {
        this.initializeForm();
    }

    initializeForm(): void {
        this.openFileModalForm = this.formBuilder.group({
            selectedDrawing: ['', Validators.required],
        });
    }

    handleSelection(event: any): void {
        if (event.option.selected) {
            event.source.deselectAll();
            event.option._setSelected(true);
            this.selectedOption = event.option.value;
        }
    }

    onCancel(): void {
        this.dialogRef.close();
        this.modalManagerService.setModalIsDisplayed(false);
    }

    onSubmit() {
        console.log(this.selectedOption);
        this.modalManagerService.setModalIsDisplayed(false);
    }
}
