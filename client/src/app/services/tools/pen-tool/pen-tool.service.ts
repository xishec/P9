import { ElementRef, Injectable, Renderer2 } from '@angular/core';

import { DrawStackService } from '../../draw-stack/draw-stack.service';
import { TracingToolService } from '../abstract-tools/tracing-tool/tracing-tool.service';
import { Mouse } from 'src/constants/constants';
import { AttributesManagerService } from '../attributes-manager/attributes-manager.service';

@Injectable({
    providedIn: 'root',
})
export class PenToolService extends TracingToolService {
    oldTimeStamp: number = -1;
    lastMouseX: number;
    lastMouseY: number;
    speedX: number;
    oldSpeedX: number = 0;
    oldSpeedY: number = 0;
    speedY: number;
    maxThickness: number;
    minThickness: number;

    constructor(elementRef: ElementRef<SVGElement>, renderer: Renderer2, drawStack: DrawStackService) {
        super(elementRef, renderer, drawStack);
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

        let totalSpeed = this.speedX + this.speedY > 500 ? 500 : this.speedX + this.speedY;
        let targetWidth = this.maxThickness * (1 - totalSpeed / 500) + this.minThickness;
        this.currentWidth += (targetWidth - this.currentWidth) / 8;

        if ((this.speedX != this.oldSpeedX || this.speedY != this.oldSpeedY) && this.isDrawing) {
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

        let now = Date.now();
        let dt = now - this.oldTimeStamp;
        let dx = e.screenX - this.lastMouseX;
        let dy = e.screenY - this.lastMouseY;

        this.speedX = Math.abs(Math.round((dx / dt) * 100));
        this.speedY = Math.abs(Math.round((dy / dt) * 100));
        this.oldTimeStamp = now;
        this.lastMouseX = e.screenX;
        this.lastMouseY = e.screenY;
    }
}
