import { ElementRef, Injectable, Renderer2 } from '@angular/core';

import { Keys, Mouse, SVG_NS } from 'src/constants/constants';
import { TraceType } from 'src/constants/tool-constants';
import { DrawStackService } from '../../draw-stack/draw-stack.service';
import { AbstractShapeToolService } from '../abstract-tools/abstract-shape-tool/abstract-shape-tool.service';
import { AttributesManagerService } from '../attributes-manager/attributes-manager.service';
import { ColorToolService } from '../color-tool/color-tool.service';

@Injectable({
    providedIn: 'root',
})
export class RectangleToolService extends AbstractShapeToolService {
    private drawRectangle: SVGRectElement = this.renderer.createElement('rect', SVG_NS);
    private fillColor = '';
    private strokeColor = '';
    private userFillColor = '';
    private userStrokeColor = '';
    private traceType = '';
    private strokeWidth = 1;
    private isSquarePreview = false;
    private attributesManagerService: AttributesManagerService;
    private colorToolService: ColorToolService;

    constructor(
        private drawStack: DrawStackService,
        private svgReference: ElementRef<SVGElement>,
        renderer: Renderer2,
    ) {
        super(renderer);
    }

    initializeAttributesManagerService(attributesManagerService: AttributesManagerService) {
        this.attributesManagerService = attributesManagerService;
        this.attributesManagerService.currentThickness.subscribe((thickness: number) => {
            this.strokeWidth = thickness;
        });
        this.attributesManagerService.currentTraceType.subscribe((traceType: string) => {
            this.updateTraceType(traceType);
        });
    }
    initializeColorToolService(colorToolService: ColorToolService) {
        this.colorToolService = colorToolService;
        this.colorToolService.currentPrimaryColor.subscribe((fillColor: string) => {
            this.fillColor = fillColor;
            this.updateTraceType(this.traceType);
        });
        this.colorToolService.currentSecondaryColor.subscribe((strokeColor: string) => {
            this.strokeColor = strokeColor;
            this.updateTraceType(this.traceType);
        });
    }

    onMouseMove(event: MouseEvent): void {
        this.currentMouseX = event.clientX - this.svgReference.nativeElement.getBoundingClientRect().left;
        this.currentMouseY = event.clientY - this.svgReference.nativeElement.getBoundingClientRect().top;

        if (this.isPreviewing) {
            this.updateDrawing();
        }
    }

    onMouseDown(event: MouseEvent): void {
        const button = event.button;

        if (button === Mouse.LeftButton && this.isIn) {
            this.initialMouseX = this.currentMouseX;
            this.initialMouseY = this.currentMouseY;
            this.isPreviewing = true;

            this.updateDrawing();

            this.renderer.appendChild(this.svgReference.nativeElement, this.previewRectangle);
            this.renderer.appendChild(this.svgReference.nativeElement, this.drawRectangle);
        }
    }

    onMouseUp(event: MouseEvent): void {
        const button = event.button;

        if (button === Mouse.LeftButton && this.isIn) {
            if (this.previewRectangle.width.baseVal.value > 0 || this.previewRectangle.height.baseVal.value > 0) {
                this.createSVG();
            }
            this.isPreviewing = false;
            this.isSquarePreview = false;
            this.renderer.removeChild(this.svgReference.nativeElement, this.previewRectangle);
            this.renderer.removeChild(this.svgReference, this.drawRectangle);
        }
    }

    onMouseEnter(event: MouseEvent): void {
        this.isIn = true;
    }

    onMouseLeave(event: MouseEvent): void {
        this.isIn = false;
    }

