import { ElementRef, Injectable, Renderer2 } from '@angular/core';
import { Mouse, SVG_NS, Keys } from 'src/constants/constants';
import { ToolName, TraceType } from 'src/constants/tool-constants';
import { DrawStackService } from '../../draw-stack/draw-stack.service';
import { AbstractShapeToolService } from '../abstract-tools/abstract-shape-tool/abstract-shape-tool.service';
import { AttributesManagerService } from '../attributes-manager/attributes-manager.service';
import { ColorToolService } from '../color-tool/color-tool.service';

@Injectable({
    providedIn: 'root',
})
export class EllipsisToolService extends AbstractShapeToolService {
    attributesManagerService: AttributesManagerService;
    colorToolService: ColorToolService;

    traceType = '';
    userStrokeWidth = 0;
    strokeWidth = 0;
    userStrokeColor = '';
    strokeColor = '';
    userFillColor = '';
    fillColor = '';

    isCirclePreview = false;

    drawEllipse: SVGEllipseElement = this.renderer.createElement('ellipse', SVG_NS);

    constructor(public drawStack: DrawStackService, public svgReference: ElementRef<SVGElement>, renderer: Renderer2) {
        super(renderer);
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
                this.userFillColor = 'ffffff00';
                this.userStrokeColor = this.strokeColor;
                this.userStrokeWidth = this.strokeWidth;
                break;
            }
            case TraceType.Full: {
                this.userFillColor = this.fillColor;
                this.userStrokeColor = 'ffffff00';
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
            'rx',
            Math.abs(this.previewRectangleWidth / 2 - this.userStrokeWidth / 2).toString(),
        );
        this.renderer.setAttribute(
            this.drawEllipse,
            'ry',
            Math.abs(this.previewRectangleHeight / 2 - this.userStrokeWidth / 2).toString(),
        );

        this.renderer.setAttribute(
            this.drawEllipse,
            'cx',
            (this.previewRectangleX + this.previewRectangleWidth / 2).toString(),
        );
        this.renderer.setAttribute(
            this.drawEllipse,
            'cy',
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
                'cx',
                (this.previewRectangleX + (this.previewRectangleWidth - (minLength / 2))).toString(),
            );
        } else {
            this.renderer.setAttribute(
                this.drawEllipse,
                'cx',
                (this.previewRectangleX + minLength / 2).toString(),
            );
        }

        if (deltaY < 0) {
            this.renderer.setAttribute(
                this.drawEllipse,
                'cy',
                (this.previewRectangleY + (this.previewRectangleHeight - (minLength / 2))).toString(),
            );
        } else {
            this.renderer.setAttribute(
                this.drawEllipse,
                'cy',
                (this.previewRectangleY + minLength / 2).toString(),
            );
        }

        this.renderer.setAttribute(
            this.drawEllipse,
            'rx',
            Math.abs(minLength / 2 - this.userStrokeWidth / 2).toString(),
        );
        this.renderer.setAttribute(
            this.drawEllipse,
            'ry',
            Math.abs(minLength / 2 - this.userStrokeWidth / 2).toString(),
        );
    }

    renderDrawEllipsis(): void {
        if (this.isValideEllipse()) {
            this.renderer.setAttribute(this.drawEllipse, 'fill', '#' + this.userFillColor);
            this.renderer.setAttribute(this.drawEllipse, 'stroke', '#' + this.userStrokeColor);
            this.renderer.setAttribute(this.drawEllipse, 'stroke-width', this.userStrokeWidth.toString());
        } else {
            this.renderer.setAttribute(this.drawEllipse, 'fill', 'none');
            this.renderer.setAttribute(this.drawEllipse, 'stroke', 'none');
            this.renderer.setAttribute(this.drawEllipse, 'stroke-width', '0');
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
        this.currentMouseX = event.clientX - this.svgReference.nativeElement.getBoundingClientRect().left;
        this.currentMouseY = event.clientY - this.svgReference.nativeElement.getBoundingClientRect().top;

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
            this.renderer.appendChild(this.svgReference.nativeElement, this.drawEllipse);
            this.renderer.appendChild(this.svgReference.nativeElement, this.previewRectangle);
        }
    }

    onMouseUp(event: MouseEvent): void {
        const button = event.button;

        if (button === Mouse.LeftButton) {
            this.renderer.removeChild(this.svgReference.nativeElement, this.drawEllipse);
            this.renderer.removeChild(this.svgReference.nativeElement, this.previewRectangle);
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
        this.renderer.setAttribute(drawEllipse, 'cx', this.drawEllipseCenterX.toString());
        this.renderer.setAttribute(drawEllipse, 'cy', this.drawEllipseCenterY.toString());
        this.renderer.setAttribute(drawEllipse, 'rx', this.drawEllipseRadiusX.toString());
        this.renderer.setAttribute(drawEllipse, 'ry', this.drawEllipseRadiusY.toString());
        this.renderer.setAttribute(el, 'stroke-width', this.userStrokeWidth.toString());
        this.renderer.setAttribute(el, 'fill', '#' + this.userFillColor);
        this.renderer.setAttribute(el, 'stroke', '#' + this.userStrokeColor);
        this.renderer.setAttribute(el, 'title', ToolName.Ellipsis);

        this.renderer.appendChild(el, drawEllipse);
        this.drawStack.push(el);
        this.renderer.appendChild(this.svgReference.nativeElement, el);
    }
}
