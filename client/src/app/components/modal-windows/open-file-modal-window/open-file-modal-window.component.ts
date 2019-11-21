import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MatSnackBar } from '@angular/material';

import { filter } from 'rxjs/operators';

import { ModalManagerService } from 'src/app/services/modal-manager/modal-manager.service';
import { DrawingLoaderService } from 'src/app/services/server/drawing-loader/drawing-loader.service';
import { FileManagerService } from 'src/app/services/server/file-manager/file-manager.service';
import { UndoRedoerService } from 'src/app/services/undo-redoer/undo-redoer.service';
import { GIFS } from 'src/constants/constants';
import { Drawing } from '../../../../../../common/communication/Drawing';
import { Message } from '../../../../../../common/communication/Message';

@Component({
    selector: 'app-open-file-modal-window',
    templateUrl: './open-file-modal-window.component.html',
    styleUrls: ['./open-file-modal-window.component.scss'],
})
export class OpenFileModalWindowComponent implements OnInit {
    openFileModalForm: FormGroup;
    openLocalFileModalForm: FormGroup;
    formBuilder: FormBuilder;

    drawingsFromServer: Drawing[] = [];
    selectedOption = '';
    nameFilter: string;
    labelFilter: string;
    emptyDrawStack = true;
    isLoading: boolean;
    randomGifIndex: number;
    localFileName = '';
    fileToLoad: Drawing | null = null;

    constructor(
        formBuilder: FormBuilder,
        private dialogRef: MatDialogRef<OpenFileModalWindowComponent>,
        private modalManagerService: ModalManagerService,
        private fileManagerService: FileManagerService,
        private drawingLoaderService: DrawingLoaderService,
        private undoRedoerService: UndoRedoerService,
        private snackBar: MatSnackBar,
    ) {
        this.formBuilder = formBuilder;
    }

    ngOnInit(): void {
        this.initializeForms();

        this.isLoading = true;
        this.localFileName = '';
        this.fileManagerService
            .getAllDrawings()
            .pipe(
                filter((subject) => {
                    if (subject === undefined) {
                        this.snackBar.open('Erreur de chargement! Le serveur n\'est peut-être pas ouvert.', 'OK');
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

    initializeForms(): void {
        this.openFileModalForm = this.formBuilder.group({
            selectedDrawing: [[this.selectedOption], Validators.required],
            confirm: false,
        });

        this.openLocalFileModalForm = this.formBuilder.group({
            confirm: false,
        });
    }

    intializeUndoRedoStacks(): void {
        this.undoRedoerService.initializeStacks();
        this.undoRedoerService.fromLoader = true;
    }

    handleSelection(event: any): void {
        this.selectedOption = event.option.selected ? event.option.value : '';
        this.openFileModalForm.controls.selectedDrawing.setValue([this.selectedOption]);
    }

    closeDialog(): void {
        this.dialogRef.close();
        this.modalManagerService.setModalIsDisplayed(false);
    }

    loadServerFile(): void {
        this.intializeUndoRedoStacks();
        const selectedDrawing: Drawing = this.drawingsFromServer.find(
            (drawing) => drawing.name === this.selectedOption,
        ) as Drawing;
        this.drawingLoaderService.currentDrawing.next(selectedDrawing);
        this.closeDialog();
    }

    loadLocalFile(): void {
        this.intializeUndoRedoStacks();
        this.drawingLoaderService.currentDrawing.next(this.fileToLoad as Drawing);
        this.closeDialog();
    }

    getFileToLoad(event: Event): void {
        const reader = new FileReader();
        const target = event.target as HTMLInputElement;
        const files = target.files as FileList;
        if (files.length !== 0) {
            reader.readAsText(files[0]);
            reader.onload = () => {
                try {
                    const localFileContent = JSON.parse(reader.result as string);
                    this.fileToLoad = {
                        name: files[0].name,
                        labels: [],
                        svg: localFileContent.svg,
                        idStack: localFileContent.idStack,
                        drawingInfo: localFileContent.drawingInfo,
                    };
                    this.localFileName = this.fileToLoad.name;
                } catch (error) {
                    this.fileToLoad = null;
                    this.localFileName = '';
                    this.snackBar.open('Le fichier choisi n\'est pas valide, veuillez réessayer.', 'OK');
                }
            };
        }
    }

    serverFormIsInvalid(): boolean {
        return (
            this.openFileModalForm.value.selectedDrawing[0] === '' ||
            (!this.emptyDrawStack && this.openFileModalForm.invalid)
        );
    }

    localFormIsInvalid(): boolean {
        return this.localFileName === '' || (!this.emptyDrawStack && this.openLocalFileModalForm.invalid);
    }

    getDimensions(drawingName: string): number[] {
        const i: number = this.findIndexByName(drawingName);
        const height: number = this.drawingsFromServer[i].drawingInfo.height;
        const width: number = this.drawingsFromServer[i].drawingInfo.width;

        return [width, height];
    }

    getViewBox(drawingName: string): string {
        const dimensions = this.getDimensions(drawingName);
        return `0 0 ${dimensions[0]} ${dimensions[1]}`;
    }

    getWidth(drawingName: string): string {
        const dimensions = this.getDimensions(drawingName);

        return dimensions[0] > dimensions[1] ? '100%' : '60px';
    }

    getHeight(drawingName: string): string {
        const dimensions = this.getDimensions(drawingName);

        return dimensions[0] < dimensions[1] ? '100%' : '60px';
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
                this.snackBar.open('Suppression réussie!', 'OK');
            } else {
                this.snackBar.open('Erreur de suppression du côté serveur!', 'OK');
            }
        });
    }

    unmaskAll() {
        this.nameFilter = '$tout';
    }
}
