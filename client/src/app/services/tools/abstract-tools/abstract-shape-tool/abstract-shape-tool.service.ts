import { Injectable, Renderer2 } from '@angular/core';

import { SVG_NS } from '../../../../../constants/constants';
import { AbstractToolService } from '../abstract-tool.service';
import { HTMLAttribute } from 'src/constants/tool-constants';

@Injectable({
    providedIn: 'root',
})
export abstract class AbstractShapeToolService extends AbstractToolService {
     currentMouseX = 0;
     currentMouseY = 0;
     initialMouseX = 0;
     initialMouseY = 0;
     previewRectangle: SVGRectElement = this.renderer.createElement('rect', SVG_NS);
     isPreviewing = false;
     isIn = true;

    constructor(public renderer: Renderer2) {
        super();
    }

    abstract onMouseMove(event: MouseEvent): void;
    abstract onMouseDown(event: MouseEvent): void;
    abstract onMouseUp(event: MouseEvent): void;
    abstract onMouseEnter(event: MouseEvent): void;
    abstract onMouseLeave(event: MouseEvent): void;
    abstract onKeyDown(event: KeyboardEvent): void;
    abstract onKeyUp(event: KeyboardEvent): void;
    abstract cleanUp(): void;
    abstract createSVG(): void;

    get previewRectangleX(): number {
        return this.previewRectangle.x.baseVal.value;
    }

    get previewRectangleY(): number {
        return this.previewRectangle.y.baseVal.value;
    }

    get previewRectangleWidth(): number {
        return this.previewRectangle.width.baseVal.value;
    }

    get previewRectangleHeight(): number {
        return this.previewRectangle.height.baseVal.value;
    }

     updatePreviewRectangle(): void {
        let deltaX = this.currentMouseX - this.initialMouseX;
        let deltaY = this.currentMouseY - this.initialMouseY;

        // adjust x
        if (deltaX < 0) {
            deltaX *= -1;
            this.renderer.setAttribute(this.previewRectangle, 'x', (this.initialMouseX - deltaX).toString());
            this.renderer.setAttribute(this.previewRectangle, HTMLAttribute.width, deltaX.toString());
        } else {
            this.renderer.setAttribute(this.previewRectangle, 'x', this.initialMouseX.toString());
            this.renderer.setAttribute(this.previewRectangle, HTMLAttribute.width, deltaX.toString());
        }

        // adjust y
        if (deltaY < 0) {
            deltaY *= -1;
            this.renderer.setAttribute(this.previewRectangle, 'y', (this.initialMouseY - deltaY).toString());
            this.renderer.setAttribute(this.previewRectangle, HTMLAttribute.height, deltaY.toString());
        } else {
            this.renderer.setAttribute(this.previewRectangle, 'y', this.initialMouseY.toString());
            this.renderer.setAttribute(this.previewRectangle, HTMLAttribute.height, deltaY.toString());
        }

        this.renderer.setAttribute(this.previewRectangle, HTMLAttribute.fill, 'white');
        this.renderer.setAttribute(this.previewRectangle, 'fill-opacity', '0.3');
        this.renderer.setAttribute(this.previewRectangle, HTMLAttribute.stroke, 'black');
        this.renderer.setAttribute(this.previewRectangle, HTMLAttribute.stroke_dasharray, '5 5');
    }
}
