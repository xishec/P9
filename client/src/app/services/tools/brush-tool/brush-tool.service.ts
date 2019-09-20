import { ElementRef, Injectable, Renderer2 } from '@angular/core';

import { Mouse, SVG_NS } from '../../constants';
import { TracingToolService } from '../abstract-tools/tracing-tool/tracing-tool.service';

@Injectable({
    providedIn: 'root',
})
export class BrushToolService extends TracingToolService {
    private currentPath = '';

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
        this.renderer.appendChild(this.elementRef.nativeElement, this.svgWrapRef);
    }

    createSVGCircle(): void {}

    onMouseMove(e: MouseEvent){}
}
