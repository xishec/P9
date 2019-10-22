import { ElementRef, Injectable, Renderer2 } from '@angular/core';
import { StackTargetInfo } from 'src/classes/StackTargetInfo';
import { Keys, Mouse, SIDEBAR_WIDTH, SVG_NS } from 'src/constants/constants';
import { HTMLAttribute } from 'src/constants/tool-constants';
import { DrawStackService } from '../../draw-stack/draw-stack.service';
import { AbstractToolService } from '../abstract-tools/abstract-tool.service';

@Injectable({
    providedIn: 'root',
})
export class SelectionToolService extends AbstractToolService {
    readonly CONTROL_POINT_RADIUS = 10;
    currentMouseX = 0;
    currentMouseY = 0;
    lastCurrentMouseX = 0;
    lastCurrentMouseY = 0;
    initialMouseX = 0;
    initialMouseY = 0;
    currentTarget = 0;

    isTheCurrentTool = false;
    isSelecting = false;
    selectionBoxIsAppended = false;
    isOnTarget = false;
    isLeftMouseDown = false;
    isRightMouseDown = false;
    isLeftMouseDragging = false;
    isRightMouseDragging = false;

    selectionRectangle: SVGRectElement = this.renderer.createElement('rect', SVG_NS);
    selectionBox: SVGRectElement = this.renderer.createElement('rect', SVG_NS);
    controlPoints: SVGCircleElement[] = new Array(8);
    selection: Set<SVGGElement> = new Set();
    invertSelection: Set<SVGGElement> = new Set();

    constructor(
        public drawStack: DrawStackService,
        public svgReference: ElementRef<SVGElement>,
        public renderer: Renderer2,
    ) {
        super();
        this.initControlPoints();
        this.initSelectionBox();
        this.drawStack.currentStackTarget.subscribe((stackTarget: StackTargetInfo) => {
            if (stackTarget.targetPosition !== undefined && this.isTheCurrentTool) {
                this.currentTarget = stackTarget.targetPosition;
                this.isOnTarget = true;
            }
        });
    }

    cleanUp(): void {
        this.removeFullSelectionBox();
        if (this.isSelecting) {
            this.renderer.removeChild(this.svgReference.nativeElement, this.selectionRectangle);
        }
        this.isTheCurrentTool = false;
        this.isLeftMouseDown = false;
        this.isRightMouseDown = false;
        this.isSelecting = false;
        this.isLeftMouseDragging = false;
        this.isRightMouseDragging = false;
    }

    initControlPoints(): void {
        for (let i = 0; i < 8; i++) {
            this.controlPoints[i] = this.renderer.createElement('circle', SVG_NS);
            this.renderer.setAttribute(this.controlPoints[i], 'r', this.CONTROL_POINT_RADIUS.toString());
            this.renderer.setAttribute(this.controlPoints[i], HTMLAttribute.stroke, 'blue');
            this.renderer.setAttribute(this.controlPoints[i], HTMLAttribute.fill, 'white');
        }
    }

    initSelectionBox(): void {
        this.renderer.setAttribute(this.selectionBox, HTMLAttribute.stroke, 'blue');
        this.renderer.setAttribute(this.selectionBox, HTMLAttribute.fill, 'none');
    }

