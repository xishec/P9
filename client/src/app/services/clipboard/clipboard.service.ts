import { ElementRef, Injectable, Renderer2 } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { SIDEBAR_WIDTH } from 'src/constants/constants';
import { OFFSET_STEP } from 'src/constants/tool-constants';
import { Selection } from '../../../classes/selection/selection';
import { DrawStackService } from '../draw-stack/draw-stack.service';
import { ManipulatorService } from '../manipulator/manipulator.service';

@Injectable({
    providedIn: 'root',
})
export class ClipboardService {
    renderer: Renderer2;
    elementRef: ElementRef<SVGElement>;
    drawStack: DrawStackService;
    selection: Selection;

    clippings: Set<SVGGElement> = new Set<SVGGElement>();
    duplicationBuffer: Set<SVGGElement> = new Set<SVGGElement>();

    pasteOffsetValue = 0;
    duplicateOffsetValue = 0;

    firstDuplication = true;
    isClippingsEmpty: BehaviorSubject<boolean> = new BehaviorSubject(true);

    clippingsBound: DOMRect;

    constructor(public manipulator: ManipulatorService) {}

    initializeService(
        elementRef: ElementRef<SVGElement>,
        renderer: Renderer2,
        drawStack: DrawStackService,
        selection: Selection,
    ): void {
        this.renderer = renderer;
        this.elementRef = elementRef;
        this.drawStack = drawStack;
        this.selection = selection;
    }

    restartDuplication(): void {
        this.duplicationBuffer.clear();
        for (const el of this.selection.selectedElements) {
            this.duplicationBuffer.add(el);
        }
        this.firstDuplication = true;
    }

    clone(elementsToClone: Set<SVGGElement>, offset: number): void {
        const newSelection: Set<SVGGElement> = new Set<SVGGElement>();
        for (const el of elementsToClone) {
            const deepCopy: SVGGElement = el.cloneNode(true) as SVGGElement;
            this.drawStack.push(deepCopy);
            this.manipulator.offsetSingle(offset, deepCopy);
            this.renderer.appendChild(this.elementRef.nativeElement, deepCopy);
            newSelection.add(deepCopy);
        }
        this.updateSelection(newSelection);
    }

    updateSelection(newSelection: Set<SVGGElement>): void {
        this.selection.emptySelection();
        for (const el of newSelection) {
            this.selection.addToSelection(el);
        }
    }

    fetchSelectionBounds(): void {
        this.clippingsBound = this.selection.selectionBox.getBoundingClientRect() as DOMRect;
    }

    handleDuplicateOutOfBounds(): void {
        this.fetchSelectionBounds();
        if (!this.isInBounds()) {
            this.duplicateOffsetValue = 0;
        }
    }

    handlePasteOutOfBounds(): void {
        this.fetchSelectionBounds();
        if (!this.isInBounds()) {
            this.pasteOffsetValue = 0;
        }
    }

    increasePasteOffsetValue(): void {
        this.pasteOffsetValue += OFFSET_STEP;
    }

    decreasePasteOffsetValue(): void {
        this.pasteOffsetValue -= OFFSET_STEP;
        if (this.pasteOffsetValue < 0) {
            this.pasteOffsetValue = 0;
        }
    }

    increaseDuplicateOffsetValue(): void {
        this.duplicateOffsetValue += OFFSET_STEP;
    }

    decreaseDuplicateOffsetValue(): void {
        this.duplicateOffsetValue -= OFFSET_STEP;
        if (this.duplicateOffsetValue < 0) {
            this.duplicateOffsetValue = 0;
        }
    }

    isInBounds(): boolean {
        const boxLeft = this.clippingsBound.x + window.scrollX - SIDEBAR_WIDTH;
        const boxTop = this.clippingsBound.y + window.scrollY;
        const parentBoxRight =
            (this.elementRef.nativeElement.getBoundingClientRect() as DOMRect).x +
            window.scrollX -
            SIDEBAR_WIDTH +
            (this.elementRef.nativeElement.getBoundingClientRect() as DOMRect).width;
        const parentBoxBottom =
            (this.elementRef.nativeElement.getBoundingClientRect() as DOMRect).y +
            window.scrollY +
            (this.elementRef.nativeElement.getBoundingClientRect() as DOMRect).height;

        return boxLeft < parentBoxRight && boxTop < parentBoxBottom;
    }

    cut(): void {
        this.firstDuplication = true;
        this.clippings.clear();
        this.duplicationBuffer.clear();
        this.fetchSelectionBounds();
        this.pasteOffsetValue = 0;
        for (const el of this.selection.selectedElements) {
            this.clippings.add(el);
            this.drawStack.delete(el);
            this.renderer.removeChild(this.elementRef.nativeElement, el);
        }
        this.selection.emptySelection();
        this.clippings.size > 0 ? this.isClippingsEmpty.next(false) : this.isClippingsEmpty.next(true);
    }

    copy(): void {
        this.firstDuplication = true;
        this.clippings.clear();
        this.duplicationBuffer.clear();
        this.fetchSelectionBounds();
        this.pasteOffsetValue = 0;
        for (const el of this.selection.selectedElements) {
            this.clippings.add(el);
        }
        this.clippings.size > 0 ? this.isClippingsEmpty.next(false) : this.isClippingsEmpty.next(true);
    }

    duplicate(): void {
        if (this.firstDuplication && this.selection.selectedElements.size > 0) {
            this.duplicationBuffer.clear();
            for (const el of this.selection.selectedElements) {
                this.duplicationBuffer.add(el);
            }
            this.duplicateOffsetValue = 0;
            this.firstDuplication = false;
        }
        this.handleDuplicateOutOfBounds();
        this.increaseDuplicateOffsetValue();
        this.clone(this.duplicationBuffer, this.duplicateOffsetValue);
    }

    paste(): void {
        this.firstDuplication = true;
        this.handlePasteOutOfBounds();
        this.increasePasteOffsetValue();
        this.clone(this.clippings, this.pasteOffsetValue);
    }

    delete(): void {
        this.firstDuplication = true;
        this.duplicationBuffer.clear();
        for (const el of this.selection.selectedElements) {
            this.drawStack.delete(el);
            this.renderer.removeChild(this.elementRef.nativeElement, el);
        }
        this.selection.emptySelection();
    }
}
