import { ElementRef, Injectable } from '@angular/core';

import { Drawing } from '../../../../../common/communication/Drawing';
import { DrawingInfo } from '../../../../../common/communication/DrawingInfo';
import { DrawingLoaderService } from '../server/drawing-loader/drawing-loader.service';

@Injectable({
    providedIn: 'root';
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

    saveCurrentState(): void {

        let currentState: Drawing = {
            name: '',
            labels: [],
            svg: this.workzoneRef.nativeElement.innerHTML,
            idStack: [],
            drawingInfo: this.drawingInfo,

        }
        // this should add the current state of the work-zone into the statesArray[];
    }

    loadPreviousState(): void {
        // verify if there is a previous state
        // when pressing control+z the previous state should load;
        const drawingToLoad = this.statesArray[this.currentStateIndexPosition - 1];
        this.drawingLoaderService.currentDrawing.next(drawingToLoad);
        // current state should be updated
    }

    loadNextState(): void {
        // verify if there is a next state
        // when pressing control-y the next state should load;
        // current state should be updated
    }

    reset(): void {

    }
}
