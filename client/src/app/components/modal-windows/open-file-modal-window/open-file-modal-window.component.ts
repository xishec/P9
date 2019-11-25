import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MatSnackBar } from '@angular/material';

import { filter } from 'rxjs/operators';

import { ModalManagerService } from 'src/app/services/modal-manager/modal-manager.service';
import { DrawingLoaderService } from 'src/app/services/server/drawing-loader/drawing-loader.service';
import { FileManagerService } from 'src/app/services/server/file-manager/file-manager.service';
import { UndoRedoerService } from 'src/app/services/undo-redoer/undo-redoer.service';
import { GIFS } from 'src/constants/constants';
import { SNACKBAR_DURATION } from 'src/constants/tool-constants';
import { CloudService } from 'src/app/services/cloud/cloud.service';
import { DrawingInfo } from '../../../../../../common/communication/DrawingInfo';
import { Drawing } from 'src/classes/Drawing';

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
    SVGs: Map<string, string> = new Map([]);
    selectedOption: number;
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
        private cloudService: CloudService,
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
                        this.snackBar.open("Erreur de chargement! Le serveur n'est peut-être pas ouvert.", 'OK', {
                            duration: SNACKBAR_DURATION,
                        });
                        this.isLoading = false;
                        return false;
                    } else {
                        return true;
                    }
                }),
            )
            .subscribe((drawingList: DrawingInfo[]) => {
                drawingList.forEach((drawingInfo: DrawingInfo) => {
                    let drawing: Drawing = { drawingInfo: drawingInfo, svg: '' } as Drawing;
                    this.cloudService
                        .download(drawingInfo.createdOn.toString())
                        .then((url: string) => {
                            this.SVGs.set(drawingInfo.name, url);

                            var xhr = new XMLHttpRequest();
                            xhr.responseType = 'blob';
                            xhr.onload = async () => {
                                var blob = xhr.response;
                                const text = await new Response(blob).text();
                                drawing.svg = text.slice(text.indexOf('>') + 1, text.indexOf('</svg>'));
                            };
                            xhr.open('GET', 'https://cors-anywhere.herokuapp.com/' + url);
                            xhr.send();
                        })
                        .catch((error: Error) => {
                            console.error(error);
                        });
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

    initializeUndoRedoStacks(): void {
        this.undoRedoerService.initializeStacks();
        this.undoRedoerService.fromLoader = true;
    }

    handleSelection(event: any): void {
        this.selectedOption = event.option.selected ? event.option.value : 0;
        this.openFileModalForm.controls.selectedDrawing.setValue([this.selectedOption]);
    }

    closeDialog(): void {
        this.dialogRef.close();
        this.modalManagerService.setModalIsDisplayed(false);
    }

    loadServerFile(): void {
        this.initializeUndoRedoStacks();
        const selectedDrawing: Drawing = this.drawingsFromServer.find(
            (drawing) => drawing.drawingInfo.createdOn === this.selectedOption,
        ) as Drawing;
        this.drawingLoaderService.currentDrawing.next(selectedDrawing);
        this.closeDialog();
    }

    loadLocalFile(): void {
        this.initializeUndoRedoStacks();
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
                    this.fileToLoad = localFileContent as Drawing;
                    this.localFileName = this.fileToLoad.drawingInfo.name;
                } catch (error) {
                    this.fileToLoad = null;
                    this.localFileName = '';
                    this.snackBar.open("Le fichier choisi n'est pas valide, veuillez réessayer.", 'OK', {
                        duration: SNACKBAR_DURATION,
                    });
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

    getGifSource() {
        return GIFS[this.randomGifIndex];
    }

    onDelete() {
        const selectedDrawing: Drawing = this.drawingsFromServer.find(
            (drawing) => drawing.drawingInfo.createdOn === this.selectedOption,
        ) as Drawing;
        this.fileManagerService.deleteDrawing(selectedDrawing.drawingInfo.createdOn).subscribe((createdOn: number) => {
            if (createdOn === selectedDrawing.drawingInfo.createdOn) {
                this.cloudService.delete(createdOn.toString());
                this.drawingsFromServer = this.drawingsFromServer.filter((drawing: Drawing) => {
                    return drawing.drawingInfo.createdOn !== createdOn;
                });
                this.snackBar.open('Suppression réussie!', 'OK', {
                    duration: SNACKBAR_DURATION,
                });
            } else {
                this.snackBar.open('Erreur de suppression du côté serveur!', 'OK', {
                    duration: SNACKBAR_DURATION,
                });
            }
        });
    }

    unmaskAll() {
        this.nameFilter = '$tout';
    }
}
