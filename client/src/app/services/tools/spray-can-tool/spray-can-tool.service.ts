import { ElementRef, Injectable, Renderer2 } from '@angular/core';

import { Coords2D } from 'src/classes/Coords2D';
import { MOUSE, SVG_NS } from 'src/constants/constants';
import {
    CIRCLES_TO_APPEND,
    HTML_ATTRIBUTE,
    MAX_CHARS_IN_PATH,
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
    private radius = SPRAY_DIAMETER.Default;
    private event: MouseEvent;
    private interval: NodeJS.Timer;
    private intervalTime = SPRAY_INTERVAL.Default;
    private sprayer: SVGCircleElement;
    private currentMouseCoords: Coords2D = new Coords2D(0, 0);

    constructor(private colorToolService: ColorToolService) {
        super();
        this.colorToolService.primaryColor.subscribe((currentColor: string) => {
            this.currentColorAndOpacity = currentColor;

            if (this.sprayer !== undefined) {
                this.renderer.setAttribute(this.sprayer, HTML_ATTRIBUTE.Stroke, '#' + this.currentColorAndOpacity);
            }
        });
    }

    initializeService(elementRef: ElementRef<SVGElement>, renderer: Renderer2, drawStack: DrawStackService) {
        super.initializeService(elementRef, renderer, drawStack);

        this.sprayer = this.renderer.createElement('circle', SVG_NS);
        this.renderer.setAttribute(this.sprayer, 'r', this.radius.toString());
        this.renderer.setAttribute(this.sprayer, HTML_ATTRIBUTE.Stroke, '#' + this.currentColorAndOpacity);
        this.renderer.setAttribute(this.sprayer, HTML_ATTRIBUTE.StrokeWidth, SPRAYER_STROKE_WIDTH);
        this.renderer.setAttribute(this.sprayer, HTML_ATTRIBUTE.Fill, 'none');
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

    onMouseDown(event: MouseEvent) {
        if (event.button === MOUSE.LeftButton) {
            this.setColorAndOpacity();
            this.event = event;
            this.isDrawing = true;
            this.createSVGWrapper();
            this.createSVGPath();
            this.spray();
            this.appendSprayer();

            clearInterval(this.interval);
            this.interval = setInterval(() => {
                this.spray();
                this.appendSprayer();
            }, this.intervalTime);
        }
    }

    private spray(): void {
        for (let i = 0; i < CIRCLES_TO_APPEND; ++i) {
            const angle = Math.random() * (2 * Math.PI);
            const radius = Math.random() * this.radius;
            const x = Math.floor(this.getXPos(this.event.clientX) + radius * Math.cos(angle) - this.currentWidth / 2);
            const y = Math.floor(this.getYPos(this.event.clientY) + radius * Math.sin(angle));
            const upperArc = `a1 1 0 0 1 ${this.currentWidth} 0`;
            const lowerArc = `a1 1 0 0 1 -${this.currentWidth} 0`;

            this.currentPath += `M${x} ${y}` + upperArc + lowerArc;
        }
        this.updateSVGPath();
    }

    onMouseUp(event: MouseEvent) {
        if (event.button === MOUSE.LeftButton && this.isDrawing) {
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

    private setSprayerToMouse(event: MouseEvent): void {
        this.currentMouseCoords.x = this.getXPos(event.clientX);
        this.currentMouseCoords.y = this.getYPos(event.clientY);

        this.renderer.setAttribute(this.sprayer, HTML_ATTRIBUTE.Cx, this.currentMouseCoords.x.toString());
        this.renderer.setAttribute(this.sprayer, HTML_ATTRIBUTE.Cy, this.currentMouseCoords.y.toString());

        this.appendSprayer();
    }

    private appendSprayer(): void {
        this.renderer.appendChild(this.elementRef.nativeElement, this.sprayer);
    }

    cleanUp() {
        super.cleanUp();
        clearInterval(this.interval);
        this.renderer.removeChild(this.elementRef, this.sprayer);
    }

    onMouseLeave(event: MouseEvent) {
        super.onMouseLeave(event);
        this.renderer.removeChild(this.elementRef, this.sprayer);
    }

    protected createSVGWrapper(): void {
        const wrap: SVGGElement = this.renderer.createElement('g', SVG_NS);
        this.renderer.setAttribute(wrap, HTML_ATTRIBUTE.Stroke, '#' + this.currentColor);
        this.renderer.setAttribute(wrap, HTML_ATTRIBUTE.Opacity, this.currentOpacity);
        this.renderer.setAttribute(wrap, HTML_ATTRIBUTE.Fill, '#' + this.currentColor);
        this.renderer.setAttribute(wrap, HTML_ATTRIBUTE.Title, TOOL_NAME.SprayCan);
        this.svgWrap = wrap;
        this.renderer.appendChild(this.elementRef.nativeElement, wrap);
    }

    protected createSVGPath(): void {
        this.svgPath = this.renderer.createElement('path', SVG_NS);
        this.renderer.setAttribute(this.svgPath, HTML_ATTRIBUTE.Fill, '#' + this.currentColor);
        this.renderer.setAttribute(this.svgPath, HTML_ATTRIBUTE.StrokeWidth, this.currentWidth.toString());
        this.renderer.appendChild(this.svgWrap, this.svgPath);
    }

    protected updateSVGPath(): void {
        if (this.currentPath.length > MAX_CHARS_IN_PATH) {
            this.currentPath = '';
            this.createSVGPath();
        } else {
            super.updateSVGPath();
        }
    }
}
