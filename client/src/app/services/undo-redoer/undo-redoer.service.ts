import { ElementRef, Injectable } from '@angular/core';

import { Drawing } from '../../../../../common/communication/Drawing';
import { DrawingInfo } from '../../../../../common/communication/DrawingInfo';
import { DrawingModalWindowService } from '../drawing-modal-window/drawing-modal-window.service';
import { DrawingLoaderService } from '../server/drawing-loader/drawing-loader.service';

interface DrawingState {
    drawing: Drawing,
    pasteOfsset?: number,
    duplicateOffset?: number,
}


@Injectable({
    providedIn: 'root',
})
export class UndoRedoerService {

    undos = new Array<DrawingState>();
    redos = new Array<DrawingState>();

    workzoneRef: ElementRef<SVGElement>;
    currentDrawingInfos: DrawingInfo;

    fromLoader = false;

    constructor(private drawingLoaderService: DrawingLoaderService, private drawingModalWindowService: DrawingModalWindowService) {
    }

    initializeService(workzoneRef: ElementRef<SVGElement>) {
        this.workzoneRef = workzoneRef;
        this.drawingModalWindowService.drawingInfo.subscribe((drawingInfo) => {
            this.currentDrawingInfos = drawingInfo;
        });
    }

    initializeStacks(): void {
        this.undos = [];
        this.redos = [];
    }

    createDrawing(idStackArray: string[]): Drawing {
        const drawing: Drawing = {
            name: '',
            labels: [],
            svg: this.workzoneRef.nativeElement.innerHTML,
            idStack: idStackArray,
            drawingInfo: this.currentDrawingInfos,
        }
        return drawing;
    }

    saveStateAndDuplicateOffset(idStackArray: string[], duplicateOffset: number) {
        const currentDrawing = this.createDrawing(idStackArray.slice(0));

        const currentState: DrawingState = {
            drawing: currentDrawing,
            duplicateOffset: duplicateOffset,
        };

        this.saveState(currentState);
    }

    saveStateAndPasteOffset(idStackArray: string[], pasteOffset: number) {
        const currentDrawing = this.createDrawing(idStackArray.slice(0));

        const currentState: DrawingState = {
            drawing: currentDrawing,
            pasteOfsset: pasteOffset,
        };

        this.saveState(currentState);
    }

    saveCurrentState(idStackArray: string[]): void {
        const currentDrawing = this.createDrawing(idStackArray.slice(0));

        const currentState: DrawingState = {
            drawing: currentDrawing,
        }

        this.saveState(currentState);
    }

    saveState(state: DrawingState) {
        this.undos.push(state);
        if (this.redos.length > 0) {
            this.redos = [];
        }
    }

    undo(): void {
        if (this.undos.length > 1) {
            const currentState = this.undos.pop();
            this.redos.push(currentState as DrawingState);
            const stateToLoad = this.undos[this.undos.length - 1];
            this.drawingLoaderService.currentDrawing.next(stateToLoad.drawing);
        }
    }

    redo(): void {
        if (this.redos.length > 0) {
            const stateToLoad = this.redos.pop() as DrawingState;
            this.undos.push(stateToLoad as DrawingState);
            this.drawingLoaderService.currentDrawing.next(stateToLoad.drawing);
        }
    }

    // tslint:disable-next-line: no-empty
    reset(): void {}
}
