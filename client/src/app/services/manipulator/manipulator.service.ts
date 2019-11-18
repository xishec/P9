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
        switch(fromControlPoint.getAttribute('controlPointId') as string) {
            case '0':
                break;
            case '1':
                //this.applyTopScale(currentMouseCoords, initialMouseCoords, selection);
                break;
            case '2':
                break;
            case '3':
                break;
            case '4':
                break;
            case '5':
                this.applyTopScale(currentMouseCoords, initialMouseCoords, selection);
                break;
            case '6':
                break;
            case '7':
                break;
            default:
                console.log('what');
                break;
        }
    }

    applyTopScale(currentMouse: Coords2D, initialMouse: Coords2D, selection: Selection): void {
        for (const el of selection.selectedElements) {
            const transformsList = el.transform.baseVal;
            if (
                transformsList.numberOfItems === 0 ||
                transformsList.getItem(0).type !== SVGTransform.SVG_TRANSFORM_SCALE
            ) {
                const svg: SVGSVGElement = this.renderer.createElement('svg', SVG_NS);
                const nullTranslate = svg.createSVGTransform();
                nullTranslate.setTranslate(0, 0);
                el.transform.baseVal.insertItemBefore(nullTranslate, 0);
                const nullScale = svg.createSVGTransform();
                nullScale.setScale(1, 1);
                el.transform.baseVal.insertItemBefore(nullScale, 0);
            }
            let newScaleFactor = currentMouse.y / initialMouse.y;

            const currentY = (selection.selectionBox.getBoundingClientRect() as DOMRect).y;
            const deltaY = (currentY - (currentY * newScaleFactor)) / newScaleFactor;

            el.transform.baseVal.getItem(0).setScale(1, newScaleFactor);
            el.transform.baseVal.getItem(1).setTranslate(0, deltaY);
        }
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
