import { ElementRef, Injectable, Renderer2 } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { BehaviorSubject } from 'rxjs';
import { filter } from 'rxjs/operators';

import { Drawing } from 'src/../../common/communication/Drawing';
import { DrawingSavingInfo } from 'src/classes/DrawingSavingInfo';
import { DrawingInfo } from '../../../../../../common/communication/DrawingInfo';
import { DrawStackService } from '../../draw-stack/draw-stack.service';
import { DrawingModalWindowService } from '../../drawing-modal-window/drawing-modal-window.service';
import { DrawingLoaderService } from '../drawing-loader/drawing-loader.service';
import { FileManagerService } from '../file-manager/file-manager.service';

@Injectable({
    providedIn: 'root',
})
export class DrawingSaverService {
    currentIsSaved: BehaviorSubject<boolean | undefined> = new BehaviorSubject(undefined);
    currentErrorMesage: BehaviorSubject<string> = new BehaviorSubject('');

    workZoneRef: ElementRef<SVGElement>;
    currentDrawingInfo: DrawingInfo;
    drawStackService: DrawStackService;
    renderer: Renderer2;

    constructor(
        private drawingModalWindowService: DrawingModalWindowService,
        private drawingLoaderService: DrawingLoaderService,
        private fileManagerService: FileManagerService,
        private sanitizer: DomSanitizer,
    ) {}

    initializeDrawingSaverService(
        ref: ElementRef<SVGElement>,
        drawStackService: DrawStackService,
        renderer: Renderer2,
    ) {
        this.workZoneRef = ref;
        this.drawStackService = drawStackService;
        this.drawingModalWindowService.drawingInfo.subscribe((drawingInfo) => {
            this.currentDrawingInfo = drawingInfo;
        });
        this.renderer = renderer;
    }

    getLocalFileDownloadUrl(): SafeResourceUrl {
        const jsonObj: string = JSON.stringify({
            svg: this.workZoneRef.nativeElement.innerHTML,
            drawingInfo: this.currentDrawingInfo,
        });
        const blob = new Blob([jsonObj], { type: 'text/plain' });
        return this.sanitizer.bypassSecurityTrustResourceUrl(window.URL.createObjectURL(blob));
    }

    sendFileToServer(drawingSavingInfo: DrawingSavingInfo): void {
        if (this.drawingLoaderService.emptyDrawStack.value) {
            this.currentIsSaved.next(false);
            this.currentErrorMesage.next('Aucun dessin dans le zone de travail!');
        } else if (drawingSavingInfo.name.length > 0) {
            this.postDrawing(drawingSavingInfo);
        }
    }

    postDrawing(drawingSavingInfo: DrawingSavingInfo) {
        this.currentDrawingInfo.name = drawingSavingInfo.name;
        this.currentDrawingInfo.labels = drawingSavingInfo.drawingLabels;
        this.currentDrawingInfo.createdAt = drawingSavingInfo.createdAt;
        this.currentDrawingInfo.lastModified = drawingSavingInfo.lastModified;
        this.currentDrawingInfo.idStack = this.drawStackService.idStack;
        const drawing: Drawing = {
            drawingInfo: this.currentDrawingInfo,
            svg: this.workZoneRef.nativeElement.innerHTML,
        };

        this.fileManagerService
            .postDrawing(drawing)
            .pipe(
                filter((subject) => {
                    if (subject !== undefined) {
                        return true;
                    }
                    this.currentErrorMesage.next(
                        'Erreur de sauvegarde du côté serveur! Le serveur n\'est peut-être pas ouvert.',
                    );
                    this.currentIsSaved.next(false);
                    return false;
                }),
            )
            .subscribe((receivedDrawing: Drawing) => {
                if (
                    receivedDrawing.drawingInfo ||
                    JSON.parse(receivedDrawing.drawingInfo).createdAt === drawingSavingInfo.createdAt
                ) {
                    this.drawingLoaderService.currentDrawing.next(receivedDrawing);
                    this.currentIsSaved.next(true);
                } else {
                    this.currentErrorMesage.next('Erreur de sauvegarde du côté serveur!');
                    this.currentIsSaved.next(false);
                }
            });
    }
}
