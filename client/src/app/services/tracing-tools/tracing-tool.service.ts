import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export abstract class TracingToolService {
    protected isDrawing = false;

    // tslint:disable-next-line: no-empty
    constructor() {}

    onMouseDown(e: MouseEvent): void {
        this.isDrawing = true;
    }

    onMouseUp(e: MouseEvent): void {
        this.isDrawing = false;
    }

    onMouseLeave(e: MouseEvent): void {
        this.isDrawing = false;
    }

    abstract onMouseMove(e: MouseEvent): void;
}
