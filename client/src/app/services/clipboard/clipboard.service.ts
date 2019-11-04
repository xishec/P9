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

    offSetValue = 0;

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
            this.offSet(deep);
            this.offSetValue++;
            this.renderer.appendChild(this.elementRef.nativeElement, deep);
        }
    }

    delete(): void {
        for (const el of this.selection.selectedElements) {
            this.drawStack.delete(el);
            this.renderer.removeChild(this.elementRef.nativeElement, el);
        }
        this.selection.emptySelection();
    }

    offSet(el: SVGGElement): void {
        const transformsList = el.transform.baseVal;
        if (
            transformsList.numberOfItems === 0 ||
            transformsList.getItem(0).type !== SVGTransform.SVG_TRANSFORM_TRANSLATE
        ) {
            const svg: SVGSVGElement = this.renderer.createElement('svg', SVG_NS);
            const translateToZero = svg.createSVGTransform();
            translateToZero.setTranslate(0, 0);
            el.transform.baseVal.insertItemBefore(translateToZero, 0);
        }
        const initialTransform = transformsList.getItem(0);
        const offsetX = -initialTransform.matrix.e;
        const offsetY = -initialTransform.matrix.f;
        el.transform.baseVal.getItem(0).setTranslate(this.offSetValue - offsetX, this.offSetValue - offsetY);
    }
}
