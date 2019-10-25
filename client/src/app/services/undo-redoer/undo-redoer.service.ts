import { ElementRef, Injectable } from '@angular/core';

import { Drawing } from '../../../../../common/communication/Drawing';
import { DrawingInfo } from '../../../../../common/communication/DrawingInfo';
import { DrawingLoaderService } from '../server/drawing-loader/drawing-loader.service';

@Injectable({
    providedIn: 'root',
})
export class UndoRedoerService {

    statesArray = new Array<Drawing>();
    currentStateIndexPosition = 0;
    workzoneRef: ElementRef<SVGElement>;
    drawingInfo: DrawingInfo;

    constructor(private drawingLoaderService: DrawingLoaderService, workzoneRef: ElementRef<SVGElement>, drawingInfo: DrawingInfo) {
        this.workzoneRef = workzoneRef;
        this.drawingInfo = drawingInfo;
    }

    saveCurrentState(idStackArray: string[]): void {

        const currentState: Drawing = {
            name: '',
            labels: [],
            svg: this.workzoneRef.nativeElement.innerHTML,
            idStack: idStackArray,
            drawingInfo: this.drawingInfo,
        };
        this.statesArray.push(currentState);
        this.currentStateIndexPosition++;
        // this should add the current state of the work-zone into the statesArray[];
    }

    loadPreviousState(): void {
        // verify if there is a previous state
        // when pressing control+z the previous state should load;
        const drawingToLoad = this.statesArray[this.currentStateIndexPosition--];
        this.drawingLoaderService.currentDrawing.next(drawingToLoad);
        // current state should be updated
    }

    loadNextState(): void {
        // verify if there is a next state
        // when pressing control-y the next state should load;
        // current state should be updated
    }

    // tslint:disable-next-line: no-empty
    reset(): void {}
}
