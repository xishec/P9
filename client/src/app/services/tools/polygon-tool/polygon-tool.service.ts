import { ElementRef, Injectable, Renderer2 } from '@angular/core';

import { StackTargetInfo } from 'src/classes/StackTargetInfo';
import { DEFAULT_TRANSPARENT } from 'src/constants/color-constants';
import { Mouse, SVG_NS } from 'src/constants/constants';
import { ToolName, TraceType, PolygonRadiusCorrection, PolygonOffsetAngles } from 'src/constants/tool-constants';
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
    drawPolygon: SVGPolygonElement = this.renderer.createElement('polygon', SVG_NS);
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

    constructor(public drawStack: DrawStackService, public svgReference: ElementRef<SVGElement>, renderer: Renderer2) {
        super(renderer);
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
        let correction: number | undefined = PolygonRadiusCorrection.get(this.nbVertices);
        if (correction === undefined) {
            correction = 0;
        }
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
        let r = this.radius;
        let deltaX = this.currentMouseX - this.initialMouseX;
        let deltaY = this.currentMouseY - this.initialMouseY;

        let xValue;
        let yValue;

        let polygonOffsetAngles: number | undefined = PolygonOffsetAngles.get(this.nbVertices);
        if (polygonOffsetAngles === undefined) {
            polygonOffsetAngles = 0;
        }

        let sin =
            (r + this.radiusCorrection - this.strokeWidth / 2) *
            Math.sin((2 * Math.PI * n) / this.nbVertices - polygonOffsetAngles);
        let cos =
            (r + this.radiusCorrection - this.strokeWidth / 2) *
            Math.cos((2 * Math.PI * n) / this.nbVertices - polygonOffsetAngles);

        if (deltaX > 0) {
            xValue = cos + this.initialMouseX + r;
        } else {
            xValue = cos + this.initialMouseX - r;
        }

        let nbVerticesIsEven = this.nbVertices % 2 === 0;
        if (deltaY > 0) {
            yValue = sin + this.initialMouseY + r + (nbVerticesIsEven ? 0 : this.radiusCorrection);
        } else {
            yValue = sin + this.initialMouseY - (r - (nbVerticesIsEven ? 0 : this.radiusCorrection));
        }

        return { x: xValue, y: yValue };
    }

    copyPreviewRectangleAttributes(drawPolygon: SVGPolygonElement = this.drawPolygon): void {
        let vertices = '';
        for (let n = 1; n <= this.nbVertices; n++) {
            let vertex: Vertex = this.calculateVertex(n);
            vertices += vertex.x + ',' + vertex.y + ' ';
        }

        this.renderer.setAttribute(drawPolygon, 'points', vertices);
    }

    updatePreviewRectangle() {
        let deltaX = this.currentMouseX - this.initialMouseX;
        let deltaY = this.currentMouseY - this.initialMouseY;
        const minLength = Math.min(Math.abs(deltaX), Math.abs(deltaY));

        this.radius = minLength / 2;
        this.setRadiusCorrection();

        // adjust x
        if (deltaX < 0) {
            this.renderer.setAttribute(this.previewRectangle, 'x', (this.initialMouseX - minLength).toString());
            this.renderer.setAttribute(this.previewRectangle, 'width', minLength.toString());
        } else {
            this.renderer.setAttribute(this.previewRectangle, 'x', this.initialMouseX.toString());
            this.renderer.setAttribute(this.previewRectangle, 'width', minLength.toString());
        }

        // adjust y
        if (deltaY < 0) {
            this.renderer.setAttribute(this.previewRectangle, 'y', (this.initialMouseY - minLength).toString());
            this.renderer.setAttribute(this.previewRectangle, 'height', minLength.toString());
        } else {
            this.renderer.setAttribute(this.previewRectangle, 'y', this.initialMouseY.toString());
            this.renderer.setAttribute(this.previewRectangle, 'height', minLength.toString());
        }

        this.renderer.setAttribute(this.previewRectangle, 'fill', 'white');
        this.renderer.setAttribute(this.previewRectangle, 'fill-opacity', '0.3');
        this.renderer.setAttribute(this.previewRectangle, 'stroke', 'black');
        this.renderer.setAttribute(this.previewRectangle, 'stroke-dasharray', '5 5');
    }

    renderdrawPolygon(drawPolygon: SVGPolygonElement = this.drawPolygon): void {
        if (this.isValidePolygon()) {
            this.renderer.setAttribute(drawPolygon, 'fill', '#' + this.userFillColor);
            this.renderer.setAttribute(drawPolygon, 'stroke', '#' + this.userStrokeColor);
            this.renderer.setAttribute(drawPolygon, 'stroke-width', this.userStrokeWidth.toString());
            this.renderer.setAttribute(drawPolygon, 'stroke-linejoin', 'round');
        } else {
            this.renderer.setAttribute(drawPolygon, 'fill', 'none');
            this.renderer.setAttribute(drawPolygon, 'stroke', 'none');
            this.renderer.setAttribute(drawPolygon, 'stroke-width', '0');
        }
    }

    cleanUpPreview(): void {
        this.isPreviewing = false;
        this.renderer.removeChild(this.svgReference.nativeElement, this.previewRectangle);
        this.renderer.removeChild(this.svgReference, this.drawPolygon);
    }

    createSVG(): void {
        const el: SVGGElement = this.renderer.createElement('g', SVG_NS);
        const drawPolygon: SVGPolygonElement = this.renderer.createElement('polygon', SVG_NS);
        this.copyPreviewRectangleAttributes(drawPolygon);
        this.renderdrawPolygon(drawPolygon);

        const currentDrawStackLength = this.drawStack.getDrawStackLength();
        drawPolygon.addEventListener('mousedown', (event: MouseEvent) => {
            this.drawStack.changeTargetElement(new StackTargetInfo(currentDrawStackLength, ToolName.Polygon));
        });

        this.renderer.appendChild(el, drawPolygon);
        this.drawStack.push(el);
        this.renderer.appendChild(this.svgReference.nativeElement, el);
    }

    updateDrawing(): void {
        this.updatePreviewRectangle(); // update les lignes pointés du rectangle (toujours rec)
        this.copyPreviewRectangleAttributes(); // va updater le polygon (position et taille)
        this.renderdrawPolygon(); // applique la couleur // contient de la logique
    }

    updateTraceType(traceType: string) {
        this.traceType = traceType;
        switch (traceType) {
            case TraceType.Outline: {
                this.userFillColor = DEFAULT_TRANSPARENT;
                this.userStrokeColor = this.strokeColor;
                this.userStrokeWidth = this.strokeWidth;
                break;
            }
            case TraceType.Full: {
                this.userFillColor = this.fillColor;
                this.userStrokeColor = DEFAULT_TRANSPARENT;
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

    updatePoints() {}

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

            this.renderer.appendChild(this.svgReference.nativeElement, this.drawPolygon);
            this.renderer.appendChild(this.svgReference.nativeElement, this.previewRectangle);
        }
    }

    onMouseUp(event: MouseEvent): void {
        const button = event.button;
        if (button === Mouse.LeftButton && this.isIn && this.isValidePolygon()) {
            this.createSVG();
        }
        this.cleanUpPreview();
    }

    onMouseEnter(event: MouseEvent): void {
        this.isIn = true;
    }

    onMouseLeave(event: MouseEvent): void {
        this.isIn = false;
    }

    onKeyDown(event: KeyboardEvent): void {}

    onKeyUp(event: KeyboardEvent): void {}
}
