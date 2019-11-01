import { ElementRef, Injectable } from '@angular/core';

import { Drawing } from '../../../../../common/communication/Drawing';
import { DrawingInfo } from '../../../../../common/communication/DrawingInfo';
import { DrawingLoaderService } from '../server/drawing-loader/drawing-loader.service';
import { DrawingModalWindowService } from '../drawing-modal-window/drawing-modal-window.service';

@Injectable({
    providedIn: 'root',
})
export class UndoRedoerService {

    undos = new Array<Drawing>();
    redos = new Array<Drawing>();

    workzoneRef: ElementRef<SVGElement>;
    currentDrawingInfos: DrawingInfo;

    constructor(private drawingLoaderService: DrawingLoaderService, private drawingModalWindowService: DrawingModalWindowService) {
    }

    initializeService(workzoneRef: ElementRef<SVGElement>) {
        this.workzoneRef = workzoneRef;
        this.drawingModalWindowService.drawingInfo.subscribe((drawingInfo) => {
            this.currentDrawingInfos = drawingInfo;
        });
    }

    initializeStacks() : void {
        this.undos = [];
        this.redos = [];
    }

    saveCurrentState(idStackArray: string[]): void {
        const currentState: Drawing = {
            name: '',
            labels: [],
            svg: this.workzoneRef.nativeElement.innerHTML,
            idStack: idStackArray,
            drawingInfo: this.currentDrawingInfos,
        };
        
        this.undos.push(currentState);

        if (this.redos.length > 0) {
            this.redos = [];
        }
    }

    undo(): void {
        if (this.undos.length > 1) {
            const currentState = this.undos.pop();
            this.redos.push(currentState!);
            const stateToLoad = this.undos[this.undos.length - 1];
            this.drawingLoaderService.currentDrawing.next(stateToLoad);
        }
    }

    redo(): void {
        if (this.redos.length > 0) {
            const stateToLoad = this.redos.pop();
            this.undos.push(stateToLoad!);
            this.drawingLoaderService.currentDrawing.next(stateToLoad!);
        }
    }

    // tslint:disable-next-line: no-empty
    reset(): void {}
}
