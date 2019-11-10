import { ElementRef, Renderer2 } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { SIDEBAR_WIDTH, SVG_NS } from 'src/constants/constants';
import { HTMLAttribute, CONTROL_POINTS_AMOUNT, DEFAULT_RADIX } from 'src/constants/tool-constants';
import { Coords2D } from '../Coords2D';

export class Selection {
    renderer: Renderer2;
    svgRef: ElementRef<SVGElement>;

    selectedElements: Set<SVGGElement> = new Set();
    invertSelectionBuffer: Set<SVGGElement> = new Set();
    selectionBox: SVGRectElement;
    controlPoints: SVGCircleElement[] = new Array(CONTROL_POINTS_AMOUNT);

    isActiveSelection: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

    isAppended = false;

    constructor(renderer: Renderer2, svgReference: ElementRef<SVGElement>) {
        this.renderer = renderer;
        this.svgRef = svgReference;

        this.initFullSelectionBox();
    }

    cleanUp(): void {
        this.removeFullSelectionBox();
        this.emptySelection();
        this.isAppended = false;
    }

    initFullSelectionBox(): void {
        this.selectionBox = this.renderer.createElement('rect', SVG_NS);
        this.renderer.setAttribute(this.selectionBox, HTMLAttribute.stroke, '#ff5722');
        this.renderer.setAttribute(this.selectionBox, HTMLAttribute.fill, 'none');
        for (let i = 0; i < CONTROL_POINTS_AMOUNT; i++) {
            this.controlPoints[i] = this.renderer.createElement('circle', SVG_NS);
            this.renderer.setAttribute(this.controlPoints[i], 'r', '5');
            this.renderer.setAttribute(this.controlPoints[i], HTMLAttribute.stroke, '#ff5722');
            this.renderer.setAttribute(this.controlPoints[i], HTMLAttribute.fill, '#ff5722');
        }
    }

    removeFullSelectionBox(): void {
        if (this.isAppended) {
            this.renderer.removeChild(this.svgRef.nativeElement, this.selectionBox);
            for (const ctrlPt of this.controlPoints) {
                this.renderer.removeChild(this.svgRef.nativeElement, ctrlPt);
            }
            this.isAppended = false;
            this.isActiveSelection.next(false);
        }
    }

    appendFullSelectionBox(): void {
        if (!this.isAppended) {
            this.renderer.appendChild(this.svgRef.nativeElement, this.selectionBox);
            for (const ctrlPt of this.controlPoints) {
                this.renderer.appendChild(this.svgRef.nativeElement, ctrlPt);
            }
            this.isAppended = true;
            this.isActiveSelection.next(true);
        }
    }

    getDOMRect(el: SVGGElement): DOMRect {
        return el.getBoundingClientRect() as DOMRect;
    }

    getControlPointCx(ctrlPt: SVGCircleElement): number {
        return ctrlPt.cx.baseVal.value;
    }

    getControlPointCy(ctrlPt: SVGCircleElement): number {
        return ctrlPt.cy.baseVal.value;
    }

    getControlPointR(ctrlPt: SVGCircleElement): number {
        return ctrlPt.r.baseVal.value;
    }

    getStrokeWidth(el: SVGGElement): number {
        if (el.getAttribute(HTMLAttribute.stroke_width)) {
            return parseInt(el.getAttribute(HTMLAttribute.stroke_width) as string, DEFAULT_RADIX);
        }

        return 0;
    }

