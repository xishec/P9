import { ElementRef, Injectable, Renderer2 } from '@angular/core';

import { Mouse, SVG_NS } from '../../constants';
import { DrawStackService } from '../../draw-stack/draw-stack.service';
import { TracingToolService } from '../abstract-tools/tracing-tool/tracing-tool.service';

@Injectable({
    providedIn: 'root',
})
export class BrushToolService extends TracingToolService {
    // should be from toolsAttributes
    private currentWidth = 5;
    private currentColor = 'red';
    private currentPattern = 1;
    //

    private currentPath = '';
    private svgPath = this.renderer.createElement('path', SVG_NS);
    private svgWrap = this.renderer.createElement('svg', SVG_NS);
    private svgPreviewCircle = this.renderer.createElement('circle', SVG_NS);

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
            this.svgPreviewCircle = this.createSVGCircle(e.offsetX, e.offsetY);
            this.createSVGPath();
        }
    }

    onMouseMove(e: MouseEvent): void {
        if (this.isDrawing && e.button === Mouse.LeftButton) {
            this.currentPath += ` L${e.offsetX} ${e.offsetY}`;
            this.updateSVGPath();
            this.updatePreviewCircle(e.offsetX, e.offsetY);
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
        let filter = this.renderer.createElement('filter', SVG_NS);
        
        this.renderer.setAttribute(filter, 'id', this.currentPattern.toString());
        this.renderer.setAttribute(filter, 'filterUnits', 'objectBoundingBox');
        this.renderer.setAttribute(filter, 'height', '100px');
        this.renderer.setAttribute(filter, 'width', '100px');
        this.renderer.setAttribute(filter, 'x', '-50px');
        this.renderer.setAttribute(filter, 'y', '-50px');
        
        if (patternId == 1 || patternId == 2){
            const effect = this.renderer.createElement('feGaussianBlur', SVG_NS);
            this.renderer.setAttribute(effect, 'stdDeviation', '3');
            this.renderer.appendChild(filter, effect);
        }
        if (patternId !== 1){
            const turbulence = this.renderer.createElement('feTurbulence', SVG_NS);
            this.renderer.setAttribute(turbulence, 'type', 'turbulence');
            this.renderer.setAttribute(turbulence, 'result', 'turbulence');

            const displacementMap = this.renderer.createElement('feDisplacementMap', SVG_NS);
            this.renderer.setAttribute(displacementMap, 'in2', 'turbulence');
            this.renderer.setAttribute(displacementMap, 'in', 'SourceGraphic');
            this.renderer.setAttribute(displacementMap, 'scale', '10');
            this.renderer.setAttribute(displacementMap, 'xChannelSelector', 'R');
            this.renderer.setAttribute(displacementMap, 'yChannelSelector', 'G');

            switch (patternId){
                case 2:
                    this.renderer.setAttribute(turbulence, 'baseFrequency', '0.1 0.9');
                    this.renderer.setAttribute(turbulence, 'numOctaves', '10');
                    this.renderer.setAttribute(displacementMap, 'scale', '20')
                    break;
                case 3:
                    this.renderer.setAttribute(turbulence, 'baseFrequency', '0.01 0.57');
                    this.renderer.setAttribute(turbulence, 'numOctaves', '2');
                    break;
                case 4:
                    this.renderer.setAttribute(turbulence, 'baseFrequency', '0.05');
                    this.renderer.setAttribute(turbulence, 'numOctaves', '2');
                    break;
                case 5:
                    this.renderer.setAttribute(turbulence, 'type', 'fractalNoise');
                    this.renderer.setAttribute(turbulence, 'baseFrequency', '0.9');
                    this.renderer.setAttribute(turbulence, 'numOctaves', '4');
                    break;
            }
            this.renderer.appendChild(filter, turbulence);
            this.renderer.appendChild(filter, displacementMap);
        }
        return filter;
    }

    createSVGCircle(x: number, y: number): SVGCircleElement {
        const circle = this.renderer.createElement('circle', SVG_NS);
        this.renderer.setAttribute(circle, 'cx', x.toString());
        this.renderer.setAttribute(circle, 'cy', y.toString());
        this.renderer.setAttribute(circle, 'r', (this.currentWidth/2).toString());
        this.renderer.setAttribute(circle, 'stroke-linecap', 'round');
        this.renderer.setAttribute(circle, 'fill', this.currentColor);
        this.renderer.setAttribute(circle, 'stroke', this.currentColor);
        this.renderer.setAttribute(circle, 'filter', `url(#${this.currentPattern.toString()})`);
        this.renderer.appendChild(this.svgWrap, circle);
        return circle;
    }

    updatePreviewCircle(x: number, y: number): void {
        this.renderer.setAttribute(this.svgPreviewCircle, 'cx', x.toString());
        this.renderer.setAttribute(this.svgPreviewCircle, 'cy', y.toString());
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

