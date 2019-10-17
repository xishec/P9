import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material';

import { ModalManagerService } from 'src/app/services/modal-manager/modal-manager.service';
import { FileManagerService } from 'src/app/services/server/file-manager/file-manager.service';
import { Message } from '../../../../../common/communication/message';
import { Drawing } from '../../../../../common/communication/Drawing';

@Component({
    selector: 'app-open-file-modal-window',
    templateUrl: './open-file-modal-window.component.html',
    styleUrls: ['./open-file-modal-window.component.scss'],
})
export class OpenFileModalWindowComponent implements OnInit {
    openFileModalForm: FormGroup;
    formBuilder: FormBuilder;

    drawingsFromServer: Drawing[] = [
        { name: 'animal drawing', labels: ['tiger', 'lion'], svg: '', idStack: [''] },
        { name: 'food drawing', labels: ['hamburger', 'poutine'], svg: '', idStack: [''] },
        { name: 'countries drawing', labels: ['Canada', 'USA', 'Italy'], svg: '', idStack: [''] },
    ];
    selectedOption: string = '';
    drawingOpenSuccess: boolean = true;

    constructor(
        formBuilder: FormBuilder,
        private dialogRef: MatDialogRef<OpenFileModalWindowComponent>,
        private modalManagerService: ModalManagerService,
        private fileManagerService: FileManagerService,
    ) {
        this.formBuilder = formBuilder;
    }

    ngOnInit() {
        this.initializeForm();

        this.fileManagerService.getAllDrawing().subscribe((ans: any) => {
            ans = ans as Message[];
            ans.forEach((el: Message) => {
                let drawing: Drawing = JSON.parse(el.body);
                this.drawingsFromServer.push(drawing);
            });
        });
    }

    initializeForm(): void {
        this.openFileModalForm = this.formBuilder.group({
            selectedDrawing: [[this.selectedOption], Validators.required],
        });
    }

    handleSelection(event: any): void {
        this.selectedOption = event.option.selected ? event.option.value : '';
        this.openFileModalForm.controls.selectedDrawing.setValue([this.selectedOption]);
    }

    onCancel(): void {
        this.dialogRef.close();
        this.modalManagerService.setModalIsDisplayed(false);
    }

    onSubmit() {
        if (this.drawingOpenSuccess) {
            this.applyDrawing();
            this.dialogRef.close();
            this.modalManagerService.setModalIsDisplayed(false);
        }
    }

    applyDrawing() {
        this.renderer.setProperty(this.refSVG.nativeElement, 'innerHTML', drawing.svg);
        let idStack = Object.values(drawing.idStack);
        idStack.forEach((id) => {
            let el: SVGGElement = this.refSVG.nativeElement.children.namedItem(id) as SVGGElement;
            this.drawStack.push(el);
        });
    }

    formIsInvalid() {
        return this.openFileModalForm.value.selectedDrawing[0] === '';
    }
}
