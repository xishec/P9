import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MatSnackBar } from '@angular/material';

import { filter, map } from 'rxjs/operators';

import { Drawing } from 'src/../../common/communication/Drawing';
import { ModalManagerService } from 'src/app/services/modal-manager/modal-manager.service';
import { DrawingLoaderService } from 'src/app/services/server/drawing-loader/drawing-loader.service';
import { FileManagerService } from 'src/app/services/server/file-manager/file-manager.service';
import { UndoRedoerService } from 'src/app/services/undo-redoer/undo-redoer.service';
import { GIFS, NUMBER_OF_MS } from 'src/constants/constants';
import { SNACKBAR_DURATION } from 'src/constants/tool-constants';
import { DrawingInfo } from '../../../../../../common/communication/DrawingInfo';

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
                        this.snackBar.open('Erreur de chargement! Le serveur n\'est peut-être pas ouvert.', 'OK', {
                            duration: SNACKBAR_DURATION,
                        });
                        this.isLoading = false;
                        return false;
                    } else {
                        return true;
                    }
                }),
            )
            .pipe(map((drawings) => drawings.sort((a, b) => b.drawingInfo.createdAt - a.drawingInfo.createdAt)))
            .subscribe((drawings: Drawing[]) => {
                drawings.forEach((drawing: Drawing) => {
                    this.drawingsFromServer.push(drawing);
                });
                this.isLoading = false;
            });

        this.drawingLoaderService.emptyDrawStack.subscribe((emptyDrawStack) => {
            this.emptyDrawStack = emptyDrawStack;
        });

        this.randomGifIndex = Math.floor(Math.random() * GIFS.length);
    }

    downloadAndUpdateSVG(drawing: Drawing, drawingInfo: DrawingInfo, url: string): void {
        this.SVGs.set(drawingInfo.name, url);

        const xhr = new XMLHttpRequest();
        xhr.responseType = 'blob';
        xhr.onload = async () => {
            const blob = xhr.response;
            const text = await new Response(blob).text();
            drawing.svg = this.extractInnerHTML(text);
        };
        xhr.open('GET', 'https://cors-anywhere.herokuapp.com/' + url);
        xhr.send();
    }

    extractInnerHTML(text: string): string {
        return text.slice(text.indexOf('>') + 1, text.indexOf('</svg>'));
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
            (drawing) => drawing.drawingInfo.createdAt === this.selectedOption,
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
                    this.snackBar.open('Le fichier choisi n\'est pas valide, veuillez réessayer.', 'OK', {
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
            (drawing) => drawing.drawingInfo.createdAt === this.selectedOption,
        ) as Drawing;
        this.fileManagerService.deleteDrawing(selectedDrawing.drawingInfo.createdAt).subscribe((createdAt: number) => {
            if (createdAt === selectedDrawing.drawingInfo.createdAt) {
                this.drawingsFromServer = this.drawingsFromServer.filter((drawing: Drawing) => {
                    return drawing.drawingInfo.createdAt !== createdAt;
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
            return el.drawingInfo.name === drawingName;
        }) as Drawing;
        return this.drawingsFromServer.indexOf(drawing);
    }

    unmaskAll() {
        this.nameFilter = '$tout';
    }

    convertTimeStampToDate(timestamp: number): string {
        const currentTimestamp = Date.now();

        if (this.numberOfDaysBetween(timestamp, currentTimestamp) < 7) {
            const differenceInMs = currentTimestamp - timestamp;
            return 'Créé il y a ' + this.msToDaysHoursMinutes(differenceInMs);
        }
        const date = new Date(timestamp);

        const creationDate =
            `${date.getFullYear}/${date.getMonth}/${date.getDay} à ` +
            `${date.getHours}:${date.getMinutes}:${date.getSeconds}}`;

        return 'Créé le ' + creationDate;
    }

    numberOfDaysBetween(timestamp1: number, timestamp2: number): number {
        const numberDaysDate1 = Math.floor(timestamp1 / NUMBER_OF_MS.Day);
        const numberDaysDate2 = Math.floor(timestamp2 / NUMBER_OF_MS.Day);

        return numberDaysDate2 - numberDaysDate1;
    }

    msToDaysHoursMinutes(differenceInMs: number): string {
        const days = Math.floor(differenceInMs / NUMBER_OF_MS.Day);
        const hours = Math.floor((differenceInMs % NUMBER_OF_MS.Day) / NUMBER_OF_MS.Hours);
        const minutes = Math.floor((differenceInMs % NUMBER_OF_MS.Hours) / NUMBER_OF_MS.Minutes);

        const daysDisplay = days <= 1 ? ' jour, ' : ' jours, ';
        const hoursDisplay = hours <= 1 ? ' heure et ' : ' heures et ';
        const minutesDisplay = minutes <= 1 ? ' minute ' : ' minutes';

        return days + daysDisplay + hours + hoursDisplay + minutes + minutesDisplay;
    }
}
