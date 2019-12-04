import { getTestBed, TestBed } from '@angular/core/testing';

import { ElementRef, Renderer2, Type } from '@angular/core';
import { Selection } from './selection';

import { SIDEBAR_WIDTH } from 'src/constants/constants';
import * as TestHelpers from '../../classes/test-helpers.spec';
import { Coords2D } from '../Coords2D';

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

        spyOnSetAttribute = spyOn(proxy[`renderer`], 'setAttribute').and.returnValue();
        spyOnAppendChild = spyOn(proxy[`renderer`], 'appendChild').and.returnValue();
        spyOnRemoveChild = spyOn(proxy[`renderer`], 'removeChild').and.returnValue();
        spyOnCreateElement = spyOn(proxy[`renderer`], 'createElement');
    });

    it('should be created', () => {
        expect(proxy).toBeTruthy();
    });

    it('should return a DOMRect when calling getDOMRect', () => {
        const mockDOMRect = {
            x: 0,
            y: 0,
            width: 0,
            height: 0,
        };

        const mockSVGGElement = {
            getBoundingClientRect: () => mockDOMRect,
        };

        const res = proxy[`getDOMRect`]((mockSVGGElement as unknown) as SVGGElement);

        expect(res).toEqual(mockDOMRect as DOMRect);
    });

    it('should initialize the selection box and the control points when calling initFullSelectionBox', () => {
        proxy[`initFullSelectionBox`]();

        expect(spyOnSetAttribute).toHaveBeenCalled();
        expect(spyOnCreateElement).toHaveBeenCalled();
    });

    it('should remove the fullselection box, empty the selection and set isAppended to false when calling cleanUp', () => {
        const spyRemoveSelectionBox = spyOn<any>(proxy, 'removeFullSelectionBox');
        const spyEmptySelection = spyOn(proxy, 'emptySelection');

        proxy.cleanUp();

        expect(spyRemoveSelectionBox).toHaveBeenCalled();
        expect(spyEmptySelection).toHaveBeenCalled();
    });

    it('should remove the selection box and control points if isAppended was true when calling removeFullSelectionBox', () => {
        proxy.isAppended = true;

        proxy[`removeFullSelectionBox`]();

        expect(spyOnRemoveChild).toHaveBeenCalled();
        expect(proxy.isAppended).toBeFalsy();
    });

    it('should append the selection box and control points if isAppended was false when calling appendFullSelectionBox', () => {
        proxy.isAppended = false;

        proxy[`appendFullSelectionBox`]();

        expect(spyOnAppendChild).toHaveBeenCalled();
        expect(proxy.isAppended).toBeTruthy();
    });

    it('should not append the selection box and control points if isAppended was true when calling appendFullSelectionBox', () => {
        proxy.isAppended = true;

        proxy[`appendFullSelectionBox`]();

        expect(spyOnAppendChild).not.toHaveBeenCalled();
        expect(proxy.isAppended).toBeTruthy();
    });

    it('should return the radius of the control point when calling getControlPointR and the radius is 10', () => {
        const RADIUS = 10;
        const mockCircle = {
            r: {
                baseVal: {
                    value: RADIUS,
                },
            },
        };
        const res = proxy[`getControlPointR`]((mockCircle as unknown) as SVGCircleElement);
        expect(res).toEqual(RADIUS);
    });

    it('should return the cx of the control point when calling getControlPointCx and the cx is 10', () => {
        const CX = 10;
        const mockCircle = {
            cx: {
                baseVal: {
                    value: CX,
                },
            },
        };
        const res = proxy[`getControlPointCx`]((mockCircle as unknown) as SVGCircleElement);
        expect(res).toEqual(CX);
    });

    it('should return the cy of the control point when calling getControlPointCx and the cy is 10', () => {
        const CY = 10;
        const mockCircle = {
            cy: {
                baseVal: {
                    value: CY,
                },
            },
        };
        const res = proxy[`getControlPointCy`]((mockCircle as unknown) as SVGCircleElement);
        expect(res).toEqual(CY);
    });

    it('getStrokeWidth should return 0 if el has no stroke-width', () => {
        const el = TestHelpers.createMockSVGGElementWithAttribute('');

        const resNumber = proxy[`getStrokeWidth`](el);

        expect(resNumber).toBe(0);
    });

    it('getStrokeWidth should return 10 if el has stroke-width', () => {
        const el = TestHelpers.createMockSVGGElementWithAttribute('stroke-width');

        const resNumber = proxy[`getStrokeWidth`](el);

        expect(resNumber).toBe(10);
    });

    it('mouseIsInSelectionBox should return true if mouseCoords are in selectionBox and selectionBox is appended', () => {
        const mockMouseCoords: Coords2D = new Coords2D(5, 5);

        const mockDOMRect = {
            x: 360,
            y: 0,
            width: 50,
            height: 50,
        };

        spyOn<any>(proxy, 'getDOMRect').and.returnValue(mockDOMRect as DOMRect);
        proxy.isAppended = true;

        const res = proxy.mouseIsInSelectionBox(mockMouseCoords);

        expect(res).toBeTruthy();
    });

    it('mouseIsInSelectionBox should return false if mouseCoords are not in selectionBox and selectionBox is appended', () => {
        const mockMouseCoords: Coords2D = new Coords2D(0, 0);

        const mockDOMRect = {
            x: 370,
            y: 10,
            width: 50,
            height: 50,
        };

        spyOn<any>(proxy, 'getDOMRect').and.returnValue(mockDOMRect as DOMRect);
        proxy.isAppended = true;

        const res = proxy.mouseIsInSelectionBox(mockMouseCoords);

        expect(res).toBeFalsy();
    });

    it('mouseIsInControlPoint should return true if mouse is in a controlPoint and isAppended is true', () => {
        const mockMouseCoords: Coords2D = new Coords2D(0, 0);

        proxy.isAppended = true;

        spyOn<any>(proxy, 'getControlPointCx').and.callFake(() => {
            return 0;
        });
        spyOn<any>(proxy, 'getControlPointCy').and.callFake(() => {
            return 0;
        });
        spyOn<any>(proxy, 'getControlPointR').and.callFake(() => {
            return 10;
        });

        const res = proxy.mouseIsInControlPoint(mockMouseCoords);

        expect(res).toBeTruthy();
    });

    it('mouseIsInControlPoint should return false if mouse is not in a controlPoint and isAppended is true', () => {
        const mockMouseCoords: Coords2D = new Coords2D(20, 20);

        proxy.isAppended = true;

        spyOn<any>(proxy, 'getControlPointCx').and.callFake(() => {
            return 0;
        });
        spyOn<any>(proxy, 'getControlPointCy').and.callFake(() => {
            return 0;
        });
        spyOn<any>(proxy, 'getControlPointR').and.callFake(() => {
            return 10;
        });

        const res = proxy.mouseIsInControlPoint(mockMouseCoords);

        expect(res).toBeFalsy();
    });

    it('should update all 16 control points when calling updateControlPoints', () => {
        const mockRect = {
            x: {
                baseVal: {
                    value: 0,
                },
            },
            y: {
                baseVal: {
                    value: 0,
                },
            },
            width: {
                baseVal: {
                    value: 100,
                },
            },
            height: {
                baseVal: {
                    value: 100,
                },
            },
        };

        proxy.selectionBox = (mockRect as unknown) as SVGRectElement;
        proxy[`updateControlPoints`]();

        expect(spyOnSetAttribute).toHaveBeenCalledTimes(16);
    });

    it('findLeftMostCoord should return most left coords of elements', () => {
        const width = 10;
        spyOn<any>(proxy, 'getStrokeWidth').and.returnValue(width);
        const fakeGetDOMRect = (el: SVGGElement) => {
            const mockDOMRect = {
                x: el.clientLeft,
            } as DOMRect;
            return mockDOMRect;
        };
        const smallestX = 1000;
        const mockSVG1 = ({
            clientLeft: smallestX,
        } as unknown) as SVGGElement;

        const mockSVG2 = ({
            clientLeft: 1360,
        } as unknown) as SVGGElement;

        proxy.selectedElements = new Set();
        proxy.selectedElements.add(mockSVG1);
        proxy.selectedElements.add(mockSVG2);

        spyOn<any>(proxy, 'getDOMRect').and.callFake(fakeGetDOMRect);

        const leftMostCoord = proxy[`findLeftMostCoord`]();

        expect(leftMostCoord).toBe(smallestX - SIDEBAR_WIDTH - width / 2);
    });

    it('findRightMostCoord should return most right coords of elements', () => {
        const strokeWidth = 10;
        const DOMRectWidth = 100;
        spyOn<any>(proxy, 'getStrokeWidth').and.returnValue(strokeWidth);
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
        } as unknown) as SVGGElement;

        const mockSVG2 = ({
            clientLeft: largestX,
        } as unknown) as SVGGElement;

        proxy.selectedElements = new Set();
        proxy.selectedElements.add(mockSVG1);
        proxy.selectedElements.add(mockSVG2);

        spyOn<any>(proxy, 'getDOMRect').and.callFake(fakeGetDOMRect);

        const leftMostCoord = proxy[`findRightMostCoord`]();

        expect(leftMostCoord).toBe(largestX - SIDEBAR_WIDTH + DOMRectWidth + strokeWidth / 2);
    });

    it('findTopMostCoord should return most top coords of elements', () => {
        const strokeWidth = 10;
        const DOMRectHeight = 100;
        spyOn<any>(proxy, 'getStrokeWidth').and.returnValue(strokeWidth);
        const fakeGetDOMRect = (el: SVGGElement) => {
            const mockDOMRect = {
                y: el.clientTop,
                height: DOMRectHeight,
            } as DOMRect;
            return mockDOMRect;
        };
        const largestY = 1000;
        const mockSVG1 = ({
            clientTop: 1000,
        } as unknown) as SVGGElement;

        const mockSVG2 = ({
            clientTop: largestY,
        } as unknown) as SVGGElement;

        proxy.selectedElements = new Set();
        proxy.selectedElements.add(mockSVG1);
        proxy.selectedElements.add(mockSVG2);

        spyOn<any>(proxy, 'getDOMRect').and.callFake(fakeGetDOMRect);

        const topMostCoord = proxy[`findTopMostCoord`]();

        expect(topMostCoord).toBe(largestY - strokeWidth / 2);
    });

    it('findBottomMostCoord should return most bottom coords of elements', () => {
        const strokeWidth = 10;
        const DOMRectHeight = 100;
        spyOn<any>(proxy, 'getStrokeWidth').and.returnValue(strokeWidth);
        const fakeGetDOMRect = (el: SVGGElement) => {
            const mockDOMRect = {
                y: el.clientTop,
                height: DOMRectHeight,
            } as DOMRect;
            return mockDOMRect;
        };
        const largestY = 1000;
        const mockSVG1 = ({
            clientTop: 1000,
        } as unknown) as SVGGElement;

        const mockSVG2 = ({
            clientTop: largestY,
        } as unknown) as SVGGElement;

        proxy.selectedElements = new Set();
        proxy.selectedElements.add(mockSVG1);
        proxy.selectedElements.add(mockSVG2);

        spyOn<any>(proxy, 'getDOMRect').and.callFake(fakeGetDOMRect);

        const bottomMostCoord = proxy[`findBottomMostCoord`]();

        expect(bottomMostCoord).toBe(largestY + DOMRectHeight + strokeWidth / 2);
    });

    it('should update the selectionBox and the controlPoints when calling updateFullSelectionBox', () => {
        proxy.selectedElements.add(TestHelpers.createMockSVGGElement());
        spyOn<any>(proxy, 'findLeftMostCoord').and.callFake(() => 0);
        spyOn<any>(proxy, 'findRightMostCoord').and.callFake(() => 0);
        spyOn<any>(proxy, 'findTopMostCoord').and.callFake(() => 0);
        spyOn<any>(proxy, 'findBottomMostCoord').and.callFake(() => 0);
        const spy = spyOn<any>(proxy, 'updateControlPoints');

        proxy.updateFullSelectionBox();

        expect(spy).toHaveBeenCalled();
        expect(spyOnSetAttribute).toHaveBeenCalled();
    });

    it('should remove the selectionBox and the controlPoints when calling updateFullSelectionBox and the selection is empty', () => {
        const spyOnRemoveFullSelectionBox = spyOn<any>(proxy, 'removeFullSelectionBox');
        proxy.updateFullSelectionBox();
        expect(spyOnRemoveFullSelectionBox).toHaveBeenCalled();
    });

    it('should add to selectedElements, update the full selectionBox and append the full selection box when adding an element', () => {
        proxy.selectedElements.add(TestHelpers.createMockSVGGElement());
        const spyAddToSelectedElements = spyOn(proxy.selectedElements, 'add');
        const spyUpdateFullSelectionBox = spyOn(proxy, 'updateFullSelectionBox');
        const spyAppendFullSelectionBox = spyOn<any>(proxy, 'appendFullSelectionBox');

        proxy.addToSelection(TestHelpers.createMockSVGGElement());

        expect(spyAddToSelectedElements).toHaveBeenCalled();
        expect(spyUpdateFullSelectionBox).toHaveBeenCalled();
        expect(spyAppendFullSelectionBox).toHaveBeenCalled();
    });

    it('should update the selectionBox but not render the selectionBox when adding an element already in selectedElements', () => {
        const spyAddToSelectedElements = spyOn(proxy.selectedElements, 'add');
        const spyUpdateFullSelectionBox = spyOn(proxy, 'updateFullSelectionBox');
        const spyAppendFullSelectionBox = spyOn<any>(proxy, 'appendFullSelectionBox');

        proxy.addToSelection(TestHelpers.createMockSVGGElement());

        expect(spyAddToSelectedElements).toHaveBeenCalled();
        expect(spyUpdateFullSelectionBox).toHaveBeenCalled();
        expect(spyAppendFullSelectionBox).not.toHaveBeenCalled();
    });

    it('should remove already selected element from selectedElements and update selectionBox when calling invertAddToSelection', () => {
        const dummyG = TestHelpers.createMockSVGGElement();
        proxy.selectedElements.add(dummyG);
        const spyDeleteFromSelectedElements = spyOn(proxy.selectedElements, 'delete');
        const spyUpdateFullSelectionBox = spyOn<any>(proxy, 'updateFullSelectionBox');
        const spyAppendFullSelectionBox = spyOn<any>(proxy, 'appendFullSelectionBox');

        proxy.invertAddToSelection(dummyG);

        expect(spyDeleteFromSelectedElements).toHaveBeenCalled();
        expect(spyUpdateFullSelectionBox).toHaveBeenCalled();
        expect(spyAppendFullSelectionBox).toHaveBeenCalled();
    });

    it('should add unselected element to selectedElements and update the selectionBox when calling invertAddToSelection', () => {
        const dummyG = TestHelpers.createMockSVGGElement();
        proxy.selectedElements.add(dummyG);
        const spyAddToSelectedElements = spyOn(proxy.selectedElements, 'add');
        const spyUpdateFullSelectionBox = spyOn<any>(proxy, 'updateFullSelectionBox');
        const spyAppendFullSelectionBox = spyOn<any>(proxy, 'appendFullSelectionBox');

        proxy.invertAddToSelection(TestHelpers.createMockSVGGElement());

        expect(spyAddToSelectedElements).toHaveBeenCalled();
        expect(spyUpdateFullSelectionBox).toHaveBeenCalled();
        expect(spyAppendFullSelectionBox).toHaveBeenCalled();
    });

    it('should delete the element from the selection and update the selectionBox when calling removeFromSelection', () => {
        const spy = spyOn(proxy.selectedElements, 'delete');
        const spyOnUpdateFullSelectionBox = spyOn(proxy, 'updateFullSelectionBox');

        proxy[`removeFromSelection`](TestHelpers.createMockSVGGElement());

        expect(spy).toHaveBeenCalled();
        expect(spyOnUpdateFullSelectionBox).toHaveBeenCalled();
    });

    it('should delete the element, update the selectionBox and remove the selectionBox if empty when calling removeFromSelection', () => {
        const spy = spyOn(proxy.selectedElements, 'delete');
        const spyOnUpdateFullSelectionBox = spyOn(proxy, 'updateFullSelectionBox');
        const spyOnRemoveFullSelectionBox = spyOn<any>(proxy, 'removeFullSelectionBox');

        proxy[`removeFromSelection`](TestHelpers.createMockSVGGElement());

        expect(spy).toHaveBeenCalled();
        if (expect(spy).toHaveBeenCalled()) {
            proxy.selectedElements = new Set<SVGGElement>();
        }
        expect(spyOnUpdateFullSelectionBox).toHaveBeenCalled();
        expect(spyOnRemoveFullSelectionBox).toHaveBeenCalled();
    });

    it('should remove the full selection box and clear the selection when calling emptySelection', () => {
        const spyOnRemoveFullSelectionBox = spyOn<any>(proxy, 'removeFullSelectionBox');
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
        const spy = spyOn<any>(proxy, 'removeFromSelection');

        proxy.handleSelection(TestHelpers.createMockSVGGElement(), false);

        expect(spy).toHaveBeenCalled();
    });

    it('should buffer and remove a selected element when calling handleInvertSelection', () => {
        const spyAddInvertBuffer = spyOn(proxy.invertSelectionBuffer, 'add');
        const spy = spyOn<any>(proxy, 'removeFromSelection');
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

    it('should unbuffer and add an unselected element when calling handleInvertSelection for element not in selection rect', () => {
        const spyAddInvertBuffer = spyOn(proxy.invertSelectionBuffer, 'delete');
        const spy = spyOn(proxy, 'addToSelection');
        spyOn(proxy.selectedElements, 'has').and.returnValue(false);
        spyOn(proxy.invertSelectionBuffer, 'has').and.returnValue(true);

        proxy.handleInvertSelection(TestHelpers.createMockSVGGElement(), false);

        expect(spyAddInvertBuffer).toHaveBeenCalled();
        expect(spy).toHaveBeenCalled();
    });

    it('should unbuffer and remove a selected element when calling handleInvertSelection for element in selection rect', () => {
        const spyAddInvertBuffer = spyOn(proxy.invertSelectionBuffer, 'delete');
        const spy = spyOn<any>(proxy, 'removeFromSelection');
        spyOn(proxy.selectedElements, 'has').and.returnValue(true);
        spyOn(proxy.invertSelectionBuffer, 'has').and.returnValue(true);

        proxy.handleInvertSelection(TestHelpers.createMockSVGGElement(), false);

        expect(spyAddInvertBuffer).toHaveBeenCalled();
        expect(spy).toHaveBeenCalled();
    });
});
