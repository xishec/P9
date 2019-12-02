import { ElementRef, Injectable, Renderer2 } from '@angular/core';

import { Coords2D } from 'src/classes/Coords2D';
import { MOUSE, SVG_NS } from 'src/constants/constants';
import {
    HTML_ATTRIBUTE,
    POLYGON_OFFSET_ANGLES,
    POLYGON_RADIUS_CORRECTION,
    TOOL_NAME,
    TRACE_TYPE,
} from 'src/constants/tool-constants';
import { DrawStackService } from '../../draw-stack/draw-stack.service';
import { AbstractShapeToolService } from '../abstract-tools/abstract-shape-tool/abstract-shape-tool.service';
import { AttributesManagerService } from '../attributes-manager/attributes-manager.service';
import { ColorToolService } from '../color-tool/color-tool.service';

@Injectable({
    providedIn: 'root',
})
export class PolygonToolService extends AbstractShapeToolService {
    private drawPolygon: SVGPolygonElement;
    private fillColor = '';
    private strokeColor = '';
    private userFillColor = '';
    private userStrokeColor = '';
    private userStrokeWidth = 0;
    private traceType = '';
    private strokeWidth = 0;
    private nbVertices = 3;
    private attributesManagerService: AttributesManagerService;
    private radius = 0;
    private radiusCorrection = 0;

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
        this.attributesManagerService.thickness.subscribe((thickness: number) => {
            this.strokeWidth = thickness;
            this.updateTraceType(this.traceType);
        });
        this.attributesManagerService.traceType.subscribe((traceType: string) => {
            this.updateTraceType(traceType);
        });
        this.attributesManagerService.nbVertices.subscribe((nbVertices: number) => {
            this.nbVertices = nbVertices;
        });
    }

    private setRadiusCorrection() {
        const correction: number = POLYGON_RADIUS_CORRECTION.get(this.nbVertices) as number;
        this.radiusCorrection = this.radius * correction;
    }

    private isValidPolygon(): boolean {
        const isValidHeight = this.previewRectangleHeight >= 2 * this.userStrokeWidth;
        const isValidWidth = this.previewRectangleWidth >= 2 * this.userStrokeWidth;

        return isValidWidth && isValidHeight && (this.previewRectangleWidth > 0 || this.previewRectangleHeight > 0);
    }

    private makeInvalidPolygon(): void {
        this.renderer.setAttribute(this.previewRectangle, HTML_ATTRIBUTE.width, '0');
        this.renderer.setAttribute(this.previewRectangle, HTML_ATTRIBUTE.height, '0');
    }

    private calculateVertex(n: number): Coords2D {
        const r = this.radius;
        const deltaX = this.currentMouseCoords.x - this.initialMouseCoords.x;
        const deltaY = this.currentMouseCoords.y - this.initialMouseCoords.y;
        let xValue: number;
        let yValue: number;
        const polygonOffsetAngles: number = POLYGON_OFFSET_ANGLES.get(this.nbVertices) as number;

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

        return new Coords2D(xValue, yValue);
    }

    private copyPreviewRectangleAttributes(drawPolygon: SVGPolygonElement = this.drawPolygon): void {
        let vertices = '';
        for (let n = 1; n <= this.nbVertices; n++) {
            const vertex: Coords2D = this.calculateVertex(n);
            vertices += vertex.x + ',' + vertex.y + ' ';
        }

        this.renderer.setAttribute(drawPolygon, HTML_ATTRIBUTE.points, vertices);
    }

    private updatePreviewRectangle() {
        const deltaX = this.currentMouseCoords.x - this.initialMouseCoords.x;
        const deltaY = this.currentMouseCoords.y - this.initialMouseCoords.y;
        const minLength = Math.min(Math.abs(deltaX), Math.abs(deltaY));

        this.radius = minLength / 2;
        this.setRadiusCorrection();

        if (deltaX < 0) {
            this.renderer.setAttribute(this.previewRectangle, 'x', (this.initialMouseCoords.x - minLength).toString());
            this.renderer.setAttribute(this.previewRectangle, HTML_ATTRIBUTE.width, minLength.toString());
        } else {
            this.renderer.setAttribute(this.previewRectangle, 'x', this.initialMouseCoords.x.toString());
            this.renderer.setAttribute(this.previewRectangle, HTML_ATTRIBUTE.width, minLength.toString());
        }

        if (deltaY < 0) {
            this.renderer.setAttribute(this.previewRectangle, 'y', (this.initialMouseCoords.y - minLength).toString());
            this.renderer.setAttribute(this.previewRectangle, HTML_ATTRIBUTE.height, minLength.toString());
        } else {
            this.renderer.setAttribute(this.previewRectangle, 'y', this.initialMouseCoords.y.toString());
            this.renderer.setAttribute(this.previewRectangle, HTML_ATTRIBUTE.height, minLength.toString());
        }

        this.renderer.setAttribute(this.previewRectangle, HTML_ATTRIBUTE.fill, 'white');
        this.renderer.setAttribute(this.previewRectangle, 'fill-opacity', '0.3');
        this.renderer.setAttribute(this.previewRectangle, HTML_ATTRIBUTE.stroke, 'black');
        this.renderer.setAttribute(this.previewRectangle, HTML_ATTRIBUTE.stroke_dasharray, '5 5');
    }

    private renderdrawPolygon(drawPolygon: SVGPolygonElement = this.drawPolygon): void {
        if (this.isValidPolygon()) {
            this.userFillColor === 'none'
                ? this.renderer.setAttribute(drawPolygon, HTML_ATTRIBUTE.fill, this.userFillColor)
                : this.renderer.setAttribute(drawPolygon, HTML_ATTRIBUTE.fill, '#' + this.userFillColor);
            this.renderer.setAttribute(drawPolygon, HTML_ATTRIBUTE.stroke, '#' + this.userStrokeColor);
            this.renderer.setAttribute(drawPolygon, HTML_ATTRIBUTE.stroke_width, this.userStrokeWidth.toString());
            this.renderer.setAttribute(drawPolygon, HTML_ATTRIBUTE.stroke_linejoin, 'round');
        } else {
            this.renderer.setAttribute(drawPolygon, HTML_ATTRIBUTE.fill, 'none');
            this.renderer.setAttribute(drawPolygon, HTML_ATTRIBUTE.stroke, 'none');
            this.renderer.setAttribute(drawPolygon, HTML_ATTRIBUTE.stroke_width, '0');
        }
    }

    private createSVG(): void {
        const el: SVGGElement = this.renderer.createElement('g', SVG_NS);
        const drawPolygon: SVGPolygonElement = this.renderer.createElement('polygon', SVG_NS);
        this.copyPreviewRectangleAttributes(drawPolygon);

        this.renderer.setAttribute(el, HTML_ATTRIBUTE.title, TOOL_NAME.Polygon);
        this.renderer.setAttribute(el, HTML_ATTRIBUTE.stroke_width, this.userStrokeWidth.toString());
        this.renderer.setAttribute(el, HTML_ATTRIBUTE.stroke_linejoin, 'round');
        this.renderer.setAttribute(el, HTML_ATTRIBUTE.stroke, '#' + this.userStrokeColor);
        this.userFillColor === 'none'
            ? this.renderer.setAttribute(el, HTML_ATTRIBUTE.fill, this.userFillColor)
            : this.renderer.setAttribute(el, HTML_ATTRIBUTE.fill, '#' + this.userFillColor);

        this.renderer.appendChild(el, drawPolygon);
        this.renderer.appendChild(this.elementRef.nativeElement, el);

        setTimeout(() => {
            this.drawStack.push(el);
        }, 0);
    }

    private updateDrawing(): void {
        this.updatePreviewRectangle();
        this.copyPreviewRectangleAttributes();
        this.renderdrawPolygon();
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

            this.renderer.appendChild(this.elementRef.nativeElement, this.drawPolygon);
        }
    }

    onMouseUp(event: MouseEvent): void {
        const button = event.button;
        if (button === MOUSE.LeftButton && this.isMouseInRef(event, this.elementRef) && this.isValidPolygon()) {
            this.createSVG();
        }
        this.cleanUp();
    }

    // tslint:disable-next-line: no-empty
    onMouseEnter(event: MouseEvent): void {}

    // tslint:disable-next-line: no-empty
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
