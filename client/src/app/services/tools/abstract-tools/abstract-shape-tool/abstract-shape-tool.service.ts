import { Injectable, Renderer2 } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export abstract class AbstractShapeToolService {
    protected currentMouseX = 0;
    protected currentMouseY = 0;
    protected initialMouseX = 0;
    protected initialMouseY = 0;
    // protected svgReference: ElementRef<SVGElement>;
    // protected renderer: Renderer2;
    protected previewRectangle = this.renderer.createElement('rect', 'http://www.w3.org/2000/svg');
    protected isPreviewing = false;
    protected isIn = false;
    protected isOut = false;

    constructor(/*private svgReference: ElementRef<SVGElement>,*/ protected renderer: Renderer2) {}

    abstract onMouseMove(event: MouseEvent): void;
    abstract onMouseDown(event: MouseEvent): void;
    abstract onMouseUp(event: MouseEvent): void;
    abstract onMouseEnter(event: MouseEvent): void;
    abstract onMouseLeave(event: MouseEvent): void;
    abstract onKeyDown(event: KeyboardEvent): void;
    abstract onKeyUp(event: KeyboardEvent): void;
    abstract createSVG(): void;

    protected updatePreviewRectangle(): void {
        let w = this.currentMouseX - this.initialMouseX;
        let h = this.currentMouseY - this.initialMouseY;

        // adjust x
        if (w < 0) {
            w *= -1;
            this.renderer.setAttribute(this.previewRectangle, 'x', (this.initialMouseX - w).toString());
            this.renderer.setAttribute(this.previewRectangle, 'width', w.toString());
        } else {
            this.renderer.setAttribute(this.previewRectangle, 'x', this.initialMouseX.toString());
            this.renderer.setAttribute(this.previewRectangle, 'width', w.toString());
        }

        // adjust y
        if (h < 0) {
            h *= -1;
            this.renderer.setAttribute(this.previewRectangle, 'y', (this.initialMouseY - h).toString());
            this.renderer.setAttribute(this.previewRectangle, 'height', h.toString());
        } else {
            this.renderer.setAttribute(this.previewRectangle, 'y', this.initialMouseY.toString());
            this.renderer.setAttribute(this.previewRectangle, 'height', h.toString());
        }
        this.renderer.setAttribute(this.previewRectangle, 'fill', 'white');
        this.renderer.setAttribute(this.previewRectangle, 'fill-opacity', '0.3');
        this.renderer.setAttribute(this.previewRectangle, 'stroke', 'black');
    }
}
