import { Injectable, Renderer2, ElementRef } from '@angular/core';

import { SVG_NS, Mouse } from 'src/constants/constants';
import { AttributesManagerService } from '../../attributes-manager/attributes-manager.service';
import { ColorToolService } from '../../color-tool/color-tool.service';
import { AbstractToolService } from '../abstract-tool.service';
import { DrawStackService } from 'src/app/services/draw-stack/draw-stack.service';

@Injectable({
    providedIn: 'root',
})
export abstract class TracingToolService extends AbstractToolService {
    protected isDrawing = false;
    protected currentPath = '';
    protected currentWidth = 0;
    protected currentColor = '';
    protected svgPath: SVGPathElement = this.renderer.createElement('path', SVG_NS);
    protected svgWrap: SVGGElement = this.renderer.createElement('g', SVG_NS);
    protected svgPreviewCircle: SVGCircleElement = this.renderer.createElement('circle', SVG_NS);

    protected attributesManagerService: AttributesManagerService;
    protected colorToolService: ColorToolService;

    constructor(protected elementRef: ElementRef<SVGElement>,
                protected renderer: Renderer2,
                protected drawStack: DrawStackService) {
        super();
    }

    onMouseDown(e: MouseEvent): void {
        if (e.button === Mouse.LeftButton) {
            this.isDrawing = true;
            this.createSVGWrapper();
            const x = e.clientX - this.elementRef.nativeElement.getBoundingClientRect().left;
            const y = e.clientY - this.elementRef.nativeElement.getBoundingClientRect().top;
            this.currentPath = `M${x} ${y}`;
            this.createSVGCircle(x, y);
            this.svgPreviewCircle = this.createSVGCircle(x, y);
            this.createSVGPath();
        }
    }

    onMouseMove(e: MouseEvent): void {
        if (e.button === Mouse.LeftButton && this.isDrawing) {
            const x = e.clientX - this.elementRef.nativeElement.getBoundingClientRect().left;
            const y = e.clientY - this.elementRef.nativeElement.getBoundingClientRect().top;
            this.currentPath += ` L${x} ${y}`;
            this.updateSVGPath();
            this.updatePreviewCircle(x, y);
        }
    }

    onMouseEnter(event: MouseEvent): undefined {
        return undefined;
    }

    onKeyDown(event: KeyboardEvent): undefined {
        return undefined;
    }

    onKeyUp(event: KeyboardEvent): undefined {
        return undefined;
    }

    updatePreviewCircle(x: number, y: number): void {
        this.renderer.setAttribute(this.svgPreviewCircle, 'cx', x.toString());
        this.renderer.setAttribute(this.svgPreviewCircle, 'cy', y.toString());
    }

    updateSVGPath(): void {
        this.renderer.setAttribute(this.svgPath, 'd', this.currentPath);
    }


    createSVGWrapper(): void {
        const el: SVGGElement = this.renderer.createElement('g', SVG_NS);
        this.renderer.setAttribute(el, 'stroke', '#' + this.currentColor);
        this.renderer.setAttribute(el, 'fill', '#' + this.currentColor);
        this.svgWrap = el;
        this.renderer.appendChild(this.elementRef.nativeElement, el);
    }

    createSVGCircle(x: number, y: number): SVGCircleElement {
        const circle: SVGCircleElement = this.renderer.createElement('circle', SVG_NS);
        this.renderer.setAttribute(circle, 'cx', x.toString());
        this.renderer.setAttribute(circle, 'cy', y.toString());
        this.renderer.setAttribute(circle, 'r', (this.currentWidth / 2).toString());
        this.renderer.setAttribute(circle, 'stroke-linecap', 'round');
        const currentDrawStackLength = this.drawStack.getDrawStackLength();
        circle.addEventListener('mousedown', (event: MouseEvent) => {
            this.drawStack.changeTargetElement(currentDrawStackLength);
        });
        this.renderer.appendChild(this.svgWrap, circle);
        return circle;
    }

    createSVGPath(): void {
        this.svgPath = this.renderer.createElement('path', SVG_NS);
        this.renderer.setAttribute(this.svgPath, 'fill', 'none');
        this.renderer.setAttribute(this.svgPath, 'stroke-width', this.currentWidth.toString());
        this.renderer.setAttribute(this.svgPath, 'stroke-linejoin', 'round');
        const currentDrawStackLength = this.drawStack.getDrawStackLength();
        this.svgPath.addEventListener('mousedown', (event: MouseEvent) => {
            this.drawStack.changeTargetElement(currentDrawStackLength);
        });
        this.renderer.appendChild(this.svgWrap, this.svgPath);
    }

    onMouseUp(e: MouseEvent): void {
        if (e.button === Mouse.LeftButton && this.isDrawing) {
            this.isDrawing = false;
            this.currentPath = '';
            this.drawStack.push(this.svgWrap);
        }
    }

    onMouseLeave(e: MouseEvent): void {
        this.onMouseUp(e);
    }
}
