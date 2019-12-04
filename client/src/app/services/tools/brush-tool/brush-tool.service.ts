import { ElementRef, Injectable, Renderer2 } from '@angular/core';

import { BRUSH_STYLE, HTML_ATTRIBUTE } from 'src/constants/tool-constants';
import { SVG_NS } from '../../../../constants/constants';
import { DrawStackService } from '../../draw-stack/draw-stack.service';
import { TracingToolService } from '../abstract-tools/tracing-tool/tracing-tool.service';
import { AttributesManagerService } from '../attributes-manager/attributes-manager.service';
import { ColorToolService } from '../color-tool/color-tool.service';

@Injectable({
    providedIn: 'root',
})
export class BrushToolService extends TracingToolService {
    private style: BRUSH_STYLE = BRUSH_STYLE.type1;

    constructor(private colorToolService: ColorToolService) {
        super();
        this.colorToolService.primaryColor.subscribe((currentColor: string) => {
            this.currentColorAndOpacity = currentColor;
        });
    }

    initializeService(elementRef: ElementRef<SVGElement>, renderer: Renderer2, drawStack: DrawStackService) {
        super.initializeService(elementRef, renderer, drawStack);
    }

    initializeAttributesManagerService(attributesManagerService: AttributesManagerService) {
        super.initializeAttributesManagerService(attributesManagerService);
        this.attributesManagerService.style.subscribe((style: BRUSH_STYLE) => {
            this.style = style;
        });
    }

    createSVGWrapper(): void {
        super.createSVGWrapper();
        const filter: SVGFilterElement = this.createFilter(this.style);
        this.renderer.appendChild(this.svgWrap, filter);
    }

    createFilter(patternId: BRUSH_STYLE): SVGFilterElement {
        const filter = this.renderer.createElement('filter', SVG_NS);

        this.renderer.setAttribute(filter, 'id', this.style.toString());
        this.renderer.setAttribute(filter, 'filterUnits', 'objectBoundingBox');
        this.renderer.setAttribute(filter, HTML_ATTRIBUTE.Height, '100px');
        this.renderer.setAttribute(filter, HTML_ATTRIBUTE.Width, '100px');
        this.renderer.setAttribute(filter, HTML_ATTRIBUTE.X, '-50px');
        this.renderer.setAttribute(filter, HTML_ATTRIBUTE.Y, '-50px');

        if (patternId === BRUSH_STYLE.type1 || patternId === BRUSH_STYLE.type2) {
            this.createGaussianBlurFilter(filter);
        }
        if (patternId !== BRUSH_STYLE.type1) {
            this.createTurbulenceDisplacementFilter(filter, patternId);
        }
        return filter;
    }

    createTurbulenceDisplacementFilter(filter: SVGFilterElement, patternId: BRUSH_STYLE): void {
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
            case BRUSH_STYLE.type2:
                this.renderer.setAttribute(turbulence, HTML_ATTRIBUTE.BaseFrequency, '0.1 0.9');
                this.renderer.setAttribute(turbulence, HTML_ATTRIBUTE.NumOctaves, '10');
                this.renderer.setAttribute(displacementMap, 'scale', '20');
                break;
            case BRUSH_STYLE.type3:
                this.renderer.setAttribute(turbulence, HTML_ATTRIBUTE.BaseFrequency, '0.01 0.57');
                this.renderer.setAttribute(turbulence, HTML_ATTRIBUTE.NumOctaves, '2');
                break;
            case BRUSH_STYLE.type4:
                this.renderer.setAttribute(turbulence, HTML_ATTRIBUTE.BaseFrequency, '0.05');
                this.renderer.setAttribute(turbulence, HTML_ATTRIBUTE.NumOctaves, '2');
                break;
            case BRUSH_STYLE.type5:
                this.renderer.setAttribute(turbulence, 'type', 'fractalNoise');
                this.renderer.setAttribute(turbulence, HTML_ATTRIBUTE.BaseFrequency, '0.9');
                this.renderer.setAttribute(turbulence, HTML_ATTRIBUTE.NumOctaves, '4');
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
        this.renderer.setAttribute(circle, HTML_ATTRIBUTE.Filter, `url(#${this.style.toString()})`);
        return circle;
    }

    createSVGPath(): void {
        super.createSVGPath();
        this.renderer.setAttribute(this.svgPath, HTML_ATTRIBUTE.Filter, `url(#${this.style})`);
    }
}
