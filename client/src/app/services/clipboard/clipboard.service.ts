import { Injectable, Renderer2, ElementRef } from '@angular/core';
import { DrawStackService } from '../draw-stack/draw-stack.service';
import { Selection } from '../../../classes/selection/selection';
import { SVG_NS } from 'src/constants/constants';

@Injectable({
    providedIn: 'root',
})
export class ClipboardService {
    renderer: Renderer2;
    elementRef: ElementRef<SVGElement>;
    drawStack: DrawStackService;
    selection: Selection;

    clippings: Set<SVGGElement> = new Set<SVGGElement>();

    constructor() {}

    initializeService(
        elementRef: ElementRef<SVGElement>,
        renderer: Renderer2,
        drawStack: DrawStackService,
        selection: Selection
    ): void {
        this.renderer = renderer;
        this.elementRef = elementRef;
        this.drawStack = drawStack;
        this.selection = selection;
    }

    cut(): void {
        this.clippings.clear();
        for (const el of this.selection.selectedElements) {
            this.clippings.add(el);
            this.drawStack.delete(el);
            this.renderer.removeChild(this.elementRef.nativeElement, el);
        }
        this.selection.emptySelection();
    }

    copy(): void {}

    paste(): void {
        for (const el of this.clippings) {
            let deep: SVGGElement = el.cloneNode(true) as SVGGElement;
            this.drawStack.push(deep);
            this.renderer.appendChild(this.elementRef.nativeElement, deep);
        }
    }

    delete(): void {}
}
