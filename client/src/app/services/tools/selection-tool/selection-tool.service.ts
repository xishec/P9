import { ElementRef, Injectable, Renderer2 } from '@angular/core';

import { Coords2D } from 'src/classes/Coords2D';
import { StackTargetInfo } from 'src/classes/StackTargetInfo';
import { KEYS, MOUSE, SIDEBAR_WIDTH, SVG_NS } from 'src/constants/constants';
import { DEFAULT_RADIX, HTML_ATTRIBUTE, ROTATION_ANGLE } from 'src/constants/tool-constants';
import { Selection } from '../../../../classes/selection/selection';
import { ClipboardService } from '../../clipboard/clipboard.service';
import { DrawStackService } from '../../draw-stack/draw-stack.service';
import { ManipulatorService } from '../../manipulator/manipulator.service';
import { UndoRedoerService } from '../../undo-redoer/undo-redoer.service';
import { AbstractToolService } from '../abstract-tools/abstract-tool.service';
import { MagnetismToolService } from '../magnetism-tool/magnetism-tool.service';

@Injectable({
    providedIn: 'root',
})
export class SelectionToolService extends AbstractToolService {
    currentMouseCoords: Coords2D = new Coords2D(0, 0);
    lastMouseCoords: Coords2D = new Coords2D(0, 0);
    initialMouseCoords: Coords2D = new Coords2D(0, 0);
    currentTarget = 0;

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

    constructor(
        public clipBoard: ClipboardService,
        public manipulator: ManipulatorService,
        public undoRedoerService: UndoRedoerService,
        public magnetismService: MagnetismToolService,
    ) {
        super();
    }

    selectAll(): void {
        this.clipBoard.restartDuplication();
        for (const el of this.drawStack.drawStack) {
            this.selection.addToSelection(el);
        }
        this.manipulator.updateOrigins(this.selection);
    }

    cleanUp(): void {
        this.selection.cleanUp();
        if (this.isSelecting) {
            this.renderer.removeChild(this.elementRef.nativeElement, this.selectionRectangle);
        }
        this.isLeftMouseDown = false;
        this.isRightMouseDown = false;
        this.isSelecting = false;
        this.isLeftMouseDragging = false;
        this.isRightMouseDragging = false;
        this.isTranslatingSelection = false;
        this.magnetismService.totalDeltaY = 0;
        this.magnetismService.totalDeltaX = 0;
    }

    initializeService(elementRef: ElementRef<SVGElement>, renderer: Renderer2, drawStack: DrawStackService): void {
        this.elementRef = elementRef;
        this.renderer = renderer;
        this.drawStack = drawStack;
        this.manipulator.initializeService(this.renderer);

        this.selectionRectangle = this.renderer.createElement('rect', SVG_NS);
        this.selection = new Selection(this.renderer, this.elementRef);
        this.magnetismService.initializeService(this.selection);
        this.drawStack.currentStackTarget.subscribe((stackTarget: StackTargetInfo) => {
            if (stackTarget.targetPosition !== undefined) {
                this.currentTarget = stackTarget.targetPosition;
                this.isOnTarget = true;
            }
        });

        this.clipBoard.initializeService(this.elementRef, this.renderer, this.drawStack, this.selection);
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
        this.renderer.setAttribute(this.selectionRectangle, HTML_ATTRIBUTE.width, deltaX.toString());

        // adjust y
        if (deltaY < 0) {
            deltaY *= -1;
            this.renderer.setAttribute(this.selectionRectangle, 'y', (this.initialMouseCoords.y - deltaY).toString());
        } else {
            this.renderer.setAttribute(this.selectionRectangle, 'y', this.initialMouseCoords.y.toString());
        }
        this.renderer.setAttribute(this.selectionRectangle, HTML_ATTRIBUTE.height, deltaY.toString());

        this.renderer.setAttribute(this.selectionRectangle, HTML_ATTRIBUTE.fill, 'white');
        this.renderer.setAttribute(this.selectionRectangle, 'fill-opacity', '0.3');
        this.renderer.setAttribute(this.selectionRectangle, HTML_ATTRIBUTE.stroke, 'black');
        this.renderer.setAttribute(this.selectionRectangle, HTML_ATTRIBUTE.stroke_dasharray, '5 5');
    }

    getDOMRect(el: SVGGElement): DOMRect {
        return el.getBoundingClientRect() as DOMRect;
    }

    getStrokeWidth(el: SVGGElement): number {
        if (el.getAttribute(HTML_ATTRIBUTE.stroke_width)) {
            return parseInt(el.getAttribute(HTML_ATTRIBUTE.stroke_width) as string, DEFAULT_RADIX);
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

    isAbleToRotate(): boolean {
        return !this.isTranslatingSelection && !this.isSelecting && this.selection.isAppended;
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
        } else if (
            (this.selection.mouseIsInSelectionBox(this.currentMouseCoords) && !this.isSelecting) ||
            this.isTranslatingSelection
        ) {
            this.isTranslatingSelection = true;
            const deltaX = this.currentMouseCoords.x - this.lastMouseCoords.x;
            const deltaY = this.currentMouseCoords.y - this.lastMouseCoords.y;
            if (this.magnetismService.isMagnetic.value) {
                const magnetizedCoords = this.magnetismService.magnetizeXY(deltaX, deltaY);
                this.manipulator.translateSelection(magnetizedCoords.x, magnetizedCoords.y, this.selection);
            } else {
                this.manipulator.translateSelection(deltaX, deltaY, this.selection);
            }
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
            case MOUSE.LeftButton:
                this.handleLeftMouseDown();
                break;

            case MOUSE.RightButton:
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
        } else if (this.isTranslatingSelection) {
            this.isTranslatingSelection = false;
            this.saveState();
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
        }
        this.isRightMouseDown = false;
        this.isRightMouseDragging = false;
        this.isOnTarget = false;
    }

    onMouseUp(event: MouseEvent): void {
        if (!this.isMouseInRef(event, this.elementRef)) {
            return;
        }
        this.clipBoard.restartDuplication();

        const button = event.button;

        switch (button) {
            case MOUSE.LeftButton:
                this.handleLeftMouseUp();
                break;

            case MOUSE.RightButton:
                this.handleRightMouseUp();
                break;

            default:
                break;
        }

        this.manipulator.updateOrigins(this.selection);
    }

    saveState() {
        this.undoRedoerService.saveCurrentState(this.drawStack.idStack);
    }

    // tslint:disable-next-line: no-empty
    onMouseEnter(event: MouseEvent): void {}
    // tslint:disable-next-line: no-empty
    onMouseLeave(event: MouseEvent): void {}

    onKeyDown(event: KeyboardEvent): void {
        const key = event.key;
        if (key === KEYS.Shift) {
            event.preventDefault();
            this.manipulator.isRotateOnSelf = true;
        } else if (key === KEYS.Alt) {
            event.preventDefault();
            this.manipulator.rotationStep = ROTATION_ANGLE.Alter;
        }
    }

    onKeyUp(event: KeyboardEvent): void {
        const key = event.key;
        if (key === KEYS.Shift) {
            event.preventDefault();
            this.manipulator.isRotateOnSelf = false;
        } else if (key === KEYS.Alt) {
            event.preventDefault();
            this.manipulator.rotationStep = ROTATION_ANGLE.Base;
        }
    }

    onWheel(event: WheelEvent): void {
        if (this.isAbleToRotate()) {
            event.preventDefault();
            this.manipulator.rotateSelection(event, this.selection);
            this.clipBoard.restartDuplication();
            this.saveState();
        }
    }
}
