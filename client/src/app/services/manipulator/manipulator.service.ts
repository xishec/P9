import { Injectable, Renderer2 } from '@angular/core';
import { SVG_NS, SIDEBAR_WIDTH } from 'src/constants/constants';
import { Selection } from '../../../classes/selection/selection';
import { BASE_ROTATION } from 'src/constants/tool-constants';
import { Coords2D } from 'src/classes/Coords2D';

@Injectable({
    providedIn: 'root',
})
export class ManipulatorService {
    renderer: Renderer2;
    isRotateOnSelf = false;
    boxOrigin: Coords2D = new Coords2D(0,0);
    selectedElementsOrigin: Map<SVGGElement, Coords2D> = new Map();
    rotationStep = BASE_ROTATION;
    //lastRotation: SVGTransform;
    //angle = 0;

    initializeService(renderer: Renderer2): void {
        this.renderer = renderer;
    }

    // isFirstTransformInvalid(transformsList: SVGTransformList, transformType: number): boolean {
    //     return transformsList.numberOfItems === 0 || transformsList.getItem(0).type !== transformType;
    // }

    // preventRotationOverwrite(selection: Selection, wasRotateOnSelf?: boolean): void {
    //     this.angle = 0;
    //     for (const el of selection.selectedElements) {
    //         if (!this.isFirstTransformInvalid(el.transform.baseVal, SVGTransform.SVG_TRANSFORM_ROTATE)) {
    //             const svg: SVGSVGElement = this.renderer.createElement('svg', SVG_NS);
    //             const rotateToZero = svg.createSVGTransform();
    //             if (wasRotateOnSelf) {
    //                 rotateToZero.setRotate(0, (this.selectedElementsOrigin.get(el) as Coords2D).x, (this.selectedElementsOrigin.get(el) as Coords2D).y);
    //             } else {
    //                 rotateToZero.setRotate(0, this.boxOrigin.x, this.boxOrigin.y);
    //             }
    //             el.transform.baseVal.insertItemBefore(rotateToZero, 0);
    //         }
    //     }
    // }

    updateOrigins(selection: Selection): void {
        this.updateElementsOrigins(selection);
        this.boxOrigin.y = selection.selectionBox.y.baseVal.value + (selection.selectionBox.height.baseVal.value / 2);
        this.boxOrigin.x = selection.selectionBox.x.baseVal.value + (selection.selectionBox.width.baseVal.value / 2);
    }

    updateElementsOrigins(selection: Selection): void {
        this.selectedElementsOrigin.clear();
        for (const el of selection.selectedElements) {
            const origin: Coords2D = new Coords2D( (el.getBoundingClientRect() as DOMRect).x - SIDEBAR_WIDTH + ((el.getBoundingClientRect() as DOMRect).width / 2), (el.getBoundingClientRect() as DOMRect).y + ((el.getBoundingClientRect() as DOMRect).height / 2));
            this.selectedElementsOrigin.set(el, origin);
        }
    }

    prepareForTransform(element: SVGGElement): void {
        if (element.transform.baseVal.numberOfItems === 0) {
            const svg: SVGSVGElement = this.renderer.createElement('svg', SVG_NS);
            const nullTransform = svg.createSVGTransform();
            nullTransform.setTranslate(0,0);
            element.transform.baseVal.appendItem(nullTransform);
        }
    }

    rotateSelection(event: WheelEvent, selection: Selection): void {
        const deltaY = event.deltaY;

        // this.angle += (deltaY < 0) ? -this.rotationStep : this.rotationStep;
        this.rotationStep = (deltaY < 0) ? (Math.abs(this.rotationStep) * -1) : (Math.abs(this.rotationStep) * 1);

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
        /*TRYING OUT MATRIX*/
        const svg: SVGSVGElement = this.renderer.createElement('svg', SVG_NS);
        this.prepareForTransform(element);
        let ctm = element.transform.baseVal.consolidate().matrix as DOMMatrix;
        let rotationMatrix = svg.createSVGTransform();
        rotationMatrix.setRotate(this.rotationStep, origin.x, origin.y);
        ctm = rotationMatrix.matrix.multiply(ctm);
        element.transform.baseVal.clear();
        element.transform.baseVal.appendItem(svg.createSVGTransformFromMatrix(ctm));
        // const transformsList = element.transform.baseVal;
        // if (this.isFirstTransformInvalid(transformsList, SVGTransform.SVG_TRANSFORM_ROTATE)) {
        //     const svg: SVGSVGElement = this.renderer.createElement('svg', SVG_NS);
        //     const rotateToZero = svg.createSVGTransform();
        //     rotateToZero.setRotate(0, 0, 0);
        //     element.transform.baseVal.insertItemBefore(rotateToZero, 0);
        // }
        // element.transform.baseVal.getItem(0).setRotate(this.angle, origin.x, origin.y);
    }

    translateElement(deltaX: number, deltaY: number, element: SVGGElement): void {
        /*TRYING OUT MATRIX*/
        const svg: SVGSVGElement = this.renderer.createElement('svg', SVG_NS);
        this.prepareForTransform(element);
        let ctm = element.transform.baseVal.consolidate().matrix as DOMMatrix;
        let translationMatrix = svg.createSVGTransform();
        translationMatrix.setTranslate(deltaX, deltaY);
        ctm = translationMatrix.matrix.multiply(ctm);
        element.transform.baseVal.clear();
        element.transform.baseVal.appendItem(svg.createSVGTransformFromMatrix(ctm));
        // const transformsList = element.transform.baseVal;
        // if (this.isFirstTransformInvalid(transformsList, SVGTransform.SVG_TRANSFORM_TRANSLATE)) {
        //     const svg: SVGSVGElement = this.renderer.createElement('svg', SVG_NS);
        //     const translateToZero = svg.createSVGTransform();
        //     translateToZero.setTranslate(0, 0);
        //     element.transform.baseVal.insertItemBefore(translateToZero, 0);
        // }

        // const initialTransform = transformsList.getItem(0);
        // const offsetX = -initialTransform.matrix.e;
        // const offsetY = -initialTransform.matrix.f;
        // element.transform.baseVal.getItem(0).setTranslate(deltaX - offsetX, deltaY - offsetY);
    }
}
