import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef } from '@angular/material';

import { ModalManagerService } from 'src/app/services/modal-manager/modal-manager.service';
import { ExportToolService } from 'src/app/services/tools/export-tool/export-tool.service';
import { FileType } from 'src/constants/tool-constants';

@Component({
    selector: 'app-export-file-modal-window',
    templateUrl: './export-file-modal-window.component.html',
    styleUrls: ['./export-file-modal-window.component.scss'],
})
export class ExportFileModalWindowComponent implements OnInit {
    exportFileModalForm: FormGroup;
    formBuilder: FormBuilder;

    @ViewChild('anchor', { static: true }) anchorRef: ElementRef<HTMLAnchorElement>;

    readonly FileType = FileType;

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
            fileType: [FileType.SVG],
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
