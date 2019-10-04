import { Injectable, ElementRef, Renderer2 } from '@angular/core';
import { ColorToolService } from '../color-tool/color-tool.service';
import { DrawStackService } from '../../draw-stack/draw-stack.service';
import { AbstractShapeToolService } from '../abstract-tools/abstract-shape-tool/abstract-shape-tool.service';

@Injectable({
    providedIn: 'root',
})
export class PolygonToolService extends AbstractShapeToolService {
    colorToolService: ColorToolService;
    fillColor = '';
    strokeColor = '';

    constructor(public drawStack: DrawStackService, public svgReference: ElementRef<SVGElement>, renderer: Renderer2) {
        super(renderer);
    }

    initializeColorToolService(colorToolService: ColorToolService) {
        this.colorToolService = colorToolService;
        this.colorToolService.primaryColor.subscribe((fillColor: string) => {
            this.fillColor = fillColor;
            //this.updateTraceType(this.traceType);
        });
        this.colorToolService.secondaryColor.subscribe((strokeColor: string) => {
            this.strokeColor = strokeColor;
            //this.updateTraceType(this.traceType);
        });
    }

    createSVG(): void {}

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
