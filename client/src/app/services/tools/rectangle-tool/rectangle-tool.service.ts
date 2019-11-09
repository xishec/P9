import { ElementRef, Injectable, Renderer2 } from '@angular/core';

import { Keys, Mouse, SVG_NS } from 'src/constants/constants';
import { HTMLAttribute, ToolName, TraceType } from 'src/constants/tool-constants';
import { DrawStackService } from '../../draw-stack/draw-stack.service';
import { AbstractShapeToolService } from '../abstract-tools/abstract-shape-tool/abstract-shape-tool.service';
import { AttributesManagerService } from '../attributes-manager/attributes-manager.service';
import { ColorToolService } from '../color-tool/color-tool.service';

@Injectable({
    providedIn: 'root',
})
export class RectangleToolService extends AbstractShapeToolService {
    drawRectangle: SVGRectElement;
    fillColor = '';
    strokeColor = '';
    strokeWidth = 0;
    userFillColor = '';
    userStrokeColor = '';
    userStrokeWidth = 0;
    traceType = '';
    isSquarePreview = false;
    attributesManagerService: AttributesManagerService;
    colorToolService: ColorToolService;

    constructor() {
        super();
    }

    initializeService(elementRef: ElementRef<SVGElement>, renderer: Renderer2, drawStack: DrawStackService) {
        super.initializeService(elementRef, renderer, drawStack);
        this.drawRectangle = this.renderer.createElement('rect', SVG_NS);
    }

    initializeAttributesManagerService(attributesManagerService: AttributesManagerService): void {
        this.attributesManagerService = attributesManagerService;
        this.attributesManagerService.currentThickness.subscribe((thickness: number) => {
            this.strokeWidth = thickness;
            this.updateTraceType(this.traceType);
        });
        this.attributesManagerService.currentTraceType.subscribe((traceType: string) => {
            this.updateTraceType(traceType);
        });
    }

    initializeColorToolService(colorToolService: ColorToolService): void {
        this.colorToolService = colorToolService;
        this.colorToolService.primaryColor.subscribe((fillColor: string) => {
            this.fillColor = fillColor;
            this.updateTraceType(this.traceType);
        });
        this.colorToolService.secondaryColor.subscribe((strokeColor: string) => {
            this.strokeColor = strokeColor;
            this.updateTraceType(this.traceType);
        });
    }

    isValidRectangle(): boolean {
        const isValidPreviewHeight = this.previewRectangleHeight >= 2 * this.userStrokeWidth;
        const isValidPreviewWidth = this.previewRectangleWidth >= 2 * this.userStrokeWidth;

        return (
            isValidPreviewWidth && isValidPreviewHeight && (this.drawRectangleWidth > 0 || this.drawRectangleHeight > 0)
        );
    }

    copyPreviewRectangleAttributes(): void {
        this.renderer.setAttribute(
            this.drawRectangle,
            'x',
            (this.previewRectangleX + this.userStrokeWidth / 2).toString()
        );
        this.renderer.setAttribute(
            this.drawRectangle,
            'y',
            (this.previewRectangleY + this.userStrokeWidth / 2).toString()
        );
        if (this.previewRectangleWidth - this.userStrokeWidth < 0) {
            this.renderer.setAttribute(
                this.drawRectangle,
                HTMLAttribute.width,
                (-(this.previewRectangleWidth - this.userStrokeWidth)).toString()
            );
        } else {
            this.renderer.setAttribute(
                this.drawRectangle,
                HTMLAttribute.width,
                (this.previewRectangleWidth - this.userStrokeWidth).toString()
            );
        }
        if (this.previewRectangleHeight - this.userStrokeWidth < 0) {
            this.renderer.setAttribute(
                this.drawRectangle,
                HTMLAttribute.height,
                (-(this.previewRectangleHeight - this.userStrokeWidth)).toString()
            );
        } else {
            this.renderer.setAttribute(
                this.drawRectangle,
                HTMLAttribute.height,
                (this.previewRectangleHeight - this.userStrokeWidth).toString()
            );
        }
    }

    renderDrawRectangle(): void {
        if (this.isValidRectangle()) {
            this.userFillColor === 'none'
                ? this.renderer.setAttribute(this.drawRectangle, HTMLAttribute.fill, this.userFillColor)
                : this.renderer.setAttribute(this.drawRectangle, HTMLAttribute.fill, '#' + this.userFillColor);
            this.renderer.setAttribute(this.drawRectangle, HTMLAttribute.stroke, '#' + this.userStrokeColor);
            this.renderer.setAttribute(this.drawRectangle, HTMLAttribute.stroke_width, this.userStrokeWidth.toString());
        } else {
            this.renderer.setAttribute(this.drawRectangle, HTMLAttribute.fill, 'none');
            this.renderer.setAttribute(this.drawRectangle, HTMLAttribute.stroke, 'none');
            this.renderer.setAttribute(this.drawRectangle, HTMLAttribute.stroke_width, '0');
        }
    }

    cleanUp(): void {
        this.isPreviewing = false;
        this.renderer.removeChild(this.elementRef.nativeElement, this.previewRectangle);
        this.renderer.removeChild(this.elementRef, this.drawRectangle);
        this.disableDrawRectangle();
    }

    disableDrawRectangle(): void {
        this.renderer.setAttribute(this.drawRectangle, 'width', '0');
        this.renderer.setAttribute(this.drawRectangle, 'height', '0');
    }

