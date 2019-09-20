import { ElementRef, Injectable, Renderer2 } from '@angular/core';

import { Mouse, SVG_NS } from '../../constants';
import { TracingToolService } from '../abstract-tools/tracing-tool/tracing-tool.service';

@Injectable({
    providedIn: 'root',
})
export class BrushToolService extends TracingToolService {
    private currentPath = '';
    private currentWidth = 2;
    private currentColor = 'black';
    private svgPathRef = this.renderer.createElement('path', SVG_NS);
    private svgWrapRef = this.renderer.createElement('svg', SVG_NS);

    constructor(private renderer: Renderer2, private elementRef: ElementRef<SVGElement>) {
        super();
    }

    onMouseDown(e: MouseEvent): void {
        if (e.button === Mouse.LeftButton) {
            super.onMouseDown(e);
            this.createSVGWrapper();
            //this.createPattern();
            //this.createSVGCircle();
            //this.createSVGPath();
        }
    }

    createSVGWrapper(): void {
        this.svgWrapRef = this.renderer.createElement('svg', SVG_NS);
        this.renderer.appendChild(this.svgWrapRef, this.createPattern());
        this.renderer.appendChild(this.elementRef.nativeElement, this.svgWrapRef);
    }

    createPattern(): SVGPatternElement {
        const pattern = this.renderer.createElement('pattern', SVG_NS);

        // design a pattern

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
        this.renderer.setAttribute(el, 'stroke', this.currentColor);
        this.renderer.appendChild(this.svgWrapRef, el);
    }

    onMouseMove(e: MouseEvent){}
}
