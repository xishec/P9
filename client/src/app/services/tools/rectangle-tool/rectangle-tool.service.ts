import { ElementRef, Injectable, Renderer2 } from '@angular/core';
import { Keys } from 'src/app/keys.enum';
import { AbstractShapeToolService } from '../abstract-tools/abstract-shape-tool/abstract-shape-tool.service';

@Injectable({
  providedIn: 'root',
})
export class RectangleToolService extends AbstractShapeToolService {
    private fillColor: string;
    private strokeColor: string;
    private strokeWidth: number;
    private isSquarePreview: boolean;
    // private centerX: number;
    // private centerY: number;
    // private radius: number;

    constructor(elementReference: ElementRef<SVGElement>, renderer: Renderer2) {
        super(elementReference, renderer);
        this.fillColor = 'green';
        this.strokeColor = 'black';
        this.strokeWidth = 1;
        this.isSquarePreview = false;
    }

    onMouseMove(event: MouseEvent): void {
        this.currentMouseX = event.offsetX;
        this.currentMouseY = event.offsetY;

        if (this.isPreviewing) {
            if (this.isSquarePreview) {
                this.updatePreviewSquare();

            } else {
                this.updatePreviewRectangle();
            }
        }
    }

    onMouseDown(event: MouseEvent): void {
        const button = event.button;

        switch (button) {
            case 0 && this.isIn:
                this.initialMouseX = this.currentMouseX;
                this.initialMouseY = this.currentMouseY;
                this.isPreviewing = true;
                if (this.isSquarePreview) {
                    this.updatePreviewSquare();
                } else {
                    this.updatePreviewRectangle();
                }

                this.renderer.appendChild(this.svgReference.nativeElement, this.previewRectangle);
                break;

            case 1:
                break;

            default:
                break;
        }
    }

    onMouseUp(event: MouseEvent): void {
        const button = event.button;

        switch (button) {
            case 0:
                if (this.previewRectangle.width.baseVal.value > 0 || this.previewRectangle.height.baseVal.value > 0) {
                    this.createSVG();
                }
                this.isPreviewing = false;
                this.isSquarePreview = false;
                this.renderer.removeChild(this.svgReference.nativeElement, this.previewRectangle);
                break;

            case 1:
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
                    this.updatePreviewSquare();
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
                }
                break;

            default:
                break;
        }
    }

    createSVG(): void {
        const el = this.renderer.createElement('rect', 'http://www.w3.org/2000/svg');
        this.renderer.setAttribute(el, 'x', this.previewRectangle.x.baseVal.valueAsString);
        this.renderer.setAttribute(el, 'y', this.previewRectangle.y.baseVal.valueAsString);
        this.renderer.setAttribute(el, 'width', this.previewRectangle.width.baseVal.valueAsString);
        this.renderer.setAttribute(el, 'height', this.previewRectangle.height.baseVal.valueAsString);
        this.renderer.setAttribute(el, 'fill', this.fillColor.toString());
        this.renderer.setAttribute(el, 'stroke', this.strokeColor.toString());
        this.renderer.setAttribute(el, 'stroke-width', this.strokeWidth.toString());
        this.renderer.appendChild(this.svgReference.nativeElement, el);
    }

    squareTransition(): void{
        // this.centerX = Math.abs((this.currentMouseX - this.initialMouseX) / 2);
        // this.centerY = Math.abs((this.currentMouseY - this.initialMouseY) / 2);

    }

    updatePreviewSquare(): void {
        let w = this.currentMouseX - this.initialMouseX;
        let h = this.currentMouseY - this.initialMouseY;
        const minLen = Math.min(Math.abs(w), Math.abs(h));
        //let r = Math.sqrt(Math.pow(w, 2) + Math.pow(h, 2));

        // this.renderer.setAttribute(this.previewRectangle, 'x', this.initialMouseX.toString());
        // this.renderer.setAttribute(this.previewRectangle, 'y', this.initialMouseY.toString());
        // this.renderer.setAttribute(this.previewRectangle, 'width', r.toString());
        // this.renderer.setAttribute(this.previewRectangle, 'height', r.toString());
        // adjust x
        if (w < 0) {
            w *= -1;
            this.renderer.setAttribute(this.previewRectangle, 'x', ((this.initialMouseX) - minLen).toString());
            this.renderer.setAttribute(this.previewRectangle, 'width', minLen.toString());
        } else {
            this.renderer.setAttribute(this.previewRectangle, 'x', (this.initialMouseX).toString());
            this.renderer.setAttribute(this.previewRectangle, 'width', minLen.toString());
        }

        // adjust y
        if (h < 0) {
            h *= -1;
            this.renderer.setAttribute(this.previewRectangle, 'y', (this.initialMouseY - minLen).toString());
            this.renderer.setAttribute(this.previewRectangle, 'height', minLen.toString());
        } else {
            this.renderer.setAttribute(this.previewRectangle, 'y', (this.initialMouseY).toString());
            this.renderer.setAttribute(this.previewRectangle, 'height', minLen.toString());
        }
    }
}
