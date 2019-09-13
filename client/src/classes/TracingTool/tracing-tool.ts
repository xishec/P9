import { ElementRef } from '@angular/core';

export abstract class TracingTool {
    protected isDrawing: boolean;
    protected svgReference: ElementRef<SVGElement>;

    constructor(elementReference: ElementRef<SVGElement>) {
        this.svgReference = elementReference;
        this.isDrawing = false;
    }

    onMouseDown(e: MouseEvent): void {
        this.isDrawing = true;
    }

    abstract onMouseMove(e: MouseEvent): void;

    onMouseUp(e: MouseEvent): void {
        this.isDrawing = false;
    }

    abstract onMouseLeave(e: MouseEvent): void;
}
