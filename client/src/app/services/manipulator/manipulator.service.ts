import { Injectable, Renderer2 } from '@angular/core';
import { SVG_NS, SIDEBAR_WIDTH } from 'src/constants/constants';
import { Selection } from '../../../classes/selection/selection';
import { BASE_ROTATION } from 'src/constants/tool-constants';

@Injectable({
    providedIn: 'root',
})
export class ManipulatorService {
    renderer: Renderer2;
    isRotateOnSelf = false;
    rotationStep = BASE_ROTATION;
    angle = 0;

    initializeService(renderer: Renderer2): void {
        this.renderer = renderer;
    }

    rotateSelection(event: WheelEvent, selection: Selection): void {
        const deltaY = event.deltaY;
        if (deltaY < 0) {
            this.angle -= this.rotationStep;
        } else {
            this.angle += this.rotationStep;
        }
        if (this.isRotateOnSelf) {
            this.rotateOnSelf(selection);
        } else {
            this.rotateOnBoxCenter(selection);
        }
    }

    rotateOnBoxCenter(selection: Selection): void {
        console.log(this.angle);
        for (const el of selection.selectedElements) {
            const transformsList = el.transform.baseVal;
            if (
                transformsList.numberOfItems === 0 ||
                transformsList.getItem(0).type !== SVGTransform.SVG_TRANSFORM_ROTATE
            ) {
                const svg: SVGSVGElement = this.renderer.createElement('svg', SVG_NS);
                const rotateToZero = svg.createSVGTransform();
                rotateToZero.setRotate(0, 0, 0);
                el.transform.baseVal.insertItemBefore(rotateToZero, 0);
            }
            const centerBoxX = selection.selectionBox.x.baseVal.value + (selection.selectionBox.width.baseVal.value / 2);
            const centerBoxY = selection.selectionBox.y.baseVal.value + (selection.selectionBox.height.baseVal.value / 2);
            console.log(centerBoxX + " " + centerBoxY);
            el.transform.baseVal.getItem(0).setRotate(this.angle, centerBoxX, centerBoxY);
            // console.log(el.transform.baseVal.getItem(0).matrix);
        }

        // const centerBoxX = selection.selectionBox.x.baseVal.value + (selection.selectionBox.width.baseVal.value / 2);
        // const centerBoxY = selection.selectionBox.y.baseVal.value + (selection.selectionBox.height.baseVal.value / 2);
        // const svg: SVGSVGElement = this.renderer.createElement('svg', SVG_NS);
        // const rotateToZero = svg.createSVGTransform();
        // rotateToZero.setRotate(this.angle, centerBoxX, centerBoxY);
        // selection.selectionBox.transform.baseVal.insertItemBefore(rotateToZero, 0);

        selection.updateFullSelectionBox();
    }

    rotateOnSelf(selection: Selection): void {
        for (const el of selection.selectedElements) {
            const transformsList = el.transform.baseVal;
            if (
                transformsList.numberOfItems === 0 ||
                transformsList.getItem(0).type !== SVGTransform.SVG_TRANSFORM_ROTATE
            ) {
                const svg: SVGSVGElement = this.renderer.createElement('svg', SVG_NS);
                const rotateToZero = svg.createSVGTransform();
                rotateToZero.setRotate(0, 0, 0);
                el.transform.baseVal.insertItemBefore(rotateToZero, 0);
            }
            //const initialTransform = transformsList.getItem(0);
            const cx = selection.selectionBox.x.baseVal.value + (selection.selectionBox.width.baseVal.value / 2);
            const cy = selection.selectionBox.y.baseVal.value + (selection.selectionBox.height.baseVal.value / 2);
            const centerBoxX = (el.getBoundingClientRect() as DOMRect).x - SIDEBAR_WIDTH + ((el.getBoundingClientRect() as DOMRect).width / 2);
            const centerBoxY = (el.getBoundingClientRect() as DOMRect).y + ((el.getBoundingClientRect() as DOMRect).height / 2);
            console.log(centerBoxX + " " + centerBoxY);
            console.log(cx + " " + cy);
            el.transform.baseVal.getItem(0).setRotate(this.angle, centerBoxX, centerBoxY);
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