    mouseIsInSelectionBox(currentMouseCoords: Coords2D): boolean {
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
            currentMouseCoords.x >= selectionBoxLeft &&
            currentMouseCoords.x <= selectionBoxRight &&
            currentMouseCoords.y >= selectionBoxTop &&
            currentMouseCoords.y <= selectionBoxBottom &&
            this.isAppended
        );
    }

    mouseIsInControlPoint(currentMouseCoords: Coords2D): boolean {
        for (const ctrlPt of this.controlPoints) {
            const cx = this.getControlPointCx(ctrlPt);
            const cy = this.getControlPointCy(ctrlPt);
            const r = this.getControlPointR(ctrlPt);

            const distX = currentMouseCoords.x - cx;
            const distY = currentMouseCoords.y - cy;

            if (Math.abs(distX) <= r && Math.abs(distY) <= r && this.isAppended) {
                return true;
            }
        }

        return false;
    }

    findLeftMostCoord(): number {
        const leftCoords: number[] = new Array();

        for (const el of this.selectedElements) {
            leftCoords.push(this.getDOMRect(el).x + window.scrollX - SIDEBAR_WIDTH - this.getStrokeWidth(el) / 2);
        }

        return Math.min.apply(Math, leftCoords);
    }

    findRightMostCoord(): number {
        const rightCoords: number[] = new Array();

        for (const el of this.selectedElements) {
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

        for (const el of this.selectedElements) {
            topCoords.push(this.getDOMRect(el).y + window.scrollY - this.getStrokeWidth(el) / 2);
        }

        return Math.min.apply(Math, topCoords);
    }

    findBottomMostCoord(): number {
        const bottomCoords: number[] = new Array();

        for (const el of this.selectedElements) {
            bottomCoords.push(
                this.getDOMRect(el).y + window.scrollY + this.getDOMRect(el).height + this.getStrokeWidth(el) / 2,
            );
        }

        return Math.max.apply(Math, bottomCoords);
    }

    updateFullSelectionBox(): void {
        if (!(this.selectedElements.size > 0)) {
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

        this.updateControlPoints();
    }

    updateControlPoints(): void {
        const positionMap: Map<number, [string, string]> = new Map();

        positionMap.set(0, [
            this.selectionBox.x.baseVal.value.toString(),
            this.selectionBox.y.baseVal.value.toString(),
        ]);
        positionMap.set(1, [
            (this.selectionBox.x.baseVal.value + this.selectionBox.width.baseVal.value / 2).toString(),
            this.selectionBox.y.baseVal.value.toString(),
        ]);
        positionMap.set(2, [
            (this.selectionBox.x.baseVal.value + this.selectionBox.width.baseVal.value).toString(),
            this.selectionBox.y.baseVal.value.toString(),
        ]);
        positionMap.set(3, [
            (this.selectionBox.x.baseVal.value + this.selectionBox.width.baseVal.value).toString(),
            (this.selectionBox.y.baseVal.value + this.selectionBox.height.baseVal.value / 2).toString(),
        ]);
        positionMap.set(4, [
            (this.selectionBox.x.baseVal.value + this.selectionBox.width.baseVal.value).toString(),
            (this.selectionBox.y.baseVal.value + this.selectionBox.height.baseVal.value).toString(),
        ]);
        positionMap.set(5, [
            (this.selectionBox.x.baseVal.value + this.selectionBox.width.baseVal.value / 2).toString(),
            (this.selectionBox.y.baseVal.value + this.selectionBox.height.baseVal.value).toString(),
        ]);
        positionMap.set(6, [
            this.selectionBox.x.baseVal.value.toString(),
            (this.selectionBox.y.baseVal.value + this.selectionBox.height.baseVal.value).toString(),
        ]);
        positionMap.set(7, [
            this.selectionBox.x.baseVal.value.toString(),
            (this.selectionBox.y.baseVal.value + this.selectionBox.height.baseVal.value / 2).toString(),
        ]);

        for (let index = 0; index < CONTROL_POINTS_AMOUNT; ++index) {
            this.renderer.setAttribute(this.controlPoints[index], HTMLAttribute.cx, (positionMap.get(index) as [string, string])[0]);
            this.renderer.setAttribute(this.controlPoints[index], HTMLAttribute.cy, (positionMap.get(index) as [string, string])[1]);
        }
    }

    addToSelection(element: SVGGElement): void {
        this.selectedElements.add(element);
        this.updateFullSelectionBox();
        if (this.selectedElements.size > 0) {
            this.appendFullSelectionBox();
        }
    }

    invertAddToSelection(element: SVGGElement): void {
        if (this.selectedElements.has(element)) {
            this.selectedElements.delete(element);
        } else {
            this.selectedElements.add(element);
        }
        this.updateFullSelectionBox();
        if (this.selectedElements.size > 0) {
            this.appendFullSelectionBox();
        }
    }

    removeFromSelection(element: SVGGElement): void {
        this.selectedElements.delete(element);
        this.updateFullSelectionBox();
        if (this.selectedElements.size === 0) {
            this.removeFullSelectionBox();
        }
    }

    emptySelection(): void {
        this.removeFullSelectionBox();
        this.selectedElements.clear();
    }

    handleSelection(element: SVGGElement, isInSelectionRect: boolean): void {
        if (isInSelectionRect) {
            this.addToSelection(element);
        } else {
            this.removeFromSelection(element);
        }
    }

    handleInvertSelection(element: SVGGElement, isInSelectionRect: boolean): void {
        if (isInSelectionRect && this.selectedElements.has(element) && !this.invertSelectionBuffer.has(element)) {
            this.invertSelectionBuffer.add(element);
            this.removeFromSelection(element);

        } else if (isInSelectionRect && !this.selectedElements.has(element) && !this.invertSelectionBuffer.has(element)) {
            this.invertSelectionBuffer.add(element);
            this.addToSelection(element);

        } else if (!isInSelectionRect && !this.selectedElements.has(element) && this.invertSelectionBuffer.has(element)) {
            this.invertSelectionBuffer.delete(element);
            this.addToSelection(element);

        } else if (!isInSelectionRect && this.selectedElements.has(element) && this.invertSelectionBuffer.has(element)) {
            this.invertSelectionBuffer.delete(element);
            this.removeFromSelection(element);
        }
    }
}
