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
                    SIDEBAR_WIDTH +
                    (el.getBoundingClientRect() as DOMRect).width / 2,
                (el.getBoundingClientRect() as DOMRect).y + (el.getBoundingClientRect() as DOMRect).height / 2,
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

        this.rotationStep = deltaY < 0 ? Math.abs(this.rotationStep) * -1 : Math.abs(this.rotationStep) * 1;

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
        // this.prepareForTransform(element);
        // let currentTransformMatrix = element.transform.baseVal.consolidate().matrix as DOMMatrix;
        // currentTransformMatrix = rotationMatrix.matrix.multiply(currentTransformMatrix);
        // element.transform.baseVal.clear();
        // element.transform.baseVal.appendItem(svg.createSVGTransformFromMatrix(currentTransformMatrix));

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
