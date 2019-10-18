import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MatDialogRef } from '@angular/material';
import { ModalManagerService } from 'src/app/services/modal-manager/modal-manager.service';
import { DrawingSaverService } from 'src/app/services/server/drawing-saver/drawing-saver.service';
import { NameAndLabels } from 'src/classes/NameAndLabels';

@Component({
    selector: 'app-save-file-modal-window',
    templateUrl: './save-file-modal-window.component.html',
    styleUrls: ['./save-file-modal-window.component.scss'],
})
export class SaveFileModalWindowComponent implements OnInit {
    saveFileModalForm: FormGroup;
    formBuilder: FormBuilder;
    name: string;
    drawingLabels: string[] = ['flower', 'hakimhakimhakim', 'kevin', 'roman'];
    selectedLabels: string[] = [''];

    constructor(
        formBuilder: FormBuilder,
        private dialogRef: MatDialogRef<SaveFileModalWindowComponent>,
        private modalManagerService: ModalManagerService,
        private drawingSaverService: DrawingSaverService,
    ) {
        this.formBuilder = formBuilder;
    }

    ngOnInit() {
        this.initializeForm();
    }

    initializeForm(): void {
        this.saveFileModalForm = this.formBuilder.group({});
    }

    onCancel(): void {
        this.dialogRef.close();
        this.modalManagerService.setModalIsDisplayed(false);
    }

    onSubmit(): void {
        let nameAndLabals = new NameAndLabels(this.name, this.drawingLabels);
        this.drawingSaverService.currentDrawingLabels.next(nameAndLabals);
        this.modalManagerService.setModalIsDisplayed(false);
        window.alert('Sauvgarde Réussie!');
    }

    addLabel(newLabel: string): void {
        this.drawingLabels.push(newLabel);
    }
}
