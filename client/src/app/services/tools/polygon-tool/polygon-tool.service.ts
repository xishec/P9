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

interface Vertex {
    x: number;
    y: number;
}

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
    colorToolService: ColorToolService;
    radius = 0;
    radiusCorrection = 0;

    constructor() {
        super();
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

    initializeColorToolService(colorToolService: ColorToolService) {
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

    isValidePolygon(): boolean {
        const height = this.previewRectangleHeight;
        const width = this.previewRectangleWidth;

        return width >= 2 * this.userStrokeWidth && height >= 2 * this.userStrokeWidth && (width > 0 || height > 0);
    }

    calculateVertex(n: number): Vertex {
        const r = this.radius;
        const deltaX = this.currentMouseX - this.initialMouseX;
        const deltaY = this.currentMouseY - this.initialMouseY;
        let xValue;
        let yValue;
        const polygonOffsetAngles: number = PolygonOffsetAngles.get(this.nbVertices) as number;

        const cos =
            (r + this.radiusCorrection - this.strokeWidth / 2) *
            Math.cos((2 * Math.PI * n) / this.nbVertices - polygonOffsetAngles);
        if (deltaX > 0) {
            xValue = cos + this.initialMouseX + r;
        } else {
            xValue = cos + this.initialMouseX - r;
        }

        const sin =
            (r + this.radiusCorrection - this.strokeWidth / 2) *
            Math.sin((2 * Math.PI * n) / this.nbVertices - polygonOffsetAngles);
        const nbVerticesIsEven = this.nbVertices % 2 === 0;
        if (deltaY > 0) {
            yValue = sin + this.initialMouseY + (r + (nbVerticesIsEven ? 0 : this.radiusCorrection));
        } else {
            yValue = sin + this.initialMouseY - (r - (nbVerticesIsEven ? 0 : this.radiusCorrection));
        }

        return { x: xValue, y: yValue };
    }

    copyPreviewRectangleAttributes(drawPolygon: SVGPolygonElement = this.drawPolygon): void {
        let vertices = '';
        for (let n = 1; n <= this.nbVertices; n++) {
            const vertex: Vertex = this.calculateVertex(n);
            vertices += vertex.x + ',' + vertex.y + ' ';
        }

        this.renderer.setAttribute(drawPolygon, HTMLAttribute.points, vertices);
    }

    updatePreviewRectangle() {
        const deltaX = this.currentMouseX - this.initialMouseX;
        const deltaY = this.currentMouseY - this.initialMouseY;
        const minLength = Math.min(Math.abs(deltaX), Math.abs(deltaY));

        this.radius = minLength / 2;
        this.setRadiusCorrection();

        if (deltaX < 0) {
            this.renderer.setAttribute(this.previewRectangle, 'x', (this.initialMouseX - minLength).toString());
            this.renderer.setAttribute(this.previewRectangle, HTMLAttribute.width, minLength.toString());
        } else {
            this.renderer.setAttribute(this.previewRectangle, 'x', this.initialMouseX.toString());
            this.renderer.setAttribute(this.previewRectangle, HTMLAttribute.width, minLength.toString());
        }

        if (deltaY < 0) {
            this.renderer.setAttribute(this.previewRectangle, 'y', (this.initialMouseY - minLength).toString());
            this.renderer.setAttribute(this.previewRectangle, HTMLAttribute.height, minLength.toString());
        } else {
            this.renderer.setAttribute(this.previewRectangle, 'y', this.initialMouseY.toString());
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
        }, 1);
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
        this.currentMouseX = event.clientX - this.elementRef.nativeElement.getBoundingClientRect().left;
        this.currentMouseY = event.clientY - this.elementRef.nativeElement.getBoundingClientRect().top;

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

            this.renderer.appendChild(this.elementRef.nativeElement, this.drawPolygon);
        }
    }

    onMouseUp(event: MouseEvent): void {
        const button = event.button;
        if (button === Mouse.LeftButton && this.isIn && this.isValidePolygon()) {
            this.createSVG();
        }
        this.cleanUp();
    }

    onMouseEnter(event: MouseEvent): void {
        this.isIn = true;
    }

    onMouseLeave(event: MouseEvent): void {
        this.isIn = false;
    }

    // tslint:disable-next-line: no-empty
    onKeyDown(event: KeyboardEvent): void {}

    // tslint:disable-next-line: no-empty
    onKeyUp(event: KeyboardEvent): void {}

    cleanUp(): void {
        this.isPreviewing = false;
        this.renderer.removeChild(this.elementRef, this.drawPolygon);
    }
}
