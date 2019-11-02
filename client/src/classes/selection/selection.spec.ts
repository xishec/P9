import { TestBed, getTestBed } from '@angular/core/testing';

import { Selection } from './selection';
import { Renderer2, ElementRef, Type } from '@angular/core';

fdescribe('Selection', () => {
    let injector: TestBed;
    let proxy: Selection;

    let rendererMock: Renderer2;
    let elementRefMock: ElementRef<SVGGElement>;

    //let spyOnSetAttribute: jasmine.Spy;
    //let spyOnAppendChild: jasmine.Spy;
    //let spyOnRemoveChild: jasmine.Spy;
    //let spyOnCreateElement: jasmine.Spy;

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

        //spyOnSetAttribute = spyOn(proxy.renderer, 'setAttribute').and.returnValue();
        //spyOnAppendChild = spyOn(proxy.renderer, 'appendChild').and.returnValue();
        //spyOnRemoveChild = spyOn(proxy.renderer, 'removeChild').and.returnValue();
        //spyOnCreateElement = spyOn(proxy.renderer, 'createElement');
    });

    it('should be created', () => {
        expect(proxy).toBeTruthy();
    });
});

/*
it('should call renderer.setAttribute for each control point', () => {
        const nbPoints = 8;
        const nbCallPerPoint = 3;

        service.initControlPoints();

        expect(spyOnSetAttribute).toHaveBeenCalledTimes(nbPoints * nbCallPerPoint);
    });

    it('should call renderer.setAttribute to set the attributes of selection box', () => {
        service.initSelectionBox();

        expect(spyOnSetAttribute).toHaveBeenCalled();
    });

    it('getStrokeWidth should return 0 if el has no stroke-width', () => {
        const el = TestHelpers.createMockSVGGElementWithAttribute('');

        const resNumber = service.getStrokeWidth(el);

        expect(resNumber).toBe(0);
    });

    it('getStrokeWidth should return 10 if el has stroke-width', () => {
        const el = TestHelpers.createMockSVGGElementWithAttribute('stroke-width');

        const resNumber = service.getStrokeWidth(el);

        expect(resNumber).toBe(10);
    });

    it('getStrokeWidth should return 0 if el has no stroke-width', () => {
        const el = TestHelpers.createMockSVGGElementWithAttribute('');

        const resNumber = service.getStrokeWidth(el);

        expect(resNumber).toBe(0);
    });

    it('mouseIsInSelectionBox should return true if mouseX is in selection box', () => {
        const mockDOMRect = {
            x: 500,
            y: 500,
            width: 50,
            height: 50,
        };

        spyOn(service, 'getDOMRect').and.returnValue(mockDOMRect as DOMRect);

        service.currentMouseX = 160;
        service.currentMouseY = 520;

        const res = service.mouseIsInSelectionBox();

        expect(res).toBeTruthy();
    });

    it('mouseIsInSelectionBox should return false if mouseX not in selection box', () => {
        const mockDOMRect = {
            x: 500,
            y: 500,
            width: 50,
            height: 50,
        };

        spyOn(service, 'getDOMRect').and.returnValue(mockDOMRect as DOMRect);

        service.currentMouseX = 1600;
        service.currentMouseY = 5200;

        const res = service.mouseIsInSelectionBox();

        expect(res).toBeFalsy();
    });

    it('mouseIsInControlPoint should return true if mouseX and mouseY in one of controlPoint', () => {
        service.controlPoints = new Array();
        const mockControlPoint = {
            cx: {
                baseVal: {
                    value: 10,
                },
            },
            cy: {
                baseVal: {
                    value: 10,
                },
            },
            r: {
                baseVal: {
                    value: 5,
                },
            },
        };
        service.controlPoints.push(mockControlPoint as SVGCircleElement);
        service.currentMouseX = 11;
        service.currentMouseY = 11;

        const res = service.mouseIsInControlPoint();

        expect(res).toBeTruthy();
    });

    it('mouseIsInControlPoint should return true if mouseX and mouseY in one of controlPoint', () => {
        service.controlPoints = new Array();
        const mockControlPoint = {
            cx: {
                baseVal: {
                    value: 10,
                },
            },
            cy: {
                baseVal: {
                    value: 10,
                },
            },
            r: {
                baseVal: {
                    value: 5,
                },
            },
        };
        service.controlPoints.push(mockControlPoint as SVGCircleElement);
        service.currentMouseX = 100;
        service.currentMouseY = 100;

        const res = service.mouseIsInControlPoint();

        expect(res).toBeFalsy();
    });

it('findLeftMostCoord should return most left coords of elements', () => {
        const width = 10;
        spyOn(service, 'getStrokeWidth').and.returnValue(width);
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

        service.selection = new Set();
        service.selection.add(mockSVG1);
        service.selection.add(mockSVG2);

        spyOn(service, 'getDOMRect').and.callFake(fakeGetDOMRect);

        const leftMostCoord = service.findLeftMostCoord();

        expect(leftMostCoord).toBe(smallestX - SIDEBAR_WIDTH - width / 2);
    });

    it('findRightMostCoord should return most right coords of elements', () => {
        const strokeWidth = 10;
        const DOMRectWidth = 100;
        spyOn(service, 'getStrokeWidth').and.returnValue(strokeWidth);
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

        service.selection = new Set();
        service.selection.add(mockSVG1);
        service.selection.add(mockSVG2);

        spyOn(service, 'getDOMRect').and.callFake(fakeGetDOMRect);

        const leftMostCoord = service.findRightMostCoord();

        expect(leftMostCoord).toBe(largestX - SIDEBAR_WIDTH + DOMRectWidth + strokeWidth / 2);
    });

    it('computeSelectionBox should call removeFullSelectionBox is !this.hasSelected', () => {
        const spy = spyOn(service, 'removeFullSelectionBox');
        spyOn(service, 'hasSelected').and.returnValue(false);

        service.computeSelectionBox();

        expect(spy).toHaveBeenCalled();
    });

    it('computeSelectionBox should call renderer.setAttribute 4 times is this.hasSelected', () => {
        spyOn(service, 'hasSelected').and.returnValue(true);
        spyOn(service, 'findLeftMostCoord').and.returnValue(10);
        spyOn(service, 'findRightMostCoord').and.returnValue(100);
        spyOn(service, 'findTopMostCoord').and.returnValue(100);
        spyOn(service, 'findBottomMostCoord').and.returnValue(10);
        spyOn(service, 'computeControlPoints').and.returnValue();

        service.computeSelectionBox();

        expect(spyOnSetAttribute).toHaveBeenCalledTimes(4);
    });

    it('computeControlPoints should call setAttribute 16 times : 8 selectionCorner * 2 attributes', () => {
        const mockSVGRectElement = {
            x: { baseVal: { value: 10 } },
            y: { baseVal: { value: 10 } },
            width: { baseVal: { value: 10 } },
            height: { baseVal: { value: 10 } },
        } as SVGRectElement;

        service.selectionBox = mockSVGRectElement;

        service.controlPoints = new Array();
        for (let i = 0; i < 8; i++) {
            const mockSVG = TestHelpers.createMockSVGCircle();
            service.controlPoints.push(mockSVG);
        }

        service.computeControlPoints();

        expect(spyOnSetAttribute).toHaveBeenCalledTimes(16);
    });

    it('hasSelected return true if this.selection.size > 0', () => {
        service.selection = new Set();
        const mockSVGElement = TestHelpers.createMockSVGGElement();
        service.selection.add(mockSVGElement);

        const res = service.hasSelected();

        expect(res).toBeTruthy();
    });

    it('appendControlPoints should call renderer.appendChild for each points (8)', () => {
        service.appendControlPoints();

        expect(spyOnAppendChild).toHaveBeenCalledTimes(8);
    });

    it('removeControlPoints should call renderer.removeChild for each ctrlPt', () => {
        const mockCtrlPnt = TestHelpers.createMockSVGCircle();
        service.controlPoints = new Array();
        service.controlPoints.push(mockCtrlPnt);

        service.removeControlPoints();

        expect(spyOnRemoveChild).toHaveBeenCalledTimes(1);
    });

    it('appendFullSelectionBox should call appendControlPoints if !selectionBoxIsAppended', () => {
        service.selectionBoxIsAppended = false;
        const spy = spyOn(service, 'appendControlPoints');

        service.appendFullSelectionBox();

        expect(spy).toHaveBeenCalled();
    });

    it('removeFullSelectionBox should call removeControlPoints if selectionBoxIsAppended', () => {
        service.selectionBoxIsAppended = true;
        const spy = spyOn(service, 'removeControlPoints');

        service.removeFullSelectionBox();

        expect(spy).toHaveBeenCalled();
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

        service.selection = new Set();
        service.selection.add(mockSVGGelement);

        const mockTranslate = ({
            setTranslate: () => null,
        } as (unknown)) as SVGTransform;

        const mockSVGSVGElement = {
            createSVGTransform: () => mockTranslate,
        } as SVGSVGElement;

        spyOn(service.renderer, 'createElement').and.returnValue(mockSVGSVGElement);

        const spy = spyOn(mockSVGTransform, 'setTranslate');

        service.translateSelection();

        expect(spy).toHaveBeenCalled();
    });

    // tslint:disable-next-line: max-line-length
    it('translateSelection should not call createSVGTransform if transformList.numberOfItems > 0 && getItem().type === SVGTransform.SVG_TRANSFORM_TRANSLATE ', () => {
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

        service.selection = new Set();
        service.selection.add(mockSVGGelement);

        const mockTranslate = ({
            setTranslate: () => null,
        } as (unknown)) as SVGTransform;

        const mockSVGSVGElement = {
            createSVGTransform: () => mockTranslate,
        } as SVGSVGElement;

        spyOn(service.renderer, 'createElement').and.returnValue(mockSVGSVGElement);

        const spy = spyOn(mockSVGTransform, 'setTranslate');

        service.translateSelection();

        expect(spy).toHaveBeenCalled();
    });


*/
