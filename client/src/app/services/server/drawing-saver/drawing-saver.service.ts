import { ElementRef, Injectable } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { BehaviorSubject } from 'rxjs';
import { filter } from 'rxjs/operators';

import { NameAndLabels } from 'src/classes/NameAndLabels';
import { DrawingInfo } from '../../../../../../common/communication/DrawingInfo';
import { DrawStackService } from '../../draw-stack/draw-stack.service';
import { DrawingModalWindowService } from '../../drawing-modal-window/drawing-modal-window.service';
import { DrawingLoaderService } from '../drawing-loader/drawing-loader.service';
import { FileManagerService } from '../file-manager/file-manager.service';
import { Drawing } from '../../../../../../common/communication/Drawing';

@Injectable({
    providedIn: 'root',
})
export class DrawingSaverService {
    currentIsSaved: BehaviorSubject<boolean | undefined> = new BehaviorSubject(undefined);
    currentErrorMesaage: BehaviorSubject<string> = new BehaviorSubject('');

    workZoneRef: ElementRef<SVGElement>;
    currentDrawingInfo: DrawingInfo;
    drawStackService: DrawStackService;

    constructor(
        private drawingModalWindowService: DrawingModalWindowService,
        private drawingLoaderService: DrawingLoaderService,
        private fileManagerService: FileManagerService,
        private sanitizer: DomSanitizer,
    ) {}

    initializeDrawingSaverService(ref: ElementRef<SVGElement>, drawStackService: DrawStackService) {
        this.workZoneRef = ref;
        this.drawStackService = drawStackService;
        this.drawingModalWindowService.drawingInfo.subscribe((drawingInfo) => {
            this.currentDrawingInfo = drawingInfo;
        });
    }

    getLocalFileDownloadUrl(): SafeResourceUrl {
        const jsonObj: string = JSON.stringify({
            svg: this.workZoneRef.nativeElement.innerHTML,
            idStack: this.drawStackService.idStack,
            drawingInfo: this.currentDrawingInfo,
        });
        const blob = new Blob([jsonObj], { type: 'text/plain' });
        return this.sanitizer.bypassSecurityTrustResourceUrl(window.URL.createObjectURL(blob));
    }

    sendFileToServer(nameAndLabels: NameAndLabels): void {
        if (this.drawingLoaderService.emptyDrawStack.value) {
            this.currentIsSaved.next(false);
            this.currentErrorMesaage.next('Aucun dessin dans le zone de travail!');
        } else if (nameAndLabels.name.length > 0) {
            this.postDrawing(nameAndLabels);
        }
    }

    postDrawing(nameAndLabels: NameAndLabels) {
        this.fileManagerService
            .postDrawing(
                nameAndLabels.name,
                nameAndLabels.drawingLabels,
                this.workZoneRef.nativeElement.innerHTML,
                this.drawStackService.idStack,
                this.currentDrawingInfo,
            )
            .pipe(
                filter((subject) => {
                    if (subject !== undefined) {
                        return true;
                    }
                    this.currentErrorMesaage.next(
                        "Erreur de sauvegarde du côté serveur! Le serveur n'est peut-être pas ouvert.",
                    );
                    this.currentIsSaved.next(false);
                    return false;
                }),
            )
            .subscribe((drawing: Drawing) => {
                if (drawing || JSON.parse(drawing).name === nameAndLabels.name) {
                    this.currentIsSaved.next(true);
                } else {
                    this.currentErrorMesaage.next('Erreur de sauvegarde du côté serveur!');
                    this.currentIsSaved.next(false);
                }
            });
    }
}
