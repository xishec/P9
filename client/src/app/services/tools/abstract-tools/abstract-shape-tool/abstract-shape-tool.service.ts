import { Injectable, Renderer2 } from '@angular/core';

import { SVG_NS } from '../../../../../constants/constants';
import { AbstractToolService } from '../abstract-tool.service';

@Injectable({
    providedIn: 'root',
})
export abstract class AbstractShapeToolService extends AbstractToolService {
    protected currentMouseX = 0;
    protected currentMouseY = 0;
    protected initialMouseX = 0;
    protected initialMouseY = 0;
    protected previewRectangle: SVGRectElement = this.renderer.createElement('rect', SVG_NS);
    protected isPreviewing = false;
    protected isIn = true;

    constructor(protected renderer: Renderer2) {
        super();
    }

    abstract onMouseMove(event: MouseEvent): void;
    abstract onMouseDown(event: MouseEvent): void;
    abstract onMouseUp(event: MouseEvent): void;
    abstract onMouseEnter(event: MouseEvent): void;
    abstract onMouseLeave(event: MouseEvent): void;
    abstract onKeyDown(event: KeyboardEvent): void;
    abstract onKeyUp(event: KeyboardEvent): void;
    protected abstract createSVG(): void;

    protected updatePreviewRectangle(): void {
        let deltaX = this.currentMouseX - this.initialMouseX;
        let deltaY = this.currentMouseY - this.initialMouseY;

        // adjust x
        if (deltaX < 0) {
            deltaX *= -1;
            this.renderer.setAttribute(this.previewRectangle, 'x', (this.initialMouseX - deltaX).toString());
            this.renderer.setAttribute(this.previewRectangle, 'width', deltaX.toString());
        } else {
            this.renderer.setAttribute(this.previewRectangle, 'x', this.initialMouseX.toString());
            this.renderer.setAttribute(this.previewRectangle, 'width', deltaX.toString());
        }

        // adjust y
        if (deltaY < 0) {
            deltaY *= -1;
            this.renderer.setAttribute(this.previewRectangle, 'y', (this.initialMouseY - deltaY).toString());
            this.renderer.setAttribute(this.previewRectangle, 'height', deltaY.toString());
        } else {
            this.renderer.setAttribute(this.previewRectangle, 'y', this.initialMouseY.toString());
            this.renderer.setAttribute(this.previewRectangle, 'height', deltaY.toString());
        }

        this.renderer.setAttribute(this.previewRectangle, 'fill', 'white');
        this.renderer.setAttribute(this.previewRectangle, 'fill-opacity', '0.3');
        this.renderer.setAttribute(this.previewRectangle, 'stroke', 'black');
        this.renderer.setAttribute(this.previewRectangle, 'stroke-dasharray', '5 5');
    }
}
