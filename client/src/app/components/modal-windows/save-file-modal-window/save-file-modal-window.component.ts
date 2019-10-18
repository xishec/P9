import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
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
        this.saveFileModalForm = this.formBuilder.group({
            name: ['', [Validators.required, Validators.minLength(1)]],
        });
    }

    onCancel(): void {
        this.dialogRef.close();
        this.modalManagerService.setModalIsDisplayed(false);
    }

    onSubmit(): void {
        let nameAndLabels = new NameAndLabels(this.saveFileModalForm.value.name, this.drawingLabels);
        this.drawingSaverService.currentNameAndLabels.next(nameAndLabels);
        this.onCancel();
        window.alert('Sauvegarde Réussie!');
    }

    addLabel(newLabel: string): void {
        this.drawingLabels.push(newLabel);
        this.selectedLabels.push(newLabel);
    }
}
