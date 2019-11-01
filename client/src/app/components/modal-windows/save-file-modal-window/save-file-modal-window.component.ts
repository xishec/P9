import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material';

import { filter, take } from 'rxjs/operators';
import { ModalManagerService } from 'src/app/services/modal-manager/modal-manager.service';
import { DrawingLoaderService } from 'src/app/services/server/drawing-loader/drawing-loader.service';
import { DrawingSaverService } from 'src/app/services/server/drawing-saver/drawing-saver.service';
import { NameAndLabels } from 'src/classes/NameAndLabels';
import { MAX_NB_LABELS } from 'src/constants/constants';

@Component({
    selector: 'app-save-file-modal-window',
    templateUrl: './save-file-modal-window.component.html',
    styleUrls: ['./save-file-modal-window.component.scss'],
})
export class SaveFileModalWindowComponent implements OnInit {
    saveFileModalForm: FormGroup;
    saveFileLocalModalForm: FormGroup;
    formBuilderServer: FormBuilder;
    formBuilderLocal: FormBuilder;
    drawingLabels: string[] = ['Art Abstrait', 'Art Contemporain', 'Expressionnisme', 'Minimalisme'];
    selectedLabels: string[] = [];
    errorMesaage: string;
    isSaving: boolean;

    constructor(
        formBuilderServer: FormBuilder,
        formBuilderLocal: FormBuilder,
        private dialogRef: MatDialogRef<SaveFileModalWindowComponent>,
        private modalManagerService: ModalManagerService,
        private drawingSaverService: DrawingSaverService,
        private drawingLoaderService: DrawingLoaderService
    ) {
        this.formBuilderServer = formBuilderServer;
        this.formBuilderLocal = formBuilderLocal;
    }

    ngOnInit() {
        this.initializeForm();
        this.drawingLoaderService.currentDrawing.subscribe((currentDrawing) => {
            this.saveFileModalForm.controls.name.setValue(currentDrawing.name);
            this.drawingLabels = this.drawingLabels.concat(currentDrawing.labels);
            this.selectedLabels = Array.from(currentDrawing.labels);
        });
        this.drawingSaverService.currentErrorMesaage.subscribe((errorMesaage) => {
            this.errorMesaage = errorMesaage;
        });
        this.isSaving = false;
    }

    initializeForm(): void {
        this.saveFileModalForm = this.formBuilderServer.group({
            name: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(15)]],
            label: ['', [Validators.maxLength(15)]],
        });
        this.saveFileLocalModalForm = this.formBuilderLocal.group({
            filename: ['', [Validators.required, Validators.minLength(1)]],
        });
    }

    onCancel(): void {
        this.dialogRef.close();
        this.modalManagerService.setModalIsDisplayed(false);
    }

    saveToServer(): void {
        const nameAndLabels = new NameAndLabels(this.saveFileModalForm.value.name, this.selectedLabels);
        this.isSaving = true;
        this.drawingSaverService.currentNameAndLabels.next(nameAndLabels);

        this.drawingSaverService.currentIsSaved
            .pipe(filter((subject) => subject !== undefined))
            .pipe(take(1))
            .subscribe((drawingIsSaved) => {
                if (drawingIsSaved) {
                    window.alert('Sauvegarde réussie!');
                    this.onCancel();
                } else {
                    window.alert(`Sauvegarde échouée...\n ${this.errorMesaage}`);
                }
                this.isSaving = false;
                this.drawingSaverService.currentIsSaved.next(undefined);
            });
    }

    saveToLocal(): void {
        return;
    }

    addLabel(newLabel: string): void {
        if (this.selectedLabels.length >= MAX_NB_LABELS) {
            window.alert(`Veuillez choisir au maximum ${MAX_NB_LABELS} étiquettes.`);
        } else {
            this.drawingLabels.push(newLabel);
            this.selectedLabels.push(newLabel);
            this.saveFileModalForm.controls.label.setValue('');
        }
    }

    toggleLabel(label: string) {
        if (this.selectedLabels.includes(label)) {
            this.selectedLabels = this.selectedLabels.filter((selectedLabel) => {
                return selectedLabel !== label;
            });
        } else {
            this.selectedLabels.push(label);
        }
    }
}
