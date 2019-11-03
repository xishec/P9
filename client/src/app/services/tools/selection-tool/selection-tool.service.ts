import { ElementRef, Injectable, Renderer2 } from '@angular/core';
import { StackTargetInfo } from 'src/classes/StackTargetInfo';
import { Keys, Mouse, SIDEBAR_WIDTH, SVG_NS } from 'src/constants/constants';
import { HTMLAttribute } from 'src/constants/tool-constants';
import { Selection } from '../../../../classes/selection/selection';
import { DrawStackService } from '../../draw-stack/draw-stack.service';
import { AbstractToolService, MouseCoords } from '../abstract-tools/abstract-tool.service';
import { UndoRedoerService } from '../../undo-redoer/undo-redoer.service';

@Injectable({
    providedIn: 'root',
})
export class SelectionToolService extends AbstractToolService {
    currentMouseCoords: MouseCoords = {x: 0, y: 0};
    lastMouseCoords: MouseCoords = {x: 0, y: 0};
    initialMouseCoords: MouseCoords = {x: 0, y: 0};
    currentTarget = 0;

    isTheCurrentTool = false;
    isSelecting = false;
    isOnTarget = false;
    isLeftMouseDown = false;
    isRightMouseDown = false;
    isLeftMouseDragging = false;
    isTranslatingSelection = false;
    isRightMouseDragging = false;

    selection: Selection;

    selectionRectangle: SVGRectElement;

    elementRef: ElementRef<SVGElement>;
    renderer: Renderer2;
    drawStack: DrawStackService;

    constructor(private undoRedoerService: UndoRedoerService) {
        super();
    }

    cleanUp(): void {
        this.selection.cleanUp();
        if (this.isSelecting) {
            this.renderer.removeChild(this.elementRef.nativeElement, this.selectionRectangle);
        }
        this.isTheCurrentTool = false;
        this.isLeftMouseDown = false;
        this.isRightMouseDown = false;
        this.isSelecting = false;
        this.isLeftMouseDragging = false;
        this.isRightMouseDragging = false;
        this.isTranslatingSelection = false;
    }

    initializeService(elementRef: ElementRef<SVGElement>, renderer: Renderer2, drawStack: DrawStackService): void {
        this.elementRef = elementRef;
        this.renderer = renderer;
        this.drawStack = drawStack;

        this.selectionRectangle = this.renderer.createElement('rect', SVG_NS);
        this.selection = new Selection(this.renderer, this.elementRef);
        this.drawStack.currentStackTarget.subscribe((stackTarget: StackTargetInfo) => {
            if (stackTarget.targetPosition !== undefined && this.isTheCurrentTool) {
                this.currentTarget = stackTarget.targetPosition;
                this.isOnTarget = true;
            }
        });
    }

    updateSelectionRectangle(): void {
        let deltaX = this.currentMouseCoords.x - this.initialMouseCoords.x;
        let deltaY = this.currentMouseCoords.y - this.initialMouseCoords.y;

        // adjust x
        if (deltaX < 0) {
            deltaX *= -1;
            this.renderer.setAttribute(this.selectionRectangle, 'x', (this.initialMouseCoords.x - deltaX).toString());
        } else {
            this.renderer.setAttribute(this.selectionRectangle, 'x', this.initialMouseCoords.x.toString());
        }
        this.renderer.setAttribute(this.selectionRectangle, HTMLAttribute.width, deltaX.toString());

        // adjust y
        if (deltaY < 0) {
            deltaY *= -1;
            this.renderer.setAttribute(this.selectionRectangle, 'y', (this.initialMouseCoords.y - deltaY).toString());
        } else {
            this.renderer.setAttribute(this.selectionRectangle, 'y', this.initialMouseCoords.y.toString());
        }
        this.renderer.setAttribute(this.selectionRectangle, HTMLAttribute.height, deltaY.toString());

        this.renderer.setAttribute(this.selectionRectangle, HTMLAttribute.fill, 'white');
        this.renderer.setAttribute(this.selectionRectangle, 'fill-opacity', '0.3');
        this.renderer.setAttribute(this.selectionRectangle, HTMLAttribute.stroke, 'black');
        this.renderer.setAttribute(this.selectionRectangle, HTMLAttribute.stroke_dasharray, '5 5');
    }

