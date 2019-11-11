import { ElementRef, Injectable, Renderer2 } from '@angular/core';

import { Mouse, SVG_NS } from 'src/constants/constants';
import {
    HTMLAttribute,
    PolygonOffsetAngles,
    PolygonRadiusCorrection,
    ToolName,
    TraceType,
} from 'src/constants/tool-constants';
import { DrawStackService } from '../../draw-stack/draw-stack.service';
import { AbstractShapeToolService } from '../abstract-tools/abstract-shape-tool/abstract-shape-tool.service';
import { AttributesManagerService } from '../attributes-manager/attributes-manager.service';
import { ColorToolService } from '../color-tool/color-tool.service';
import { Coords2D } from 'src/classes/Coords2D';

@Injectable({
    providedIn: 'root',
})
export class PolygonToolService extends AbstractShapeToolService {
    drawPolygon: SVGPolygonElement;
    fillColor = '';
    strokeColor = '';
    userFillColor = '';
    userStrokeColor = '';
    userStrokeWidth = 0;
    traceType = '';
    strokeWidth = 0;
    nbVertices = 3;
    attributesManagerService: AttributesManagerService;
    radius = 0;
    radiusCorrection = 0;

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
        this.drawPolygon = this.renderer.createElement('polygon', SVG_NS);
    }

    initializeAttributesManagerService(attributesManagerService: AttributesManagerService) {
        this.attributesManagerService = attributesManagerService;
        this.attributesManagerService.currentThickness.subscribe((thickness: number) => {
            this.strokeWidth = thickness;
            this.updateTraceType(this.traceType);
        });
        this.attributesManagerService.currentTraceType.subscribe((traceType: string) => {
            this.updateTraceType(traceType);
        });
        this.attributesManagerService.currentNbVertices.subscribe((nbVertices: number) => {
            this.nbVertices = nbVertices;
        });
    }

    setRadiusCorrection() {
        const correction: number = PolygonRadiusCorrection.get(this.nbVertices) as number;
        this.radiusCorrection = this.radius * correction;
    }

    isValidePolygon(): boolean {
        const isValidHeight = this.previewRectangleHeight >= 2 * this.userStrokeWidth;
        const isValidWidth = this.previewRectangleWidth >= 2 * this.userStrokeWidth;

        return isValidWidth && isValidHeight && (this.previewRectangleWidth > 0 || this.previewRectangleHeight > 0);
    }

    makeInvalidPolygon(): void {
        this.renderer.setAttribute(this.previewRectangle, 'width', '0');
        this.renderer.setAttribute(this.previewRectangle, 'height', '0');
    }

    calculateVertex(n: number): Coords2D {
        const r = this.radius;
        const deltaX = this.currentMouseCoords.x - this.initialMouseCoords.x;
        const deltaY = this.currentMouseCoords.y - this.initialMouseCoords.y;
        let xValue;
        let yValue;
        const polygonOffsetAngles: number = PolygonOffsetAngles.get(this.nbVertices) as number;

        const cos =
            (r + this.radiusCorrection - this.strokeWidth / 2) *
            Math.cos((2 * Math.PI * n) / this.nbVertices - polygonOffsetAngles);
        if (deltaX > 0) {
            xValue = cos + this.initialMouseCoords.x + r;
        } else {
            xValue = cos + this.initialMouseCoords.x - r;
        }

        const sin =
            (r + this.radiusCorrection - this.strokeWidth / 2) *
            Math.sin((2 * Math.PI * n) / this.nbVertices - polygonOffsetAngles);
        const nbVerticesIsEven = this.nbVertices % 2 === 0;
        if (deltaY > 0) {
            yValue = sin + this.initialMouseCoords.y + (r + (nbVerticesIsEven ? 0 : this.radiusCorrection));
        } else {
            yValue = sin + this.initialMouseCoords.y - (r - (nbVerticesIsEven ? 0 : this.radiusCorrection));
        }

        return { x: xValue, y: yValue };
    }

    copyPreviewRectangleAttributes(drawPolygon: SVGPolygonElement = this.drawPolygon): void {
        let vertices = '';
        for (let n = 1; n <= this.nbVertices; n++) {
            const vertex: Coords2D = this.calculateVertex(n);
            vertices += vertex.x + ',' + vertex.y + ' ';
        }

        this.renderer.setAttribute(drawPolygon, HTMLAttribute.points, vertices);
    }

    updatePreviewRectangle() {
        const deltaX = this.currentMouseCoords.x - this.initialMouseCoords.x;
        const deltaY = this.currentMouseCoords.y - this.initialMouseCoords.y;
        const minLength = Math.min(Math.abs(deltaX), Math.abs(deltaY));

        this.radius = minLength / 2;
        this.setRadiusCorrection();

        if (deltaX < 0) {
            this.renderer.setAttribute(this.previewRectangle, 'x', (this.initialMouseCoords.x - minLength).toString());
            this.renderer.setAttribute(this.previewRectangle, HTMLAttribute.width, minLength.toString());
        } else {
            this.renderer.setAttribute(this.previewRectangle, 'x', this.initialMouseCoords.x.toString());
            this.renderer.setAttribute(this.previewRectangle, HTMLAttribute.width, minLength.toString());
        }

        if (deltaY < 0) {
            this.renderer.setAttribute(this.previewRectangle, 'y', (this.initialMouseCoords.y - minLength).toString());
            this.renderer.setAttribute(this.previewRectangle, HTMLAttribute.height, minLength.toString());
        } else {
            this.renderer.setAttribute(this.previewRectangle, 'y', this.initialMouseCoords.y.toString());
            this.renderer.setAttribute(this.previewRectangle, HTMLAttribute.height, minLength.toString());
        }

        this.renderer.setAttribute(this.previewRectangle, HTMLAttribute.fill, 'white');
        this.renderer.setAttribute(this.previewRectangle, 'fill-opacity', '0.3');
        this.renderer.setAttribute(this.previewRectangle, HTMLAttribute.stroke, 'black');
        this.renderer.setAttribute(this.previewRectangle, HTMLAttribute.stroke_dasharray, '5 5');
    }

    renderdrawPolygon(drawPolygon: SVGPolygonElement = this.drawPolygon): void {
        if (this.isValidePolygon()) {
            this.userFillColor === 'none'
                ? this.renderer.setAttribute(drawPolygon, HTMLAttribute.fill, this.userFillColor)
                : this.renderer.setAttribute(drawPolygon, HTMLAttribute.fill, '#' + this.userFillColor);
            this.renderer.setAttribute(drawPolygon, HTMLAttribute.stroke, '#' + this.userStrokeColor);
            this.renderer.setAttribute(drawPolygon, HTMLAttribute.stroke_width, this.userStrokeWidth.toString());
            this.renderer.setAttribute(drawPolygon, HTMLAttribute.stroke_linejoin, 'round');
        } else {
            this.renderer.setAttribute(drawPolygon, HTMLAttribute.fill, 'none');
            this.renderer.setAttribute(drawPolygon, HTMLAttribute.stroke, 'none');
            this.renderer.setAttribute(drawPolygon, HTMLAttribute.stroke_width, '0');
        }
    }

    createSVG(): void {
        const el: SVGGElement = this.renderer.createElement('g', SVG_NS);
        const drawPolygon: SVGPolygonElement = this.renderer.createElement('polygon', SVG_NS);
        this.copyPreviewRectangleAttributes(drawPolygon);

        this.renderer.setAttribute(el, HTMLAttribute.title, ToolName.Polygon);
        this.renderer.setAttribute(el, HTMLAttribute.stroke_width, this.userStrokeWidth.toString());
        this.renderer.setAttribute(el, HTMLAttribute.stroke_linejoin, 'round');
        this.renderer.setAttribute(el, HTMLAttribute.stroke, '#' + this.userStrokeColor);
        this.userFillColor === 'none'
            ? this.renderer.setAttribute(el, HTMLAttribute.fill, this.userFillColor)
            : this.renderer.setAttribute(el, HTMLAttribute.fill, '#' + this.userFillColor);

        this.renderer.appendChild(el, drawPolygon);
        this.renderer.appendChild(this.elementRef.nativeElement, el);

        setTimeout(() => {
            this.drawStack.push(el);
        }, 0);
    }

    updateDrawing(): void {
        this.updatePreviewRectangle();
        this.copyPreviewRectangleAttributes();
        this.renderdrawPolygon();
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

            this.renderer.appendChild(this.elementRef.nativeElement, this.drawPolygon);
        }
    }

    onMouseUp(event: MouseEvent): void {
        const button = event.button;
        if (button === Mouse.LeftButton && this.isMouseInRef(event, this.elementRef) && this.isValidePolygon()) {
            this.createSVG();
        }
        this.cleanUp();
    }

    onMouseEnter(event: MouseEvent): void {}

    onMouseLeave(event: MouseEvent): void {}

    // tslint:disable-next-line: no-empty
    onKeyDown(event: KeyboardEvent): void {}

    // tslint:disable-next-line: no-empty
    onKeyUp(event: KeyboardEvent): void {}

    cleanUp(): void {
        this.isPreviewing = false;
        this.renderer.removeChild(this.elementRef, this.drawPolygon);
        this.makeInvalidPolygon();
    }
}
