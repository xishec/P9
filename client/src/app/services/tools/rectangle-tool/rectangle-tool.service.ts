import { ElementRef, Injectable, Renderer2 } from '@angular/core';

import { Keys, Mouse, SVG_NS } from '../../constants';
import { DrawStackService } from '../../draw-stack/draw-stack.service';
import { AbstractShapeToolService } from '../abstract-tools/abstract-shape-tool/abstract-shape-tool.service';

@Injectable({
    providedIn: 'root',
})
export class RectangleToolService extends AbstractShapeToolService {
    private drawRectangle = this.renderer.createElement('rect', SVG_NS);
    private fillColor = 'green';
    private strokeColor = 'black';
    private strokeWidth = 1;
    private isSquarePreview = false;

    constructor(
        private drawStack: DrawStackService,
        private svgReference: ElementRef<SVGElement>,
        renderer: Renderer2
    ) {
        super(renderer);
    }

    onMouseMove(event: MouseEvent): void {
        this.currentMouseX = event.offsetX;
        this.currentMouseY = event.offsetY;

        if (this.isPreviewing) {
            this.updatePreviewRectangle();
            this.updateDrawing();
        }
    }

    onMouseDown(event: MouseEvent): void {
        const button = event.button;

        switch (button) {
            case Mouse.LeftButton && this.isIn:
                this.initialMouseX = this.currentMouseX;
                this.initialMouseY = this.currentMouseY;
                this.isPreviewing = true;

                this.updatePreviewRectangle();
                this.updateDrawing();

                this.renderer.appendChild(this.svgReference.nativeElement, this.previewRectangle);
                this.renderer.appendChild(this.svgReference.nativeElement, this.drawRectangle);
                break;

            default:
                break;
        }
    }

    onMouseUp(event: MouseEvent): void {
        const button = event.button;

        switch (button) {
            case Mouse.LeftButton:
                if (this.previewRectangle.width.baseVal.value > 0 || this.previewRectangle.height.baseVal.value > 0) {
                    this.createSVG();
                }
                this.isPreviewing = false;
                this.isSquarePreview = false;
                this.renderer.removeChild(this.svgReference.nativeElement, this.previewRectangle);
                this.renderer.removeChild(this.svgReference, this.drawRectangle);
                break;

            default:
                break;
        }
    }

    onMouseEnter(event: MouseEvent): void {
        this.isIn = true;
        this.isOut = false;
    }

    onMouseLeave(event: MouseEvent): void {
        this.isIn = false;
        this.isOut = true;
    }

    onKeyDown(event: KeyboardEvent): void {
        const key = event.key;

        switch (key) {
            case Keys.Shift:
                if (this.isPreviewing && !this.isSquarePreview) {
                    this.isSquarePreview = true;
                    this.updateDrawing();
                }
                break;

            default:
                break;
        }
    }

    onKeyUp(event: KeyboardEvent): void {
        const key = event.key;

        switch (key) {
            case Keys.Shift:
                if (this.isPreviewing && this.isSquarePreview) {
                    this.isSquarePreview = false;
                    this.updatePreviewRectangle();
                    this.updateDrawing();
                }
                break;

            default:
                break;
        }
    }

    createSVG(): void {
        const el = this.renderer.createElement('svg', SVG_NS);
        const drawRectangle = this.renderer.createElement('rect', SVG_NS);
        this.renderer.setAttribute(drawRectangle, 'x', this.drawRectangle.x.baseVal.valueAsString);
        this.renderer.setAttribute(drawRectangle, 'y', this.drawRectangle.y.baseVal.valueAsString);
        this.renderer.setAttribute(drawRectangle, 'width', this.drawRectangle.width.baseVal.valueAsString);
        this.renderer.setAttribute(drawRectangle, 'height', this.drawRectangle.height.baseVal.valueAsString);
        this.renderer.setAttribute(drawRectangle, 'fill', this.fillColor.toString());
        this.renderer.setAttribute(drawRectangle, 'stroke', this.strokeColor.toString());
        this.renderer.setAttribute(drawRectangle, 'stroke-width', this.strokeWidth.toString());
        this.renderer.appendChild(el, drawRectangle);
        this.drawStack.push(el);
        this.renderer.appendChild(this.svgReference.nativeElement, el);
    }

    updateDrawing(): void {
        if (this.isSquarePreview) {
            this.updatePreviewSquare();
        } else {
            this.updatePreviewRectangle();
            this.renderer.setAttribute(this.drawRectangle, 'x', this.previewRectangle.x.baseVal.valueAsString);
            this.renderer.setAttribute(this.drawRectangle, 'y', this.previewRectangle.y.baseVal.valueAsString);
            this.renderer.setAttribute(this.drawRectangle, 'width', this.previewRectangle.width.baseVal.valueAsString);
            this.renderer.setAttribute(this.drawRectangle, 'height', this.previewRectangle.height.baseVal.valueAsString);
            this.renderer.setAttribute(this.drawRectangle, 'fill', this.fillColor.toString());
            this.renderer.setAttribute(this.drawRectangle, 'stroke', this.strokeColor.toString());
            this.renderer.setAttribute(this.drawRectangle, 'stroke-width', this.strokeWidth.toString());
        }
    }

    updatePreviewSquare(): void {
        let w = this.currentMouseX - this.initialMouseX;
        let h = this.currentMouseY - this.initialMouseY;
        const minLen = Math.min(Math.abs(w), Math.abs(h));

        // adjust x
        if (w < 0) {
            w *= -1;
            this.renderer.setAttribute(this.drawRectangle, 'x', (this.initialMouseX - w + w / 2 - minLen / 2).toString());
            this.renderer.setAttribute(this.drawRectangle, 'width', minLen.toString());
        } else {
            this.renderer.setAttribute(this.drawRectangle, 'x', (this.initialMouseX + w / 2 - minLen / 2).toString());
            this.renderer.setAttribute(this.drawRectangle, 'width', minLen.toString());
        }

        // adjust y
        if (h < 0) {
            h *= -1;
            this.renderer.setAttribute(this.drawRectangle, 'y', (this.initialMouseY - h + h / 2 - minLen / 2).toString());
            this.renderer.setAttribute(this.drawRectangle, 'height', minLen.toString());
        } else {
            this.renderer.setAttribute(this.drawRectangle, 'y', (this.initialMouseY + h / 2 - minLen / 2).toString());
            this.renderer.setAttribute(this.drawRectangle, 'height', minLen.toString());
        }
    }
}
