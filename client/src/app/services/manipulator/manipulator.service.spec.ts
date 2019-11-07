import { TestBed } from '@angular/core/testing';

import { ManipulatorService } from './manipulator.service';

describe('ManipulatorService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ManipulatorService = TestBed.get(ManipulatorService);
    expect(service).toBeTruthy();
  });
});


// it('moveBy should call createSVGTransform if transformList.numberOfItems === 0', () => {
    //     const mockSVGTransform = ({
    //         type: 0,
    //         setTranslate: () => null,
    //         matrix: {
    //             e: 0,
    //             f: 0,
    //         },
    //     } as (unknown)) as SVGTransform;

    //     const mockSVGTranformList = ({
    //         numberOfItems: 0,
    //         getItem: () => mockSVGTransform,
    //         insertItemBefore: () => null,
    //     } as (unknown)) as SVGTransformList;

    //     const mockSVGGelement = ({
    //         transform: {
    //             baseVal: mockSVGTranformList,
    //         },
    //     } as (unknown)) as SVGGElement;

    //     proxy.selectedElements = new Set<SVGGElement>();
    //     proxy.selectedElements.add(mockSVGGelement);

    //     const mockTranslate = ({
    //         setTranslate: () => null,
    //     } as (unknown)) as SVGTransform;

    //     const mockSVGSVGElement = {
    //         createSVGTransform: () => mockTranslate,
    //     } as SVGSVGElement;

    //     spyOnCreateElement.and.returnValue(mockSVGSVGElement);

    //     const spy = spyOn(mockSVGTransform, 'setTranslate');
    //     const spyOnUpdateFullSelectionBox = spyOn(proxy, 'updateFullSelectionBox').and.callFake(() => null);

    //     const dummyMouseCoordsInit: MouseCoords = {x: 10, y: 10};
    //     const dummyMouseCoordsCurr: MouseCoords = {x: 20, y: 20};
    //     proxy.moveBy(dummyMouseCoordsInit, dummyMouseCoordsCurr);

    //     expect(spy).toHaveBeenCalled();
    //     expect(spyOnUpdateFullSelectionBox).toHaveBeenCalled();
    // });

    // tslint:disable-next-line: max-line-length
    // it('moveBy should not call createSVGTransform if transformList.numberOfItems > 0 && getItem().type === SVGTransform.SVG_TRANSFORM_TRANSLATE ', () => {
    //     const mockSVGTransform = ({
    //         type: SVGTransform.SVG_TRANSFORM_TRANSLATE,
    //         setTranslate: () => null,
    //         matrix: {
    //             e: 0,
    //             f: 0,
    //         },
    //     } as (unknown)) as SVGTransform;

    //     const mockSVGTranformList = ({
    //         numberOfItems: 5,
    //         getItem: () => mockSVGTransform,
    //         insertItemBefore: () => null,
    //     } as (unknown)) as SVGTransformList;

    //     const mockSVGGelement = ({
    //         transform: {
    //             baseVal: mockSVGTranformList,
    //         },
    //     } as (unknown)) as SVGGElement;

    //     proxy.selectedElements = new Set<SVGGElement>();
    //     proxy.selectedElements.add(mockSVGGelement);

    //     const mockTranslate = ({
    //         setTranslate: () => null,
    //     } as (unknown)) as SVGTransform;

    //     const mockSVGSVGElement = {
    //         createSVGTransform: () => mockTranslate,
    //     } as SVGSVGElement;

    //     spyOnCreateElement.and.returnValue(mockSVGSVGElement);

    //     const spy = spyOn(mockSVGTransform, 'setTranslate');
    //     const spyOnUpdateFullSelectionBox = spyOn(proxy, 'updateFullSelectionBox').and.callFake(() => null);

    //     const dummyMouseCoordsInit: MouseCoords = {x: 10, y: 10};
    //     const dummyMouseCoordsCurr: MouseCoords = {x: 20, y: 20};
    //     proxy.moveBy(dummyMouseCoordsInit, dummyMouseCoordsCurr);

    //     expect(spy).toHaveBeenCalled();
    //     expect(spyOnUpdateFullSelectionBox).toHaveBeenCalled();
    // });
