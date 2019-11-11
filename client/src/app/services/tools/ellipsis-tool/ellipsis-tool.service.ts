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
        this.attributesManagerService.currentThickness.subscribe((thickness: number) => {
            this.strokeWidth = thickness;
            this.updateTraceType(this.traceType);
        });
        this.attributesManagerService.currentTraceType.subscribe((traceType: string) => {
            this.updateTraceType(traceType);
        });
    }

    isValideEllipse(): boolean {
        const radiusX = this.previewRectangleWidth;
        const radiusY = this.previewRectangleHeight;

        return (
            radiusX >= 2 * this.userStrokeWidth && radiusY >= 2 * this.userStrokeWidth && (radiusX > 0 || radiusY > 0)
        );
    }

    updateTraceType(traceType: string): void {
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

    copyRectanglePreview(): void {
        this.renderer.setAttribute(
            this.drawEllipse,
            HTMLAttribute.rx,
            Math.abs(this.previewRectangleWidth / 2 - this.userStrokeWidth / 2).toString(),
        );
        this.renderer.setAttribute(
            this.drawEllipse,
            HTMLAttribute.ry,
            Math.abs(this.previewRectangleHeight / 2 - this.userStrokeWidth / 2).toString(),
        );

        this.renderer.setAttribute(
            this.drawEllipse,
            HTMLAttribute.cx,
            (this.previewRectangleX + this.previewRectangleWidth / 2).toString(),
        );
        this.renderer.setAttribute(
            this.drawEllipse,
            HTMLAttribute.cy,
            (this.previewRectangleY + this.previewRectangleHeight / 2).toString(),
        );
    }

    updatePreviewCircle(): void {
        const deltaX = this.currentMouseX - this.initialMouseX;
        const deltaY = this.currentMouseY - this.initialMouseY;
        const minLength = Math.min(this.previewRectangleWidth, this.previewRectangleHeight);

        if (deltaX < 0) {
            this.renderer.setAttribute(
                this.drawEllipse,
                HTMLAttribute.cx,
                (this.previewRectangleX + (this.previewRectangleWidth - minLength / 2)).toString(),
            );
        } else {
            this.renderer.setAttribute(
                this.drawEllipse,
                HTMLAttribute.cx,
                (this.previewRectangleX + minLength / 2).toString(),
            );
        }

        if (deltaY < 0) {
            this.renderer.setAttribute(
                this.drawEllipse,
                HTMLAttribute.cy,
                (this.previewRectangleY + (this.previewRectangleHeight - minLength / 2)).toString(),
            );
        } else {
            this.renderer.setAttribute(
                this.drawEllipse,
                HTMLAttribute.cy,
                (this.previewRectangleY + minLength / 2).toString(),
            );
        }

        this.renderer.setAttribute(
            this.drawEllipse,
            HTMLAttribute.rx,
            Math.abs(minLength / 2 - this.userStrokeWidth / 2).toString(),
        );
        this.renderer.setAttribute(
            this.drawEllipse,
            HTMLAttribute.ry,
            Math.abs(minLength / 2 - this.userStrokeWidth / 2).toString(),
        );
    }

    renderDrawEllipsis(): void {
        if (this.isValideEllipse()) {
            this.userFillColor === 'none'
                ? this.renderer.setAttribute(this.drawEllipse, HTMLAttribute.fill, this.userFillColor)
                : this.renderer.setAttribute(this.drawEllipse, HTMLAttribute.fill, '#' + this.userFillColor);
            this.renderer.setAttribute(this.drawEllipse, HTMLAttribute.stroke, '#' + this.userStrokeColor);
            this.renderer.setAttribute(this.drawEllipse, HTMLAttribute.stroke_width, this.userStrokeWidth.toString());
        } else {
            this.renderer.setAttribute(this.drawEllipse, HTMLAttribute.fill, 'none');
            this.renderer.setAttribute(this.drawEllipse, HTMLAttribute.stroke, 'none');
            this.renderer.setAttribute(this.drawEllipse, HTMLAttribute.stroke_width, '0');
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
        this.currentMouseX = event.clientX - this.elementRef.nativeElement.getBoundingClientRect().left;
        this.currentMouseY = event.clientY - this.elementRef.nativeElement.getBoundingClientRect().top;

        if (this.isPreviewing) {
            this.updateDrawing();
        }
    }

    onMouseDown(event: MouseEvent): void {
        const button = event.button;

        if (button === Mouse.LeftButton) {
            this.initialMouseX = this.currentMouseX;
            this.initialMouseY = this.currentMouseY;
            this.isPreviewing = true;
            this.updateDrawing();
            this.renderer.appendChild(this.elementRef.nativeElement, this.drawEllipse);
            this.renderer.appendChild(this.elementRef.nativeElement, this.previewRectangle);
        }
    }

    onMouseUp(event: MouseEvent): void {
        const button = event.button;

        if (button === Mouse.LeftButton) {
            this.renderer.removeChild(this.elementRef.nativeElement, this.drawEllipse);
            this.renderer.removeChild(this.elementRef.nativeElement, this.previewRectangle);
            this.isPreviewing = false;
            if (this.isValideEllipse() && this.isIn) {
                this.createSVG();
            }
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

        if (key === Keys.Shift) {
            if (!this.isCirclePreview) {
                this.isCirclePreview = true;
                this.updateDrawing();
            }
        }
    }

    onKeyUp(event: KeyboardEvent): void {
        const key = event.key;

        if (key === Keys.Shift) {
            if (this.isCirclePreview) {
                this.isCirclePreview = false;
                this.updateDrawing();
            }
        }
    }

    createSVG(): void {
        const el: SVGGElement = this.renderer.createElement('g', SVG_NS);
        const drawEllipse: SVGEllipseElement = this.renderer.createElement('ellipse', SVG_NS);
        this.renderer.setAttribute(drawEllipse, HTMLAttribute.cx, this.drawEllipseCenterX.toString());
        this.renderer.setAttribute(drawEllipse, HTMLAttribute.cy, this.drawEllipseCenterY.toString());
        this.renderer.setAttribute(drawEllipse, HTMLAttribute.rx, this.drawEllipseRadiusX.toString());
        this.renderer.setAttribute(drawEllipse, HTMLAttribute.ry, this.drawEllipseRadiusY.toString());
        this.renderer.setAttribute(el, HTMLAttribute.stroke_width, this.userStrokeWidth.toString());
        this.userFillColor === 'none'
            ? this.renderer.setAttribute(el, HTMLAttribute.fill, this.userFillColor)
            : this.renderer.setAttribute(el, HTMLAttribute.fill, '#' + this.userFillColor);
        this.renderer.setAttribute(el, HTMLAttribute.stroke, '#' + this.userStrokeColor);
        this.renderer.setAttribute(el, HTMLAttribute.title, ToolName.Ellipsis);

        this.renderer.appendChild(el, drawEllipse);
        this.drawStack.push(el);
        this.renderer.appendChild(this.elementRef.nativeElement, el);
    }

    cleanUp(): void {
        this.renderer.removeChild(this.elementRef, this.previewRectangle);
        this.renderer.removeChild(this.elementRef, this.drawEllipse);
        this.isPreviewing = false;
    }
}
