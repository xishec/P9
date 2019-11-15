import { ElementRef, Injectable, Renderer2 } from '@angular/core';

import { MOUSE } from 'src/constants/constants';
import { DrawStackService } from '../../draw-stack/draw-stack.service';
import { TracingToolService } from '../abstract-tools/tracing-tool/tracing-tool.service';
import { ColorToolService } from '../color-tool/color-tool.service';

@Injectable({
    providedIn: 'root',
})
export class SprayCanToolService extends TracingToolService {
    radius = 30;
    event: MouseEvent;
    interval: NodeJS.Timer;

    constructor(private colorToolService: ColorToolService) {
        super();
        this.colorToolService.primaryColor.subscribe((currentColor: string) => {
            this.currentColorAndOpacity = currentColor;
        });
    }

    initializeService(elementRef: ElementRef<SVGElement>, renderer: Renderer2, drawStack: DrawStackService) {
        super.initializeService(elementRef, renderer, drawStack);
    }

    createSVGCircle(x: number, y: number): SVGCircleElement {
        const circle = super.createSVGCircle(x, y);
        return circle;
    }

    onMouseDown(e: MouseEvent) {
        this.getColorAndOpacity();
        if (e.button === MOUSE.LeftButton) {
            this.event = e;
            this.isDrawing = true;
            this.createSVGWrapper();
            const angle = Math.random() * (2 * Math.PI);
            const radius = Math.random() * this.radius;
            const x = this.getXPos(this.event.clientX) + radius * Math.cos(angle);
            const y = this.getYPos(this.event.clientY) + radius * Math.sin(angle);
            this.currentPath = `M${x} ${y}`;
            this.svgPreviewCircle = this.createSVGCircle(x, y);
            this.renderer.appendChild(this.svgWrap, this.svgPreviewCircle);
            this.createSVGPath();
        }

        clearInterval(this.interval);
        this.interval = setInterval(() => {
            for (let i = 0; i < 20; ++i) {
                const angle = Math.random() * (2 * Math.PI);
                const radius = Math.random() * this.radius;
                const x = this.getXPos(this.event.clientX) + radius * Math.cos(angle);
                const y = this.getYPos(this.event.clientY) + radius * Math.sin(angle);
                this.currentPath = `M${x} ${y}`;
                this.svgPreviewCircle = this.createSVGCircle(x, y);
                this.renderer.appendChild(this.svgWrap, this.svgPreviewCircle);
            }
        }, 20);
    }

    onMouseUp(e: MouseEvent) {
        super.onMouseUp(e);
        clearInterval(this.interval);
    }

    onMouseMove(e: MouseEvent) {
        this.event = e;
    }
}
