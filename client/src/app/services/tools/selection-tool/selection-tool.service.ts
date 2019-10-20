import { ElementRef, Injectable, Renderer2 } from '@angular/core';
import { Mouse, SVG_NS, SIDEBAR_WIDTH } from 'src/constants/constants';
import { DrawStackService } from '../../draw-stack/draw-stack.service';
import { AbstractToolService } from '../abstract-tools/abstract-tool.service';
import { StackTargetInfo } from 'src/classes/StackTargetInfo';

@Injectable({
    providedIn: 'root',
})
export class SelectionToolService extends AbstractToolService {
    readonly CONTROL_POINT_RADIUS = 10;
    currentMouseX = 0;
    currentMouseY = 0;
    initialMouseX = 0;
    initialMouseY = 0;
    currentTarget = 0;

    isTheCurrentTool = false;
    isSelecting = false;
    isManipulating = false;
    isIn = false;
    isOnTarget = false;
    leftMouseIsDown = false;
    rightMouseIsDown = false;
    isLeftMouseDragging = false;
    isRightMouseDragging = false;

    selectionRectangle: SVGRectElement = this.renderer.createElement('rect', SVG_NS);
    selectionBox: SVGRectElement = this.renderer.createElement('rect', SVG_NS);
    controlPoints: SVGCircleElement[] = new Array(8);
    selection: Set<SVGGElement> = new Set();

    constructor(
        public drawStack: DrawStackService,
        public svgReference: ElementRef<SVGElement>,
        public renderer: Renderer2
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
        this.isTheCurrentTool = false;
        this.leftMouseIsDown = false;
        this.rightMouseIsDown = false;
        this.isSelecting = false;
        this.isManipulating = false;
        this.isLeftMouseDragging = false;
        this.isRightMouseDragging = false;
    }

    initControlPoints(): void {
        for (let i = 0; i < 8; i++) {
            this.controlPoints[i] = this.renderer.createElement('circle', SVG_NS);
            this.renderer.setAttribute(this.controlPoints[i], 'r', this.CONTROL_POINT_RADIUS.toString());
            this.renderer.setAttribute(this.controlPoints[i], 'stroke', 'blue');
            this.renderer.setAttribute(this.controlPoints[i], 'fill', 'white');
        }
    }

    initSelectionBox(): void {
        this.renderer.setAttribute(this.selectionBox, 'stroke', 'blue');
        this.renderer.setAttribute(this.selectionBox, 'fill', 'none');
    }

    updateSelectionRectangle(): void {
        let deltaX = this.currentMouseX - this.initialMouseX;
        let deltaY = this.currentMouseY - this.initialMouseY;

        // adjust x
        if (deltaX < 0) {
            deltaX *= -1;
            this.renderer.setAttribute(this.selectionRectangle, 'x', (this.initialMouseX - deltaX).toString());
            this.renderer.setAttribute(this.selectionRectangle, 'width', deltaX.toString());
        } else {
            this.renderer.setAttribute(this.selectionRectangle, 'x', this.initialMouseX.toString());
            this.renderer.setAttribute(this.selectionRectangle, 'width', deltaX.toString());
        }

        // adjust y
        if (deltaY < 0) {
            deltaY *= -1;
            this.renderer.setAttribute(this.selectionRectangle, 'y', (this.initialMouseY - deltaY).toString());
            this.renderer.setAttribute(this.selectionRectangle, 'height', deltaY.toString());
        } else {
            this.renderer.setAttribute(this.selectionRectangle, 'y', this.initialMouseY.toString());
            this.renderer.setAttribute(this.selectionRectangle, 'height', deltaY.toString());
        }

        this.renderer.setAttribute(this.selectionRectangle, 'fill', 'white');
        this.renderer.setAttribute(this.selectionRectangle, 'fill-opacity', '0.3');
        this.renderer.setAttribute(this.selectionRectangle, 'stroke', 'black');
        this.renderer.setAttribute(this.selectionRectangle, 'stroke-dasharray', '5 5');
    }

    getInclusiveBBox(el: SVGGElement): DOMRect {
        return el.getBoundingClientRect() as DOMRect;
    }

    getStrokeWidth(el: SVGGElement): number {
        if (el.getAttribute('stroke-width')) {
            return parseInt(el.getAttribute('stroke-width') as string, 10);
        }

        return 0;
    }

