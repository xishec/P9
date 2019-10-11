import { Injectable, ElementRef, Renderer2 } from '@angular/core';

import { ColorToolService } from '../color-tool/color-tool.service';
import { DrawStackService } from '../../draw-stack/draw-stack.service';
import { AbstractShapeToolService } from '../abstract-tools/abstract-shape-tool/abstract-shape-tool.service';
import { SVG_NS, Mouse } from 'src/constants/constants';
import { StackTargetInfo } from 'src/classes/StackTargetInfo';
import { ToolName, TraceType } from 'src/constants/tool-constants';
import { AttributesManagerService } from '../attributes-manager/attributes-manager.service';
import { DEFAULT_TRANSPARENT } from 'src/constants/color-constants';

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
    sideNumber = 3;
    attributesManagerService: AttributesManagerService;
    colorToolService: ColorToolService;

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
        this.attributesManagerService.currentSideNumber.subscribe((sideNumber: number) => {
            this.sideNumber = sideNumber;
        });
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

    copyPreviewRectangleAttributes(): void {
        this.renderer.setAttribute(
            this.drawPolygon,
            'points',
            `${this.previewRectangleX + this.previewRectangleWidth},${this.previewRectangleY +
                this.previewRectangleHeight} ${this.previewRectangleX +
                this.previewRectangleWidth},65 51.96152422706631,70 `
        );
    }

    renderDrawRectangle(): void {
        if (this.isValidePolygon()) {
            this.renderer.setAttribute(this.drawPolygon, 'fill', '#' + this.userFillColor);
            this.renderer.setAttribute(this.drawPolygon, 'stroke', '#' + this.userStrokeColor);
            this.renderer.setAttribute(this.drawPolygon, 'stroke-width', this.userStrokeWidth.toString());
        } else {
            this.renderer.setAttribute(this.drawPolygon, 'fill', 'none');
            this.renderer.setAttribute(this.drawPolygon, 'stroke', 'none');
            this.renderer.setAttribute(this.drawPolygon, 'stroke-width', '0');
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

        const currentDrawStackLength = this.drawStack.getDrawStackLength();
        drawPolygon.addEventListener('mousedown', (event: MouseEvent) => {
            this.drawStack.changeTargetElement(new StackTargetInfo(currentDrawStackLength, ToolName.Polygon));
        });

        this.renderer.appendChild(el, drawPolygon);
        this.drawStack.push(el);
        this.renderer.appendChild(this.svgReference.nativeElement, el);
    }

    updateDrawing(): void {
        this.updatePreviewRectangle(); //update les lignes pointés du rectangle (toujours rec)
        this.copyPreviewRectangleAttributes(); //va updater le polygon (position et taille)
        this.renderDrawRectangle(); // applique la couleur // contient de la logique
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
