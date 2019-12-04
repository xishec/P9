import { ElementRef, Injectable, Renderer2 } from '@angular/core';

import { KEYS, MOUSE, SVG_NS } from 'src/constants/constants';
import { HTML_ATTRIBUTE, TOOL_NAME, TRACE_TYPE } from 'src/constants/tool-constants';
import { DrawStackService } from '../../draw-stack/draw-stack.service';
import { AbstractShapeToolService } from '../abstract-tools/abstract-shape-tool/abstract-shape-tool.service';
import { AttributesManagerService } from '../attributes-manager/attributes-manager.service';
import { ColorToolService } from '../color-tool/color-tool.service';

@Injectable({
    providedIn: 'root',
})
export class RectangleToolService extends AbstractShapeToolService {
    private drawRectangle: SVGRectElement;
    private fillColor = '';
    private strokeColor = '';
    private strokeWidth = 0;
    private userFillColor = '';
    private userStrokeColor = '';
    private userStrokeWidth = 0;
    private traceType = '';
    private isSquarePreview = false;
    private attributesManagerService: AttributesManagerService;

    constructor(private colorToolService: ColorToolService) {
        super();
        this.colorToolService.primaryColor.subscribe((fillColor: string) => {
            this.fillColor = fillColor;
            this.updateTraceType(this.traceType);
        });
        this.colorToolService.secondaryColor.subscribe((strokeColor: string) => {
            this.strokeColor = strokeColor;
            this.updateTraceType(this.traceType);
        });
    }

    initializeService(elementRef: ElementRef<SVGElement>, renderer: Renderer2, drawStack: DrawStackService) {
        super.initializeService(elementRef, renderer, drawStack);
        this.drawRectangle = this.renderer.createElement('rect', SVG_NS);
    }

    initializeAttributesManagerService(attributesManagerService: AttributesManagerService): void {
        this.attributesManagerService = attributesManagerService;
        this.attributesManagerService.thickness.subscribe((thickness: number) => {
            this.strokeWidth = thickness;
            this.updateTraceType(this.traceType);
        });
        this.attributesManagerService.traceType.subscribe((traceType: string) => {
            this.updateTraceType(traceType);
        });
    }

    private isValidRectangle(): boolean {
        const isValidPreviewHeight = this.previewRectangleHeight >= 2 * this.userStrokeWidth;
        const isValidPreviewWidth = this.previewRectangleWidth >= 2 * this.userStrokeWidth;

        return (
            isValidPreviewWidth && isValidPreviewHeight && (this.drawRectangleWidth > 0 || this.drawRectangleHeight > 0)
        );
    }

    private copyPreviewRectangleAttributes(): void {
        this.renderer.setAttribute(
            this.drawRectangle,
            HTML_ATTRIBUTE.X,
            (this.previewRectangleX + this.userStrokeWidth / 2).toString(),
        );
        this.renderer.setAttribute(
            this.drawRectangle,
            HTML_ATTRIBUTE.Y,
            (this.previewRectangleY + this.userStrokeWidth / 2).toString(),
        );
        if (this.previewRectangleWidth - this.userStrokeWidth < 0) {
            this.renderer.setAttribute(
                this.drawRectangle,
                HTML_ATTRIBUTE.Width,
                (-(this.previewRectangleWidth - this.userStrokeWidth)).toString(),
            );
        } else {
            this.renderer.setAttribute(
                this.drawRectangle,
                HTML_ATTRIBUTE.Width,
                (this.previewRectangleWidth - this.userStrokeWidth).toString(),
            );
        }
        if (this.previewRectangleHeight - this.userStrokeWidth < 0) {
            this.renderer.setAttribute(
                this.drawRectangle,
                HTML_ATTRIBUTE.Height,
                (-(this.previewRectangleHeight - this.userStrokeWidth)).toString(),
            );
        } else {
            this.renderer.setAttribute(
                this.drawRectangle,
                HTML_ATTRIBUTE.Height,
                (this.previewRectangleHeight - this.userStrokeWidth).toString(),
            );
        }
    }

    private renderDrawRectangle(): void {
        if (this.isValidRectangle()) {
            this.userFillColor === 'none'
                ? this.renderer.setAttribute(this.drawRectangle, HTML_ATTRIBUTE.Fill, this.userFillColor)
                : this.renderer.setAttribute(this.drawRectangle, HTML_ATTRIBUTE.Fill, '#' + this.userFillColor);
            this.renderer.setAttribute(this.drawRectangle, HTML_ATTRIBUTE.Stroke, '#' + this.userStrokeColor);
            this.renderer.setAttribute(
                this.drawRectangle,
                HTML_ATTRIBUTE.StrokeWidth,
                this.userStrokeWidth.toString(),
            );
        } else {
            this.renderer.setAttribute(this.drawRectangle, HTML_ATTRIBUTE.Fill, 'none');
            this.renderer.setAttribute(this.drawRectangle, HTML_ATTRIBUTE.Stroke, 'none');
            this.renderer.setAttribute(this.drawRectangle, HTML_ATTRIBUTE.StrokeWidth, '0');
        }
    }

    cleanUp(): void {
        this.isPreviewing = false;
        this.renderer.removeChild(this.elementRef.nativeElement, this.previewRectangle);
        this.renderer.removeChild(this.elementRef, this.drawRectangle);
        this.makeDrawRectangleInvalid();
    }

