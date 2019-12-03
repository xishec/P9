import { Injectable, Renderer2 } from '@angular/core';
import { Coords2D } from 'src/classes/Coords2D';
import { SIDEBAR_WIDTH, SVG_NS } from 'src/constants/constants';
import { CONTROL_POINTS, ROTATION_ANGLE } from 'src/constants/tool-constants';
import { Selection } from '../../../classes/selection/selection';

const RIGHT = true;
const LEFT = false;
const TOP = false;
const BOTTOM = true;

@Injectable({
    providedIn: 'root',
})
export class ManipulatorService {
    private renderer: Renderer2;
    isRotateOnSelf = false;
    private boxOrigin: Coords2D = new Coords2D(0, 0);
    private selectedElementsOrigin: Map<SVGGElement, Coords2D> = new Map();
    rotationStep = ROTATION_ANGLE.Base;

    isAltDown: boolean;
    isShiftDown: boolean;

    initializeService(renderer: Renderer2): void {
        this.renderer = renderer;
    }

    scaleSelection(currentMouseCoords: Coords2D, fromControlPoint: SVGCircleElement, selection: Selection): void {
        switch (Number(fromControlPoint.getAttribute('controlPointId') as string)) {
            case CONTROL_POINTS.TopLeft:
                this.applyScaleCorner(currentMouseCoords, selection, LEFT, TOP);
                break;
            case CONTROL_POINTS.TopMiddle:
                this.applyScaleY(currentMouseCoords, selection, TOP);
                break;
            case CONTROL_POINTS.TopRight:
                this.applyScaleCorner(currentMouseCoords, selection, RIGHT, TOP);
                break;
            case CONTROL_POINTS.CenterRight:
                this.applyScaleX(currentMouseCoords, selection, RIGHT);
                break;
            case CONTROL_POINTS.BottomRight:
                this.applyScaleCorner(currentMouseCoords, selection, RIGHT, BOTTOM);
                break;
            case CONTROL_POINTS.BottomMiddle:
                this.applyScaleY(currentMouseCoords, selection, BOTTOM);
                break;
            case CONTROL_POINTS.BottomLeft:
                this.applyScaleCorner(currentMouseCoords, selection, LEFT, BOTTOM);
                break;
            case CONTROL_POINTS.CenterLeft:
                this.applyScaleX(currentMouseCoords, selection, LEFT);
                break;
            default:
                break;
        }
    }

    initTransformMatrix(selection: Selection) {
        selection.selectedElements.forEach((element: SVGGElement) => {
            const svg: SVGSVGElement = this.renderer.createElement('svg', SVG_NS);

            const initScale = svg.createSVGTransform();
            const initTranslate = svg.createSVGTransform();

            initScale.setScale(1, 1);
            initTranslate.setTranslate(0, 0);

            element.transform.baseVal.insertItemBefore(initTranslate, 0);
            element.transform.baseVal.insertItemBefore(initScale, 1);
        });
    }

    getXScaleFactor(dx: number, selection: Selection, isRight: boolean): number {
        // get the distance from mouse to the coords x of box
        const distFromOgXToCurrentMouse = dx + (isRight ? selection.ogSelectionBoxWidth : 0);

        const newWidth = distFromOgXToCurrentMouse + (isRight ? 0 : selection.ogSelectionBoxWidth);

        const scaleFactor = newWidth / selection.ogSelectionBoxWidth;

        return (this.isAltDown) ? 2 * scaleFactor - 1 : scaleFactor;
    }

    getXTranslate(dx: number, scaleFactor: number, selection: Selection, isRight: boolean): number {
        let xTranslate =  selection.ogSelectionBoxPositions.x - (scaleFactor * selection.ogSelectionBoxPositions.x) - (isRight ? 0 : dx);

        if (this.isAltDown) {
            xTranslate = xTranslate - (isRight ? dx : 0);
        }

        return xTranslate;
    }