    mouseIsInSelectionBox(): boolean {
        return (
            this.currentMouseX >= ((this.selectionBox.getBoundingClientRect() as DOMRect).x - SIDEBAR_WIDTH) &&
            this.currentMouseX <= ((this.selectionBox.getBoundingClientRect() as DOMRect).x - SIDEBAR_WIDTH) + (this.selectionBox.getBoundingClientRect() as DOMRect).width &&
            this.currentMouseY >= (this.selectionBox.getBoundingClientRect() as DOMRect).y &&
            this.currentMouseY <= (this.selectionBox.getBoundingClientRect() as DOMRect).y + (this.selectionBox.getBoundingClientRect() as DOMRect).height
        );
    }

    mouseIsInControlPoint(): boolean {
        for (const ctrlPt of this.controlPoints) {
            const cx = ctrlPt.cx.baseVal.value;
            const cy = ctrlPt.cy.baseVal.value;
            const r = ctrlPt.r.baseVal.value;

            const distX = this.currentMouseX - cx;
            const distY = this.currentMouseY - cy;

            if ((Math.abs(distX) <= r) && (Math.abs(distY) <= r)) {
                return true;
            }
        }

        return false;
    }

    isInSelection(selectionBox: DOMRect, elementBox: DOMRect, strokeWidth?: number): boolean {
        const boxLeft = selectionBox.x - SIDEBAR_WIDTH;
        const boxRight = selectionBox.x - SIDEBAR_WIDTH + selectionBox.width;
        const boxTop = selectionBox.y;
        const boxBottom = selectionBox.y + selectionBox.height;

        let elLeft = elementBox.x - SIDEBAR_WIDTH;
        let elRight = elementBox.x - SIDEBAR_WIDTH + elementBox.width;
        let elTop = elementBox.y;
        let elBottom = elementBox.y + elementBox.height;

        if (strokeWidth) {
            const halfStrokeWidth = strokeWidth / 2;

            elLeft = elLeft - halfStrokeWidth;
            elRight = elRight + halfStrokeWidth;
            elTop = elTop - halfStrokeWidth;
            elBottom = elBottom + halfStrokeWidth;
        }

        const boxTopLeftCorner = {
            x: boxLeft,
            y: boxTop,
        };

        const boxBottomRightCorner = {
            x: boxRight,
            y: boxBottom,
        };

        const elTopLeftCorner = {
            x: elLeft,
            y: elTop,
        };

        const elBottomRightCorner = {
            x: elRight,
            y: elBottom,
        };

        if (elBottomRightCorner.x < boxTopLeftCorner.x || boxBottomRightCorner.x < elTopLeftCorner.x) {
            return false;
        }

        if (elBottomRightCorner.y < boxTopLeftCorner.y || boxBottomRightCorner.y < elTopLeftCorner.y) {
            return false;
        }

        return true;
    }

    singlySelect(stackPosition: number): void {
        if (this.hasSelected()) {
            this.isManipulating = false;
            this.clearSelection();
            this.removeFullSelectionBox();
        }
        this.selection.add(this.drawStack.drawStack[stackPosition]);
        this.isManipulating = true;
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
        this.isManipulating = false;
    }

    invertSelection(stackPosition?: number): void {
        if (stackPosition === undefined) {
            return;
        }

        if (!this.selection.has(this.drawStack.drawStack[stackPosition])) {
            for (const el of this.drawStack.drawStack) {
                if (el !== this.drawStack.drawStack[stackPosition]) {
                    this.selection.add(el);
                }
            }
        } else {
            this.selection.delete(this.drawStack.drawStack[stackPosition]);
        }
        this.isOnTarget = false;

        if (this.selection.size === 0) {
            this.removeFullSelectionBox();
            return;
        }

        this.removeFullSelectionBox();
        this.computeSelectionBox();
        this.appendFullSelectionBox();
    }

    checkSelection(): void {
        const selectionBox = this.getInclusiveBBox(this.selectionRectangle);

        for (const el of this.drawStack.drawStack) {
            const elBox = this.getInclusiveBBox(el);

            if (this.isInSelection(selectionBox, elBox, this.getStrokeWidth(el))) {
                this.selection.add(el);
            }
        }
    }

    findLeftMostCoord(): number {
        const leftCoords: number[] = new Array();

        for (const el of this.selection) {
            leftCoords.push(this.getInclusiveBBox(el).x - SIDEBAR_WIDTH - this.getStrokeWidth(el) / 2);
        }

        return Math.min.apply(Math, leftCoords);
    }

