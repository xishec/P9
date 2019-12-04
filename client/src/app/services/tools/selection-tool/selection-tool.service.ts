import { ElementRef, Injectable, Renderer2 } from '@angular/core';

import { Coords2D } from 'src/classes/Coords2D';
import { StackTargetInfo } from 'src/classes/StackTargetInfo';
import { KEYS, MOUSE, SIDEBAR_WIDTH, SVG_NS } from 'src/constants/constants';
import { DEFAULT_RADIX, HTML_ATTRIBUTE, ROTATION_ANGLE, SELECTION_BOX_CURSOR_STYLES } from 'src/constants/tool-constants';
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
    private currentMouseCoords: Coords2D = new Coords2D(0, 0);
    private lastMouseCoords: Coords2D = new Coords2D(0, 0);
    private initialMouseCoords: Coords2D = new Coords2D(0, 0);
    private currentTarget = 0;

    private isSelecting = false;
    private isOnTarget = false;
    private isLeftMouseDown = false;
    private isRightMouseDown = false;
    private isTranslatingSelection = false;
    private isScalingSelection = false;

    selection: Selection;

    selectionRectangle: SVGRectElement;

    elementRef: ElementRef<SVGElement>;
    renderer: Renderer2;
    drawStack: DrawStackService;

    constructor(
        public clipBoard: ClipboardService,
        private manipulator: ManipulatorService,
        private undoRedoerService: UndoRedoerService,
        private magnetismService: MagnetismToolService,
    ) {
        super();
    }

    selectAll(): void {
        this.clipBoard.restartDuplication();
        for (const el of this.drawStack.drawStack) {
            this.selection.addToSelection(el);
        }
        this.manipulator.updateOrigins(this.selection);
        this.updateCursorStyleOnSelectionBox();
    }

    updateCursorStyleOnSelectionBox(): void {
        if (this.selection.mouseIsInControlPoint(this.currentMouseCoords) || this.selection.isInputOnControlPoint) {
            return;
        }
        if(this.selection.mouseIsInSelectionBox(this.currentMouseCoords)){
            this.renderer.setStyle(this.elementRef.nativeElement, 'cursor', 'move');
        } else {
            this.renderer.setStyle(this.elementRef.nativeElement, 'cursor', 'default');
        }
    }

    cleanUp(): void {
        this.selection.cleanUp();
        this.renderer.setStyle(this.elementRef.nativeElement, 'cursor', 'default');
        if (this.isSelecting) {
            this.renderer.removeChild(this.elementRef.nativeElement, this.selectionRectangle);
        }
        this.isLeftMouseDown = false;
        this.isRightMouseDown = false;
        this.isSelecting = false;
        this.isTranslatingSelection = false;
        this.isScalingSelection = false;
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

    private updateSelectionRectangle(): void {
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

    private getDOMRect(el: SVGGElement): DOMRect {
        return el.getBoundingClientRect() as DOMRect;
    }

    private getStrokeWidth(el: SVGGElement): number {
        if (el.getAttribute(HTML_ATTRIBUTE.stroke_width)) {
            return parseInt(el.getAttribute(HTML_ATTRIBUTE.stroke_width) as string, DEFAULT_RADIX);
        }

        return 0;
    }

    private isInSelection(selectionBox: DOMRect, elementBox: DOMRect, strokeWidth?: number): boolean {
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

    private isAbleToRotate(): boolean {
        return (
            !this.isTranslatingSelection && !this.isSelecting && !this.isScalingSelection && this.selection.isAppended
        );
    }

    private singlySelect(stackPosition: number): void {
        this.selection.emptySelection();
        this.selection.addToSelection(this.drawStack.drawStack[stackPosition]);
        this.isOnTarget = false;
    }

    private singlySelectInvert(stackPosition: number): void {
        this.selection.invertAddToSelection(this.drawStack.drawStack[stackPosition]);
        this.isOnTarget = false;
    }

    private startSelection(): void {
        this.isSelecting = true;
        this.updateSelectionRectangle();
        this.renderer.appendChild(this.elementRef.nativeElement, this.selectionRectangle);
    }

    private checkSelection(): void {
        const selectionBox = this.getDOMRect(this.selectionRectangle);
        for (const el of this.drawStack.drawStack) {
            const elBox = this.getDOMRect(el);
            this.selection.handleSelection(el, this.isInSelection(selectionBox, elBox, this.getStrokeWidth(el)));
        }
    }

    private checkSelectionInverse(): void {
        const selectionBox = this.getDOMRect(this.selectionRectangle);
        for (const el of this.drawStack.drawStack) {
            const elBox = this.getDOMRect(el);
            this.selection.handleInvertSelection(el, this.isInSelection(selectionBox, elBox, this.getStrokeWidth(el)));
        }
    }

    private isAbleToScale(): boolean {
        return (
            this.selection.mouseIsInControlPoint(this.currentMouseCoords) &&
            !this.isSelecting &&
            !this.isTranslatingSelection
        );
    }

    private isAbleToTranslate(): boolean {
        return (
            this.selection.mouseIsInSelectionBox(this.currentMouseCoords) &&
            !this.isSelecting &&
            !this.isScalingSelection
        );
    }

    private handleLeftMouseDrag(): void {
        if (this.isOnTarget && !this.selection.selectedElements.has(this.drawStack.drawStack[this.currentTarget])) {
            this.singlySelect(this.currentTarget);
        } else if (this.isScalingSelection || this.isAbleToScale()) {
            this.isScalingSelection = true;
            this.manipulator.scaleSelection(this.currentMouseCoords, this.selection.activeControlPoint, this.selection);
        } else if (this.isTranslatingSelection || this.isAbleToTranslate()) {
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

    private handleRightMouseDrag(): void {
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

        this.updateCursorStyleOnSelectionBox();
    }

    private handleLeftMouseDown(): void {
        this.isLeftMouseDown = true;
        this.initialMouseCoords.x = this.currentMouseCoords.x;
        this.initialMouseCoords.y = this.currentMouseCoords.y;

        if (this.selection.mouseIsInControlPoint(this.currentMouseCoords)) {
            this.saveOriginalSelectionBoxState();
            this.manipulator.initTransformMatrix(this.selection);
            this.selection.isInputOnControlPoint = true;
            this.renderer.setStyle(this.elementRef.nativeElement, 'cursor', SELECTION_BOX_CURSOR_STYLES.get(parseInt(this.selection.activeControlPoint.getAttribute('controlPointId') as string)));
        }
    }

    private saveOriginalSelectionBoxState(): void {
        this.selection.ogSelectionBoxHeight = this.getDOMRect(this.selection.selectionBox).height;
        this.selection.ogSelectionBoxWidth = this.getDOMRect(this.selection.selectionBox).width;

        this.selection.ogSelectionBoxPositions = new Coords2D(
            this.getDOMRect(this.selection.selectionBox).left - SIDEBAR_WIDTH + window.scrollX,
            this.getDOMRect(this.selection.selectionBox).top + window.scrollY,
        );

        this.selection.ogActiveControlPointCoords = new Coords2D(
            this.selection.getControlPointCx(this.selection.activeControlPoint) + window.scrollX,
            this.selection.getControlPointCy(this.selection.activeControlPoint) + window.scrollY,
        );
    }

    private handleRightMouseDown(): void {
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

        this.updateCursorStyleOnSelectionBox();
    }

    private handleLeftMouseUp(): void {
        this.renderer.removeChild(this.elementRef.nativeElement, this.selectionRectangle);
        if (this.isSelecting) {
            this.isSelecting = false;
        } else if (this.isOnTarget && !this.isTranslatingSelection && !this.isScalingSelection) {
            this.singlySelect(this.currentTarget);
        } else if (this.isTranslatingSelection) {
            this.isTranslatingSelection = false;
            this.saveState();
        } else if (this.isScalingSelection) {
            this.isScalingSelection = false;
            this.saveState();
        } else {
            this.selection.emptySelection();
        }

        this.selection.isInputOnControlPoint = false;
        this.renderer.setStyle(this.elementRef.nativeElement, 'cursor', 'default');

        this.isLeftMouseDown = false;
        this.isOnTarget = false;
    }

    private handleRightMouseUp(): void {
        this.renderer.removeChild(this.elementRef.nativeElement, this.selectionRectangle);

        if (this.isSelecting) {
            this.isSelecting = false;
        } else if (this.isOnTarget) {
            this.singlySelectInvert(this.currentTarget);
        }
        this.isRightMouseDown = false;
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
        this.updateCursorStyleOnSelectionBox();
    }

    private saveState() {
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
            this.manipulator.isShiftDown = true;
            this.manipulator.isRotateOnSelf = true;
            if (this.isScalingSelection) {
                this.manipulator.scaleSelection(
                    this.currentMouseCoords,
                    this.selection.activeControlPoint,
                    this.selection,
                );
            }
        } else if (key === KEYS.Alt) {
            event.preventDefault();
            this.manipulator.isAltDown = true;
            this.manipulator.rotationStep = ROTATION_ANGLE.Alter;
            if (this.isScalingSelection) {
                this.manipulator.scaleSelection(
                    this.currentMouseCoords,
                    this.selection.activeControlPoint,
                    this.selection,
                );
            }
        }
    }

    onKeyUp(event: KeyboardEvent): void {
        const key = event.key;
        if (key === KEYS.Shift) {
            event.preventDefault();
            this.manipulator.isRotateOnSelf = false;
            this.manipulator.isShiftDown = false;
            if (this.isScalingSelection) {
                this.manipulator.scaleSelection(
                    this.currentMouseCoords,
                    this.selection.activeControlPoint,
                    this.selection,
                );
            }
        } else if (key === KEYS.Alt) {
            event.preventDefault();
            this.manipulator.rotationStep = ROTATION_ANGLE.Base;
            this.manipulator.isAltDown = false;
            if (this.isScalingSelection) {
                this.manipulator.scaleSelection(
                    this.currentMouseCoords,
                    this.selection.activeControlPoint,
                    this.selection,
                );
            }
        }
    }

    onWheel(event: WheelEvent): void {
        if (this.isAbleToRotate()) {
            event.preventDefault();
            this.manipulator.rotateSelection(event, this.selection);
            this.clipBoard.restartDuplication();
            this.saveState();
        }
        this.updateCursorStyleOnSelectionBox();
    }
}