    getYScaleFactor(dy: number, selection: Selection, isBottom: boolean): number {
        const distFromOgYToCurrentMouse = dy + (isBottom ? selection.ogSelectionBoxHeight : 0);

        const newHeight = distFromOgYToCurrentMouse + (isBottom ? 0 : selection.ogSelectionBoxHeight);

        const scaleFactor = newHeight / selection.ogSelectionBoxHeight;

        return (this.isAltDown) ? 2 * scaleFactor - 1 : scaleFactor;
    }

    getYTranslate(dy: number, scaleFactor: number, selection: Selection, isBottom: boolean): number {
        let yTranslate = selection.ogSelectionBoxPositions.y - (scaleFactor * selection.ogSelectionBoxPositions.y) - (isBottom ? 0 : dy);

        if (this.isAltDown) {
            yTranslate = yTranslate - (isBottom ? dy : 0);
        }

        return yTranslate;
    }

    applyRedimTransformations(selection: Selection, xScale: number, yScale: number, xTranslate: number, yTranslate: number): void {
        selection.selectedElements.forEach((element: SVGGElement) => {
            element.transform.baseVal.getItem(0).setTranslate(xTranslate, yTranslate);
            element.transform.baseVal.getItem(1).setScale(xScale, yScale);
        });
    }

    getDistanceFromControlPoint(currentMousePos: number, cntrlPointPos: number, isRightOrBottom: boolean): number {
        let distance = currentMousePos - cntrlPointPos;
        distance = isRightOrBottom ? distance : -distance;
        return distance;
    }

    applyScaleCorner(currentMouse: Coords2D, selection: Selection, isRight: boolean, isBottom: boolean): void {
        let dx = this.getDistanceFromControlPoint(currentMouse.x + window.scrollX, selection.ogActiveControlPointCoords.x, isRight);
        let dy = this.getDistanceFromControlPoint(currentMouse.y + window.scrollY, selection.ogActiveControlPointCoords.y, isBottom);

        if (this.isShiftDown) {
            const notProportionalWidth = selection.ogSelectionBoxWidth + dx;
            const notProportionalHeight = selection.ogSelectionBoxHeight + dy;

            // get the scale factor for both directions
            const horizScale = notProportionalWidth / selection.ogSelectionBoxWidth;
            const vertScale = notProportionalHeight / selection.ogSelectionBoxHeight;

            // Get the smallest scale
            const scale = Math.min(Math.abs(horizScale), Math.abs(vertScale));

            // Get Dimensions of the scaled rectangle
            const proportionalWidth = Math.sign(horizScale) * scale * selection.ogSelectionBoxWidth;
            const proporionalHeight = Math.sign(vertScale) * scale * selection.ogSelectionBoxHeight;

            dx = proportionalWidth - selection.ogSelectionBoxWidth;
            dy = proporionalHeight - selection.ogSelectionBoxHeight;
        }

        const xScaleFactor = this.getXScaleFactor(dx, selection, isRight);
        const yScaleFactor = this.getYScaleFactor(dy, selection, isBottom);

        const xTranslate = this.getXTranslate(dx, xScaleFactor, selection, isRight);
        const yTranslate = this.getYTranslate(dy, yScaleFactor, selection, isBottom);

        this.applyRedimTransformations(selection, xScaleFactor, yScaleFactor, xTranslate, yTranslate);

        selection.updateFullSelectionBox();
    }

    applyScaleX(currentMouse: Coords2D, selection: Selection, isRight: boolean): void {
        const dx = this.getDistanceFromControlPoint(currentMouse.x + window.scrollX, selection.ogActiveControlPointCoords.x, isRight);

        const scaleFactor =  this.getXScaleFactor(dx, selection, isRight);

        const xTranslate = this.getXTranslate(dx, scaleFactor, selection, isRight);

        this.applyRedimTransformations(selection, scaleFactor, 1, xTranslate, 0);

        selection.updateFullSelectionBox();
    }

