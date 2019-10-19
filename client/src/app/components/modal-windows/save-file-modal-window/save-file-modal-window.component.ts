import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material';
import { ModalManagerService } from 'src/app/services/modal-manager/modal-manager.service';
import { DrawingSaverService } from 'src/app/services/server/drawing-saver/drawing-saver.service';
import { NameAndLabels } from 'src/classes/NameAndLabels';
import { DrawingLoaderService } from 'src/app/services/server/drawing-loader/drawing-loader.service';
import { take, filter } from 'rxjs/operators';

@Component({
    selector: 'app-save-file-modal-window',
    templateUrl: './save-file-modal-window.component.html',
    styleUrls: ['./save-file-modal-window.component.scss'],
})
export class SaveFileModalWindowComponent implements OnInit {
    saveFileModalForm: FormGroup;
    formBuilder: FormBuilder;
    drawingLabels: string[] = ['Art Abstrait', 'Art Contemporain', 'Expressionnisme', 'Minimalisme'];
    selectedLabels: string[] = [];
    errorMesaage: string;
    isSaving: boolean;

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
            this.drawingLabels = this.drawingLabels.concat(currentDrawing.labels);
            this.selectedLabels = Array.from(currentDrawing.labels);
        });
        this.drawingSaverService.currentErrorMesaage.subscribe((errorMesaage) => {
            this.errorMesaage = errorMesaage;
        });
        this.isSaving = false;
    }

    initializeForm(): void {
        this.saveFileModalForm = this.formBuilder.group({
            name: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(15)]],
            label: ['', [Validators.maxLength(15)]],
        });
    }

    onCancel(): void {
        this.dialogRef.close();
        this.modalManagerService.setModalIsDisplayed(false);
    }

    onSubmit(): void {
        let nameAndLabels = new NameAndLabels(this.saveFileModalForm.value.name, this.selectedLabels);
        this.isSaving = true;
        this.drawingSaverService.currentNameAndLabels.next(nameAndLabels);

        this.drawingSaverService.currentIsSaved
            .pipe(filter((subject) => subject !== undefined))
            .pipe(take(1))
            .subscribe((drawingIsSaved) => {
                console.log(drawingIsSaved);
                if (drawingIsSaved) {
                    window.alert('Sauvegarde réussie!');
                    this.onCancel();
                } else {
                    window.alert('Sauvegarde échouée...\n' + this.errorMesaage);
                }
                this.isSaving = false;
                this.drawingSaverService.currentIsSaved.next(undefined);
            });
    }

    addLabel(newLabel: string): void {
        if (this.selectedLabels.length >= 6) {
            window.alert('Veuillez choisir au maximum 6 étiquettes.');
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
