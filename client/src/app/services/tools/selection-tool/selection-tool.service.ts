import { ElementRef, Injectable, Renderer2 } from '@angular/core';
import { Mouse, SVG_NS } from 'src/constants/constants';
import { AbstractToolService } from '../abstract-tools/abstract-tool.service';
import { DrawStackService } from '../../draw-stack/draw-stack.service';

@Injectable({
    providedIn: 'root',
})
export class SelectionToolService extends AbstractToolService {
    currentMouseX = 0;
    currentMouseY = 0;
    initialMouseX = 0;
    initialMouseY = 0;
    currentTarget = 0;

    isSelecting = false;
    isManipulating = false;
    isIn = false;
    isOnTarget = false;

    selectionRectangle: SVGRectElement = this.renderer.createElement('rect', SVG_NS);
    selectionBox: SVGRectElement = this.renderer.createElement('rect', SVG_NS);
    controlPoints: SVGCircleElement[] = new Array(8);
    selection: Set<SVGGElement> = new Set();

    constructor(
        public drawStack: DrawStackService,
        public svgReference: ElementRef<SVGElement>,
        public renderer: Renderer2,
    ) {
        super();
        this.initControlPoints();
        this.initSelectionBox();
        this.drawStack.currentStackTarget.subscribe((stackTarget) => {
            if (stackTarget.targetPosition !== undefined) {
                this.currentTarget = stackTarget.targetPosition;
                this.isOnTarget = true;
                //this.singlySelect(stackTarget.targetPosition);
            }
        });
    }

