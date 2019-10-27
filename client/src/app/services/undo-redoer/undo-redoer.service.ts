import { ElementRef, Injectable } from '@angular/core';

import { Drawing } from '../../../../../common/communication/Drawing';
import { DrawingInfo } from '../../../../../common/communication/DrawingInfo';
import { DrawingLoaderService } from '../server/drawing-loader/drawing-loader.service';
import { DEFAULT_WHITE } from 'src/constants/color-constants';

@Injectable({
    providedIn: 'root',
})
export class UndoRedoerService {

    statesArray = new Array<Drawing>();
    currentStateIndexPosition = 0;
    workzoneRef: ElementRef<SVGElement>;

    constructor(private drawingLoaderService: DrawingLoaderService) {
    }

    setWorkZoneRef(workzoneRef: ElementRef<SVGElement>) {
        this.workzoneRef = workzoneRef;
    }

    initializeStateArray(idStackArray: string[]) : void {
        this.statesArray = new Array<Drawing>();
        this.currentStateIndexPosition = 0;
        this.saveCurrentState(idStackArray);
    }

    saveCurrentState(idStackArray: string[]): void {
        const currentState: Drawing = {
            name: '',
            labels: [],
            svg: this.workzoneRef.nativeElement.innerHTML,
            idStack:  idStackArray,
            drawingInfo: new DrawingInfo(700, 700, DEFAULT_WHITE),
        };

        // verify
        if (this.currentStateIndexPosition < this.statesArray.length - 2) {
            this.statesArray = this.statesArray.slice(0, this.currentStateIndexPosition + 1);
        }
        this.statesArray.push(currentState);
        this.currentStateIndexPosition = this.statesArray.length - 1;
        // this should add the current state of the work-zone into the statesArray[];
        console.log('save : ' + currentState.idStack);
    }

    loadPreviousState(): void {
        // verify if there is a previous state
        if (this.currentStateIndexPosition > 0) {
            // when pressing control+z the previous state should load;
            const drawingToLoad = this.statesArray[--this.currentStateIndexPosition];
            this.drawingLoaderService.currentDrawing.next(drawingToLoad);
            // current state should be updated
            console.log('previous : ' + drawingToLoad.idStack);
        }
    }

    loadNextState(): void {
        // verify if there is a next state
        if (this.currentStateIndexPosition < this.statesArray.length - 1) {
            // when pressing control-y the next state should load;
            const drawingToLoad = this.statesArray[++this.currentStateIndexPosition];
            this.drawingLoaderService.currentDrawing.next(drawingToLoad);
            console.log('next ' + drawingToLoad.idStack);
        }
    }

    // tslint:disable-next-line: no-empty
    reset(): void {}
}
