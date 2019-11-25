import { ElementRef, Injectable, Renderer2 } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { BehaviorSubject } from 'rxjs';
import { filter } from 'rxjs/operators';

import { Drawing } from 'src/classes/Drawing';
import { DrawingSavingInfo } from 'src/classes/DrawingSavingInfo';
import { SVG_NS } from 'src/constants/constants';
import { DrawingInfo } from '../../../../../../common/communication/DrawingInfo';
import { CloudService } from '../../cloud/cloud.service';
import { DrawStackService } from '../../draw-stack/draw-stack.service';
import { DrawingModalWindowService } from '../../drawing-modal-window/drawing-modal-window.service';
import { DrawingLoaderService } from '../drawing-loader/drawing-loader.service';
import { FileManagerService } from '../file-manager/file-manager.service';

@Injectable({
    providedIn: 'root',
})
export class DrawingSaverService {
    currentIsSaved: BehaviorSubject<boolean | undefined> = new BehaviorSubject(undefined);
    currentErrorMesaage: BehaviorSubject<string> = new BehaviorSubject('');

    workZoneRef: ElementRef<SVGElement>;
    currentDrawingInfo: DrawingInfo;
    drawStackService: DrawStackService;
    renderer: Renderer2;

    constructor(
        private drawingModalWindowService: DrawingModalWindowService,
        private drawingLoaderService: DrawingLoaderService,
        private fileManagerService: FileManagerService,
        private sanitizer: DomSanitizer,
        private cloudService: CloudService,
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
            this.currentErrorMesaage.next('Aucun dessin dans le zone de travail!');
        } else if (drawingSavingInfo.name.length > 0) {
            this.postDrawing(drawingSavingInfo);
        }
    }

    saveToCloud(id: string) {
        const clone = this.workZoneRef.nativeElement.cloneNode(true);
        this.renderer.setAttribute(clone, 'xmlns', SVG_NS);
        const file = new Blob([this.getXMLSVG(clone)], { type: 'image/svg+xml;charset=utf-8' });
        this.cloudService.save(id, file);
    }

    getXMLSVG(clone: any): string {
        return new XMLSerializer().serializeToString(clone);
    }

    postDrawing(drawingSavingInfo: DrawingSavingInfo) {
        this.currentDrawingInfo.name = drawingSavingInfo.name;
        this.currentDrawingInfo.labels = drawingSavingInfo.drawingLabels;
        this.currentDrawingInfo.createdOn = drawingSavingInfo.createdOn;
        this.currentDrawingInfo.lastModified = drawingSavingInfo.lastModified;
        this.currentDrawingInfo.idStack = this.drawStackService.idStack;

        this.fileManagerService
            .postDrawing(this.currentDrawingInfo)
            .pipe(
                filter((subject) => {
                    if (subject !== undefined) {
                        return true;
                    }
                    this.currentErrorMesaage.next(
                        'Erreur de sauvegarde du côté serveur! Le serveur n\'est peut-être pas ouvert.',
                    );
                    this.currentIsSaved.next(false);
                    return false;
                }),
            )
            .subscribe((drawingInfo: DrawingInfo) => {
                if (drawingInfo || JSON.parse(drawingInfo).createdOn === drawingSavingInfo.createdOn) {
                    const drawing: Drawing = { drawingInfo, svg: '' } as Drawing;
                    this.drawingLoaderService.currentDrawing.next(drawing);
                    this.saveToCloud(drawing.drawingInfo.createdOn.toString());
                    this.currentIsSaved.next(true);
                } else {
                    this.currentErrorMesaage.next('Erreur de sauvegarde du côté serveur!');
                    this.currentIsSaved.next(false);
                }
            });
    }
}
