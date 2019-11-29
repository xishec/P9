import { Injectable, Renderer2 } from '@angular/core';
import { Coords2D } from 'src/classes/Coords2D';
import { SIDEBAR_WIDTH, SVG_NS } from 'src/constants/constants';
import { BASE_ROTATION } from 'src/constants/tool-constants';
import { Selection } from '../../../classes/selection/selection';

@Injectable({
    providedIn: 'root',
})
export class ManipulatorService {
    renderer: Renderer2;
    isRotateOnSelf = false;
    boxOrigin: Coords2D = new Coords2D(0, 0);
    selectedElementsOrigin: Map<SVGGElement, Coords2D> = new Map();
    rotationStep = BASE_ROTATION;

    initializeService(renderer: Renderer2): void {
        this.renderer = renderer;
    }

    scaleSelection(currentMouseCoords: Coords2D, initialMouseCoords: Coords2D, fromControlPoint: SVGCircleElement, selection: Selection): void {
        switch (fromControlPoint.getAttribute('controlPointId') as string) {
            case '0':
                this.applyScaleCorner(currentMouseCoords, selection, false, false);
                break;
            case '1':
                this.applyScaleY(currentMouseCoords, selection, false);
                break;
            case '2':
                this.applyScaleCorner(currentMouseCoords, selection, true, false);
                break;
            case '3':
                this.applyScaleX(currentMouseCoords, selection, true);
                break;
            case '4':
                this.applyScaleCorner(currentMouseCoords, selection, true, true);
                break;
            case '5':
                this.applyScaleY(currentMouseCoords, selection, true);
                break;
            case '6':
                this.applyScaleCorner(currentMouseCoords, selection, false, true);
                break;
            case '7':
                this.applyScaleX(currentMouseCoords, selection, false);
                break;
            default:
                console.log('what');
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

        let scaleFactor = newWidth / selection.ogSelectionBoxWidth;

        if (selection.isAltDown) {
            scaleFactor = 2 * scaleFactor - 1;
        }

        return scaleFactor;
    }

    getXTranslate(dx: number, scaleFactor: number, selection: Selection, isRight: boolean): number {
        let xTranslate =  selection.ogSelectionBoxPositions.x - (scaleFactor * selection.ogSelectionBoxPositions.x) - (isRight ? 0 : dx);

        if (selection.isAltDown) {
            xTranslate = xTranslate - (isRight ? dx : 0)
        }

        return xTranslate;
    }

    getYScaleFactor(dy: number, selection: Selection, isBottom: boolean) {
        const distFromOgYToCurrentMouse = dy + (isBottom ? selection.ogSelectionBoxHeight : 0);

        const newHeight = distFromOgYToCurrentMouse + (isBottom ? 0 : selection.ogSelectionBoxHeight);

        let scaleFactor = newHeight / selection.ogSelectionBoxHeight;

        if (selection.isAltDown) {
            scaleFactor = 2 * scaleFactor - 1;
        }

        return scaleFactor;
    }

    getYTranslate(dy: number, scaleFactor: number, selection: Selection, isBottom: boolean): number {
        let yTranslate = selection.ogSelectionBoxPositions.y - (scaleFactor * selection.ogSelectionBoxPositions.y) - (isBottom ? 0 : dy);

        if (selection.isAltDown) {
            yTranslate = yTranslate - (isBottom ? dy : 0);
        }

        return yTranslate;
    }

    applyRedimTransformations(selection: Selection, xScale: number, yScale: number, xTranslate: number, yTranslate: number) {
        selection.selectedElements.forEach((element: SVGGElement) => {
            element.transform.baseVal.getItem(0).setTranslate(xTranslate, yTranslate);
            element.transform.baseVal.getItem(1).setScale(xScale, yScale);
        });
    }

    getDistanceFromControlPoint(currentMousePos: number, cntrlPointPos: number, isRightOrBottom: boolean) {
        let distance = currentMousePos - cntrlPointPos;
        distance = isRightOrBottom ? distance : -distance;
        return distance;
    }

    applyScaleCorner(currentMouse: Coords2D, selection: Selection, isRight: boolean, isBottom: boolean) {
        let dx = this.getDistanceFromControlPoint(currentMouse.x + window.scrollX, selection.ogActiveControlPointCoords.x, isRight);
        let dy = this.getDistanceFromControlPoint(currentMouse.y + window.scrollY, selection.ogActiveControlPointCoords.y, isBottom);

        if (selection.isShiftDown) {
            // find the new wanted dimensions of the redimBox
            const width2 = selection.ogSelectionBoxWidth + dx;
            const height2 = selection.ogSelectionBoxHeight + dy;

            // get the scale factor for both directions
            const horizScale = width2 / selection.ogSelectionBoxWidth;
            const vertScale = height2 / selection.ogSelectionBoxHeight;

            // Get the smallest scale
            const scale = Math.min(Math.abs(horizScale), Math.abs(vertScale));

            // Get Dimensions of the scaled rectangle
            const newWidth = Math.sign(horizScale) * scale * selection.ogSelectionBoxWidth;
            const newHeight = Math.sign(vertScale) * scale * selection.ogSelectionBoxHeight;

            dx = newWidth - selection.ogSelectionBoxWidth;
            dy = newHeight - selection.ogSelectionBoxHeight;
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

    updateElementsOrigins(selection: Selection): void {
        this.selectedElementsOrigin.clear();
        for (const el of selection.selectedElements) {
            const origin: Coords2D = new Coords2D(
                (el.getBoundingClientRect() as DOMRect).x -
                    SIDEBAR_WIDTH + window.scrollX +
                    (el.getBoundingClientRect() as DOMRect).width / 2,
                (el.getBoundingClientRect() as DOMRect).y + window.scrollY + (el.getBoundingClientRect() as DOMRect).height / 2,
            );
            this.selectedElementsOrigin.set(el, origin);
        }
    }

    prepareForTransform(element: SVGGElement): void {
        if (element.transform.baseVal.numberOfItems === 0) {
            const svg: SVGSVGElement = this.renderer.createElement('svg', SVG_NS);
            const nullTransform = svg.createSVGTransform();
            nullTransform.setTranslate(0, 0);
            element.transform.baseVal.appendItem(nullTransform);
        }
    }

    getCurrentTransformMatrix(element: SVGGElement): DOMMatrix {
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

    rotateElement(element: SVGGElement, origin: Coords2D): void {
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
