import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material';
import { ModalManagerService } from 'src/app/services/modal-manager/modal-manager.service';
import { DrawingSaverService } from 'src/app/services/server/drawing-saver/drawing-saver.service';
import { NameAndLabels } from 'src/classes/NameAndLabels';
import { DrawingLoaderService } from 'src/app/services/server/drawing-loader/drawing-loader.service';

@Component({
    selector: 'app-save-file-modal-window',
    templateUrl: './save-file-modal-window.component.html',
    styleUrls: ['./save-file-modal-window.component.scss'],
})
export class SaveFileModalWindowComponent implements OnInit {
    saveFileModalForm: FormGroup;
    formBuilder: FormBuilder;
    drawingLabels: string[] = [];
    selectedLabels: string[] = [];

    constructor(
        formBuilder: FormBuilder,
        private dialogRef: MatDialogRef<SaveFileModalWindowComponent>,
        private modalManagerService: ModalManagerService,
        private drawingSaverService: DrawingSaverService,
        private drawingLoaderService: DrawingLoaderService,
    ) {
        this.formBuilder = formBuilder;
    }

    ngOnInit() {
        this.initializeForm();
        this.drawingLoaderService.currentDrawing.subscribe((currentDrawing) => {
            this.saveFileModalForm.controls.name.setValue(currentDrawing.name);
            console.log(currentDrawing.labels);
            this.drawingLabels = currentDrawing.labels;
            this.selectedLabels = currentDrawing.labels;
        });
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
        let nameAndLabels = new NameAndLabels(this.saveFileModalForm.value.name, this.selectedLabels);
        this.drawingSaverService.currentNameAndLabels.next(nameAndLabels);
        this.onCancel();
        window.alert('Sauvegarde Réussie!');
    }

    addLabel(newLabel: string): void {
        this.drawingLabels.push(newLabel);
    }

    toggleLabel(label: string) {
        if (this.selectedLabels.includes(label)) {
            this.selectedLabels = this.selectedLabels.filter((selectedLabel) => {
                return selectedLabel !== label;
            });
        } else {
            this.selectedLabels.push(label);
        }
        console.log(this.selectedLabels);
    }
}
