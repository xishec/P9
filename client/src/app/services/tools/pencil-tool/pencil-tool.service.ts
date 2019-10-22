import { ElementRef, Injectable, Renderer2 } from '@angular/core';

import { DrawStackService } from '../../draw-stack/draw-stack.service';
import { TracingToolService } from '../abstract-tools/tracing-tool/tracing-tool.service';

@Injectable({
    providedIn: 'root',
})
export class PencilToolService extends TracingToolService {
    constructor(elementRef: ElementRef<SVGElement>, renderer: Renderer2, drawStack: DrawStackService) {
        super(elementRef, renderer, drawStack);
    }

    createSVGCircle(x: number, y: number): SVGCircleElement {
        const circle = super.createSVGCircle(x, y);
        return circle;
    }

    createSVGPath(): void {
        super.createSVGPath();
    }
}
