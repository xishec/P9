import { Component, OnInit, Pipe, PipeTransform } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { filter } from 'rxjs/operators';

import { ModalManagerService } from 'src/app/services/modal-manager/modal-manager.service';
import { DrawingLoaderService } from 'src/app/services/server/drawing-loader/drawing-loader.service';
import { FileManagerService } from 'src/app/services/server/file-manager/file-manager.service';
import { GIFS } from 'src/constants/constants';
import { Drawing } from '../../../../../../common/communication/Drawing';
import { Message } from '../../../../../../common/communication/message';

// tslint:disable-next-line: max-classes-per-file
@Pipe({ name: 'toTrustHtml' })
export class ToTrustHtmlPipe implements PipeTransform {
    constructor(private domSanitizer: DomSanitizer) {}
    transform(svg: string): SafeHtml {
        return this.domSanitizer.bypassSecurityTrustHtml(svg);
    }
}

// tslint:disable-next-line: max-classes-per-file
@Pipe({
    name: 'mySlice',
    pure: false,
})
export class MySlice implements PipeTransform {
    transform(drawings: Drawing[], nameFilter: string): Drawing[] {
        if (nameFilter === '$tout') {
            return drawings;
        } else {
            return drawings.slice(0, 5);
        }
    }
}

// tslint:disable-next-line: max-classes-per-file
@Pipe({
    name: 'nameFilter',
    pure: false,
})
export class NameFilter implements PipeTransform {
    transform(drawings: Drawing[], nameFilter: string): Drawing[] {
        if (nameFilter === '$tout') {
            return drawings;
        }

        if (nameFilter === undefined || nameFilter.length === 0) {
            return drawings;
        } else {
            nameFilter = nameFilter.toLowerCase();
            return drawings.filter((drawing: Drawing) => {
                return drawing.name.toLowerCase().includes(nameFilter);
            });
        }
    }
}

// tslint:disable-next-line: max-classes-per-file
@Pipe({
    name: 'labelFilter',
    pure: false,
})
export class LabelFilter implements PipeTransform {
    transform(drawings: Drawing[], labelFilter: string): Drawing[] {
        if (labelFilter === undefined || labelFilter.length === 0) {
            return drawings;
        } else {
            labelFilter = labelFilter.toLowerCase().replace(/\s/g, '');
            const labelsFromFilter = labelFilter.split(',').map(String);

            return drawings.filter((drawing: Drawing) => {
                let checkLabels = false;
                labelsFromFilter.forEach((labelFromFilter: string) => {
                    if (
                        drawing.labels.filter((label: string) => {
                            return label.toLowerCase().replace(/\s/g, '') === labelFromFilter;
                        }).length !== 0
                    ) {
                        checkLabels = true;
                    }
                });
                return checkLabels;
            });
        }
    }
}

// tslint:disable-next-line: max-classes-per-file
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
    drawingOpenSuccess = true;
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
    ) {
        this.formBuilder = formBuilder;
    }

    ngOnInit(): void {
        this.initializeForm();

        this.isLoading = true;
        this.localFileName = '';
        this.fileManagerService
            .getAllDrawings()
            .pipe(
                filter((subject) => {
                    if (subject === undefined) {
                        window.alert('Erreur de chargement! Le serveur n\'est peut-être pas ouvert.');
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

        this.openLocalFileModalForm = this.formBuilder.group({
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

    loadServerFile(): void {
        if (this.drawingOpenSuccess) {
            const selectedDrawing: Drawing = this.drawingsFromServer.find(
                (drawing) => drawing.name === this.selectedOption,
            ) as Drawing;

            this.drawingLoaderService.currentDrawing.next(selectedDrawing);
            this.dialogRef.close();
            this.modalManagerService.setModalIsDisplayed(false);
        }
    }

    loadLocalFile(e: Event): void {
        this.drawingLoaderService.currentDrawing.next(this.fileToLoad as Drawing);
        this.dialogRef.close();
        this.modalManagerService.setModalIsDisplayed(false);
    }

    getFileToLoad(e: Event): void {
        const reader = new FileReader();
        const target = e.target as HTMLInputElement;
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
                } catch (e) {
                    this.fileToLoad = null;
                    this.localFileName = '';
                    window.alert('Le fichier choisi n\'est pas valide, veuillez réessayer.');
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
        // tslint:disable-next-line: no-shadowed-variable
        const drawing: Drawing = this.drawingsFromServer.find((drawing: Drawing) => {
            return drawing.name === drawingName;
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
