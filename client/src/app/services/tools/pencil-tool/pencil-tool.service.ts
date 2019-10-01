import { ElementRef, Injectable, Renderer2 } from '@angular/core';

import { StackTargetInfo } from 'src/classes/StackTargetInfo';
import { ToolName } from 'src/constants/tool-constants';
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
        const currentDrawStackLength = this.drawStack.getDrawStackLength();
        circle.addEventListener('mousedown', () => {
            this.drawStack.changeTargetElement(new StackTargetInfo(currentDrawStackLength, ToolName.Pencil));
        });
        return circle;
    }

    createSVGPath(): void {
        super.createSVGPath();
        const currentDrawStackLength = this.drawStack.getDrawStackLength();
        this.svgPath.addEventListener('mousedown', () => {
            this.drawStack.changeTargetElement(new StackTargetInfo(currentDrawStackLength, ToolName.Pencil));
        });
    }
}
