import { Injectable } from '@angular/core';
import { AbstractToolService } from '../abstract-tool.service';

@Injectable({
    providedIn: 'root',
})
export abstract class TracingToolService extends AbstractToolService {
    protected isDrawing = false;

    // tslint:disable-next-line: no-empty
    constructor() {
        super();
    }

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
