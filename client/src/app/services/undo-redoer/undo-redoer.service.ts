import { ElementRef, Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

import { Drawing } from 'src/../../common/communication/Drawing';
import { DrawingState } from 'src/classes/DrawingState';
import { TITLE_ELEMENT_TO_REMOVE } from 'src/constants/constants';
import { HTML_ATTRIBUTE } from 'src/constants/tool-constants';
import { DrawingInfo } from '../../../../../common/communication/DrawingInfo';
import { DrawingModalWindowService } from '../drawing-modal-window/drawing-modal-window.service';
import { DrawingLoaderService } from '../server/drawing-loader/drawing-loader.service';

@Injectable({
    providedIn: 'root',
})
export class UndoRedoerService {
    undos = new Array<DrawingState>();
    redos = new Array<DrawingState>();

    workzoneRef: ElementRef<SVGElement>;
    currentDrawingInfo: DrawingInfo;

    fromLoader = false;

    pasteOffset: BehaviorSubject<number> = new BehaviorSubject(0);
    duplicateOffset: BehaviorSubject<number> = new BehaviorSubject(0);
    clipping: BehaviorSubject<Set<SVGElement>> = new BehaviorSubject(new Set<SVGElement>());

    currentPasteOffset: Observable<number> = this.pasteOffset.asObservable();
    currentDuplicateOffset: Observable<number> = this.duplicateOffset.asObservable();
    currentClipping: Observable<Set<SVGElement>> = this.clipping.asObservable();

    constructor(
        private drawingLoaderService: DrawingLoaderService,
        private drawingModalWindowService: DrawingModalWindowService,
    ) {}

    initializeService(workzoneRef: ElementRef<SVGElement>) {
        this.workzoneRef = workzoneRef;
        this.drawingModalWindowService.drawingInfo.subscribe((drawingInfo) => {
            this.currentDrawingInfo = drawingInfo;
        });
    }

    initializeStacks(): void {
        this.undos = [];
        this.redos = [];
    }

    getCleanInnerHTML(): string {
        const cloneWorkzone = this.workzoneRef.nativeElement.cloneNode(true) as SVGElement;

        const elToRemove = new Array<SVGElement>();

        cloneWorkzone.childNodes.forEach((childNode: ChildNode) => {
            if ((childNode as SVGElement).getAttribute(HTML_ATTRIBUTE.title) === TITLE_ELEMENT_TO_REMOVE) {
                elToRemove.push(childNode as SVGElement);
            }
        });

        elToRemove.forEach((el: SVGElement) => {
            cloneWorkzone.removeChild(el);
        });

        return cloneWorkzone.innerHTML;
    }

    createDrawing(idStackArray: string[]): Drawing {
        const cleanedInnerHTML = this.getCleanInnerHTML();
        const drawing: Drawing = {
            svg: cleanedInnerHTML,
            drawingInfo: {
                name: '',
                labels: [],
                idStack: idStackArray,
                height: this.currentDrawingInfo.height,
                width: this.currentDrawingInfo.width,
                color: this.currentDrawingInfo.color,
                createdAt: 0,
                lastModified: 0,
            } as DrawingInfo,
        } as Drawing;

        return drawing;
    }

    saveStateAndDuplicateOffset(idStackArray: string[], duplicateOffset: number) {
        const currentDrawing = this.createDrawing(idStackArray.slice(0));

        const currentState: DrawingState = new DrawingState(currentDrawing);
        currentState.duplicateOffset = duplicateOffset;

        this.saveState(currentState);
    }

    saveStateFromPaste(idStackArray: string[], pasteOffset: number, clippingState: Set<SVGElement>) {
        const currentDrawing = this.createDrawing(idStackArray.slice(0));

        const currentState: DrawingState = new DrawingState(currentDrawing);
        currentState.pasteOffset = pasteOffset;
        currentState.clippings = new Set<SVGElement>(clippingState);

        this.saveState(currentState);
    }

    saveCurrentState(idStackArray: string[]): void {
        const currentDrawing = this.createDrawing(idStackArray.slice(0));

        const currentState: DrawingState = new DrawingState(currentDrawing);

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
