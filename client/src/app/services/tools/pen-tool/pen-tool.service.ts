import { ElementRef, Injectable, Renderer2 } from '@angular/core';

import { DrawStackService } from '../../draw-stack/draw-stack.service';
import { TracingToolService } from '../abstract-tools/tracing-tool/tracing-tool.service';

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

    constructor(elementRef: ElementRef<SVGElement>, renderer: Renderer2, drawStack: DrawStackService) {
        super(elementRef, renderer, drawStack);
    }

    createSVGCircle(x: number, y: number): SVGCircleElement {
        const circle = super.createSVGCircle(x, y);
        return circle;
    }

    createSVGPath(): void {
        super.createSVGPath();
    }

    onMouseMove(e: MouseEvent): void {
        super.onMouseMove(e);

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

        let totalSpeed = this.speedX + this.speedY > 600 ? 600 : this.speedX + this.speedY;
        let targetWidth = 12 * (1 - totalSpeed / 600) + 1;
        this.currentWidth += (targetWidth - this.currentWidth) / 8;
        if (this.speedX != this.oldSpeedX || this.speedY != this.oldSpeedY) {
            super.onMouseDown(e);
        }
        this.oldSpeedX = this.speedX;
        this.oldSpeedY = this.speedY;
        return;
    }
}
