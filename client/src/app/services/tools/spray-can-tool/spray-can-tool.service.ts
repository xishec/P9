import { ElementRef, Injectable, Renderer2 } from '@angular/core';

import { DrawStackService } from '../../draw-stack/draw-stack.service';
import { TracingToolService } from '../abstract-tools/tracing-tool/tracing-tool.service';
import { Mouse } from 'src/constants/constants';

@Injectable({
    providedIn: 'root',
})
export class SprayCanToolService extends TracingToolService {
    radius = 30;
    event: MouseEvent;
    interval: NodeJS.Timer;

    constructor(elementRef: ElementRef<SVGElement>, renderer: Renderer2, drawStack: DrawStackService) {
        super(elementRef, renderer, drawStack);
    }

    createSVGCircle(x: number, y: number): SVGCircleElement {
        const circle = super.createSVGCircle(x, y);
        return circle;
    }

    onMouseDown(e: MouseEvent) {
        this.getColorAndOpacity();
        if (e.button === Mouse.LeftButton) {
            this.event = e;
            this.isDrawing = true;
            this.createSVGWrapper();
            let angle = Math.random() * (2 * Math.PI);
            let radius = Math.random() * this.radius;
            let x = this.getXPos(this.event.clientX) + radius * Math.cos(angle);
            let y = this.getYPos(this.event.clientY) + radius * Math.sin(angle);
            this.currentPath = `M${x} ${y}`;
            this.svgPreviewCircle = this.createSVGCircle(x, y);
            this.renderer.appendChild(this.svgWrap, this.svgPreviewCircle);
            this.createSVGPath();
        }

        clearInterval(this.interval);
        this.interval = setInterval(() => {
            for (let i = 0; i < 20; ++i) {
                let angle = Math.random() * (2 * Math.PI);
                let radius = Math.random() * this.radius;
                let x = this.getXPos(this.event.clientX) + radius * Math.cos(angle);
                let y = this.getYPos(this.event.clientY) + radius * Math.sin(angle);
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
