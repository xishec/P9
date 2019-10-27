import { ElementRef, Injectable } from '@angular/core';

import { Drawing } from '../../../../../common/communication/Drawing';
import { DrawingInfo } from '../../../../../common/communication/DrawingInfo';
import { DrawingLoaderService } from '../server/drawing-loader/drawing-loader.service';
import { DEFAULT_WHITE } from 'src/constants/color-constants';

@Injectable({
    providedIn: 'root',
})
export class UndoRedoerService {

    undos = new Array<Drawing>();
    redos = new Array<Drawing>();

    workzoneRef: ElementRef<SVGElement>;

    constructor(private drawingLoaderService: DrawingLoaderService) {
    }

    setWorkZoneRef(workzoneRef: ElementRef<SVGElement>) {
        this.workzoneRef = workzoneRef;
    }

    initializeStacks(idStackArray: string[]) : void {
        this.undos = [];
        this.redos = [];
        this.saveCurrentState(idStackArray);
    }

    saveCurrentState(idStackArray: string[]): void {
        const currentState: Drawing = {
            name: '',
            labels: [],
            svg: this.workzoneRef.nativeElement.innerHTML,
            idStack: idStackArray,
            drawingInfo: new DrawingInfo(700, 700, DEFAULT_WHITE),
        };

        this.undos.push(currentState);

        if( this.redos.length > 0) {
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
