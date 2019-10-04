import { Injectable, ElementRef, Renderer2 } from '@angular/core';

import { ColorToolService } from '../color-tool/color-tool.service';
import { DrawStackService } from '../../draw-stack/draw-stack.service';
import { AbstractShapeToolService } from '../abstract-tools/abstract-shape-tool/abstract-shape-tool.service';
import { SVG_NS } from 'src/constants/constants';
import { StackTargetInfo } from 'src/classes/StackTargetInfo';
import { ToolName, TraceType } from 'src/constants/tool-constants';
import { AttributesManagerService } from '../attributes-manager/attributes-manager.service';
import { DEFAULT_TRANSPARENT } from 'src/constants/color-constants';

@Injectable({
    providedIn: 'root',
})
export class PolygonToolService extends AbstractShapeToolService {
    drawPolygon: SVGPolygonElement = this.renderer.createElement('rect', SVG_NS);
    fillColor = '';
    strokeColor = '';
    userFillColor = '';
    userStrokeColor = '';
    userStrokeWidth = 0;
    traceType = '';
    strokeWidth = 0;
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

    onMouseMove(event: MouseEvent): void {
        this.currentMouseX = event.clientX - this.svgReference.nativeElement.getBoundingClientRect().left;
        this.currentMouseY = event.clientY - this.svgReference.nativeElement.getBoundingClientRect().top;

        // if (this.isPreviewing) {
        //     this.updateDrawing();
        // }
    }

    onMouseDown(event: MouseEvent): void {}

    onMouseUp(event: MouseEvent): void {}

    onMouseEnter(event: MouseEvent): void {
        this.isIn = true;
    }

    onMouseLeave(event: MouseEvent): void {
        this.isIn = false;
    }

    onKeyDown(event: KeyboardEvent): void {}

    onKeyUp(event: KeyboardEvent): void {
        // const key = event.key;
        // switch (key) {
        //     case Keys.Shift:
        //         if (this.isSquarePreview) {
        //             this.isSquarePreview = false;
        //             this.updateDrawing();
        //         }
        //         break;
        //     default:
        //         break;
        // }
    }
}
