import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef } from '@angular/material';

import { ModalManagerService } from 'src/app/services/modal-manager/modal-manager.service';
import { ExportToolService } from 'src/app/services/tools/export-tool/export-tool.service';
import { FILE_TYPE } from 'src/constants/tool-constants';

@Component({
    selector: 'app-export-file-modal-window',
    templateUrl: './export-file-modal-window.component.html',
    styleUrls: ['./export-file-modal-window.component.scss'],
})
export class ExportFileModalWindowComponent implements OnInit {
    exportFileModalForm: FormGroup;
    formBuilder: FormBuilder;

    readonly FILE_TYPE = FILE_TYPE;

    constructor(
        formBuilder: FormBuilder,
        private dialogRef: MatDialogRef<ExportFileModalWindowComponent>,
        private modalManagerService: ModalManagerService,
        public exportToolService: ExportToolService,
    ) {
        this.formBuilder = formBuilder;
    }

    ngOnInit() {
        this.initializeForm();
    }

    initializeForm(): void {
        this.exportFileModalForm = this.formBuilder.group({
            fileType: [FILE_TYPE.SVG],
        });
    }

    onCancel(): void {
        this.dialogRef.close();
        this.modalManagerService.setModalIsDisplayed(false);
    }

    onSubmit(): void {
        this.exportToolService.saveFile(this.exportFileModalForm.controls.fileType.value);
        this.onCancel();
    }
}