    onKeyDown(event: KeyboardEvent): void {
        const key = event.key;

        switch (key) {
            case Keys.Shift:
                if (!this.isSquarePreview) {
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
                if (this.isSquarePreview) {
                    this.isSquarePreview = false;
                    this.updateDrawing();
                }
                break;

            default:
                break;
        }
    }

    createSVG(): void {
        const el: SVGGElement = this.renderer.createElement('g', SVG_NS);
        const drawRectangle: SVGRectElement = this.renderer.createElement('rect', SVG_NS);
        this.renderer.setAttribute(drawRectangle, 'x', this.drawRectangle.x.baseVal.valueAsString);
        this.renderer.setAttribute(drawRectangle, 'y', this.drawRectangle.y.baseVal.valueAsString);
        this.renderer.setAttribute(drawRectangle, 'width', this.drawRectangle.width.baseVal.valueAsString);
        this.renderer.setAttribute(drawRectangle, 'height', this.drawRectangle.height.baseVal.valueAsString);
        this.renderer.setAttribute(drawRectangle, 'stroke-width', this.strokeWidth.toString());
        this.renderer.setAttribute(el, 'fill', '#' + this.userFillColor);
        this.renderer.setAttribute(el, 'stroke', '#' + this.userStrokeColor);
        const currentDrawStackLength = this.drawStack.getDrawStackLength();
        drawRectangle.addEventListener('mousedown', (event: MouseEvent) => {
            this.drawStack.changeTargetElement(currentDrawStackLength);
        });

        this.renderer.appendChild(el, drawRectangle);
        this.drawStack.push(el);
        this.renderer.appendChild(this.svgReference.nativeElement, el);
    }

    updateDrawing(): void {
        this.updatePreviewRectangle();
        if (this.isSquarePreview) {
            this.updatePreviewSquare();
        } else {
            this.renderer.setAttribute(
                this.drawRectangle,
                'x',
                (this.previewRectangle.x.baseVal.value + this.strokeWidth / 2).toString(),
            );
            this.renderer.setAttribute(
                this.drawRectangle,
                'y',
                (this.previewRectangle.y.baseVal.value + this.strokeWidth / 2).toString(),
            );
            if (this.previewRectangle.width.baseVal.value - this.strokeWidth < 0) {
                this.renderer.setAttribute(
                    this.drawRectangle,
                    'width',
                    (-(this.previewRectangle.width.baseVal.value - this.strokeWidth)).toString(),
                );
            } else {
                this.renderer.setAttribute(
                    this.drawRectangle,
                    'width',
                    (this.previewRectangle.width.baseVal.value - this.strokeWidth).toString(),
                );
            }
            if (this.previewRectangle.height.baseVal.value - this.strokeWidth < 0) {
                this.renderer.setAttribute(
                    this.drawRectangle,
                    'height',
                    (-(this.previewRectangle.height.baseVal.value - this.strokeWidth)).toString(),
                );
            } else {
                this.renderer.setAttribute(
                    this.drawRectangle,
                    'height',
                    (this.previewRectangle.height.baseVal.value - this.strokeWidth).toString(),
                );
            }
        }
        this.renderer.setAttribute(this.drawRectangle, 'fill', '#' + this.userFillColor);
        this.renderer.setAttribute(this.drawRectangle, 'stroke', '#' + this.userStrokeColor);
        this.renderer.setAttribute(this.drawRectangle, 'stroke-width', this.strokeWidth.toString());
    }

    updatePreviewSquare(): void {
        let deltaX = this.currentMouseX - this.initialMouseX;
        let deltaY = this.currentMouseY - this.initialMouseY;
        const minLen = Math.min(Math.abs(deltaX), Math.abs(deltaY));

        // adjust x
        if (deltaX < 0) {
            deltaX *= -1;
            this.renderer.setAttribute(
                this.drawRectangle,
                'x',
                (this.initialMouseX - minLen + this.strokeWidth / 2).toString(),
            );
        } else {
            this.renderer.setAttribute(this.drawRectangle, 'x', (this.initialMouseX + this.strokeWidth / 2).toString());
        }

        // set width
        if (minLen - this.strokeWidth < 0) {
            this.renderer.setAttribute(this.drawRectangle, 'width', (-(minLen - this.strokeWidth)).toString());
        } else {
            this.renderer.setAttribute(this.drawRectangle, 'width', (minLen - this.strokeWidth).toString());
        }

        // adjust y
        if (deltaY < 0) {
            deltaY *= -1;
            this.renderer.setAttribute(
                this.drawRectangle,
                'y',
                (this.initialMouseY - minLen + this.strokeWidth / 2).toString(),
            );
        } else {
            this.renderer.setAttribute(this.drawRectangle, 'y', (this.initialMouseY + this.strokeWidth / 2).toString());
        }

        // set height
        if (minLen - this.strokeWidth < 0) {
            this.renderer.setAttribute(this.drawRectangle, 'height', (-(minLen - this.strokeWidth)).toString());
        } else {
            this.renderer.setAttribute(this.drawRectangle, 'height', (minLen - this.strokeWidth).toString());
        }
    }

    updateTraceType(traceType: string) {
        this.traceType = traceType;
        switch (traceType) {
            case TraceType.Outline: {
                this.userFillColor = 'ffffff00';
                this.userStrokeColor = this.strokeColor;
                break;
            }
            case TraceType.Full: {
                this.userFillColor = this.fillColor;
                this.userStrokeColor = 'ffffff00';
                break;
            }
            case TraceType.Both: {
                this.userFillColor = this.fillColor;
                this.userStrokeColor = this.strokeColor;
                break;
            }
        }
    }
}
