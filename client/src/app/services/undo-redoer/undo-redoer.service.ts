import { ElementRef, Injectable } from '@angular/core';

import { BehaviorSubject, Observable } from 'rxjs';
import { Drawing } from '../../../../../common/communication/Drawing';
import { DrawingInfo } from '../../../../../common/communication/DrawingInfo';
import { DrawingModalWindowService } from '../drawing-modal-window/drawing-modal-window.service';
import { DrawingLoaderService } from '../server/drawing-loader/drawing-loader.service';
import { DrawingState } from 'src/classes/DrawingState';


@Injectable({
    providedIn: 'root',
})
export class UndoRedoerService {

    undos = new Array<DrawingState>();
    redos = new Array<DrawingState>();

    workzoneRef: ElementRef<SVGElement>;
    currentDrawingInfos: DrawingInfo;

    fromLoader = false;

    pasteOffset: BehaviorSubject<number> = new BehaviorSubject(0);
    duplicateOffset: BehaviorSubject<number> = new BehaviorSubject(0);
    clipping: BehaviorSubject<Set<SVGElement>> = new BehaviorSubject(new Set<SVGElement>());

    currentPasteOffset: Observable<number> = this.pasteOffset.asObservable();
    currentDuplicateOffset: Observable<number> = this.duplicateOffset.asObservable();
    currentClipping: Observable<Set<SVGElement>> = this.clipping.asObservable();

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
        };
        return drawing;
    }

    saveStateAndDuplicateOffset(idStackArray: string[], duplicateOffset: number) {
        const currentDrawing = this.createDrawing(idStackArray.slice(0));

        const currentState: DrawingState = {
            drawing: currentDrawing,
            duplicateOffset,
        };

        this.saveState(currentState);
    }

    saveStateFromPaste(idStackArray: string[], pasteOffset: number, clippingState: Set<SVGElement>) {
        const currentDrawing = this.createDrawing(idStackArray.slice(0));

        const currentState: DrawingState = {
            drawing: currentDrawing,
            pasteOffset,
            clippings: new Set<SVGElement>(clippingState),
        };

        this.saveState(currentState);
    }

    saveCurrentState(idStackArray: string[]): void {
        const currentDrawing = this.createDrawing(idStackArray.slice(0));

        const currentState: DrawingState = {
            drawing: currentDrawing,
        };

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

            if (stateToLoad.duplicateOffset !== undefined) {
                this.duplicateOffset.next(stateToLoad.duplicateOffset);
            } else if (stateToLoad.pasteOffset !== undefined && stateToLoad.clippings !== undefined) {
                this.pasteOffset.next(stateToLoad.pasteOffset);
                this.clipping.next(stateToLoad.clippings);
            }

            this.drawingLoaderService.currentDrawing.next(stateToLoad.drawing);
        }
    }

    redo(): void {
        if (this.redos.length > 0) {
            const stateToLoad = this.redos.pop() as DrawingState;
            this.undos.push(stateToLoad as DrawingState);

            if (stateToLoad.duplicateOffset !== undefined) {
                this.duplicateOffset.next(stateToLoad.duplicateOffset);
            } else if (stateToLoad.pasteOffset !== undefined) {
                this.pasteOffset.next(stateToLoad.pasteOffset);
            }

            this.drawingLoaderService.currentDrawing.next(stateToLoad.drawing);
        }
    }
}
