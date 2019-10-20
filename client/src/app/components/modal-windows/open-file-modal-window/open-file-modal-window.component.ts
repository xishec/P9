import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material';
import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

import { ModalManagerService } from 'src/app/services/modal-manager/modal-manager.service';
import { FileManagerService } from 'src/app/services/server/file-manager/file-manager.service';
import { DrawingLoaderService } from 'src/app/services/server/drawing-loader/drawing-loader.service';
import { Message } from '../../../../../../common/communication/message';
import { Drawing } from '../../../../../../common/communication/Drawing';
import { GIFS } from 'src/constants/constants';
import { filter } from 'rxjs/operators';

@Pipe({ name: 'toTrustHtml' })
export class ToTrustHtmlPipe implements PipeTransform {
    constructor(private domSanitizer: DomSanitizer) {}
    transform(svg: string): SafeHtml {
        return this.domSanitizer.bypassSecurityTrustHtml(svg);
    }
}

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
            let labelsFromFilter = labelFilter.split(',').map(String);

            return drawings.filter((drawing: Drawing) => {
                let checkLabels: boolean = false;
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
                        window.alert('Error de chargement!');
                        return false;
                    } else {
                        return true;
                    }
                }),
            )
            .subscribe((ans: any) => {
                ans = ans as Message[];
                ans.forEach((el: Message) => {
                    let drawing: Drawing = JSON.parse(el.body);
                    this.drawingsFromServer.push(drawing);
                    this.isLoading = false;
                });
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
            let selectedDrawing: Drawing = this.drawingsFromServer.find(
                (drawing) => drawing.name == this.selectedOption,
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
        let i: number = this.findIndexByName(drawingName);
        let height: number = this.drawingsFromServer[i].drawingInfo.height;
        let width: number = this.drawingsFromServer[i].drawingInfo.width;

        return `0 0 ${width} ${height}`;
    }
    getWidth(drawingName: string): string {
        let i: number = this.findIndexByName(drawingName);
        let height: number = this.drawingsFromServer[i].drawingInfo.height;
        let width: number = this.drawingsFromServer[i].drawingInfo.width;

        if (width > height) {
            return '100%';
        }
        return '60px';
    }
    getHeight(drawingName: string): string {
        let i: number = this.findIndexByName(drawingName);
        let height: number = this.drawingsFromServer[i].drawingInfo.height;
        let width: number = this.drawingsFromServer[i].drawingInfo.width;

        if (width < height) {
            return '100%';
        }
        return '60px';
    }
    getSVG(drawingName: string): string {
        let i: number = this.findIndexByName(drawingName);
        return this.drawingsFromServer[i].svg;
    }
    findIndexByName(drawingName: string): number {
        let drawing: Drawing = this.drawingsFromServer.find((drawing: Drawing) => {
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
                window.alert('Error de suppression du côté serveur!');
            }
        });
    }
}
