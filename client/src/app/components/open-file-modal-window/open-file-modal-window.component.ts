import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material';
import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

import { ModalManagerService } from 'src/app/services/modal-manager/modal-manager.service';
import { FileManagerService } from 'src/app/services/server/file-manager/file-manager.service';
import { Message } from '../../../../../common/communication/message';
import { Drawing } from '../../../../../common/communication/Drawing';
import { DrawingLoaderService } from 'src/app/services/server/drawing-loader/drawing-loader.service';

@Pipe({ name: 'toTrustHtml' })
export class ToTrustHtmlPipe implements PipeTransform {
    constructor(private domSanitizer: DomSanitizer) {}
    transform(svg: string): SafeHtml {
        return this.domSanitizer.bypassSecurityTrustHtml(svg);
    }
}

@Component({
    selector: 'app-open-file-modal-window',
    templateUrl: './open-file-modal-window.component.html',
    styleUrls: ['./open-file-modal-window.component.scss'],
})
export class OpenFileModalWindowComponent implements OnInit {
    openFileModalForm: FormGroup;
    formBuilder: FormBuilder;

    drawingsFromServer: Drawing[] = [];
    selectedOption: string = '';
    drawingOpenSuccess: boolean = true;

    constructor(
        formBuilder: FormBuilder,
        private dialogRef: MatDialogRef<OpenFileModalWindowComponent>,
        private modalManagerService: ModalManagerService,
        private fileManagerService: FileManagerService,
        private drawingLoaderService: DrawingLoaderService,
    ) {
        this.formBuilder = formBuilder;
    }

    ngOnInit(): void {
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

    onSubmit(): void {
        if (this.drawingOpenSuccess) {
            let selectedDrawing: Drawing = this.drawingsFromServer.find(
                (drawing) => drawing.name == this.selectedOption,
            ) as Drawing;

            this.drawingLoaderService.currentRefSVG.next(selectedDrawing);
            this.drawingLoaderService.currentHeight.next(
                Number(selectedDrawing.svg.split('height="')[1].split('px')[0]),
            );
            this.drawingLoaderService.currentWidth.next(Number(selectedDrawing.svg.split('width="')[1].split('px')[0]));

            this.dialogRef.close();
            this.modalManagerService.setModalIsDisplayed(false);
        }
    }

    formIsInvalid(): boolean {
        return this.openFileModalForm.value.selectedDrawing[0] === '';
    }

    getViewBox(i: number): string {
        let height: number = Number(this.drawingsFromServer[i].svg.split('height="')[1].split('px')[0]);
        let width: number = Number(this.drawingsFromServer[i].svg.split('width="')[1].split('px')[0]);

        return `0 0 ${width} ${height}`;
    }

    getWidth(i: number): string {
        let height: number = Number(this.drawingsFromServer[i].svg.split('height="')[1].split('px')[0]);
        let width: number = Number(this.drawingsFromServer[i].svg.split('width="')[1].split('px')[0]);

        if (width > height) {
            return '100%';
        }
        return '40px';
    }
    getHeight(i: number): string {
        let height: number = Number(this.drawingsFromServer[i].svg.split('height="')[1].split('px')[0]);
        let width: number = Number(this.drawingsFromServer[i].svg.split('width="')[1].split('px')[0]);

        if (width < height) {
            return '100%';
        }
        return '40px';
    }
}
