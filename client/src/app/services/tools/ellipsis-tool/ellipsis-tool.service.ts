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
export class EllipsisToolService extends AbstractShapeToolService {
    attributesManagerService: AttributesManagerService;

    traceType = '';
    userStrokeWidth = 0;
    strokeWidth = 0;
    userStrokeColor = '';
    strokeColor = '';
    userFillColor = '';
    fillColor = '';

    isCirclePreview = false;

    drawEllipse: SVGEllipseElement;

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
        this.drawEllipse = this.renderer.createElement('ellipse', SVG_NS);
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

    isValidEllipse(): boolean {
        const isValidRadiusX = this.previewRectangleWidth >= 2 * this.userStrokeWidth;
        const isValidRadiusY = this.previewRectangleHeight >= 2 * this.userStrokeWidth;

        return isValidRadiusX && isValidRadiusY && (this.drawEllipseRadiusX > 0 || this.drawEllipseRadiusY > 0);
    }

    makeEllipseInvalid(): void {
        this.renderer.setAttribute(this.drawEllipse, HTML_ATTRIBUTE.rx, '0');
        this.renderer.setAttribute(this.drawEllipse, HTML_ATTRIBUTE.ry, '0');
    }

    updateTraceType(traceType: string): void {
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

    copyRectanglePreview(): void {
        this.renderer.setAttribute(
            this.drawEllipse,
            HTML_ATTRIBUTE.rx,
            Math.abs(this.previewRectangleWidth / 2 - this.userStrokeWidth / 2).toString(),
        );
        this.renderer.setAttribute(
            this.drawEllipse,
            HTML_ATTRIBUTE.ry,
            Math.abs(this.previewRectangleHeight / 2 - this.userStrokeWidth / 2).toString(),
        );

        this.renderer.setAttribute(
            this.drawEllipse,
            HTML_ATTRIBUTE.cx,
            (this.previewRectangleX + this.previewRectangleWidth / 2).toString(),
        );
        this.renderer.setAttribute(
            this.drawEllipse,
            HTML_ATTRIBUTE.cy,
            (this.previewRectangleY + this.previewRectangleHeight / 2).toString(),
        );
    }

    updatePreviewCircle(): void {
        const deltaX = this.currentMouseCoords.x - this.initialMouseCoords.x;
        const deltaY = this.currentMouseCoords.y - this.initialMouseCoords.y;
        const minLength = Math.min(this.previewRectangleWidth, this.previewRectangleHeight);

        if (deltaX < 0) {
            this.renderer.setAttribute(
                this.drawEllipse,
                HTML_ATTRIBUTE.cx,
                (this.previewRectangleX + (this.previewRectangleWidth - minLength / 2)).toString(),
            );
        } else {
            this.renderer.setAttribute(
                this.drawEllipse,
                HTML_ATTRIBUTE.cx,
                (this.previewRectangleX + minLength / 2).toString(),
            );
        }

        if (deltaY < 0) {
            this.renderer.setAttribute(
                this.drawEllipse,
                HTML_ATTRIBUTE.cy,
                (this.previewRectangleY + (this.previewRectangleHeight - minLength / 2)).toString(),
            );
        } else {
            this.renderer.setAttribute(
                this.drawEllipse,
                HTML_ATTRIBUTE.cy,
                (this.previewRectangleY + minLength / 2).toString(),
            );
        }

        this.renderer.setAttribute(
            this.drawEllipse,
            HTML_ATTRIBUTE.rx,
            Math.abs(minLength / 2 - this.userStrokeWidth / 2).toString(),
        );
        this.renderer.setAttribute(
            this.drawEllipse,
            HTML_ATTRIBUTE.ry,
            Math.abs(minLength / 2 - this.userStrokeWidth / 2).toString(),
        );
    }

    renderDrawEllipsis(): void {
        if (this.isValidEllipse()) {
            this.userFillColor === 'none'
                ? this.renderer.setAttribute(this.drawEllipse, HTML_ATTRIBUTE.fill, this.userFillColor)
                : this.renderer.setAttribute(this.drawEllipse, HTML_ATTRIBUTE.fill, '#' + this.userFillColor);
            this.renderer.setAttribute(this.drawEllipse, HTML_ATTRIBUTE.stroke, '#' + this.userStrokeColor);
            this.renderer.setAttribute(this.drawEllipse, HTML_ATTRIBUTE.stroke_width, this.userStrokeWidth.toString());
        } else {
            this.renderer.setAttribute(this.drawEllipse, HTML_ATTRIBUTE.fill, 'none');
            this.renderer.setAttribute(this.drawEllipse, HTML_ATTRIBUTE.stroke, 'none');
            this.renderer.setAttribute(this.drawEllipse, HTML_ATTRIBUTE.stroke_width, '0');
        }
    }

    updateDrawing(): void {
        this.updatePreviewRectangle();
        if (!this.isCirclePreview) {
            this.copyRectanglePreview();
        } else {
            this.updatePreviewCircle();
        }
        this.renderDrawEllipsis();
    }

    get drawEllipseCenterX(): number {
        return this.drawEllipse.cx.baseVal.value;
    }

    get drawEllipseCenterY(): number {
        return this.drawEllipse.cy.baseVal.value;
    }

    get drawEllipseRadiusX(): number {
        return this.drawEllipse.rx.baseVal.value;
    }

    get drawEllipseRadiusY(): number {
        return this.drawEllipse.ry.baseVal.value;
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

        if (button === MOUSE.LeftButton) {
            this.initialMouseCoords.x = this.currentMouseCoords.x;
            this.initialMouseCoords.y = this.currentMouseCoords.y;
            this.isPreviewing = true;
            this.updateDrawing();
            this.renderer.appendChild(this.elementRef.nativeElement, this.drawEllipse);
            this.renderer.appendChild(this.elementRef.nativeElement, this.previewRectangle);
        }
    }

    onMouseUp(event: MouseEvent): void {
        const button = event.button;
        if (button === MOUSE.LeftButton && this.isValidEllipse() && this.isMouseInRef(event, this.elementRef)) {
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
            this.isCirclePreview = true;
            this.updateDrawing();
        }
    }

    onKeyUp(event: KeyboardEvent): void {
        const key = event.key;

        if (key === KEYS.Shift) {
            this.isCirclePreview = false;
            this.updateDrawing();
        }
    }

    createSVG(): void {
        const el: SVGGElement = this.renderer.createElement('g', SVG_NS);
        const drawEllipse: SVGEllipseElement = this.renderer.createElement('ellipse', SVG_NS);
        this.renderer.setAttribute(drawEllipse, HTML_ATTRIBUTE.cx, this.drawEllipseCenterX.toString());
        this.renderer.setAttribute(drawEllipse, HTML_ATTRIBUTE.cy, this.drawEllipseCenterY.toString());
        this.renderer.setAttribute(drawEllipse, HTML_ATTRIBUTE.rx, this.drawEllipseRadiusX.toString());
        this.renderer.setAttribute(drawEllipse, HTML_ATTRIBUTE.ry, this.drawEllipseRadiusY.toString());
        this.renderer.setAttribute(el, HTML_ATTRIBUTE.stroke_width, this.userStrokeWidth.toString());
        this.userFillColor === 'none'
            ? this.renderer.setAttribute(el, HTML_ATTRIBUTE.fill, this.userFillColor)
            : this.renderer.setAttribute(el, HTML_ATTRIBUTE.fill, '#' + this.userFillColor);
        this.renderer.setAttribute(el, HTML_ATTRIBUTE.stroke, '#' + this.userStrokeColor);
        this.renderer.setAttribute(el, HTML_ATTRIBUTE.title, TOOL_NAME.Ellipsis);

        this.renderer.appendChild(el, drawEllipse);
        this.renderer.appendChild(this.elementRef.nativeElement, el);

        setTimeout(() => {
            this.drawStack.push(el);
        }, 0);
    }

    cleanUp(): void {
        this.renderer.removeChild(this.elementRef, this.previewRectangle);
        this.renderer.removeChild(this.elementRef, this.drawEllipse);
        this.isPreviewing = false;
        this.makeEllipseInvalid();
    }
}