    createSVG(): void {
        const el: SVGGElement = this.renderer.createElement('g', SVG_NS);
        const drawRectangle: SVGRectElement = this.renderer.createElement('rect', SVG_NS);
        this.renderer.setAttribute(drawRectangle, 'x', this.drawRectangleX.toString());
        this.renderer.setAttribute(drawRectangle, 'y', this.drawRectangleY.toString());
        this.renderer.setAttribute(drawRectangle, HTMLAttribute.width, this.drawRectangleWidth.toString());
        this.renderer.setAttribute(drawRectangle, HTMLAttribute.height, this.drawRectangleHeight.toString());
        this.userFillColor === 'none'
            ? this.renderer.setAttribute(el, HTMLAttribute.fill, this.userFillColor)
            : this.renderer.setAttribute(el, HTMLAttribute.fill, '#' + this.userFillColor);

        this.renderer.setAttribute(el, HTMLAttribute.stroke_width, this.userStrokeWidth.toString());
        this.renderer.setAttribute(el, HTMLAttribute.stroke, '#' + this.userStrokeColor);
        this.renderer.setAttribute(el, HTMLAttribute.title, ToolName.Rectangle);
        this.renderer.appendChild(el, drawRectangle);
        this.drawStack.push(el);
        this.renderer.appendChild(this.elementRef.nativeElement, el);
    }

    updateDrawing(): void {
        this.updatePreviewRectangle();
        if (this.isSquarePreview) {
            this.updatePreviewSquare();
        } else {
            this.copyPreviewRectangleAttributes();
        }
        this.renderDrawRectangle();
    }

    updatePreviewSquare(): void {
        const deltaX = this.currentMouseCoords.x - this.initialMouseCoords.x;
        const deltaY = this.currentMouseCoords.y - this.initialMouseCoords.y;
        const minLength = Math.min(Math.abs(deltaX), Math.abs(deltaY));

        if (deltaX < 0) {
            this.renderer.setAttribute(
                this.drawRectangle,
                'x',
                (this.initialMouseCoords.x - minLength + this.userStrokeWidth / 2).toString()
            );
        } else {
            this.renderer.setAttribute(
                this.drawRectangle,
                'x',
                (this.initialMouseCoords.x + this.userStrokeWidth / 2).toString()
            );
        }

        if (deltaY < 0) {
            this.renderer.setAttribute(
                this.drawRectangle,
                'y',
                (this.initialMouseCoords.y - minLength + this.userStrokeWidth / 2).toString()
            );
        } else {
            this.renderer.setAttribute(
                this.drawRectangle,
                'y',
                (this.initialMouseCoords.y + this.userStrokeWidth / 2).toString()
            );
        }

        this.renderer.setAttribute(
            this.drawRectangle,
            HTMLAttribute.height,
            Math.abs(minLength - this.userStrokeWidth).toString()
        );
        this.renderer.setAttribute(
            this.drawRectangle,
            HTMLAttribute.width,
            Math.abs(minLength - this.userStrokeWidth).toString()
        );
    }

    updateTraceType(traceType: string) {
        this.traceType = traceType;
        switch (traceType) {
            case TraceType.Outline: {
                this.userFillColor = 'none';
                this.userStrokeColor = this.strokeColor;
                this.userStrokeWidth = this.strokeWidth;
                break;
            }
            case TraceType.Full: {
                this.userFillColor = this.fillColor;
                this.userStrokeColor = 'none';
                this.userStrokeWidth = 0;
                break;
            }
            case TraceType.Both: {
                this.userFillColor = this.fillColor;
                this.userStrokeColor = this.strokeColor;
                this.userStrokeWidth = this.strokeWidth;
                break;
            }
        }
    }

    get drawRectangleX(): number {
        return this.drawRectangle.x.baseVal.value;
    }

    get drawRectangleY(): number {
        return this.drawRectangle.y.baseVal.value;
    }

    get drawRectangleWidth(): number {
        return this.drawRectangle.width.baseVal.value;
    }

    get drawRectangleHeight(): number {
        return this.drawRectangle.height.baseVal.value;
    }

    onMouseMove(event: MouseEvent): void {
        this.currentMouseCoords.x = event.clientX - this.elementRef.nativeElement.getBoundingClientRect().left;
        this.currentMouseCoords.y = event.clientY - this.elementRef.nativeElement.getBoundingClientRect().top;

        if (this.isPreviewing) {
            this.updateDrawing();
        }
    }

    onMouseDown(event: MouseEvent): void {
        const button = event.button;

        if (button === Mouse.LeftButton && this.isMouseInRef(event, this.elementRef)) {
            this.initialMouseCoords.x = this.currentMouseCoords.x;
            this.initialMouseCoords.y = this.currentMouseCoords.y;
            this.isPreviewing = true;

            this.updateDrawing();

            this.renderer.appendChild(this.elementRef.nativeElement, this.previewRectangle);
            this.renderer.appendChild(this.elementRef.nativeElement, this.drawRectangle);
        }
    }

    onMouseUp(event: MouseEvent): void {
        const button = event.button;
        if (button === Mouse.LeftButton && this.isMouseInRef(event, this.elementRef) && this.isValidRectangle()) {
            this.createSVG();
        }
        this.cleanUp();
    }

    onMouseEnter(event: MouseEvent): void {}

    onMouseLeave(event: MouseEvent): void {}

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
}
