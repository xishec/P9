import { ElementRef, Injectable, Renderer2 } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export abstract class AbstractShapeToolService {
    protected currentMouseX: number;
    protected currentMouseY: number;
    protected initialMouseX: number;
    protected initialMouseY: number;
    protected svgReference: ElementRef<SVGElement>;
    protected renderer: Renderer2;
    protected previewRectangle: SVGRectElement;
    protected isPreviewing: boolean;
    protected isIn: boolean;
    protected isOut: boolean;

    constructor(elementReference: ElementRef<SVGElement>, renderer: Renderer2) {
        this.currentMouseX = 0;
        this.currentMouseY = 0;
        this.initialMouseX = 0;
        this.initialMouseY = 0;
        this.svgReference = elementReference;
        this.renderer = renderer;
        this.previewRectangle = this.renderer.createElement('rect', 'http://www.w3.org/2000/svg');
        this.isPreviewing = false;
        this.isIn = false;
        this.isOut = false;
    }

    abstract onMouseMove(event: MouseEvent): void;
    abstract onMouseDown(event: MouseEvent): void;
    abstract onMouseUp(event: MouseEvent): void;
    abstract onMouseEnter(event: MouseEvent): void;
    abstract onMouseLeave(event: MouseEvent): void;
    abstract onKeyDown(event: KeyboardEvent): void;
    abstract onKeyUp(event: KeyboardEvent): void;
    abstract createSVG(): void;

    protected updatePreviewRectangle(): void{
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
