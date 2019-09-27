import { Injectable, Renderer2 } from '@angular/core';
import { AbstractToolService } from '../abstract-tool.service';
import { SVG_NS } from 'src/constants/constants';

@Injectable({
    providedIn: 'root',
})
export abstract class TracingToolService extends AbstractToolService {
    protected isDrawing = false;
    protected currentPath = '';
    protected currentWidth = 0;
    protected currentColor = '';
    protected svgPath: SVGPathElement = this.renderer.createElement('path', SVG_NS);
    protected svgWrap: SVGGElement = this.renderer.createElement('g', SVG_NS);
    protected svgPreviewCircle: SVGCircleElement = this.renderer.createElement('circle', SVG_NS);

    constructor(protected renderer: Renderer2) {
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
