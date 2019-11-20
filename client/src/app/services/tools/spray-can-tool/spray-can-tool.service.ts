import { ElementRef, Injectable, Renderer2 } from '@angular/core';

import { Coords2D } from 'src/classes/Coords2D';
import { MOUSE, SVG_NS } from 'src/constants/constants';
import {
    HTML_ATTRIBUTE,
    SPRAY_DIAMETER,
    SPRAY_INTERVAL,
    SPRAYER_STROKE_WIDTH,
    TOOL_NAME,
} from 'src/constants/tool-constants';
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
    sprayer: SVGCircleElement;
    currentMouseCoords: Coords2D = new Coords2D(0, 0);
    isSprayerAppended = false;

    constructor(private colorToolService: ColorToolService) {
        super();
        this.colorToolService.primaryColor.subscribe((currentColor: string) => {
            this.currentColorAndOpacity = currentColor;

            if (this.sprayer !== undefined) {
                this.renderer.setAttribute(this.sprayer, HTML_ATTRIBUTE.stroke, '#' + this.currentColorAndOpacity);
            }
        });
    }

    initializeService(elementRef: ElementRef<SVGElement>, renderer: Renderer2, drawStack: DrawStackService) {
        super.initializeService(elementRef, renderer, drawStack);

        this.sprayer = this.renderer.createElement('circle', SVG_NS);
        this.renderer.setAttribute(this.sprayer, 'r', this.radius.toString());
        this.renderer.setAttribute(this.sprayer, HTML_ATTRIBUTE.stroke, '#' + this.currentColorAndOpacity);
        this.renderer.setAttribute(this.sprayer, HTML_ATTRIBUTE.stroke_width, SPRAYER_STROKE_WIDTH);
        this.renderer.setAttribute(this.sprayer, HTML_ATTRIBUTE.fill, 'none');
    }

    initializeAttributesManagerService(attributesManagerService: AttributesManagerService) {
        super.initializeAttributesManagerService(attributesManagerService);
        this.attributesManagerService.sprayDiameter.subscribe((sprayDiameter: number) => {
            this.radius = sprayDiameter / 2;
            this.renderer.setAttribute(this.sprayer, 'r', this.radius.toString());
        });
        this.attributesManagerService.sprayInterval.subscribe((intervalTime: number) => {
            this.intervalTime = intervalTime;
        });
    }

    createSVGCircle(x: number, y: number): SVGCircleElement {
        const circle = super.createSVGCircle(x, y);
        return circle;
    }

    onMouseDown(event: MouseEvent) {
        if (event.button === MOUSE.LeftButton) {
            this.setColorAndOpacity();
            this.event = event;
            this.isDrawing = true;
            this.createSVGWrapper();
            this.appendSpray();
            this.appendSprayer();
            this.createSVGPath();

            clearInterval(this.interval);
            this.interval = setInterval(() => {
                this.appendSpray();
                this.appendSprayer();
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

    onMouseUp(event: MouseEvent) {
        if (event.button === MOUSE.LeftButton && this.getIsDrawing()) {
            this.isDrawing = false;
            this.currentPath = '';

            clearInterval(this.interval);

            setTimeout(() => {
                this.drawStack.push(this.svgWrap);
            }, 0);

            this.renderer.removeChild(this.elementRef, this.sprayer);

            setTimeout(() => {
                this.appendSprayer();
            }, 0);
        }
    }

    onMouseMove(event: MouseEvent) {
        this.event = event;
        this.setSprayerToMouse(event);
    }

    setSprayerToMouse(event: MouseEvent): void {
        this.currentMouseCoords.x = this.getXPos(event.clientX);
        this.currentMouseCoords.y = this.getYPos(event.clientY);

        this.renderer.setAttribute(this.sprayer, HTML_ATTRIBUTE.cx, this.currentMouseCoords.x.toString());
        this.renderer.setAttribute(this.sprayer, HTML_ATTRIBUTE.cy, this.currentMouseCoords.y.toString());

        if (!this.isSprayerAppended) {
            this.appendSprayer();
        }
    }

    appendSprayer(): void {
        this.renderer.appendChild(this.elementRef.nativeElement, this.sprayer);
        this.isSprayerAppended = true;
    }

    cleanUp() {
        super.cleanUp();
        this.renderer.removeChild(this.elementRef, this.sprayer);
        this.isSprayerAppended = false;
    }

    onMouseLeave(event: MouseEvent) {
        super.onMouseLeave(event);
        this.renderer.removeChild(this.elementRef, this.sprayer);
        this.isSprayerAppended = false;
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
}
