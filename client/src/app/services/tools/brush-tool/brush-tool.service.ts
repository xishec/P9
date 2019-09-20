import { ElementRef, Injectable, Renderer2 } from '@angular/core';

import { Mouse, SVG_NS } from '../../constants';
import { TracingToolService } from '../abstract-tools/tracing-tool/tracing-tool.service';
import { DrawStackService } from '../../draw-stack/draw-stack.service';

@Injectable({
    providedIn: 'root',
})
export class BrushToolService extends TracingToolService {
    private currentPath = '';
    private currentWidth = 2;
    private currentColor = 'black';
    private currentPatternId = '';
    private svgPathRef = this.renderer.createElement('path', SVG_NS);
    private svgWrapRef = this.renderer.createElement('svg', SVG_NS);

    constructor(
        private elementRef: ElementRef<SVGElement>,
        private renderer: Renderer2,
        private drawStack: DrawStackService,
    ) {
        super();
    }

    onMouseDown(e: MouseEvent): void {
        if (e.button === Mouse.LeftButton) {
            super.onMouseDown(e);
            this.createSVGWrapper();
            this.currentPath = `M${e.offsetX} ${e.offsetY}`;
            this.createSVGCircle(e.offsetX, e.offsetY);
            this.createSVGPath();
        }
    }

    onMouseMove(e: MouseEvent): void {
        if (this.isDrawing && e.button === Mouse.LeftButton) {
            this.createSVGCircle(e.offsetX, e.offsetY);
            this.currentPath += ` L${e.offsetX} ${e.offsetY}`;
            this.updateSVGPath();
        }
    }

    onMouseUp(e: MouseEvent): void {
        if (this.isDrawing && e.button === Mouse.LeftButton) {
            super.onMouseUp(e);
            this.currentPath = '';
            this.drawStack.push(this.svgWrapRef);
        }
    }

    createSVGWrapper(): void {
        this.svgWrapRef = this.renderer.createElement('svg', SVG_NS);
        this.renderer.appendChild(this.svgWrapRef, this.createPattern());
        this.renderer.appendChild(this.elementRef.nativeElement, this.svgWrapRef);
    }

    createPattern(): SVGPatternElement {
        this.currentPatternId = 'myPattern';
        const pattern = this.renderer.createElement('pattern', SVG_NS);
        this.renderer.setAttribute(pattern, 'id', this.currentPatternId);
        // design a pattern
        const c = this.renderer.createElement('circle', SVG_NS);
        this.renderer.setAttribute(c, 'cx', '10');
        this.renderer.setAttribute(c, 'cy', '10');
        this.renderer.setAttribute(c, 'r', '10');
        this.renderer.setAttribute(c, 'fill', '#393');
        this.renderer.setAttribute(c, 'stroke', 'none');
        this.renderer.appendChild(pattern, c);

        return pattern;
    }

    createSVGCircle(x: number, y: number): void {
        const el = this.renderer.createElement('line', SVG_NS);
        this.renderer.setAttribute(el, 'x1', x.toString());
        this.renderer.setAttribute(el, 'x2', x.toString());
        this.renderer.setAttribute(el, 'y1', y.toString());
        this.renderer.setAttribute(el, 'y2', y.toString());
        this.renderer.setAttribute(el, 'stroke-width', this.currentWidth.toString());
        this.renderer.setAttribute(el, 'stroke-linecap', 'round');
        this.renderer.setAttribute(el, 'stroke', `url(#${this.currentPatternId})`);
        this.renderer.appendChild(this.svgWrapRef, el);
    }

    createSVGPath(): void {
        this.svgPathRef = this.renderer.createElement('path', SVG_NS);
        this.renderer.setAttribute(this.svgPathRef, 'fill', 'none');
        this.renderer.setAttribute(this.svgPathRef, 'stroke', `url(#${this.currentPatternId})`);
        this.renderer.setAttribute(this.svgPathRef, 'stroke-width', this.currentWidth.toString());
        this.renderer.appendChild(this.svgWrapRef, this.svgPathRef);
    }

    updateSVGPath(): void {
        this.renderer.setAttribute(this.svgPathRef, 'd', this.currentPath);
    }
}
