import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MatSnackBar } from '@angular/material';
import { SafeResourceUrl } from '@angular/platform-browser';

import { filter, take } from 'rxjs/operators';
import { ModalManagerService } from 'src/app/services/modal-manager/modal-manager.service';
import { DrawingLoaderService } from 'src/app/services/server/drawing-loader/drawing-loader.service';
import { DrawingSaverService } from 'src/app/services/server/drawing-saver/drawing-saver.service';
import { NameAndLabels } from 'src/classes/NameAndLabels';
import { MAX_NB_LABELS } from 'src/constants/constants';
import { SNACKBAR_DURATION } from 'src/constants/tool-constants';

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
    saveFileUrl: SafeResourceUrl = '';
    filename = '';

    constructor(
        formBuilderServer: FormBuilder,
        formBuilderLocal: FormBuilder,
        private dialogRef: MatDialogRef<SaveFileModalWindowComponent>,
        private modalManagerService: ModalManagerService,
        private drawingSaverService: DrawingSaverService,
        private drawingLoaderService: DrawingLoaderService,
        private snackBar: MatSnackBar,
    ) {
        this.formBuilderServer = formBuilderServer;
        this.formBuilderLocal = formBuilderLocal;
    }

    ngOnInit() {
        this.initializeForm();
        this.drawingLoaderService.currentDrawing.subscribe((currentDrawing) => {
            this.saveFileModalForm.controls.name.setValue(currentDrawing.name);
            currentDrawing.labels.forEach((label) => {
                if (!this.drawingLabels.includes(label)) {
                    this.drawingLabels.push(label);
                }
            });
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
            label: ['', [Validators.maxLength(15), Validators.pattern('[A-Za-z0-9àÀéÉèÈôÔîÏçÇùÙ]*')]],
        });
        this.saveFileLocalModalForm = this.formBuilderLocal.group({
            filename: [
                '',
                [Validators.required, Validators.minLength(1), Validators.pattern('([a-zA-Z0-9s_\\():])+(?:|.txt)$')],
            ],
        });
    }

    closeDialog(): void {
        this.dialogRef.close();
        this.modalManagerService.setModalIsDisplayed(false);
    }

    saveToServer(): void {
        this.drawingSaverService.sendFileToServer(
            new NameAndLabels(this.saveFileModalForm.value.name, this.selectedLabels),
        );
        this.isSaving = true;

        this.drawingSaverService.currentIsSaved
            .pipe(filter((subject) => subject !== undefined))
            .pipe(take(1))
            .subscribe((drawingIsSaved) => {
                if (drawingIsSaved) {
                    this.snackBar.open('Sauvegarde réussie!', 'OK', {
                        duration: SNACKBAR_DURATION,
                    });
                    this.closeDialog();
                } else {
                    this.snackBar.open(`Sauvegarde échouée...\n${this.errorMesaage}`, 'OK', {
                        duration: SNACKBAR_DURATION,
                    });
                }
                this.isSaving = false;
                this.drawingSaverService.currentIsSaved.next(undefined);
            });
    }

    saveToLocal(): boolean {
        if (this.drawingLoaderService.emptyDrawStack.value) {
            this.snackBar.open('Sauvegarde échouée...\nAucun dessin dans le zone de travail!', 'OK', {
                duration: SNACKBAR_DURATION,
            });
            return false;
        }
        this.saveFileUrl = this.drawingSaverService.getLocalFileDownloadUrl();
        this.filename = this.saveFileLocalModalForm.value.filename;
        this.closeDialog();
        return true;
    }

    addLabel(newLabel: string): void {
        if (this.selectedLabels.length >= MAX_NB_LABELS) {
            this.snackBar.open(`Veuillez choisir au maximum ${MAX_NB_LABELS} étiquettes.`, 'OK', {
                duration: SNACKBAR_DURATION,
            });
            return;
        }
        this.drawingLabels.push(newLabel);
        this.selectedLabels.push(newLabel);
        this.saveFileModalForm.controls.label.setValue('');
    }

    toggleLabel(label: string): void {
        this.selectedLabels.includes(label) ? this.deselect(label) : this.select(label);
    }

    deselect(label: string): void {
        this.selectedLabels = this.selectedLabels.filter((selectedLabel) => {
            return selectedLabel !== label;
        });
    }

    select(label: string): void {
        this.selectedLabels.length >= MAX_NB_LABELS
            ? this.snackBar.open(`Veuillez choisir au maximum ${MAX_NB_LABELS} étiquettes.`, 'OK', {
                  duration: SNACKBAR_DURATION,
              })
            : this.selectedLabels.push(label);
    }
}
