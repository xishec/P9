import { ElementRef, Injectable, Renderer2 } from '@angular/core';

import { PEN_WIDTH_FACTOR } from 'src/constants/tool-constants';
import { DrawStackService } from '../../draw-stack/draw-stack.service';
import { TracingToolService } from '../abstract-tools/tracing-tool/tracing-tool.service';
import { AttributesManagerService } from '../attributes-manager/attributes-manager.service';

@Injectable({
    providedIn: 'root',
})
export class PenToolService extends TracingToolService {
    oldTimeStamp = -1;
    lastMouseX: number;
    lastMouseY: number;
    speedX: number;
    oldSpeedX = 0;
    oldSpeedY = 0;
    speedY: number;
    maxThickness: number;
    minThickness: number;

    constructor() {
        super();
    }

    initializeService(elementRef: ElementRef<SVGElement>, renderer: Renderer2, drawStack: DrawStackService) {
        super.initializeService(elementRef, renderer, drawStack);
    }

    createSVGCircle(x: number, y: number): SVGCircleElement {
        const circle = super.createSVGCircle(x, y);
        return circle;
    }

    initializeAttributesManagerService(attributesManagerService: AttributesManagerService) {
        this.attributesManagerService = attributesManagerService;
        this.attributesManagerService.currentThickness.subscribe((thickness) => {
            this.currentWidth = thickness;
        });
        this.attributesManagerService.currentMaxThickness.subscribe((thickness) => {
            this.maxThickness = thickness;
        });
        this.attributesManagerService.currentMinThickness.subscribe((thickness) => {
            this.minThickness = thickness;
        });
    }

    onMouseMove(e: MouseEvent): void {
        super.onMouseMove(e);
        this.calculateSpeed(e);

        if (this.isDrawing) {
            const x = this.getXPos(e.clientX);
            const y = this.getYPos(e.clientY);
            this.currentPath = `M${x} ${y}`;
            this.svgPreviewCircle = this.createSVGCircle(x, y);
            this.renderer.appendChild(this.svgWrap, this.svgPreviewCircle);
            this.createSVGPath();
        }
        this.oldSpeedX = this.speedX;
        this.oldSpeedY = this.speedY;
        return;
    }

    calculateSpeed(e: MouseEvent): void {
        if (this.oldTimeStamp === -1) {
            this.speedX = 0;
            this.speedY = 0;
            this.oldTimeStamp = Date.now();
            this.lastMouseX = e.screenX;
            this.lastMouseY = e.screenY;
            return;
        }

        const now = Date.now();
        const dt = now - this.oldTimeStamp;
        const dx = e.screenX - this.lastMouseX;
        const dy = e.screenY - this.lastMouseY;

        this.speedX = Math.abs(Math.round(dx / dt));
        this.speedY = Math.abs(Math.round(dy / dt));
        this.oldTimeStamp = now;
        this.lastMouseX = e.screenX;
        this.lastMouseY = e.screenY;

        const totalSpeed = this.speedX + this.speedY > PEN_WIDTH_FACTOR ? PEN_WIDTH_FACTOR : this.speedX + this.speedY;
        const targetWidth = this.maxThickness * (1 - totalSpeed / PEN_WIDTH_FACTOR) + this.minThickness;
        this.currentWidth += (targetWidth - this.currentWidth) / (2 * PEN_WIDTH_FACTOR);
    }
}
