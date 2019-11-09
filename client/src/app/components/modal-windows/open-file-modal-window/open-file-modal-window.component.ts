import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material';

import { filter } from 'rxjs/operators';
import { ModalManagerService } from 'src/app/services/modal-manager/modal-manager.service';
import { DrawingLoaderService } from 'src/app/services/server/drawing-loader/drawing-loader.service';
import { FileManagerService } from 'src/app/services/server/file-manager/file-manager.service';
import { GIFS } from 'src/constants/constants';
import { Drawing } from '../../../../../../common/communication/Drawing';
import { Message } from '../../../../../../common/communication/message';

@Component({
    selector: 'app-open-file-modal-window',
    templateUrl: './open-file-modal-window.component.html',
    styleUrls: ['./open-file-modal-window.component.scss'],
})
export class OpenFileModalWindowComponent implements OnInit {
    openFileModalForm: FormGroup;
    formBuilder: FormBuilder;

    drawingsFromServer: Drawing[] = [];
    selectedOption = '';
    drawingOpenSuccess = true;
    nameFilter: string;
    labelFilter: string;
    emptyDrawStack = true;
    isLoading: boolean;
    randomGifIndex: number;

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

        this.isLoading = true;
        this.fileManagerService
            .getAllDrawings()
            .pipe(
                filter((subject) => {
                    if (subject === undefined) {
                        window.alert("Erreur de chargement! Le serveur n'est peut-être pas ouvert.");
                        this.isLoading = false;
                        return false;
                    } else {
                        return true;
                    }
                }),
            )
            .subscribe((ans: any) => {
                ans.forEach((el: Message) => {
                    const drawing: Drawing = JSON.parse(el.body);
                    this.drawingsFromServer.push(drawing);
                });
                this.isLoading = false;
            });

        this.drawingLoaderService.emptyDrawStack.subscribe((emptyDrawStack) => {
            this.emptyDrawStack = emptyDrawStack;
        });

        this.randomGifIndex = Math.floor(Math.random() * GIFS.length);
    }

    initializeForm(): void {
        this.openFileModalForm = this.formBuilder.group({
            selectedDrawing: [[this.selectedOption], Validators.required],
            confirm: false,
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
            const selectedDrawing: Drawing = this.drawingsFromServer.find(
                (drawing) => drawing.name === this.selectedOption,
            ) as Drawing;

            this.drawingLoaderService.currentDrawing.next(selectedDrawing);

            this.dialogRef.close();
            this.modalManagerService.setModalIsDisplayed(false);
        }
    }

    formIsInvalid(): boolean {
        return (
            this.openFileModalForm.value.selectedDrawing[0] === '' ||
            (!this.emptyDrawStack && this.openFileModalForm.invalid)
        );
    }

    getViewBox(drawingName: string): string {
        const i: number = this.findIndexByName(drawingName);
        const height: number = this.drawingsFromServer[i].drawingInfo.height;
        const width: number = this.drawingsFromServer[i].drawingInfo.width;

        return `0 0 ${width} ${height}`;
    }

    getWidth(drawingName: string): string {
        const i: number = this.findIndexByName(drawingName);
        const height: number = this.drawingsFromServer[i].drawingInfo.height;
        const width: number = this.drawingsFromServer[i].drawingInfo.width;

        return width > height ? '100%' : '60px';
    }

    getHeight(drawingName: string): string {
        const i: number = this.findIndexByName(drawingName);
        const height: number = this.drawingsFromServer[i].drawingInfo.height;
        const width: number = this.drawingsFromServer[i].drawingInfo.width;

        return width < height ? '100%' : '60px';
    }

    getSVG(drawingName: string): string {
        const i: number = this.findIndexByName(drawingName);
        return this.drawingsFromServer[i].svg;
    }

    findIndexByName(drawingName: string): number {
        const drawing: Drawing = this.drawingsFromServer.find((el: Drawing) => {
            return el.name === drawingName;
        }) as Drawing;
        return this.drawingsFromServer.indexOf(drawing);
    }

    getGifSource() {
        return GIFS[this.randomGifIndex];
    }

    onDelete() {
        this.fileManagerService.deleteDrawing(this.selectedOption).subscribe((message: Message) => {
            if (message.title || message.title === 'Add Drawing' + this.selectedOption) {
                this.drawingsFromServer = this.drawingsFromServer.filter((drawing: Drawing) => {
                    return drawing.name !== this.selectedOption;
                });
            } else {
                window.alert('Erreur de suppression du côté serveur!');
            }
        });
    }
}
