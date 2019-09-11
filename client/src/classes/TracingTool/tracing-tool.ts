import { OnInit } from '@angular/core';
import { Stroke } from './Stroke/stroke';

export abstract class TracingTool implements OnInit {
    strokes: Stroke[];
    nbStrokes = 0;
    color: string;
    isDrawing = false;
    // WIDTH

    // tslint:disable-next-line: no-empty
    constructor() { }

    mouseDown(e: MouseEvent): void {
        this.isDrawing = true;
        this.strokes = [];
        this.strokes.push(new Stroke(e.offsetX, e.offsetY));
    }

    mouseMove(e: MouseEvent): void {
        if (this.isDrawing) {
            this.strokes[this.nbStrokes].addCoordinate(e.offsetX, e.offsetY);
        }
    }

    mouseUp(e: MouseEvent): void {
        this.nbStrokes += 1;
        this.isDrawing = false;
    }

    // tslint:disable-next-line: no-empty
    ngOnInit() { }
}
