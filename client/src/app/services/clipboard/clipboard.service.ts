import { ElementRef, Injectable, Renderer2 } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { SIDEBAR_WIDTH } from 'src/constants/constants';
import { OFFSET_STEP } from 'src/constants/tool-constants';
import { Selection } from '../../../classes/selection/selection';
import { DrawStackService } from '../draw-stack/draw-stack.service';
import { ManipulatorService } from '../manipulator/manipulator.service';
import { UndoRedoerService } from '../undo-redoer/undo-redoer.service';

@Injectable({
    providedIn: 'root',
})
export class ClipboardService {
    private renderer: Renderer2;
    private elementRef: ElementRef<SVGElement>;
    private drawStack: DrawStackService;
    private selection: Selection;

    private clippings: Set<SVGGElement> = new Set<SVGGElement>();
    private duplicationBuffer: Set<SVGGElement> = new Set<SVGGElement>();

    private pasteOffsetValue = 0;
    private duplicateOffsetValue = 0;

    private isFromInitialCut = false;
    private firstDuplication = true;
    isClippingsEmpty: BehaviorSubject<boolean> = new BehaviorSubject(true);

    private clippingsBound: DOMRect;

    constructor(public manipulator: ManipulatorService, private undoRedoerService: UndoRedoerService) {
        this.undoRedoerService.currentDuplicateOffset.subscribe((value) => {
            this.duplicateOffsetValue = value;
        });

        this.undoRedoerService.currentPasteOffset.subscribe((value) => {
            this.pasteOffsetValue = value;
        });

        this.undoRedoerService.currentClipping.subscribe((value) => {
            if (!this.compareClipings(value, this.clippings)) {
                this.pasteOffsetValue = 0;
                this.duplicateOffsetValue = 0;
            }
        });
    }

    private compareClipings(clip1: Set<SVGElement>, clip2: Set<SVGElement>): boolean {
        if (clip1.size !== clip2.size) {
            return false;
        }
        for (const elem of clip1) {
            if (!clip2.has(elem)) {
                return false;
            }
        }
        return true;
    }

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

    private clone(elementsToClone: Set<SVGGElement>, offset: number): void {
        const newSelection: Set<SVGGElement> = new Set<SVGGElement>();
        for (const el of elementsToClone) {
            const deepCopy: SVGGElement = el.cloneNode(true) as SVGGElement;
            this.drawStack.push(deepCopy, false);
            this.manipulator.translateElement(offset, offset, deepCopy);
            this.renderer.appendChild(this.elementRef.nativeElement, deepCopy);
            newSelection.add(deepCopy);
        }
        this.updateSelection(newSelection);
        this.manipulator.updateOrigins(this.selection);
    }

    private updateSelection(newSelection: Set<SVGGElement>): void {
        this.selection.emptySelection();
        for (const el of newSelection) {
            this.selection.addToSelection(el);
        }
    }

    private fetchSelectionBounds(): void {
        this.clippingsBound = this.selection.selectionBox.getBoundingClientRect() as DOMRect;
    }

    private handleDuplicateOutOfBounds(): void {
        this.fetchSelectionBounds();
        if (!this.isInBounds()) {
            this.duplicateOffsetValue = 0;
        }
    }

    private handlePasteOutOfBounds(): void {
        this.fetchSelectionBounds();
        if (!this.isInBounds()) {
            this.pasteOffsetValue = 0;
        }
    }

    private increasePasteOffsetValue(): void {
        this.pasteOffsetValue += OFFSET_STEP;
    }

    private increaseDuplicateOffsetValue(): void {
        this.duplicateOffsetValue += OFFSET_STEP;
    }

    private isInBounds(): boolean {
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

    private notifyClippingsState(): void {
        this.isClippingsEmpty.next(!(this.clippings.size > 0));
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
        this.notifyClippingsState();
        this.isFromInitialCut = true;
        setTimeout(() => {
            this.undoRedoerService.saveCurrentState(this.drawStack.idStack);
        }, 0);
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
        this.notifyClippingsState();
    }

    duplicate(): void {
        if (this.selection.selectedElements.size === 0) {
            return;
        }

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

        this.saveStateFromDuplicate();
    }

    private saveStateFromDuplicate() {
        this.undoRedoerService.saveStateAndDuplicateOffset(this.drawStack.idStack, this.duplicateOffsetValue);
    }

    paste(): void {
        if (this.clippings.size === 0) {
            return;
        }
        this.firstDuplication = true;
        this.handlePasteOutOfBounds();
        if (!this.isFromInitialCut) {
            this.increasePasteOffsetValue();
        } else {
            this.isFromInitialCut = false;
        }
        this.clone(this.clippings, this.pasteOffsetValue);

        this.saveStateFromPaste();
    }

    private saveStateFromPaste() {
        this.undoRedoerService.saveStateFromPaste(this.drawStack.idStack, this.pasteOffsetValue, this.clippings);
    }

    delete(): void {
        if (this.selection.selectedElements.size === 0) {
            return;
        }
        this.firstDuplication = true;
        this.duplicationBuffer.clear();
        for (const el of this.selection.selectedElements) {
            this.drawStack.delete(el);
            this.renderer.removeChild(this.elementRef.nativeElement, el);
        }
        this.selection.emptySelection();
        setTimeout(() => {
            this.undoRedoerService.saveCurrentState(this.drawStack.idStack);
        }, 0);
    }
}
