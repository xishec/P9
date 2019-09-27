import { ElementRef, Injectable, Renderer2 } from '@angular/core';

import { Mouse, SVG_NS } from '../../../../constants/constants';
import { DrawStackService } from '../../draw-stack/draw-stack.service';
import { TracingToolService } from '../abstract-tools/tracing-tool/tracing-tool.service';
import { AttributesManagerService } from '../attributes-manager/attributes-manager.service';
import { ColorToolService } from '../color-tool/color-tool.service';

@Injectable({
    providedIn: 'root',
})
export class PencilToolService extends TracingToolService {
    private currentPath = '';
    private currentWidth = 0;
    currentColor = '';
    private svgPathRef: SVGPathElement = this.renderer.createElement('path', SVG_NS);
    private svgWrapRef: SVGGElement = this.renderer.createElement('g', SVG_NS);
    private svgPreviewCircle: SVGCircleElement = this.renderer.createElement('circle', SVG_NS);
    private attributesManagerService: AttributesManagerService;
    private colorToolService: ColorToolService;

    constructor(
        private elementRef: ElementRef<SVGElement>,
        private renderer: Renderer2,
        private drawStack: DrawStackService,
    ) {
        super();
    }

    initializeAttributesManagerService(attributesManagerService: AttributesManagerService) {
        this.attributesManagerService = attributesManagerService;
        this.attributesManagerService.currentThickness.subscribe((thickness) => {
            this.currentWidth = thickness;
        });
    }
    initializeColorToolService(colorToolService: ColorToolService) {
        this.colorToolService = colorToolService;
        this.colorToolService.currentPrimaryColor.subscribe((currentColor: string) => {
            this.currentColor = currentColor;
        });
    }

    onMouseDown(e: MouseEvent): void {
        if (e.button === Mouse.LeftButton) {
            super.onMouseDown(e);
            this.createSVGWrapper();
            const x = e.clientX - this.elementRef.nativeElement.getBoundingClientRect().left;
            const y = e.clientY - this.elementRef.nativeElement.getBoundingClientRect().top;
            this.currentPath = `M${x} ${y}`;
            this.createSVGCircle(x, y);
            this.svgPreviewCircle = this.createSVGCircle(x,y);
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

    onMouseUp(e: MouseEvent): void {
        if (e.button === Mouse.LeftButton && this.isDrawing) {
            super.onMouseUp(e);
            this.currentPath = '';
            this.drawStack.push(this.svgWrapRef);
        }
    }

    onMouseLeave(e: MouseEvent): void {
        if (this.isDrawing) {
            this.isDrawing = false;
            this.currentPath = '';
            this.drawStack.push(this.svgWrapRef);
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

    createSVGWrapper(): void {
        const el: SVGGElement = this.renderer.createElement('g', SVG_NS);
        this.renderer.setAttribute(el, 'stroke', '#' + this.currentColor);
        this.renderer.setAttribute(el, 'fill', '#' + this.currentColor);
        this.svgWrapRef = el;
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
            setTimeout(() => {
                this.drawStack.changeTargetElement(currentDrawStackLength);
            }, 10);
        });
        this.renderer.appendChild(this.svgWrapRef, circle);
        return circle;
    }

    createSVGPath(): void {
        this.svgPathRef = this.renderer.createElement('path', SVG_NS);
        this.renderer.setAttribute(this.svgPathRef, 'fill', 'none');
        this.renderer.setAttribute(this.svgPathRef, 'stroke-width', this.currentWidth.toString());
        this.renderer.setAttribute(this.svgPathRef, 'stroke-linejoin', 'round');
        const currentDrawStackLength = this.drawStack.getDrawStackLength();
        this.svgPathRef.addEventListener('mousedown', (event: MouseEvent) => {
            setTimeout(() => {
                this.drawStack.changeTargetElement(currentDrawStackLength);
            }, 10);
        });
        this.renderer.appendChild(this.svgWrapRef, this.svgPathRef);
    }

    updatePreviewCircle(x: number, y: number): void {
        this.renderer.setAttribute(this.svgPreviewCircle, 'cx', x.toString());
        this.renderer.setAttribute(this.svgPreviewCircle, 'cy', y.toString());
    }

    updateSVGPath(): void {
        this.renderer.setAttribute(this.svgPathRef, 'd', this.currentPath);
    }
}