    getDOMRect(el: SVGGElement): DOMRect {
        return el.getBoundingClientRect() as DOMRect;
    }

    getStrokeWidth(el: SVGGElement): number {
        if (el.getAttribute(HTMLAttribute.stroke_width)) {
            return parseInt(el.getAttribute(HTMLAttribute.stroke_width) as string, 10);
        }

        return 0;
    }

    isInSelection(selectionBox: DOMRect, elementBox: DOMRect, strokeWidth?: number): boolean {
        const boxLeft = selectionBox.x + window.scrollX - SIDEBAR_WIDTH;
        const boxRight = selectionBox.x + window.scrollX - SIDEBAR_WIDTH + selectionBox.width;
        const boxTop = selectionBox.y + window.scrollY;
        const boxBottom = selectionBox.y + window.scrollY + selectionBox.height;

        let elLeft = elementBox.x + window.scrollX - SIDEBAR_WIDTH;
        let elRight = elementBox.x + window.scrollX - SIDEBAR_WIDTH + elementBox.width;
        let elTop = elementBox.y + window.scrollY;
        let elBottom = elementBox.y + window.scrollY + elementBox.height;

        if (strokeWidth) {
            const halfStrokeWidth = strokeWidth / 2;

            elLeft = elLeft - halfStrokeWidth;
            elRight = elRight + halfStrokeWidth;
            elTop = elTop - halfStrokeWidth;
            elBottom = elBottom + halfStrokeWidth;
        }

        // Check all cases where el and box don't touch each other
        if (elRight < boxLeft || boxRight < elLeft || elBottom < boxTop || boxBottom < elTop) {
            return false;
        }

        return true;
    }

    singlySelect(stackPosition: number): void {
        this.selection.emptySelection();
        this.selection.addToSelection(this.drawStack.drawStack[stackPosition]);
        this.isOnTarget = false;
    }

    singlySelectInvert(stackPosition: number): void {
        this.selection.invertAddToSelection(this.drawStack.drawStack[stackPosition]);
        this.isOnTarget = false;
    }

    startSelection(): void {
        this.isSelecting = true;
        this.updateSelectionRectangle();
        this.renderer.appendChild(this.elementRef.nativeElement, this.selectionRectangle);
    }

    checkSelection(): void {
        const selectionBox = this.getDOMRect(this.selectionRectangle);
        for (const el of this.drawStack.drawStack) {
            const elBox = this.getDOMRect(el);
            this.selection.handleSelection(el, this.isInSelection(selectionBox, elBox, this.getStrokeWidth(el)));
        }
    }

    checkSelectionInverse(): void {
        const selectionBox = this.getDOMRect(this.selectionRectangle);
        for (const el of this.drawStack.drawStack) {
            const elBox = this.getDOMRect(el);
            this.selection.handleInvertSelection(el, this.isInSelection(selectionBox, elBox, this.getStrokeWidth(el)));
        }
    }

    handleLeftMouseDrag(): void {
        this.isLeftMouseDragging = true;

        if (this.isOnTarget && !this.selection.selectedElements.has(this.drawStack.drawStack[this.currentTarget])) {
            this.singlySelect(this.currentTarget);
        } else if (this.selection.mouseIsInSelectionBox(this.currentMouseCoords) && !this.isSelecting || this.isTranslatingSelection) {
            this.isTranslatingSelection = true;
            this.selection.moveBy(this.currentMouseCoords, this.lastMouseCoords);
        } else {
            this.startSelection();
            this.updateSelectionRectangle();
            this.checkSelection();
        }
    }