    applyScaleY(currentMouse: Coords2D, selection: Selection, isBottom: boolean): void {
        const dy = this.getDistanceFromControlPoint(currentMouse.y + window.scrollY, selection.ogActiveControlPointCoords.y, isBottom);

        const scaleFactor = this.getYScaleFactor(dy, selection, isBottom);

        const yTranslate = this.getYTranslate(dy, scaleFactor, selection, isBottom);

        this.applyRedimTransformations(selection, 1, scaleFactor, 0, yTranslate);

        selection.updateFullSelectionBox();
    }

    updateOrigins(selection: Selection): void {
        this.updateElementsOrigins(selection);
        this.boxOrigin.y = selection.selectionBox.y.baseVal.value + selection.selectionBox.height.baseVal.value / 2;
        this.boxOrigin.x = selection.selectionBox.x.baseVal.value + selection.selectionBox.width.baseVal.value / 2;
    }

    private updateElementsOrigins(selection: Selection): void {
        this.selectedElementsOrigin.clear();
        for (const el of selection.selectedElements) {
            const origin: Coords2D = new Coords2D(
                (el.getBoundingClientRect() as DOMRect).x -
                    SIDEBAR_WIDTH +
                    window.scrollX +
                    (el.getBoundingClientRect() as DOMRect).width / 2,
                (el.getBoundingClientRect() as DOMRect).y +
                    window.scrollY +
                    (el.getBoundingClientRect() as DOMRect).height / 2,
            );
            this.selectedElementsOrigin.set(el, origin);
        }
    }

    private prepareForTransform(element: SVGGElement): void {
        if (element.transform.baseVal.numberOfItems === 0) {
            const svg: SVGSVGElement = this.renderer.createElement('svg', SVG_NS);
            const nullTransform = svg.createSVGTransform();
            nullTransform.setTranslate(0, 0);
            element.transform.baseVal.appendItem(nullTransform);
        }
    }

    private getCurrentTransformMatrix(element: SVGGElement): DOMMatrix {
        this.prepareForTransform(element);
        return element.transform.baseVal.consolidate().matrix as DOMMatrix;
    }

    applyTransformation(element: SVGGElement, transform: SVGTransform): void {
        const svg: SVGSVGElement = this.renderer.createElement('svg', SVG_NS);
        let currentTransformMatrix = this.getCurrentTransformMatrix(element);
        currentTransformMatrix = transform.matrix.multiply(currentTransformMatrix);
        element.transform.baseVal.clear();
        element.transform.baseVal.appendItem(svg.createSVGTransformFromMatrix(currentTransformMatrix));
    }

    rotateSelection(event: WheelEvent, selection: Selection): void {
        const deltaY = event.deltaY;

        this.rotationStep = deltaY < 0 ? Math.abs(this.rotationStep) * -1 : Math.abs(this.rotationStep);

        for (const element of selection.selectedElements) {
            if (this.isRotateOnSelf) {
                this.rotateElement(element, this.selectedElementsOrigin.get(element) as Coords2D);
            } else {
                this.rotateElement(element, this.boxOrigin);
            }
        }

        selection.updateFullSelectionBox();

        if (!this.isRotateOnSelf) {
            this.updateElementsOrigins(selection);
        }
    }

    private rotateElement(element: SVGGElement, origin: Coords2D): void {
        const svg: SVGSVGElement = this.renderer.createElement('svg', SVG_NS);
        const rotateTransform = svg.createSVGTransform();
        rotateTransform.setRotate(this.rotationStep, origin.x, origin.y);
        this.applyTransformation(element, rotateTransform);
    }

    translateSelection(deltaX: number, deltaY: number, selection: Selection): void {
        for (const element of selection.selectedElements) {
            this.translateElement(deltaX, deltaY, element);
        }
        selection.updateFullSelectionBox();
    }

    translateElement(deltaX: number, deltaY: number, element: SVGGElement): void {
        const svg: SVGSVGElement = this.renderer.createElement('svg', SVG_NS);
        const translateTransform = svg.createSVGTransform();
        translateTransform.setTranslate(deltaX, deltaY);
        this.applyTransformation(element, translateTransform);
    }
}
