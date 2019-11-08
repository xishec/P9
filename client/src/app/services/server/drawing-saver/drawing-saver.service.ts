import { Injectable, ElementRef } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { BehaviorSubject } from 'rxjs';

import { NameAndLabels } from 'src/classes/NameAndLabels';
import { DrawingInfo } from 'src/classes/DrawingInfo';
import { DrawingModalWindowService } from '../../drawing-modal-window/drawing-modal-window.service';
import { DrawStackService } from '../../draw-stack/draw-stack.service';

@Injectable({
    providedIn: 'root',
})
export class DrawingSaverService {
    currentNameAndLabels: BehaviorSubject<NameAndLabels> = new BehaviorSubject(new NameAndLabels('', ['']));
    currentIsSaved: BehaviorSubject<boolean | undefined> = new BehaviorSubject(undefined);
    currentErrorMesaage: BehaviorSubject<string> = new BehaviorSubject('');

    workZoneRef: ElementRef<SVGElement>;
    currentDrawingInfo: DrawingInfo;
    drawStackService: DrawStackService;

    constructor(private drawingModalWindowService: DrawingModalWindowService, private sanitizer: DomSanitizer) {}

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
}
