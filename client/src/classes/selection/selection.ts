import { Renderer2 } from '@angular/core';
import { HTMLAttribute } from 'src/constants/tool-constants';

export class Selection {
    selection: Set<SVGGElement> = new Set();
    selectionBox: SVGRectElement;
    controlPoints: Map<string, SVGCircleElement> = new Map();

    initSelectionBox(renderer: Renderer2): void {
        renderer.setAttribute(this.selectionBox, HTMLAttribute.stroke, 'blue');
        renderer.setAttribute(this.selectionBox, HTMLAttribute.fill, 'none');
    }

    initControlPoints(renderer: Renderer2): void {
        // for (let i = 0; i < 8; i++) {
        //     this.controlPoints[i] = this.renderer.createElement('circle', SVG_NS);
        //     this.renderer.setAttribute(this.controlPoints[i], 'r', this.CONTROL_POINT_RADIUS.toString());
        //     this.renderer.setAttribute(this.controlPoints[i], HTMLAttribute.stroke, 'blue');
        //     this.renderer.setAttribute(this.controlPoints[i], HTMLAttribute.fill, 'white');
        // }
    }

    removeFullSelectionBox(renderer: Renderer2, svgRef: SVGElement): void {

    }

    removeSelectionBox(renderer: Renderer2, svgRef: SVGElement): void {

    }

    removeControlPoints(renderer: Renderer2, svgRef: SVGElement): void {

    }
}