    findRightMostCoord(): number {
        const rightCoords: number[] = new Array();

        for (const el of this.selection) {
            rightCoords.push(
                this.getInclusiveBBox(el).x - SIDEBAR_WIDTH + this.getInclusiveBBox(el).width + this.getStrokeWidth(el) / 2
            );
        }

        return Math.max.apply(Math, rightCoords);
    }

    findTopMostCoord(): number {
        const topCoords: number[] = new Array();

        for (const el of this.selection) {
            topCoords.push(this.getInclusiveBBox(el).y - this.getStrokeWidth(el) / 2);
        }

        return Math.min.apply(Math, topCoords);
    }

    findBottomMostCoord(): number {
        const bottomCoords: number[] = new Array();

        for (const el of this.selection) {
            bottomCoords.push(
                this.getInclusiveBBox(el).y + this.getInclusiveBBox(el).height + this.getStrokeWidth(el) / 2
            );
        }

        return Math.max.apply(Math, bottomCoords);
    }

    computeSelectionBox(): void {
        const left = this.findLeftMostCoord();
        const right = this.findRightMostCoord();
        const top = this.findTopMostCoord();
        const bottom = this.findBottomMostCoord();

        this.renderer.setAttribute(this.selectionBox, 'x', left.toString());
        this.renderer.setAttribute(this.selectionBox, 'y', top.toString());
        this.renderer.setAttribute(this.selectionBox, 'width', (right - left).toString());
        this.renderer.setAttribute(this.selectionBox, 'height', (bottom - top).toString());

        this.computeControlPoints();
    }

