import { getTestBed, TestBed } from '@angular/core/testing';

import { ElementRef, Renderer2, Type } from '@angular/core';
import { Coords2D } from 'src/classes/Coords2D';
import { OFFSET_STEP } from 'src/constants/tool-constants';
import { Selection } from '../../../classes/selection/selection';
import { ManipulatorService } from './manipulator.service';

describe('ManipulatorService', () => {
    let selection: Selection;
    let service: ManipulatorService;
    let injector: TestBed;
    let rendererMock: Renderer2;
    let elementRefMock: ElementRef<SVGGElement>;
    let spyOnCreateElement: jasmine.Spy;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                Selection,
                ManipulatorService,
                {
                    provide: Renderer2,
                    useValue: {
                        createElement: () => null,
                        setAttribute: () => null,
                        appendChild: () => null,
                        removeChild: () => null,
                    },
                },
                {
                    provide: ElementRef,
                    useValue: {
                        nativeElement: {
                            getBoundingClientRect: () => {
                                const boundLeft = 0;
                                const boundTop = 0;
                                const boundRect = {
                                    left: boundLeft,
                                    top: boundTop,
                                };
                                return boundRect;
                            },
                        },
                    },
                },
            ],
        });
        injector = getTestBed();
        rendererMock = injector.get<Renderer2>(Renderer2 as Type<Renderer2>);
        elementRefMock = injector.get<ElementRef>(ElementRef as Type<ElementRef>);
        selection = new Selection(rendererMock, elementRefMock);
        service = injector.get(ManipulatorService);
        service.initializeService(rendererMock);
        spyOnCreateElement = spyOn(rendererMock, 'createElement');
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('translateSelection should call createSVGTransform if transformList.numberOfItems === 0', () => {
        const mockSVGTransform = ({
            type: 0,
            setTranslate: () => null,
            matrix: {
                e: 0,
                f: 0,
            },
        } as (unknown)) as SVGTransform;

        const mockSVGTranformList = ({
            numberOfItems: 0,
            getItem: () => mockSVGTransform,
            insertItemBefore: () => null,
        } as (unknown)) as SVGTransformList;

        const mockSVGGelement = ({
            transform: {
                baseVal: mockSVGTranformList,
            },
        } as (unknown)) as SVGGElement;

        selection.selectedElements = new Set<SVGGElement>();
        selection.selectedElements.add(mockSVGGelement);

        const mockTranslate = ({
            setTranslate: () => null,
        } as (unknown)) as SVGTransform;

        const mockSVGSVGElement = {
            createSVGTransform: () => mockTranslate,
        } as SVGSVGElement;

        spyOnCreateElement.and.returnValue(mockSVGSVGElement);

        const spy = spyOn(mockSVGTransform, 'setTranslate');
        const spyOnUpdateFullSelectionBox = spyOn(selection, 'updateFullSelectionBox').and.callFake(() => null);

        const dummyMouseCoordsInit: Coords2D = { x: 10, y: 10 };
        const dummyMouseCoordsCurr: Coords2D = { x: 20, y: 20 };
        service.translateSelection(
            dummyMouseCoordsInit.x - dummyMouseCoordsCurr.x,
            dummyMouseCoordsInit.x - dummyMouseCoordsCurr.x,
            selection,
        );

        expect(spy).toHaveBeenCalled();
        expect(spyOnUpdateFullSelectionBox).toHaveBeenCalled();
    });

    it('translateSelection should not call createSVGTransform if transformList is not empty and first transform is translate', () => {
        const mockSVGTransform = ({
            type: SVGTransform.SVG_TRANSFORM_TRANSLATE,
            setTranslate: () => null,
            matrix: {
                e: 0,
                f: 0,
            },
        } as (unknown)) as SVGTransform;

        const mockSVGTranformList = ({
            numberOfItems: 5,
            getItem: () => mockSVGTransform,
            insertItemBefore: () => null,
        } as (unknown)) as SVGTransformList;

        const mockSVGGelement = ({
            transform: {
                baseVal: mockSVGTranformList,
            },
        } as (unknown)) as SVGGElement;

        selection.selectedElements = new Set<SVGGElement>();
        selection.selectedElements.add(mockSVGGelement);

        const mockTranslate = ({
            setTranslate: () => null,
        } as (unknown)) as SVGTransform;

        const mockSVGSVGElement = {
            createSVGTransform: () => mockTranslate,
        } as SVGSVGElement;

        spyOnCreateElement.and.returnValue(mockSVGSVGElement);

        const spy = spyOn(mockSVGTransform, 'setTranslate');
        const spyOnUpdateFullSelectionBox = spyOn(selection, 'updateFullSelectionBox').and.callFake(() => null);

        const dummyMouseCoordsInit: Coords2D = { x: 10, y: 10 };
        const dummyMouseCoordsCurr: Coords2D = { x: 20, y: 20 };
        service.translateSelection(
            dummyMouseCoordsInit.x - dummyMouseCoordsCurr.x,
            dummyMouseCoordsInit.x - dummyMouseCoordsCurr.x,
            selection,
        );

        expect(spy).toHaveBeenCalled();
        expect(spyOnUpdateFullSelectionBox).toHaveBeenCalled();
    });

    it('offsetSingle should call createSVGTransform if transformList.numberOfItems === 0', () => {
        const mockSVGTransform = ({
            type: 0,
            setTranslate: () => null,
            matrix: {
                e: 0,
                f: 0,
            },
        } as (unknown)) as SVGTransform;

        const mockSVGTranformList = ({
            numberOfItems: 0,
            getItem: () => mockSVGTransform,
            insertItemBefore: () => null,
        } as (unknown)) as SVGTransformList;

        const mockSVGGelement = ({
            transform: {
                baseVal: mockSVGTranformList,
            },
        } as (unknown)) as SVGGElement;

        const mockTranslate = ({
            setTranslate: () => null,
        } as (unknown)) as SVGTransform;

        const mockSVGSVGElement = {
            createSVGTransform: () => mockTranslate,
        } as SVGSVGElement;

        spyOnCreateElement.and.returnValue(mockSVGSVGElement);

        const spy = spyOn(mockSVGTransform, 'setTranslate');

        const offset = OFFSET_STEP;
        service.offsetSingle(offset, mockSVGGelement);

        expect(spy).toHaveBeenCalled();
    });

    it('translateSelection should not call createSVGTransform if transformList is empty and first transform is translate', () => {
        const mockSVGTransform = ({
            type: SVGTransform.SVG_TRANSFORM_TRANSLATE,
            setTranslate: () => null,
            matrix: {
                e: 0,
                f: 0,
            },
        } as (unknown)) as SVGTransform;

        const mockSVGTranformList = ({
            numberOfItems: 5,
            getItem: () => mockSVGTransform,
            insertItemBefore: () => null,
        } as (unknown)) as SVGTransformList;

        const mockSVGGelement = ({
            transform: {
                baseVal: mockSVGTranformList,
            },
        } as (unknown)) as SVGGElement;

        const mockTranslate = ({
            setTranslate: () => null,
        } as (unknown)) as SVGTransform;

        const mockSVGSVGElement = {
            createSVGTransform: () => mockTranslate,
        } as SVGSVGElement;

        spyOnCreateElement.and.returnValue(mockSVGSVGElement);

        const spy = spyOn(mockSVGTransform, 'setTranslate');

        const offset = OFFSET_STEP;
        service.offsetSingle(offset, mockSVGGelement);

        expect(spy).toHaveBeenCalled();
    });
});
