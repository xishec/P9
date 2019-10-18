import { ElementRef, Injectable, Renderer2 } from '@angular/core';

import { SVG_NS } from '../../../../constants/constants';
import { DrawStackService } from '../../draw-stack/draw-stack.service';
import { TracingToolService } from '../abstract-tools/tracing-tool/tracing-tool.service';
import { AttributesManagerService } from '../attributes-manager/attributes-manager.service';

@Injectable({
    providedIn: 'root',
})
export class BrushToolService extends TracingToolService {
    private currentStyle = 1;

    constructor(elementRef: ElementRef<SVGElement>, renderer: Renderer2, drawStack: DrawStackService) {
        super(elementRef, renderer, drawStack);
    }

    initializeAttributesManagerService(attributesManagerService: AttributesManagerService) {
        super.initializeAttributesManagerService(attributesManagerService);
        this.attributesManagerService.currentStyle.subscribe((style) => {
            this.currentStyle = style;
        });
    }

    createSVGWrapper(): void {
        super.createSVGWrapper();
        const filter: SVGFilterElement = this.createFilter(this.currentStyle);
        this.renderer.appendChild(this.svgWrap, filter);
    }

    createFilter(patternId: number): SVGFilterElement {
        const filter = this.renderer.createElement('filter', SVG_NS);

        this.renderer.setAttribute(filter, 'id', this.currentStyle.toString());
        this.renderer.setAttribute(filter, 'filterUnits', 'objectBoundingBox');
        this.renderer.setAttribute(filter, 'height', '100px');
        this.renderer.setAttribute(filter, 'width', '100px');
        this.renderer.setAttribute(filter, 'x', '-50px');
        this.renderer.setAttribute(filter, 'y', '-50px');

        if (patternId === 1 || patternId === 2) {
            this.createGaussianBlurFilter(filter);
        }
        if (patternId !== 1) {
            this.createTurbulenceDisplacementFilter(filter, patternId);
        }
        return filter;
    }

    createTurbulenceDisplacementFilter(filter: SVGFilterElement, patternId: number): void {
        const turbulence = this.renderer.createElement('feTurbulence', SVG_NS);
        this.renderer.setAttribute(turbulence, 'type', 'turbulence');
        this.renderer.setAttribute(turbulence, 'result', 'turbulence');

        const displacementMap = this.renderer.createElement('feDisplacementMap', SVG_NS);
        this.renderer.setAttribute(displacementMap, 'in2', 'turbulence');
        this.renderer.setAttribute(displacementMap, 'in', 'SourceGraphic');
        this.renderer.setAttribute(displacementMap, 'scale', '10');
        this.renderer.setAttribute(displacementMap, 'xChannelSelector', 'R');
        this.renderer.setAttribute(displacementMap, 'yChannelSelector', 'G');

        switch (patternId) {
            case 2:
                this.renderer.setAttribute(turbulence, 'baseFrequency', '0.1 0.9');
                this.renderer.setAttribute(turbulence, 'numOctaves', '10');
                this.renderer.setAttribute(displacementMap, 'scale', '20');
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

    createGaussianBlurFilter(filter: SVGFilterElement): void {
        const effect = this.renderer.createElement('feGaussianBlur', SVG_NS);
        this.renderer.setAttribute(effect, 'stdDeviation', '3');
        this.renderer.appendChild(filter, effect);
    }

    createSVGCircle(x: number, y: number): SVGCircleElement {
        const circle = super.createSVGCircle(x, y);
        this.renderer.setAttribute(circle, 'filter', `url(#${this.currentStyle.toString()})`);
        return circle;
    }

    createSVGPath(): void {
        super.createSVGPath();
        this.renderer.setAttribute(this.svgPath, 'filter', `url(#${this.currentStyle})`);
    }

    // tslint:disable-next-line: no-empty
    cleanUp(): void {}
}
