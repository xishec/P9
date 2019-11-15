import { ElementRef, Injectable, Renderer2 } from '@angular/core';

import { MOUSE, SVG_NS } from 'src/constants/constants';
import { HTML_ATTRIBUTE, TOOL_NAME, SPRAY_INTERVAL, SPRAY_DIAMETER } from 'src/constants/tool-constants';
import { DrawStackService } from '../../draw-stack/draw-stack.service';
import { TracingToolService } from '../abstract-tools/tracing-tool/tracing-tool.service';
import { AttributesManagerService } from '../attributes-manager/attributes-manager.service';
import { ColorToolService } from '../color-tool/color-tool.service';

@Injectable({
    providedIn: 'root',
})
export class SprayCanToolService extends TracingToolService {
    radius = SPRAY_DIAMETER.Default;
    event: MouseEvent;
    interval: NodeJS.Timer;
    intervalTime = SPRAY_INTERVAL.Default;

    constructor(private colorToolService: ColorToolService) {
        super();
        console.log(this.attributesManagerService);
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
        if (e.button === MOUSE.LeftButton) {
            this.setColorAndOpacity();
            this.event = e;
            this.isDrawing = true;
            this.createSVGWrapper();
            this.appendSpray();
            this.createSVGPath();

            clearInterval(this.interval);
            this.interval = setInterval(() => {
                this.appendSpray();
            }, this.intervalTime);
        }
    }

    appendSpray(): void {
        for (let i = 0; i < 20; ++i) {
            const angle = Math.random() * (2 * Math.PI);
            const radius = Math.random() * this.radius;
            const x = this.getXPos(this.event.clientX) + radius * Math.cos(angle);
            const y = this.getYPos(this.event.clientY) + radius * Math.sin(angle);
            this.currentPath = `M${x} ${y}`;
            this.svgPreviewCircle = this.createSVGCircle(x, y);
            this.renderer.appendChild(this.svgWrap, this.svgPreviewCircle);
        }
    }

    onMouseUp(e: MouseEvent) {
        super.onMouseUp(e);
        clearInterval(this.interval);
    }

    onMouseMove(e: MouseEvent) {
        this.event = e;
    }

    createSVGWrapper(): void {
        const wrap: SVGGElement = this.renderer.createElement('g', SVG_NS);
        this.renderer.setAttribute(wrap, HTML_ATTRIBUTE.stroke, '#' + this.currentColor);
        this.renderer.setAttribute(wrap, HTML_ATTRIBUTE.opacity, this.currentOpacity);
        this.renderer.setAttribute(wrap, HTML_ATTRIBUTE.fill, '#' + this.currentColor);
        this.renderer.setAttribute(wrap, HTML_ATTRIBUTE.title, TOOL_NAME.SprayCan);
        this.svgWrap = wrap;
        this.renderer.appendChild(this.elementRef.nativeElement, wrap);
    }

    initializeAttributesManagerService(attributesManagerService: AttributesManagerService) {
        super.initializeAttributesManagerService(attributesManagerService);
        this.attributesManagerService.sprayDiameter.subscribe((sprayDiameter: number) => {
            this.radius = sprayDiameter / 2;
        });
        this.attributesManagerService.sprayInterval.subscribe((intervalTime: number) => {
            this.intervalTime = intervalTime;
        });
    }
}
