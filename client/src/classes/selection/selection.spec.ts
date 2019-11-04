import { getTestBed, TestBed } from '@angular/core/testing';

import { ElementRef, Renderer2, Type } from '@angular/core';
import { MouseCoords } from 'src/app/services/tools/abstract-tools/abstract-tool.service';
import { Selection } from './selection';

import { SIDEBAR_WIDTH } from 'src/constants/constants';
import * as TestHelpers from '../../classes/test-helpers.spec';

describe('Selection', () => {
    let injector: TestBed;
    let proxy: Selection;

    let rendererMock: Renderer2;
    let elementRefMock: ElementRef<SVGGElement>;

    let spyOnSetAttribute: jasmine.Spy;
    let spyOnAppendChild: jasmine.Spy;
    let spyOnRemoveChild: jasmine.Spy;
    let spyOnCreateElement: jasmine.Spy;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                Selection,
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
        proxy = new Selection(rendererMock, elementRefMock);

        spyOnSetAttribute = spyOn(proxy.renderer, 'setAttribute').and.returnValue();
        spyOnAppendChild = spyOn(proxy.renderer, 'appendChild').and.returnValue();
        spyOnRemoveChild = spyOn(proxy.renderer, 'removeChild').and.returnValue();
        spyOnCreateElement = spyOn(proxy.renderer, 'createElement');
    });

    it('should be created', () => {
        expect(proxy).toBeTruthy();
    });

    it('should initialize the selection box and the control points when calling initFullSelectionBox', () => {
        proxy.initFullSelectionBox();

        expect(spyOnSetAttribute).toHaveBeenCalled();
        expect(spyOnCreateElement).toHaveBeenCalled();
    });

    it('should remove the fullselection box, empty the selection and set isAppended to false when calling cleanUp', () => {
        const spyRemoveSelectionBox = spyOn(proxy, 'removeFullSelectionBox');
        const spyEmptySelection = spyOn(proxy, 'emptySelection');

        proxy.cleanUp();

        expect(spyRemoveSelectionBox).toHaveBeenCalled();
        expect(spyEmptySelection).toHaveBeenCalled();
    });

    it('should remove the selection box and control points if isAppended was true when calling removeFullSelectionBox', () => {
        proxy.isAppended = true;

        proxy.removeFullSelectionBox();

        expect(spyOnRemoveChild).toHaveBeenCalled();
        expect(proxy.isAppended).toBeFalsy();
    });

    it('should append the selection box and control points if isAppended was false when calling appendFullSelectionBox', () => {
        proxy.isAppended = false;

        proxy.appendFullSelectionBox();

        expect(spyOnAppendChild).toHaveBeenCalled();
        expect(proxy.isAppended).toBeTruthy();
    });

    it('getStrokeWidth should return 0 if el has no stroke-width', () => {
        const el = TestHelpers.createMockSVGGElementWithAttribute('');

        const resNumber = proxy.getStrokeWidth(el);

        expect(resNumber).toBe(0);
    });

    it('getStrokeWidth should return 10 if el has stroke-width', () => {
        const el = TestHelpers.createMockSVGGElementWithAttribute('stroke-width');

        const resNumber = proxy.getStrokeWidth(el);

        expect(resNumber).toBe(10);
    });

    it('mouseIsInSelectionBox should return true if mouseCoords are in selectionBox and selectionBox is appended', () => {
        const mockMouseCoords: MouseCoords = { x: 5, y: 5 };

        const mockDOMRect = {
            x: 360,
            y: 0,
            width: 50,
            height: 50,
        };

        spyOn(proxy, 'getDOMRect').and.returnValue(mockDOMRect as DOMRect);
        proxy.isAppended = true;

        const res = proxy.mouseIsInSelectionBox(mockMouseCoords);

        expect(res).toBeTruthy();
    });

    it('mouseIsInSelectionBox should return false if mouseCoords are not in selectionBox and selectionBox is appended', () => {
        const mockMouseCoords: MouseCoords = { x: 0, y: 0 };

        const mockDOMRect = {
            x: 370,
            y: 10,
            width: 50,
            height: 50,
        };

        spyOn(proxy, 'getDOMRect').and.returnValue(mockDOMRect as DOMRect);
        proxy.isAppended = true;

        const res = proxy.mouseIsInSelectionBox(mockMouseCoords);

        expect(res).toBeFalsy();
    });

    it('mouseIsInControlPoint should return true if mouse is in a controlPoint and isAppended is true', () => {
        const mockMouseCoords: MouseCoords = { x: 0, y: 0 };

        proxy.isAppended = true;

        spyOn(proxy, 'getControlPointCx').and.callFake(() => {
            return 0;
        });
        spyOn(proxy, 'getControlPointCy').and.callFake(() => {
            return 0;
        });
        spyOn(proxy, 'getControlPointR').and.callFake(() => {
            return 10;
        });

        const res = proxy.mouseIsInControlPoint(mockMouseCoords);

        expect(res).toBeTruthy();
    });

    it('mouseIsInControlPoint should return false if mouse is not in a controlPoint and isAppended is true', () => {
        const mockMouseCoords: MouseCoords = { x: 20, y: 20 };

        proxy.isAppended = true;

        spyOn(proxy, 'getControlPointCx').and.callFake(() => {
            return 0;
        });
        spyOn(proxy, 'getControlPointCy').and.callFake(() => {
            return 0;
        });
        spyOn(proxy, 'getControlPointR').and.callFake(() => {
            return 10;
        });

        const res = proxy.mouseIsInControlPoint(mockMouseCoords);

        expect(res).toBeFalsy();
    });

    it('findLeftMostCoord should return most left coords of elements', () => {
        const width = 10;
        spyOn(proxy, 'getStrokeWidth').and.returnValue(width);
        const fakeGetDOMRect = (el: SVGGElement) => {
            const mockDOMRect = {
                x: el.clientLeft,
            } as DOMRect;
            return mockDOMRect;
        };
        const smallestX = 1000;
        const mockSVG1 = ({
            clientLeft: smallestX,
        } as (unknown)) as SVGGElement;

        const mockSVG2 = ({
            clientLeft: 1360,
        } as (unknown)) as SVGGElement;

        proxy.selectedElements = new Set();
        proxy.selectedElements.add(mockSVG1);
        proxy.selectedElements.add(mockSVG2);

        spyOn(proxy, 'getDOMRect').and.callFake(fakeGetDOMRect);

        const leftMostCoord = proxy.findLeftMostCoord();

        expect(leftMostCoord).toBe(smallestX - SIDEBAR_WIDTH - width / 2);
    });

    it('findRightMostCoord should return most right coords of elements', () => {
        const strokeWidth = 10;
        const DOMRectWidth = 100;
        spyOn(proxy, 'getStrokeWidth').and.returnValue(strokeWidth);
        const fakeGetDOMRect = (el: SVGGElement) => {
            const mockDOMRect = {
                x: el.clientLeft,
                width: DOMRectWidth,
            } as DOMRect;
            return mockDOMRect;
        };
        const largestX = 1360;
        const mockSVG1 = ({
            clientLeft: 1000,
        } as (unknown)) as SVGGElement;

        const mockSVG2 = ({
            clientLeft: largestX,
        } as (unknown)) as SVGGElement;

        proxy.selectedElements = new Set();
        proxy.selectedElements.add(mockSVG1);
        proxy.selectedElements.add(mockSVG2);

        spyOn(proxy, 'getDOMRect').and.callFake(fakeGetDOMRect);

        const leftMostCoord = proxy.findRightMostCoord();

        expect(leftMostCoord).toBe(largestX - SIDEBAR_WIDTH + DOMRectWidth + strokeWidth / 2);
    });

    it('should update the selectionBox and the controlPoints when calling updateFullSelectionBox', () => {
        proxy.selectedElements.add(TestHelpers.createMockSVGGElement());
        spyOn(proxy, 'findLeftMostCoord').and.callFake(() => 0);
        spyOn(proxy, 'findRightMostCoord').and.callFake(() => 0);
        spyOn(proxy, 'findTopMostCoord').and.callFake(() => 0);
        spyOn(proxy, 'findBottomMostCoord').and.callFake(() => 0);
        const spy = spyOn(proxy, 'updateControlPoints');

        proxy.updateFullSelectionBox();

        expect(spy).toHaveBeenCalled();
        expect(spyOnSetAttribute).toHaveBeenCalled();
    });

    it('should remove the selectionBox and the controlPoints when calling updateFullSelectionBox and the selection is empty', () => {
        const spyOnRemoveFullSelectionBox = spyOn(proxy, 'removeFullSelectionBox');
        proxy.updateFullSelectionBox();
        expect(spyOnRemoveFullSelectionBox).toHaveBeenCalled();
    });

    it('should add to selectedElements, update the full selectionBox and append the full selection box when adding an element', () => {
        proxy.selectedElements.add(TestHelpers.createMockSVGGElement());
        const spyAddToSelectedElements = spyOn(proxy.selectedElements, 'add');
        const spyUpdateFullSelectionBox = spyOn(proxy, 'updateFullSelectionBox');
        const spyAppendFullSelectionBox = spyOn(proxy, 'appendFullSelectionBox');

        proxy.addToSelection(TestHelpers.createMockSVGGElement());

        expect(spyAddToSelectedElements).toHaveBeenCalled();
        expect(spyUpdateFullSelectionBox).toHaveBeenCalled();
        expect(spyAppendFullSelectionBox).toHaveBeenCalled();
    });

    it('should update the selectionBox but not render the selectionBox when adding an element already in selectedElements', () => {
        const spyAddToSelectedElements = spyOn(proxy.selectedElements, 'add');
        const spyUpdateFullSelectionBox = spyOn(proxy, 'updateFullSelectionBox');
        const spyAppendFullSelectionBox = spyOn(proxy, 'appendFullSelectionBox');

        proxy.addToSelection(TestHelpers.createMockSVGGElement());

        expect(spyAddToSelectedElements).toHaveBeenCalled();
        expect(spyUpdateFullSelectionBox).toHaveBeenCalled();
        expect(spyAppendFullSelectionBox).not.toHaveBeenCalled();
    });

    it('should remove already selected element from selectedElements and update selectionBox when calling invertAddToSelection', () => {
        const dummyG = TestHelpers.createMockSVGGElement();
        proxy.selectedElements.add(dummyG);
        const spyDeleteFromSelectedElements = spyOn(proxy.selectedElements, 'delete');
        const spyUpdateFullSelectionBox = spyOn(proxy, 'updateFullSelectionBox');
        const spyAppendFullSelectionBox = spyOn(proxy, 'appendFullSelectionBox');

        proxy.invertAddToSelection(dummyG);

        expect(spyDeleteFromSelectedElements).toHaveBeenCalled();
        expect(spyUpdateFullSelectionBox).toHaveBeenCalled();
        expect(spyAppendFullSelectionBox).toHaveBeenCalled();
    });

    it('should add unselected element to selectedElements and update the selectionBox when calling invertAddToSelection', () => {
        const dummyG = TestHelpers.createMockSVGGElement();
        proxy.selectedElements.add(dummyG);
        const spyAddToSelectedElements = spyOn(proxy.selectedElements, 'add');
        const spyUpdateFullSelectionBox = spyOn(proxy, 'updateFullSelectionBox');
        const spyAppendFullSelectionBox = spyOn(proxy, 'appendFullSelectionBox');

        proxy.invertAddToSelection(TestHelpers.createMockSVGGElement());

        expect(spyAddToSelectedElements).toHaveBeenCalled();
        expect(spyUpdateFullSelectionBox).toHaveBeenCalled();
        expect(spyAppendFullSelectionBox).toHaveBeenCalled();
    });

    it('should delete the element from the selection and update the selectionBox when calling removeFromSelection', () => {
        const spy = spyOn(proxy.selectedElements, 'delete');
        const spyOnUpdateFullSelectionBox = spyOn(proxy, 'updateFullSelectionBox');

        proxy.removeFromSelection(TestHelpers.createMockSVGGElement());

        expect(spy).toHaveBeenCalled();
        expect(spyOnUpdateFullSelectionBox).toHaveBeenCalled();
    });

    it('should delete the element, update the selectionBox and remove the selectionBox if empty when calling removeFromSelection', () => {
        const spy = spyOn(proxy.selectedElements, 'delete');
        const spyOnUpdateFullSelectionBox = spyOn(proxy, 'updateFullSelectionBox');
        const spyOnRemoveFullSelectionBox = spyOn(proxy, 'removeFullSelectionBox');

        proxy.removeFromSelection(TestHelpers.createMockSVGGElement());

        expect(spy).toHaveBeenCalled();
        if (expect(spy).toHaveBeenCalled()) {
            proxy.selectedElements = new Set<SVGGElement>();
        }
        expect(spyOnUpdateFullSelectionBox).toHaveBeenCalled();
        expect(spyOnRemoveFullSelectionBox).toHaveBeenCalled();
    });

    it('should remove the full selection box and clear the selection when calling emptySelection', () => {
        const spyOnRemoveFullSelectionBox = spyOn(proxy, 'removeFullSelectionBox');
        const spy = spyOn(proxy.selectedElements, 'clear');

        proxy.emptySelection();

        expect(spyOnRemoveFullSelectionBox).toHaveBeenCalled();
        expect(spy).toHaveBeenCalled();
    });

    it('should add element to selection if isInSelectionRect is true when calling handleSelection', () => {
        const spy = spyOn(proxy, 'addToSelection');

        proxy.handleSelection(TestHelpers.createMockSVGGElement(), true);

        expect(spy).toHaveBeenCalled();
    });

    it('should remove element from selection if isInSelectionRect is false when calling handleSelection', () => {
        const spy = spyOn(proxy, 'removeFromSelection');

        proxy.handleSelection(TestHelpers.createMockSVGGElement(), false);

        expect(spy).toHaveBeenCalled();
    });

    it('should buffer and remove a selected element when calling handleInvertSelection', () => {
        const spyAddInvertBuffer = spyOn(proxy.invertSelectionBuffer, 'add');
        const spy = spyOn(proxy, 'removeFromSelection');
        spyOn(proxy.selectedElements, 'has').and.returnValue(true);
        spyOn(proxy.invertSelectionBuffer, 'has').and.returnValue(false);

        proxy.handleInvertSelection(TestHelpers.createMockSVGGElement(), true);

        expect(spyAddInvertBuffer).toHaveBeenCalled();
        expect(spy).toHaveBeenCalled();
    });

    it('should buffer and add an unselected element when calling handleInvertSelection', () => {
        const spyAddInvertBuffer = spyOn(proxy.invertSelectionBuffer, 'add');
        const spy = spyOn(proxy, 'addToSelection');
        spyOn(proxy.selectedElements, 'has').and.returnValue(false);
        spyOn(proxy.invertSelectionBuffer, 'has').and.returnValue(false);

        proxy.handleInvertSelection(TestHelpers.createMockSVGGElement(), true);

        expect(spyAddInvertBuffer).toHaveBeenCalled();
        expect(spy).toHaveBeenCalled();
    });

    it('should not do anything when calling handleInvertSelection and nothing is in the selectionRect', () => {
        const spyAddInvertBuffer = spyOn(proxy.invertSelectionBuffer, 'add');
        const spy = spyOn(proxy, 'addToSelection');
        spyOn(proxy.selectedElements, 'has').and.returnValue(false);
        spyOn(proxy.invertSelectionBuffer, 'has').and.returnValue(false);

        proxy.handleInvertSelection(TestHelpers.createMockSVGGElement(), false);

        expect(spyAddInvertBuffer).not.toHaveBeenCalled();
        expect(spy).not.toHaveBeenCalled();
    });

    it('moveBy should call createSVGTransform if transformList.numberOfItems === 0', () => {
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

        proxy.selectedElements = new Set<SVGGElement>();
        proxy.selectedElements.add(mockSVGGelement);

        const mockTranslate = ({
            setTranslate: () => null,
        } as (unknown)) as SVGTransform;

        const mockSVGSVGElement = {
            createSVGTransform: () => mockTranslate,
        } as SVGSVGElement;

        spyOnCreateElement.and.returnValue(mockSVGSVGElement);

        const spy = spyOn(mockSVGTransform, 'setTranslate');
        const spyOnUpdateFullSelectionBox = spyOn(proxy, 'updateFullSelectionBox').and.callFake(() => null);

        const dummyMouseCoordsInit: MouseCoords = {x: 10, y: 10};
        const dummyMouseCoordsCurr: MouseCoords = {x: 20, y: 20};
        proxy.moveBy(dummyMouseCoordsInit, dummyMouseCoordsCurr);

        expect(spy).toHaveBeenCalled();
        expect(spyOnUpdateFullSelectionBox).toHaveBeenCalled();
    });

    // tslint:disable-next-line: max-line-length
    it('moveBy should not call createSVGTransform if transformList.numberOfItems > 0 && getItem().type === SVGTransform.SVG_TRANSFORM_TRANSLATE ', () => {
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

        proxy.selectedElements = new Set<SVGGElement>();
        proxy.selectedElements.add(mockSVGGelement);

        const mockTranslate = ({
            setTranslate: () => null,
        } as (unknown)) as SVGTransform;

        const mockSVGSVGElement = {
            createSVGTransform: () => mockTranslate,
        } as SVGSVGElement;

        spyOnCreateElement.and.returnValue(mockSVGSVGElement);

        const spy = spyOn(mockSVGTransform, 'setTranslate');
        const spyOnUpdateFullSelectionBox = spyOn(proxy, 'updateFullSelectionBox').and.callFake(() => null);

        const dummyMouseCoordsInit: MouseCoords = {x: 10, y: 10};
        const dummyMouseCoordsCurr: MouseCoords = {x: 20, y: 20};
        proxy.moveBy(dummyMouseCoordsInit, dummyMouseCoordsCurr);

        expect(spy).toHaveBeenCalled();
        expect(spyOnUpdateFullSelectionBox).toHaveBeenCalled();
    });
});
