import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MatSnackBar } from '@angular/material';

import { ModalManagerService } from 'src/app/services/modal-manager/modal-manager.service';
import { DrawingLoaderService } from 'src/app/services/server/drawing-loader/drawing-loader.service';
import { ExportToolService } from 'src/app/services/tools/export-tool/export-tool.service';
import { FILE_TYPE, SNACKBAR_DURATION } from 'src/constants/tool-constants';

@Component({
    selector: 'app-export-file-modal-window',
    templateUrl: './export-file-modal-window.component.html',
    styleUrls: ['./export-file-modal-window.component.scss'],
})
export class ExportFileModalWindowComponent implements OnInit {
    exportFileModalForm: FormGroup;
    private formBuilder: FormBuilder;
    workZoneIsEmpty = true;
    filename = '';
    selected = 'svg';

    readonly FILE_TYPE = FILE_TYPE;

    constructor(
        formBuilder: FormBuilder,
        private dialogRef: MatDialogRef<ExportFileModalWindowComponent>,
        private modalManagerService: ModalManagerService,
        private exportToolService: ExportToolService,
        private drawingLoaderService: DrawingLoaderService,
        private snackBar: MatSnackBar,
    ) {
        this.formBuilder = formBuilder;
    }

    ngOnInit() {
        this.initializeForm();
        this.drawingLoaderService.untouchedWorkZone.subscribe((isEmpty: boolean) => {
            this.workZoneIsEmpty = isEmpty;
        });
        this.exportFileModalForm.controls.fileType.setValue(FILE_TYPE);
    }

    initializeForm(): void {
        this.exportFileModalForm = this.formBuilder.group({
            fileType: [[FILE_TYPE.SVG], Validators.required],
            filename: [
                '',
                [Validators.required, Validators.minLength(1), Validators.pattern('([a-zA-Z0-9s_\\():])+(?:)$')],
            ],
        });
    }

    closeDialog(): void {
        this.dialogRef.close();
        this.modalManagerService.setModalIsDisplayed(false);
    }

    onSubmit(): void {

        if (this.drawingLoaderService.emptyDrawStack.value) {
            this.snackBar.open('Sauvegarde échouée...\nAucun dessin dans la zone de travail!', 'OK', {
                duration: SNACKBAR_DURATION,
            });
            return;
        }
        this.exportToolService.saveFile(this.exportFileModalForm.value.fileType, this.exportFileModalForm.value.filename);
        this.filename = this.exportFileModalForm.controls.filename.value;
        this.closeDialog();
        return;
    }
}
