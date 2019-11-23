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
    // selectedElementsOrigin: Coords2D[] = new Array();
    selectedElementsOrigin: Map<SVGGElement, Coords2D> = new Map();
    rotationStep = BASE_ROTATION;
    lastRotation: SVGTransform;
    angle = 0;

    initializeService(renderer: Renderer2): void {
        this.renderer = renderer;
    }

    preventRotationOverwrite(selection: Selection, wasRotateOnSelf: boolean): void {
        this.angle = 0;
        for (const el of selection.selectedElements) {
            const transformsList = el.transform.baseVal;
            if (
                transformsList.numberOfItems === 0 ||
                transformsList.getItem(0).type === SVGTransform.SVG_TRANSFORM_ROTATE
            ) {
                const svg: SVGSVGElement = this.renderer.createElement('svg', SVG_NS);
                const rotateToZero = svg.createSVGTransform();
                if (wasRotateOnSelf) {
                    rotateToZero.setRotate(0, (this.selectedElementsOrigin.get(el) as Coords2D).x, (this.selectedElementsOrigin.get(el) as Coords2D).y);
                    el.transform.baseVal.insertItemBefore(rotateToZero, 0);
                } else {
                    rotateToZero.setRotate(0, this.boxOrigin.x, this.boxOrigin.y);
                    el.transform.baseVal.insertItemBefore(rotateToZero, 0);
                }
            }
        }
    }

    updateOrigins(selection: Selection): void {
        this.updateElementsOrigins(selection);
        this.boxOrigin.y = selection.selectionBox.y.baseVal.value + (selection.selectionBox.height.baseVal.value / 2);
        this.boxOrigin.x = selection.selectionBox.x.baseVal.value + (selection.selectionBox.width.baseVal.value / 2);
    }

    updateElementsOrigins(selection: Selection): void {
        //this.selectedElementsOrigin.splice(0, this.selectedElementsOrigin.length);
        this.selectedElementsOrigin.clear();
        for (const el of selection.selectedElements) {
            const origin: Coords2D = new Coords2D( (el.getBoundingClientRect() as DOMRect).x - SIDEBAR_WIDTH + ((el.getBoundingClientRect() as DOMRect).width / 2), (el.getBoundingClientRect() as DOMRect).y + ((el.getBoundingClientRect() as DOMRect).height / 2));
            this.selectedElementsOrigin.set(el, origin);
            //this.selectedElementsOrigin.push(origin);
        }
    }

    rotateSelection(event: WheelEvent, selection: Selection): void {
        const deltaY = event.deltaY;
        if (deltaY < 0) {
            this.angle -= this.rotationStep;
        } else {
            this.angle += this.rotationStep;
        }
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
        // if (this.isRotateOnSelf) {
        //     this.rotateOnSelf(selection);
        // } else {
        //     this.rotateOnBoxCenter(selection);
        // }
    }

    rotateElement(element: SVGGElement, origin: Coords2D): void {
        const transformsList = element.transform.baseVal;
        if (
            transformsList.numberOfItems === 0 ||
            transformsList.getItem(0).type !== SVGTransform.SVG_TRANSFORM_ROTATE
        ) {
            const svg: SVGSVGElement = this.renderer.createElement('svg', SVG_NS);
            const rotateToZero = svg.createSVGTransform();
            rotateToZero.setRotate(0, 0, 0);
            element.transform.baseVal.insertItemBefore(rotateToZero, 0);
        }
        element.transform.baseVal.getItem(0).setRotate(this.angle, origin.x, origin.y);
    }

    // rotateOnBoxCenter(selection: Selection): void {
    //     for (const el of selection.selectedElements) {
    //         const transformsList = el.transform.baseVal;
    //         if (
    //             transformsList.numberOfItems === 0 ||
    //             transformsList.getItem(0).type !== SVGTransform.SVG_TRANSFORM_ROTATE
    //         ) {
    //             const svg: SVGSVGElement = this.renderer.createElement('svg', SVG_NS);
    //             const rotateToZero = svg.createSVGTransform();
    //             rotateToZero.setRotate(0, 0, 0);
    //             el.transform.baseVal.insertItemBefore(rotateToZero, 0);
    //         }
    //         el.transform.baseVal.getItem(0).setRotate(this.angle, this.boxOrigin.x, this.boxOrigin.y);
    //     }
    //     selection.updateFullSelectionBox();
    //     this.updateElementsOrigins(selection);
    // }

    // rotateOnSelf(selection: Selection): void {
    //     for (const el of selection.selectedElements) {
    //         const transformsList = el.transform.baseVal;
    //         if (
    //             transformsList.numberOfItems === 0 ||
    //             transformsList.getItem(0).type !== SVGTransform.SVG_TRANSFORM_ROTATE
    //         ) {
    //             const svg: SVGSVGElement = this.renderer.createElement('svg', SVG_NS);
    //             const rotateToZero = svg.createSVGTransform();
    //             rotateToZero.setRotate(0, 0, 0);
    //             el.transform.baseVal.insertItemBefore(rotateToZero, 0);
    //         }
    //         el.transform.baseVal.getItem(0).setRotate(this.angle, (this.selectedElementsOrigin.get(el) as Coords2D).x, (this.selectedElementsOrigin.get(el) as Coords2D).y);
    //     }
    //     selection.updateFullSelectionBox();
    // }

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
