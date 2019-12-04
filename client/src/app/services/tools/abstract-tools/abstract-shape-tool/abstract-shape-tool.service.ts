import { ElementRef, Injectable, Renderer2 } from '@angular/core';

import { DrawStackService } from 'src/app/services/draw-stack/draw-stack.service';
import { Coords2D } from 'src/classes/Coords2D';
import { HTML_ATTRIBUTE } from 'src/constants/tool-constants';
import { SVG_NS, TITLE_ELEMENT_TO_REMOVE } from '../../../../../constants/constants';
import { AbstractToolService } from '../abstract-tool.service';

@Injectable({
    providedIn: 'root',
})
export abstract class AbstractShapeToolService extends AbstractToolService {
    currentMouseCoords: Coords2D = new Coords2D(0, 0);
    initialMouseCoords: Coords2D = new Coords2D(0, 0);
    previewRectangle: SVGRectElement;
    isPreviewing = false;

    elementRef: ElementRef<SVGElement>;
    renderer: Renderer2;
    drawStack: DrawStackService;

    constructor() {
        super();
    }

    initializeService(elementRef: ElementRef<SVGElement>, renderer: Renderer2, drawStack: DrawStackService) {
        this.elementRef = elementRef;
        this.renderer = renderer;
        this.drawStack = drawStack;
        this.previewRectangle = this.renderer.createElement('rect', SVG_NS);
        this.renderer.setAttribute(this.previewRectangle, HTML_ATTRIBUTE.Title, TITLE_ELEMENT_TO_REMOVE);
    }

    abstract onMouseMove(event: MouseEvent): void;
    abstract onMouseDown(event: MouseEvent): void;
    abstract onMouseUp(event: MouseEvent): void;
    abstract onMouseEnter(event: MouseEvent): void;
    abstract onMouseLeave(event: MouseEvent): void;
    abstract onKeyDown(event: KeyboardEvent): void;
    abstract onKeyUp(event: KeyboardEvent): void;
    abstract cleanUp(): void;
    protected abstract createSVG(): void;

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

    protected updatePreviewRectangle(): void {
        let deltaX = this.currentMouseCoords.x - this.initialMouseCoords.x;
        let deltaY = this.currentMouseCoords.y - this.initialMouseCoords.y;

        // adjust x
        if (deltaX < 0) {
            deltaX *= -1;
            this.renderer.setAttribute(this.previewRectangle, HTML_ATTRIBUTE.X, (this.initialMouseCoords.x - deltaX).toString());
            this.renderer.setAttribute(this.previewRectangle, HTML_ATTRIBUTE.Width, deltaX.toString());
        } else {
            this.renderer.setAttribute(this.previewRectangle, HTML_ATTRIBUTE.X, this.initialMouseCoords.x.toString());
            this.renderer.setAttribute(this.previewRectangle, HTML_ATTRIBUTE.Width, deltaX.toString());
        }

        // adjust y
        if (deltaY < 0) {
            deltaY *= -1;
            this.renderer.setAttribute(this.previewRectangle, HTML_ATTRIBUTE.Y, (this.initialMouseCoords.y - deltaY).toString());
            this.renderer.setAttribute(this.previewRectangle, HTML_ATTRIBUTE.Height, deltaY.toString());
        } else {
            this.renderer.setAttribute(this.previewRectangle, HTML_ATTRIBUTE.Y, this.initialMouseCoords.y.toString());
            this.renderer.setAttribute(this.previewRectangle, HTML_ATTRIBUTE.Height, deltaY.toString());
        }

        this.renderer.setAttribute(this.previewRectangle, HTML_ATTRIBUTE.Fill, 'white');
        this.renderer.setAttribute(this.previewRectangle, 'fill-opacity', '0.3');
        this.renderer.setAttribute(this.previewRectangle, HTML_ATTRIBUTE.Stroke, 'black');
        this.renderer.setAttribute(this.previewRectangle, HTML_ATTRIBUTE.StrokeDasharray, '5 5');
    }
}
