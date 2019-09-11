import { ElementRef } from '@angular/core';

export abstract class TracingTool {
    protected isDrawing: boolean;
    protected svgReference: ElementRef<SVGElement>;

    constructor(elementReference: ElementRef<SVGElement>) {
        this.svgReference = elementReference;
        this.isDrawing = false;
    }

    mouseDown(e: MouseEvent): void {
        this.isDrawing = true;
    }

    // tslint:disable-next-line: no-empty
    mouseMove(e: MouseEvent): void { }

    mouseUp(e: MouseEvent): void {
        this.isDrawing = false;
    }
}
