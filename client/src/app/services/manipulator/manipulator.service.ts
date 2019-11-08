import { Injectable, Renderer2 } from '@angular/core';
import { Selection } from '../../../classes/selection/selection';
import { SVG_NS } from 'src/constants/constants';

@Injectable({
  providedIn: 'root'
})
export class ManipulatorService {
    renderer: Renderer2;

  constructor() { }

  initializeService(renderer: Renderer2): void {
      this.renderer = renderer;
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