    computeControlPoints(): void {
        // Top left corner
        this.renderer.setAttribute(this.controlPoints[0], 'cx', this.selectionBox.x.baseVal.value.toString());
        this.renderer.setAttribute(this.controlPoints[0], 'cy', this.selectionBox.y.baseVal.value.toString());

        // Top side
        this.renderer.setAttribute(
            this.controlPoints[1],
            'cx',
            (this.selectionBox.x.baseVal.value + this.selectionBox.width.baseVal.value / 2).toString()
        );
        this.renderer.setAttribute(this.controlPoints[1], 'cy', this.selectionBox.y.baseVal.value.toString());

        // Top right corner
        this.renderer.setAttribute(
            this.controlPoints[2],
            'cx',
            (this.selectionBox.x.baseVal.value + this.selectionBox.width.baseVal.value).toString()
        );
        this.renderer.setAttribute(this.controlPoints[2], 'cy', this.selectionBox.y.baseVal.value.toString());

        // Right side
        this.renderer.setAttribute(
            this.controlPoints[3],
            'cx',
            (this.selectionBox.x.baseVal.value + this.selectionBox.width.baseVal.value).toString()
        );
        this.renderer.setAttribute(
            this.controlPoints[3],
            'cy',
            (this.selectionBox.y.baseVal.value + this.selectionBox.height.baseVal.value / 2).toString()
        );

        // Bottom right corner
        this.renderer.setAttribute(
            this.controlPoints[4],
            'cx',
            (this.selectionBox.x.baseVal.value + this.selectionBox.width.baseVal.value).toString()
        );
        this.renderer.setAttribute(
            this.controlPoints[4],
            'cy',
            (this.selectionBox.y.baseVal.value + this.selectionBox.height.baseVal.value).toString()
        );

        // Bottom side
        this.renderer.setAttribute(
            this.controlPoints[5],
            'cx',
            (this.selectionBox.x.baseVal.value + this.selectionBox.width.baseVal.value / 2).toString()
        );
        this.renderer.setAttribute(
            this.controlPoints[5],
            'cy',
            (this.selectionBox.y.baseVal.value + this.selectionBox.height.baseVal.value).toString()
        );

        // Bottom left corner
        this.renderer.setAttribute(this.controlPoints[6], 'cx', this.selectionBox.x.baseVal.value.toString());
        this.renderer.setAttribute(
            this.controlPoints[6],
            'cy',
            (this.selectionBox.y.baseVal.value + this.selectionBox.height.baseVal.value).toString()
        );

        // Left side
        this.renderer.setAttribute(this.controlPoints[7], 'cx', this.selectionBox.x.baseVal.value.toString());
        this.renderer.setAttribute(
            this.controlPoints[7],
            'cy',
            (this.selectionBox.y.baseVal.value + this.selectionBox.height.baseVal.value / 2).toString()
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
        this.renderer.appendChild(this.svgReference.nativeElement, this.selectionBox);
        this.appendControlPoints();
    }

    removeFullSelectionBox(): void {
        this.renderer.removeChild(this.svgReference.nativeElement, this.selectionBox);
        this.removeControlPoints();
    }

    handleLeftMouseDrag(): void {

    }

    handleRightMouseDrag(): void {

    }

    onMouseMove(event: MouseEvent): void {
        const lastMouseX = this.currentMouseX;
        const lastMouseY = this.currentMouseY;
        this.currentMouseX = event.clientX - this.svgReference.nativeElement.getBoundingClientRect().left;
        this.currentMouseY = event.clientY - this.svgReference.nativeElement.getBoundingClientRect().top;
        const deltaX = this.currentMouseX - lastMouseX;
        const deltaY = this.currentMouseY - lastMouseY;

        if (this.isSelecting) {
            this.updateSelectionRectangle();
            this.checkSelection();
        } else if (this.leftMouseIsDown && this.mouseIsInSelectionBox() && ! this.mouseIsInControlPoint()) {
            this.isLeftMouseDragging = true;
            for (const el of this.selection) {
                // Get all transforms on el
                const transformsList = el.transform.baseVal;
                // Check if first transform is translate
                if ((transformsList.numberOfItems === 0) || (transformsList.getItem(0).type !== SVGTransform.SVG_TRANSFORM_TRANSLATE)) {
                    // If not create translate(0,0) and add it to the beginning of the list
                    const svg: SVGSVGElement = this.renderer.createElement('svg', SVG_NS);
                    const translateToZero = svg.createSVGTransform();
                    translateToZero.setTranslate(0, 0);
                    el.transform.baseVal.insertItemBefore(translateToZero, 0);
                }

                const initialTransform = transformsList.getItem(0);
                const offsetX = -initialTransform.matrix.e;
                const offsetY = -initialTransform.matrix.f;
                el.transform.baseVal.getItem(0).setTranslate((deltaX - offsetX), (deltaY - offsetY));
            }

            this.computeSelectionBox();
        }
    }

    handleLeftMouseDown(): void {
        this.leftMouseIsDown = true;
        this.initialMouseX = this.currentMouseX;
        this.initialMouseY = this.currentMouseY;
        // Mouse down on selection box

        // Mouse down on an unselected object
        // Mouse down on unselected object inside selection box
        if (this.isOnTarget) {
        } // Mouse down on control point
        else if (this.mouseIsInControlPoint() || (this.mouseIsInSelectionBox() && !this.isOnTarget)) {

        } // Mouse down on nothing
        else {
            this.clearSelection();
            this.startSelection();
        }
    }

    handleRightMouseDown(): void {
        // Mouse down on nothing
        // Mouse down on unselected object
        // Mouse down on selection box
        // Mouse down on selected object
        // Mouse down on unselected objected inside selection box
        if (this.isOnTarget) {
            this.invertSelection(this.currentTarget);
        }
        // if (this.hasSelected()) {
        //     this.invertSelection();
        // }
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
        if (this.hasSelected() && this.isSelecting) {
            this.isSelecting = false;
            this.isManipulating = true;
            this.computeSelectionBox();
            this.appendFullSelectionBox();
        } else if ((this.mouseIsInSelectionBox() && this.isOnTarget)) {

            if (!this.isLeftMouseDragging) {

                this.singlySelect(this.currentTarget);
            } else {

                this.isOnTarget = false;
            }
        } else if (this.isOnTarget) {
            this.singlySelect(this.currentTarget);
        }
        else if (this.mouseIsInControlPoint() || this.mouseIsInSelectionBox()) {

        } else {
            this.clearSelection();
            this.removeFullSelectionBox();
        }
        this.leftMouseIsDown = false;
        this.isLeftMouseDragging = false;
    }

    handleRightMouseUp(): void {
        if (this.isOnTarget) {
            this.isOnTarget = false;
        }
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
        this.isIn = true;
    }
    onMouseLeave(event: MouseEvent): void {
        this.isTheCurrentTool = true;
        this.isIn = false;
    }
    onKeyDown(event: KeyboardEvent): void {}
    onKeyUp(event: KeyboardEvent): void {
        this.isTheCurrentTool = true;
    }
}
