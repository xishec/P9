import { Injectable, Renderer2, ElementRef } from '@angular/core';
import { DrawStackService } from '../draw-stack/draw-stack.service';
import { Selection } from '../../../classes/selection/selection';
import { SVG_NS, SIDEBAR_WIDTH } from 'src/constants/constants';

@Injectable({
    providedIn: 'root',
})
export class ClipboardService {
    renderer: Renderer2;
    elementRef: ElementRef<SVGElement>;
    drawStack: DrawStackService;
    selection: Selection;

    clippings: Set<SVGGElement> = new Set<SVGGElement>();
    buffer: Set<SVGGElement> = new Set<SVGGElement>();

    offsetValue = 0;
    initialDuplicateOffset = {x: 0, y: 0};

    firstDuplication = true;

    clippingsBound: DOMRect;

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

    restartOffset(): void {
        this.offsetValue = 0;
        this.buffer.clear();
        for (const el of this.selection.selectedElements) {
            this.buffer.add(el);
        }
        this.firstDuplication = true;
    }

    fetchSelectionBounds(): void {
        this.clippingsBound = this.selection.selectionBox.getBoundingClientRect() as DOMRect;
    }

    increaseOffsetValue(): void {
        this.offsetValue += 5;
    }

    isInBounds(): boolean {
        const boxLeft = this.clippingsBound.x + window.scrollX - SIDEBAR_WIDTH;
        const boxTop = this.clippingsBound.y + window.scrollY;
        const parentBoxRight = (this.elementRef.nativeElement.getBoundingClientRect() as DOMRect).x + window.scrollX - SIDEBAR_WIDTH + (this.elementRef.nativeElement.getBoundingClientRect() as DOMRect).width;
        const parentBoxBottom = (this.elementRef.nativeElement.getBoundingClientRect() as DOMRect).y + window.scrollY + (this.elementRef.nativeElement.getBoundingClientRect() as DOMRect).height;

        return (boxLeft < parentBoxRight && boxTop < parentBoxBottom);
    }

    cut(): void {
        this.firstDuplication = true;
        this.clippings.clear();
        this.fetchSelectionBounds();
        this.offsetValue = 0;
        for (const el of this.selection.selectedElements) {
            this.clippings.add(el);
            this.drawStack.delete(el);
            this.renderer.removeChild(this.elementRef.nativeElement, el);
        }
        this.selection.emptySelection();
    }

    copy(): void {
        this.firstDuplication = true;
        this.clippings.clear();
        this.fetchSelectionBounds();
        this.offsetValue = 0;
        for (const el of this.selection.selectedElements) {
            this.clippings.add(el);
        }
    }

    duplicate(): void {
        if (this.firstDuplication) {
            this.buffer.clear();
            for (const el of this.selection.selectedElements) {
            this.buffer.add(el);
            }
            this.offsetValue = 0;
            this.firstDuplication = false;
            this.increaseOffsetValue();
        }

        this.fetchSelectionBounds();
        if (!this.isInBounds()) {
            this.offsetValue = 0;
            this.increaseOffsetValue();
        }

        let dupBuffer: Set<SVGGElement> = new Set<SVGGElement>();
        for (const el of this.buffer) {
            let deepCopy: SVGGElement = el.cloneNode(true) as SVGGElement;
            this.drawStack.push(deepCopy);
            this.offSet(deepCopy);
            this.renderer.appendChild(this.elementRef.nativeElement, deepCopy);
            dupBuffer.add(deepCopy);
        }

        this.increaseOffsetValue();

        this.selection.emptySelection();
        for(const el of dupBuffer){
            this.selection.addToSelection(el);
        }
    }

    paste(): void {
        this.increaseOffsetValue();
        this.firstDuplication = true;
        this.fetchSelectionBounds();
        if (!this.isInBounds()) {
            this.offsetValue = 0;
        }
        let dupBuffer: Set<SVGGElement> = new Set<SVGGElement>();
        for (const el of this.clippings) {
            let deepCopy: SVGGElement = el.cloneNode(true) as SVGGElement;
            this.drawStack.push(deepCopy);
            this.offSet(deepCopy);
            this.renderer.appendChild(this.elementRef.nativeElement, deepCopy);
            dupBuffer.add(deepCopy);
        }
        this.selection.emptySelection();
        for(const el of dupBuffer){
            this.selection.addToSelection(el);
        }
    }

    delete(): void {
        this.firstDuplication = true;
        for (const el of this.selection.selectedElements) {
            this.drawStack.delete(el);
            this.renderer.removeChild(this.elementRef.nativeElement, el);
        }
        this.selection.emptySelection();
    }

    preventAdditionnalOffset(el: SVGGElement): void {
        const svg: SVGSVGElement = this.renderer.createElement('svg', SVG_NS);
        const translateToZero = svg.createSVGTransform();
        translateToZero.setTranslate(0, 0);
        el.transform.baseVal.insertItemBefore(translateToZero, 0);
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
        el.transform.baseVal.getItem(0).setTranslate(this.offsetValue - offsetX, this.offsetValue - offsetY);
    }
}