    updateSelectionRectangle(): void {
        let deltaX = this.currentMouseX - this.initialMouseX;
        let deltaY = this.currentMouseY - this.initialMouseY;

        // adjust x
        if (deltaX < 0) {
            deltaX *= -1;
            this.renderer.setAttribute(this.selectionRectangle, 'x', (this.initialMouseX - deltaX).toString());
        } else {
            this.renderer.setAttribute(this.selectionRectangle, 'x', this.initialMouseX.toString());
        }
        this.renderer.setAttribute(this.selectionRectangle, HTMLAttribute.width, deltaX.toString());

        // adjust y
        if (deltaY < 0) {
            deltaY *= -1;
            this.renderer.setAttribute(this.selectionRectangle, 'y', (this.initialMouseY - deltaY).toString());
        } else {
            this.renderer.setAttribute(this.selectionRectangle, 'y', this.initialMouseY.toString());
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

    mouseIsInSelectionBox(): boolean {
        const selectionBoxLeft = this.getDOMRect(this.selectionBox).x + window.scrollX - SIDEBAR_WIDTH;
        const selectionBoxRight =
            this.getDOMRect(this.selectionBox).x +
            window.scrollX -
            SIDEBAR_WIDTH +
            this.getDOMRect(this.selectionBox).width;
        const selectionBoxTop = this.getDOMRect(this.selectionBox).y + window.scrollY;
        const selectionBoxBottom =
            this.getDOMRect(this.selectionBox).y + window.scrollY + this.getDOMRect(this.selectionBox).height;
        return (
            this.currentMouseX >= selectionBoxLeft &&
            this.currentMouseX <= selectionBoxRight &&
            this.currentMouseY >= selectionBoxTop &&
            this.currentMouseY <= selectionBoxBottom
        );
    }

    mouseIsInControlPoint(): boolean {
        for (const ctrlPt of this.controlPoints) {
            const cx = ctrlPt.cx.baseVal.value;
            const cy = ctrlPt.cy.baseVal.value;
            const r = ctrlPt.r.baseVal.value;

            const distX = this.currentMouseX - cx;
            const distY = this.currentMouseY - cy;

            if (Math.abs(distX) <= r && Math.abs(distY) <= r) {
                return true;
            }
        }

        return false;
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
        if (this.hasSelected()) {
            this.clearSelection();
            this.removeFullSelectionBox();
        }
        this.selection.add(this.drawStack.drawStack[stackPosition]);
        this.computeSelectionBox();
        this.appendFullSelectionBox();
        this.isOnTarget = false;
    }

    startSelection(): void {
        this.isSelecting = true;
        this.updateSelectionRectangle();
        this.renderer.appendChild(this.svgReference.nativeElement, this.selectionRectangle);
    }

    clearSelection(): void {
        this.selection.clear();
    }

    applySelectionInvert(): void {
        for (const el of this.invertSelection) {
            if (this.selection.has(el)) {
                this.selection.delete(el);
            }
        }
    }

    singlyInvertSelect(stackPosition: number): void {
        if (!this.drawStack.drawStack[stackPosition]) {
            return;
        }

        this.selection.delete(this.drawStack.drawStack[stackPosition]);
        this.isOnTarget = false;

        if (this.selection.size === 0) {
            this.removeFullSelectionBox();
            return;
        }

        this.computeSelectionBox();
    }

    checkSelection(): void {
        const selectionBox = this.getDOMRect(this.selectionRectangle);

        for (const el of this.drawStack.drawStack) {
            const elBox = this.getDOMRect(el);

            if (this.isInSelection(selectionBox, elBox, this.getStrokeWidth(el))) {
                if (this.isLeftMouseDown) {
                    this.selection.add(el);
                } else if (this.isRightMouseDown) {
                    this.invertSelection.add(el);
                }
            } else {
                if (this.isLeftMouseDown) {
                    this.selection.delete(el);
                } else if (this.isRightMouseDown) {
                    this.invertSelection.delete(el);
                }
            }
        }
    }

    findLeftMostCoord(): number {
        const leftCoords: number[] = new Array();

        for (const el of this.selection) {
            leftCoords.push(this.getDOMRect(el).x + window.scrollX - SIDEBAR_WIDTH - this.getStrokeWidth(el) / 2);
        }

        return Math.min.apply(Math, leftCoords);
    }

    findRightMostCoord(): number {
        const rightCoords: number[] = new Array();

        for (const el of this.selection) {
            rightCoords.push(
                this.getDOMRect(el).x +
                    window.scrollX -
                    SIDEBAR_WIDTH +
                    this.getDOMRect(el).width +
                    this.getStrokeWidth(el) / 2,
            );
        }

        return Math.max.apply(Math, rightCoords);
    }

    findTopMostCoord(): number {
        const topCoords: number[] = new Array();

        for (const el of this.selection) {
            topCoords.push(this.getDOMRect(el).y + window.scrollY - this.getStrokeWidth(el) / 2);
        }

        return Math.min.apply(Math, topCoords);
    }

    findBottomMostCoord(): number {
        const bottomCoords: number[] = new Array();

        for (const el of this.selection) {
            bottomCoords.push(
                this.getDOMRect(el).y + window.scrollY + this.getDOMRect(el).height + this.getStrokeWidth(el) / 2,
            );
        }

        return Math.max.apply(Math, bottomCoords);
    }

    computeSelectionBox(): void {
        if (!this.hasSelected()) {
            this.removeFullSelectionBox();
            return;
        }
        const left = this.findLeftMostCoord();
        const right = this.findRightMostCoord();
        const top = this.findTopMostCoord();
        const bottom = this.findBottomMostCoord();

        this.renderer.setAttribute(this.selectionBox, 'x', left.toString());
        this.renderer.setAttribute(this.selectionBox, 'y', top.toString());
        this.renderer.setAttribute(this.selectionBox, HTMLAttribute.width, (right - left).toString());
        this.renderer.setAttribute(this.selectionBox, HTMLAttribute.height, (bottom - top).toString());

        this.computeControlPoints();
    }

    computeControlPoints(): void {
        // Top left corner
        this.renderer.setAttribute(this.controlPoints[0], HTMLAttribute.cx, this.selectionBox.x.baseVal.value.toString());
        this.renderer.setAttribute(this.controlPoints[0], HTMLAttribute.cy, this.selectionBox.y.baseVal.value.toString());

        // Top side
        this.renderer.setAttribute(
            this.controlPoints[1],
            HTMLAttribute.cx,
            (this.selectionBox.x.baseVal.value + this.selectionBox.width.baseVal.value / 2).toString(),
        );
        this.renderer.setAttribute(this.controlPoints[1], HTMLAttribute.cy, this.selectionBox.y.baseVal.value.toString());

        // Top right corner
        this.renderer.setAttribute(
            this.controlPoints[2],
            HTMLAttribute.cx,
            (this.selectionBox.x.baseVal.value + this.selectionBox.width.baseVal.value).toString(),
        );
        this.renderer.setAttribute(this.controlPoints[2], HTMLAttribute.cy, this.selectionBox.y.baseVal.value.toString());

        // Right side
        this.renderer.setAttribute(
            this.controlPoints[3],
            HTMLAttribute.cx,
            (this.selectionBox.x.baseVal.value + this.selectionBox.width.baseVal.value).toString(),
        );
        this.renderer.setAttribute(
            this.controlPoints[3],
            HTMLAttribute.cy,
            (this.selectionBox.y.baseVal.value + this.selectionBox.height.baseVal.value / 2).toString(),
        );

        // Bottom right corner
        this.renderer.setAttribute(
            this.controlPoints[4],
            HTMLAttribute.cx,
            (this.selectionBox.x.baseVal.value + this.selectionBox.width.baseVal.value).toString(),
        );
        this.renderer.setAttribute(
            this.controlPoints[4],
            HTMLAttribute.cy,
            (this.selectionBox.y.baseVal.value + this.selectionBox.height.baseVal.value).toString(),
        );

        // Bottom side
        this.renderer.setAttribute(
            this.controlPoints[5],
            HTMLAttribute.cx,
            (this.selectionBox.x.baseVal.value + this.selectionBox.width.baseVal.value / 2).toString(),
        );
        this.renderer.setAttribute(
            this.controlPoints[5],
            HTMLAttribute.cy,
            (this.selectionBox.y.baseVal.value + this.selectionBox.height.baseVal.value).toString(),
        );

        // Bottom left corner
        this.renderer.setAttribute(this.controlPoints[6], HTMLAttribute.cx, this.selectionBox.x.baseVal.value.toString());
        this.renderer.setAttribute(
            this.controlPoints[6],
            HTMLAttribute.cy,
            (this.selectionBox.y.baseVal.value + this.selectionBox.height.baseVal.value).toString(),
        );

        // Left side
        this.renderer.setAttribute(this.controlPoints[7], HTMLAttribute.cx, this.selectionBox.x.baseVal.value.toString());
        this.renderer.setAttribute(
            this.controlPoints[7],
            HTMLAttribute.cy,
            (this.selectionBox.y.baseVal.value + this.selectionBox.height.baseVal.value / 2).toString(),
        );
    }

    hasSelected(): boolean {
        return this.selection.size > 0;
    }

    appendControlPoints(): void {
        for (let i = 0; i < 8; i++) {
            this.renderer.appendChild(this.svgReference.nativeElement, this.controlPoints[i]);
        }
    }

    removeControlPoints(): void {
        for (const ctrlPt of this.controlPoints) {
            this.renderer.removeChild(this.svgReference, ctrlPt);
        }
    }

    appendFullSelectionBox(): void {
        if (!this.selectionBoxIsAppended) {
            this.renderer.appendChild(this.svgReference.nativeElement, this.selectionBox);
            this.appendControlPoints();
            this.selectionBoxIsAppended = true;
        }
    }

    removeFullSelectionBox(): void {
        if (this.selectionBoxIsAppended) {
            this.renderer.removeChild(this.svgReference.nativeElement, this.selectionBox);
            this.removeControlPoints();
            this.selectionBoxIsAppended = false;
        }
    }

    translateSelection(): void {
        const deltaX = this.currentMouseX - this.lastCurrentMouseX;
        const deltaY = this.currentMouseY - this.lastCurrentMouseY;
        for (const el of this.selection) {
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
            el.transform.baseVal.getItem(0).setTranslate(deltaX - offsetX, deltaY - offsetY);
        }
    }

    handleLeftMouseDrag(): void {
        this.isLeftMouseDragging = true;

        if (this.isSelecting) {
            this.updateSelectionRectangle();
            this.checkSelection();
            this.appendFullSelectionBox();
        } else if (!this.mouseIsInControlPoint()) {
            this.translateSelection();
        }
        this.computeSelectionBox();
    }

    handleRightMouseDrag(): void {
        this.isRightMouseDragging = true;

        if (this.isSelecting) {
            this.updateSelectionRectangle();
            this.checkSelection();
            this.appendFullSelectionBox();
            this.applySelectionInvert();
        }

        this.computeSelectionBox();
    }

    onMouseMove(event: MouseEvent): void {
        this.lastCurrentMouseX = this.currentMouseX;
        this.lastCurrentMouseY = this.currentMouseY;
        this.currentMouseX = event.clientX - this.svgReference.nativeElement.getBoundingClientRect().left;
        this.currentMouseY = event.clientY - this.svgReference.nativeElement.getBoundingClientRect().top;

        if (this.isLeftMouseDown) {
            this.handleLeftMouseDrag();
        } else if (this.isRightMouseDown) {
            this.handleRightMouseDrag();
        }
    }

    handleLeftMouseDown(): void {
        this.isLeftMouseDown = true;
        this.initialMouseX = this.currentMouseX;
        this.initialMouseY = this.currentMouseY;

        if (this.isOnTarget && !this.selection.has(this.drawStack.drawStack[this.currentTarget])) {
            this.singlySelect(this.currentTarget);
        } else if (!this.mouseIsInControlPoint() && !this.mouseIsInSelectionBox()) {
            this.clearSelection();
            this.startSelection();
        }
    }

    handleRightMouseDown(): void {
        this.isRightMouseDown = true;
        this.initialMouseX = this.currentMouseX;
        this.initialMouseY = this.currentMouseY;

        if (this.isOnTarget) {
            this.singlyInvertSelect(this.currentTarget);
        } else {
            this.invertSelection.clear();
            this.startSelection();
        }
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
        this.renderer.removeChild(this.svgReference.nativeElement, this.selectionRectangle);

        if (this.isSelecting) {
            this.isSelecting = false;
            this.computeSelectionBox();
        } else if (this.mouseIsInSelectionBox()) {
            if (!this.isLeftMouseDragging && this.isOnTarget && !this.mouseIsInControlPoint()) {
                this.singlySelect(this.currentTarget);
            }
        } else if (this.isOnTarget) {
            this.singlySelect(this.currentTarget);
        } else {
            this.clearSelection();
            this.removeFullSelectionBox();
        }

        this.isLeftMouseDown = false;
        this.isLeftMouseDragging = false;
        this.isOnTarget = false;
    }

    handleRightMouseUp(): void {
        this.renderer.removeChild(this.svgReference.nativeElement, this.selectionRectangle);
        if (this.isSelecting) {
            this.isSelecting = false;
            this.computeSelectionBox();
        }
        if (this.isOnTarget) {
            this.isOnTarget = false;
        }

        this.isRightMouseDown = false;
        this.isRightMouseDragging = false;
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