    initControlPoints(): void {
        for (let i = 0; i < 8; i++) {
            this.controlPoints[i] = this.renderer.createElement('circle', SVG_NS);
            this.renderer.setAttribute(this.controlPoints[i], 'r', '10');
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
        return el.getBBox();
    }

    getStrokeWidth(el: SVGGElement): number {
        if (el.getAttribute('stroke-width')) {
            return parseInt(el.getAttribute('stroke-width') as string, 10);
        }

        return 0;
    }

    isInSelection(selectionBox: DOMRect, elementBox: DOMRect, strokeWidth?: number): boolean {
        const boxLeft = selectionBox.x;
        const boxRight = selectionBox.x + selectionBox.width;
        const boxTop = selectionBox.y;
        const boxBottom = selectionBox.y + selectionBox.height;
        let elLeft = elementBox.x;
        let elRight = elementBox.x + elementBox.width;
        let elTop = elementBox.y;
        let elBottom = elementBox.y + elementBox.height;

        if (strokeWidth) {
            const halfStrokeWidth = strokeWidth / 2;

            elLeft = elementBox.x - halfStrokeWidth;
            elRight = elementBox.x + elementBox.width + halfStrokeWidth;
            elTop = elementBox.y - halfStrokeWidth;
            elBottom = elementBox.y + elementBox.height + halfStrokeWidth;

            return (
                elLeft > boxLeft &&
                elRight < boxRight &&
                elTop > boxTop &&
                elBottom < boxBottom
            );
        }

        return (
            elLeft > boxLeft &&
            elRight < boxRight &&
            elTop > boxTop &&
            elBottom < boxBottom
        );
    }

    singlySelect(stackPosition: number): void {
        console.log('singly');
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

    invertSelection(): void {
        const invertedSelection: Set<SVGGElement> = new Set();

        for (const el of this.drawStack.drawStack) {
            if (!this.selection.has(el)) {
                invertedSelection.add(el);
            }
        }

        this.selection = invertedSelection;
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
            leftCoords.push(this.getInclusiveBBox(el).x - (this.getStrokeWidth(el) / 2));
        }

        return Math.min.apply(Math, leftCoords);
    }

    findRightMostCoord(): number {
        const rightCoords: number[] = new Array();

        for (const el of this.selection) {
            rightCoords.push(this.getInclusiveBBox(el).x + this.getInclusiveBBox(el).width + (this.getStrokeWidth(el) / 2));
        }

        return Math.max.apply(Math, rightCoords);
    }

    findTopMostCoord(): number {
        const topCoords: number[] = new Array();

        for (const el of this.selection) {
            topCoords.push(this.getInclusiveBBox(el).y - (this.getStrokeWidth(el) / 2));
        }

        return Math.min.apply(Math, topCoords);
    }

    findBottomCoord(): number {
        const bottomCoords: number[] = new Array();

        for (const el of this.selection) {
            bottomCoords.push(this.getInclusiveBBox(el).y + this.getInclusiveBBox(el).height + (this.getStrokeWidth(el) / 2));
        }

        return Math.max.apply(Math, bottomCoords);
    }

    computeSelectionBox(): void {
        const left = this.findLeftMostCoord();
        const right = this.findRightMostCoord();
        const top = this.findTopMostCoord();
        const bottom = this.findBottomCoord();

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
        this.renderer.setAttribute(this.controlPoints[1], 'cx', (this.selectionBox.x.baseVal.value + (this.selectionBox.width.baseVal.value / 2)).toString());
        this.renderer.setAttribute(this.controlPoints[1], 'cy', (this.selectionBox.y.baseVal.value).toString());

        // Top right corner
        this.renderer.setAttribute(this.controlPoints[2], 'cx', (this.selectionBox.x.baseVal.value + this.selectionBox.width.baseVal.value).toString());
        this.renderer.setAttribute(this.controlPoints[2], 'cy', this.selectionBox.y.baseVal.value.toString());

        // Right side
        this.renderer.setAttribute(this.controlPoints[3], 'cx', (this.selectionBox.x.baseVal.value + this.selectionBox.width.baseVal.value).toString());
        this.renderer.setAttribute(this.controlPoints[3], 'cy', (this.selectionBox.y.baseVal.value + (this.selectionBox.height.baseVal.value / 2)).toString());

        // Bottom right corner
        this.renderer.setAttribute(this.controlPoints[4], 'cx', (this.selectionBox.x.baseVal.value + this.selectionBox.width.baseVal.value).toString());
        this.renderer.setAttribute(this.controlPoints[4], 'cy', (this.selectionBox.y.baseVal.value + this.selectionBox.height.baseVal.value).toString());

        // Bottom side
        this.renderer.setAttribute(this.controlPoints[5], 'cx', (this.selectionBox.x.baseVal.value + (this.selectionBox.width.baseVal.value / 2)).toString());
        this.renderer.setAttribute(this.controlPoints[5], 'cy', (this.selectionBox.y.baseVal.value + this.selectionBox.height.baseVal.value).toString());

        // Bottom left corner
        this.renderer.setAttribute(this.controlPoints[6], 'cx', (this.selectionBox.x.baseVal.value).toString());
        this.renderer.setAttribute(this.controlPoints[6], 'cy', (this.selectionBox.y.baseVal.value + this.selectionBox.height.baseVal.value).toString());

        // Left side
        this.renderer.setAttribute(this.controlPoints[7], 'cx', (this.selectionBox.x.baseVal.value).toString());
        this.renderer.setAttribute(this.controlPoints[7], 'cy', (this.selectionBox.y.baseVal.value + (this.selectionBox.height.baseVal.value / 2)).toString());
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

    onMouseMove(event: MouseEvent): void {
        this.currentMouseX = event.clientX - this.svgReference.nativeElement.getBoundingClientRect().left;
        this.currentMouseY = event.clientY - this.svgReference.nativeElement.getBoundingClientRect().top;

        if (this.isSelecting) {
            this.updateSelectionRectangle();
            this.checkSelection();
        }
    }

    onMouseDown(event: MouseEvent): void {
        const button = event.button;

        console.log('mousedown');

        switch (button) {
            case Mouse.LeftButton:
                this.initialMouseX = this.currentMouseX;
                this.initialMouseY = this.currentMouseY;
                if (this.isOnTarget) {
                    this.singlySelect(this.currentTarget);
                } else {
                    this.clearSelection();
                    this.startSelection();
                }
                break;

            case Mouse.RightButton:
                if (this.hasSelected()) {
                    this.invertSelection();
                }
                break;

            default:
                break;
        }
    }

    onMouseUp(event: MouseEvent): void {
        const button = event.button;

        console.log('mouseup');

        switch (button) {
            case Mouse.LeftButton:
                this.isSelecting = false;
                this.renderer.removeChild(this.svgReference.nativeElement, this.selectionRectangle);
                if (this.hasSelected()) {
                    this.isManipulating = true;
                    this.computeSelectionBox();
                    this.appendFullSelectionBox();
                } else {
                    this.clearSelection();
                    this.removeFullSelectionBox();
                }
                break;

            case Mouse.RightButton:
                break;

            default:
                break;
        }
    }

    onMouseEnter(event: MouseEvent): void {
        this.isIn = true;
    }
    onMouseLeave(event: MouseEvent): void {
        this.isIn = false;
    }
    onKeyDown(event: KeyboardEvent): void {}
    onKeyUp(event: KeyboardEvent): void {}
}