    private makeDrawRectangleInvalid(): void {
        this.renderer.setAttribute(this.drawRectangle, HTML_ATTRIBUTE.Width, '0');
        this.renderer.setAttribute(this.drawRectangle, HTML_ATTRIBUTE.Height, '0');
    }

    createSVG(): void {
        const el: SVGGElement = this.renderer.createElement('g', SVG_NS);
        const drawRectangle: SVGRectElement = this.renderer.createElement('rect', SVG_NS);
        this.renderer.setAttribute(drawRectangle, HTML_ATTRIBUTE.X, this.drawRectangleX.toString());
        this.renderer.setAttribute(drawRectangle, HTML_ATTRIBUTE.Y, this.drawRectangleY.toString());
        this.renderer.setAttribute(drawRectangle, HTML_ATTRIBUTE.Width, this.drawRectangleWidth.toString());
        this.renderer.setAttribute(drawRectangle, HTML_ATTRIBUTE.Height, this.drawRectangleHeight.toString());
        this.userFillColor === 'none'
            ? this.renderer.setAttribute(el, HTML_ATTRIBUTE.Fill, this.userFillColor)
            : this.renderer.setAttribute(el, HTML_ATTRIBUTE.Fill, '#' + this.userFillColor);

        this.renderer.setAttribute(el, HTML_ATTRIBUTE.StrokeWidth, this.userStrokeWidth.toString());
        this.renderer.setAttribute(el, HTML_ATTRIBUTE.Stroke, '#' + this.userStrokeColor);
        this.renderer.setAttribute(el, HTML_ATTRIBUTE.Title, TOOL_NAME.Rectangle);
        this.renderer.appendChild(el, drawRectangle);
        this.renderer.appendChild(this.elementRef.nativeElement, el);

        setTimeout(() => {
            this.drawStack.push(el);
        }, 0);
    }

    private updateDrawing(): void {
        this.updatePreviewRectangle();
        if (this.isSquarePreview) {
            this.updatePreviewSquare();
        } else {
            this.copyPreviewRectangleAttributes();
        }
        this.renderDrawRectangle();
    }

    private updatePreviewSquare(): void {
        const deltaX = this.currentMouseCoords.x - this.initialMouseCoords.x;
        const deltaY = this.currentMouseCoords.y - this.initialMouseCoords.y;
        const minLength = Math.min(Math.abs(deltaX), Math.abs(deltaY));

        if (deltaX < 0) {
            this.renderer.setAttribute(
                this.drawRectangle,
                HTML_ATTRIBUTE.X,
                (this.initialMouseCoords.x - minLength + this.userStrokeWidth / 2).toString(),
            );
        } else {
            this.renderer.setAttribute(
                this.drawRectangle,
                HTML_ATTRIBUTE.X,
                (this.initialMouseCoords.x + this.userStrokeWidth / 2).toString(),
            );
        }

        if (deltaY < 0) {
            this.renderer.setAttribute(
                this.drawRectangle,
                HTML_ATTRIBUTE.Y,
                (this.initialMouseCoords.y - minLength + this.userStrokeWidth / 2).toString(),
            );
        } else {
            this.renderer.setAttribute(
                this.drawRectangle,
                HTML_ATTRIBUTE.Y,
                (this.initialMouseCoords.y + this.userStrokeWidth / 2).toString(),
            );
        }

        this.renderer.setAttribute(
            this.drawRectangle,
            HTML_ATTRIBUTE.Height,
            Math.abs(minLength - this.userStrokeWidth).toString(),
        );
        this.renderer.setAttribute(
            this.drawRectangle,
            HTML_ATTRIBUTE.Width,
            Math.abs(minLength - this.userStrokeWidth).toString(),
        );
    }

    private updateTraceType(traceType: string) {
        this.traceType = traceType;
        switch (traceType) {
            case TRACE_TYPE.Outline: {
                this.userFillColor = 'none';
                this.userStrokeColor = this.strokeColor;
                this.userStrokeWidth = this.strokeWidth;
                break;
            }
            case TRACE_TYPE.Full: {
                this.userFillColor = this.fillColor;
                this.userStrokeColor = 'none';
                this.userStrokeWidth = 0;
                break;
            }
            case TRACE_TYPE.Both: {
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

        if (button === MOUSE.LeftButton && this.isMouseInRef(event, this.elementRef)) {
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
        if (button === MOUSE.LeftButton && this.isMouseInRef(event, this.elementRef) && this.isValidRectangle()) {
            this.createSVG();
        }
        this.cleanUp();
    }

    // tslint:disable-next-line: no-empty
    onMouseEnter(event: MouseEvent): void {}
    // tslint:disable-next-line: no-empty
    onMouseLeave(event: MouseEvent): void {}

    onKeyDown(event: KeyboardEvent): void {
        const key = event.key;

        if (key === KEYS.Shift) {
            if (!this.isSquarePreview) {
                this.isSquarePreview = true;
                this.updateDrawing();
            }
        }
    }

    onKeyUp(event: KeyboardEvent): void {
        const key = event.key;

        if (key === KEYS.Shift) {
            if (this.isSquarePreview) {
                this.isSquarePreview = false;
                this.updateDrawing();
            }
        }
    }
}
