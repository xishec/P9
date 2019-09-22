import { ElementRef, Injectable, Renderer2 } from '@angular/core';

import { Mouse, SVG_NS } from '../../constants';
import { DrawStackService } from '../../draw-stack/draw-stack.service';
import { TracingToolService } from '../abstract-tools/tracing-tool/tracing-tool.service';

@Injectable({
    providedIn: 'root',
})
export class BrushToolService extends TracingToolService {
    private currentPath = '';
    private currentWidth = 7;
    private currentColor = 'red';
    private currentPattern = 1;
    private svgPath = this.renderer.createElement('path', SVG_NS);
    private svgWrap = this.renderer.createElement('svg', SVG_NS);

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
            this.createSVGCircle(e.offsetX, e.offsetY);
            this.currentPath = `M${e.offsetX} ${e.offsetY}`;
            this.createSVGCircle(e.offsetX, e.offsetY);
            this.createSVGPath();
        }
    }

    onMouseMove(e: MouseEvent): void {
        if (this.isDrawing && e.button === Mouse.LeftButton) {
            // this.createSVGCircle(e.offsetX, e.offsetY);
            this.currentPath += ` L${e.offsetX} ${e.offsetY}`;
            this.updateSVGPath();
        }
    }

    onMouseUp(e: MouseEvent): void {
        if (this.isDrawing && e.button === Mouse.LeftButton) {
            super.onMouseUp(e);
            this.currentPath = '';
            this.drawStack.push(this.svgWrap);
            this.currentPattern = this.currentPattern + 1;
        }
        
    }

    createSVGWrapper(): void {
        this.svgWrap = this.renderer.createElement('svg', SVG_NS);
        const filter = this.createFilter(this.currentPattern);
        this.renderer.appendChild(this.svgWrap, filter);
        this.renderer.appendChild(this.elementRef.nativeElement, this.svgWrap);
    }

    createFilter(patternId: number): object {
        let filter;
        switch (patternId) {
            case 1:
                filter = this.renderer.createElement('filter', SVG_NS);
                this.renderer.setAttribute(filter, 'id', this.currentPattern.toString());
                this.renderer.setAttribute(filter, 'filterUnits', 'objectBoundingBox');
                this.renderer.setAttribute(filter, 'height', '100px');
                this.renderer.setAttribute(filter, 'width', '100px');
                this.renderer.setAttribute(filter, 'x', '-50px');
                this.renderer.setAttribute(filter, 'y', '-50px');
                
                const effect = this.renderer.createElement('feGaussianBlur', SVG_NS);
                this.renderer.setAttribute(effect, 'stdDeviation', '3');
                this.renderer.appendChild(filter, effect);
                break;
            case 2:
                filter = this.renderer.createElement('filter', SVG_NS);
                this.renderer.setAttribute(filter, 'id', this.currentPattern.toString());
                this.renderer.setAttribute(filter, 'filterUnits', 'objectBoundingBox');
                this.renderer.setAttribute(filter, 'height', '100px');
                this.renderer.setAttribute(filter, 'width', '100px');
                this.renderer.setAttribute(filter, 'x', '-50px');
                this.renderer.setAttribute(filter, 'y', '-50px');
                
                const turbulence2 = this.renderer.createElement('feTurbulence', SVG_NS);
                this.renderer.setAttribute(turbulence2, 'type', 'turbulence');
                this.renderer.setAttribute(turbulence2, 'baseFrequency', '0.3');
                this.renderer.setAttribute(turbulence2, 'result', 'turbulence');
                this.renderer.setAttribute(turbulence2, 'numOctaves', '1');

                const displacementMap2 = this.renderer.createElement('feDisplacementMap', SVG_NS);
                this.renderer.setAttribute(displacementMap2, 'in2', 'turbulence');
                this.renderer.setAttribute(displacementMap2, 'in', 'SourceGraphic');
                this.renderer.setAttribute(displacementMap2, 'scale', '40')
                this.renderer.setAttribute(displacementMap2, 'xChannelSelector', 'R');
                this.renderer.setAttribute(displacementMap2, 'yChannelSelector', 'G');

                this.renderer.appendChild(filter, turbulence2);
                this.renderer.appendChild(filter, displacementMap2);
                break;
            case 3:
                filter = this.renderer.createElement('filter', SVG_NS);
                this.renderer.setAttribute(filter, 'id', this.currentPattern.toString());
                this.renderer.setAttribute(filter, 'filterUnits', 'objectBoundingBox');
                this.renderer.setAttribute(filter, 'height', '100px');
                this.renderer.setAttribute(filter, 'width', '100px');
                this.renderer.setAttribute(filter, 'x', '-50px');
                this.renderer.setAttribute(filter, 'y', '-50px');
                
                const turbulence3 = this.renderer.createElement('feTurbulence', SVG_NS);
                this.renderer.setAttribute(turbulence3, 'type', 'turbulence');
                this.renderer.setAttribute(turbulence3, 'baseFrequency', '0.01 0.57');
                this.renderer.setAttribute(turbulence3, 'result', 'turbulence');
                this.renderer.setAttribute(turbulence3, 'numOctaves', '2');

                const displacementMap3 = this.renderer.createElement('feDisplacementMap', SVG_NS);
                this.renderer.setAttribute(displacementMap3, 'in2', 'turbulence');
                this.renderer.setAttribute(displacementMap3, 'in', 'SourceGraphic');
                this.renderer.setAttribute(displacementMap3, 'scale', '10')
                this.renderer.setAttribute(displacementMap3, 'xChannelSelector', 'R');
                this.renderer.setAttribute(displacementMap3, 'yChannelSelector', 'G');

                this.renderer.appendChild(filter, turbulence3);
                this.renderer.appendChild(filter, displacementMap3);
                break;
            case 4:
                filter = this.renderer.createElement('filter', SVG_NS);
                this.renderer.setAttribute(filter, 'id', this.currentPattern.toString());
                this.renderer.setAttribute(filter, 'filterUnits', 'objectBoundingBox');
                this.renderer.setAttribute(filter, 'height', '100px');
                this.renderer.setAttribute(filter, 'width', '100px');
                this.renderer.setAttribute(filter, 'x', '-50px');
                this.renderer.setAttribute(filter, 'y', '-50px');
                
                const turbulence4 = this.renderer.createElement('feTurbulence', SVG_NS);
                this.renderer.setAttribute(turbulence4, 'type', 'turbulence');
                this.renderer.setAttribute(turbulence4, 'baseFrequency', '0.05');
                this.renderer.setAttribute(turbulence4, 'result', 'turbulence');
                this.renderer.setAttribute(turbulence4, 'numOctaves', '2');

                const displacementMap4 = this.renderer.createElement('feDisplacementMap', SVG_NS);
                this.renderer.setAttribute(displacementMap4, 'in2', 'turbulence');
                this.renderer.setAttribute(displacementMap4, 'in', 'SourceGraphic');
                this.renderer.setAttribute(displacementMap4, 'scale', '10')
                this.renderer.setAttribute(displacementMap4, 'xChannelSelector', 'R');
                this.renderer.setAttribute(displacementMap4, 'yChannelSelector', 'G');

                this.renderer.appendChild(filter, turbulence4);
                this.renderer.appendChild(filter, displacementMap4);
                break;
            case 5:
                filter = this.renderer.createElement('filter', SVG_NS);
                this.renderer.setAttribute(filter, 'id', this.currentPattern.toString());
                this.renderer.setAttribute(filter, 'filterUnits', 'objectBoundingBox');
                this.renderer.setAttribute(filter, 'height', '100px');
                this.renderer.setAttribute(filter, 'width', '100px');
                this.renderer.setAttribute(filter, 'x', '-50px');
                this.renderer.setAttribute(filter, 'y', '-50px');
                
                const turbulence5 = this.renderer.createElement('feTurbulence', SVG_NS);
                this.renderer.setAttribute(turbulence5, 'type', 'fractalNoise');
                this.renderer.setAttribute(turbulence5, 'baseFrequency', '0.9');
                this.renderer.setAttribute(turbulence5, 'result', 'turbulence');
                this.renderer.setAttribute(turbulence5, 'numOctaves', '4');

                const displacementMap5 = this.renderer.createElement('feDisplacementMap', SVG_NS);
                this.renderer.setAttribute(displacementMap5, 'in2', 'turbulence');
                this.renderer.setAttribute(displacementMap5, 'in', 'SourceGraphic');
                this.renderer.setAttribute(displacementMap5, 'scale', '10')
                this.renderer.setAttribute(displacementMap5, 'xChannelSelector', 'R');
                this.renderer.setAttribute(displacementMap5, 'yChannelSelector', 'G');

                this.renderer.appendChild(filter, turbulence5);
                this.renderer.appendChild(filter, displacementMap5);
            break;
        }
        return filter;
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
        this.renderer.setAttribute(el, 'filter', `url(#${this.currentPattern.toString()})`);
            

        this.renderer.appendChild(this.svgWrap, el);
    }

    createSVGPath(): void {
        this.svgPath = this.renderer.createElement('path', SVG_NS);

        this.renderer.setAttribute(this.svgPath, 'filter', `url(#${this.currentPattern})`);
        this.renderer.setAttribute(this.svgPath, 'stroke', this.currentColor);

        this.renderer.setAttribute(this.svgPath, 'stroke-width', this.currentWidth.toString());
        this.renderer.setAttribute(this.svgPath, 'fill', 'none');
        
        this.renderer.appendChild(this.svgWrap, this.svgPath);
        this.updateSVGPath();
    }

    updateSVGPath(): void {
        this.renderer.setAttribute(this.svgPath, 'd', this.currentPath);
    }
}

