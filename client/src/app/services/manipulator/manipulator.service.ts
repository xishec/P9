import { Injectable, Renderer2 } from '@angular/core';
import { SVG_NS } from 'src/constants/constants';
import { Selection } from '../../../classes/selection/selection';
import { Coords2D } from 'src/classes/Coords2D';

@Injectable({
    providedIn: 'root',
})
export class ManipulatorService {
    renderer: Renderer2;

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
        const distFromOgXToCurrentMouse = dx + (isRight ? selection.ogSelectionBoxWidth : 0);

        const newWidth = distFromOgXToCurrentMouse + (isRight ? 0 : selection.ogSelectionBoxWidth);

        return newWidth / selection.ogSelectionBoxWidth;
    }

    getXTranslate(dx: number, scaleFactor: number, selection: Selection, isRight: boolean): number {
        return selection.ogSelectionBoxPositions.x - (scaleFactor * selection.ogSelectionBoxPositions.x) - (isRight ? 0 : dx);
    }

    getYScaleFactor(dy: number, selection: Selection, isBottom: boolean) {
        const distFromOgYToCurrentMouse = dy + (isBottom ? selection.ogSelectionBoxHeight : 0);

        const newHeight = distFromOgYToCurrentMouse + (isBottom ? 0 : selection.ogSelectionBoxHeight);

        return newHeight / selection.ogSelectionBoxHeight;
    }

    getYTranslate(dy: number, scaleFactor: number, selection: Selection, isBottom: boolean): number {
        return selection.ogSelectionBoxPositions.y - (scaleFactor * selection.ogSelectionBoxPositions.y) - (isBottom ? 0 : dy);
    }

    applyTransformations(selection: Selection, xScale: number, yScale: number, xTranslate: number, yTranslate: number) {
        selection.selectedElements.forEach((element: SVGGElement) => {
            element.transform.baseVal.getItem(0).setTranslate(xTranslate, yTranslate);
            element.transform.baseVal.getItem(1).setScale(xScale, yScale);
        });
    }

    applyScaleCorner(currentMouse: Coords2D, selection: Selection, isRight: boolean, isBottom: boolean) {
        let dx = currentMouse.x - selection.ogActiveControlPointCoords.x;
        dx = isRight ? dx : -dx;

        let dy = currentMouse.y - selection.ogActiveControlPointCoords.y;
        dy = isBottom ? dy : -dy;

        const xScaleFactor = this.getXScaleFactor(dx, selection, isRight);
        const yScaleFactor = this.getYScaleFactor(dy, selection, isBottom);

        const xTranslate = this.getXTranslate(dx, xScaleFactor, selection, isRight);
        const yTranslate = this.getYTranslate(dy, yScaleFactor, selection, isBottom);

        this.applyTransformations(selection, xScaleFactor, yScaleFactor, xTranslate, yTranslate);

        selection.updateFullSelectionBox();
    }

    applyScaleX(currentMouse: Coords2D, selection: Selection, isRight: boolean): void {
        let dx = currentMouse.x - selection.ogActiveControlPointCoords.x;
        dx = isRight ? dx : -dx;

        const scaleFactor = this.getXScaleFactor(dx, selection, isRight);

        const xTranslate = this.getXTranslate(dx, scaleFactor, selection, isRight);

        this.applyTransformations(selection, scaleFactor, 1, xTranslate, 0);

        selection.updateFullSelectionBox();
    }

    applyScaleY(currentMouse: Coords2D, selection: Selection, isBottom: boolean): void {
        let dy = currentMouse.y - selection.ogActiveControlPointCoords.y;
        dy = isBottom ? dy : -dy;

        const scaleFactor = this.getYScaleFactor(dy, selection, isBottom);

        const yTranslate = this.getYTranslate(dy, scaleFactor, selection, isBottom);

        this.applyTransformations(selection, 1, scaleFactor, 0, yTranslate);

        selection.updateFullSelectionBox();
    }

    translateSelection(deltaX: number, deltaY: number, selection: Selection): void {
        for (const el of selection.selectedElements) {
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

        selection.updateFullSelectionBox();
    }

    offsetSingle(offset: number, element: SVGGElement): void {
        const transformsList = element.transform.baseVal;
        if (
            transformsList.numberOfItems === 0 ||
            transformsList.getItem(0).type !== SVGTransform.SVG_TRANSFORM_TRANSLATE
        ) {
            const svg: SVGSVGElement = this.renderer.createElement('svg', SVG_NS);
            const translateToZero = svg.createSVGTransform();
            translateToZero.setTranslate(0, 0);
            element.transform.baseVal.insertItemBefore(translateToZero, 0);
        }

        const initialTransform = transformsList.getItem(0);
        const offsetX = -initialTransform.matrix.e;
        const offsetY = -initialTransform.matrix.f;
        element.transform.baseVal.getItem(0).setTranslate(offset - offsetX, offset - offsetY);
    }
}