    handleRightMouseDrag(): void {
        this.isRightMouseDragging = true;

        this.startSelection();
        this.updateSelectionRectangle();
        this.checkSelectionInverse();
    }

    onMouseMove(event: MouseEvent): void {
        this.lastMouseCoords.x = this.currentMouseCoords.x;
        this.lastMouseCoords.y = this.currentMouseCoords.y;
        this.currentMouseCoords.x = event.clientX - this.elementRef.nativeElement.getBoundingClientRect().left;
        this.currentMouseCoords.y = event.clientY - this.elementRef.nativeElement.getBoundingClientRect().top;

        if (this.isLeftMouseDown && !this.isRightMouseDown) {
            this.handleLeftMouseDrag();
        } else if (this.isRightMouseDown && !this.isLeftMouseDown) {
            this.handleRightMouseDrag();
        }
    }

    handleLeftMouseDown(): void {
        this.isLeftMouseDown = true;
        this.initialMouseCoords.x = this.currentMouseCoords.x;
        this.initialMouseCoords.y = this.currentMouseCoords.y;
    }

    handleRightMouseDown(): void {
        this.isRightMouseDown = true;
        this.initialMouseCoords.x = this.currentMouseCoords.x;
        this.initialMouseCoords.y = this.currentMouseCoords.y;
        this.selection.invertSelectionBuffer.clear();
    }

    onMouseDown(event: MouseEvent): void {
        const button = event.button;

        switch (button) {
            case Mouse.LeftButton:
                this.handleLeftMouseDown();
                break;

            case Mouse.RightButton:
                this.handleRightMouseDown();
                break;

            default:
                break;
        }
    }

    handleLeftMouseUp(): void {
        this.renderer.removeChild(this.elementRef.nativeElement, this.selectionRectangle);

        if (this.isSelecting) {
            this.isSelecting = false;
        } else if (this.isOnTarget && !this.isTranslatingSelection) {
            this.singlySelect(this.currentTarget);
            this.isOnTarget = false;
        } else if (this.isTranslatingSelection) {
            this.isTranslatingSelection = false;

            // FOR UNDO REDOER SERVICE 
            setTimeout(() => {
                this.selection.removeFullSelectionBox();
            }, 1);
            setTimeout(() => {
                this.undoRedoerService.saveCurrentState(this.drawStack.idStack);
            }, 1);
            setTimeout(() => {
                this.selection.appendFullSelectionBox();
            }, 1);
            //

        } else {
            this.selection.emptySelection();
        }

        this.isLeftMouseDown = false;
        this.isLeftMouseDragging = false;
        this.isOnTarget = false;
    }

    handleRightMouseUp(): void {
        this.renderer.removeChild(this.elementRef.nativeElement, this.selectionRectangle);

        if (this.isSelecting) {
            this.isSelecting = false;
        } else if (this.isOnTarget) {
            this.singlySelectInvert(this.currentTarget);
            this.isOnTarget = false;
        }
        this.isRightMouseDown = false;
        this.isRightMouseDragging = false;
        this.isOnTarget = false;
    }

    onMouseUp(event: MouseEvent): void {
        const button = event.button;

        switch (button) {
            case Mouse.LeftButton:
                this.handleLeftMouseUp();
                break;

            case Mouse.RightButton:
                this.handleRightMouseUp();
                break;

            default:
                break;
        }
    }

    onMouseEnter(event: MouseEvent): void {
        this.isTheCurrentTool = true;
    }
    onMouseLeave(event: MouseEvent): void {
        this.isTheCurrentTool = true;
    }
    // tslint:disable-next-line: no-empty
    onKeyDown(event: KeyboardEvent): void {}
    onKeyUp(event: KeyboardEvent): void {
        if (event.key === Keys.s) {
            this.isTheCurrentTool = true;
        }
    }
}
