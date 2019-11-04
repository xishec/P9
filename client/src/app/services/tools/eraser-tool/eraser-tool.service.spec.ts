import { ElementRef, Renderer2, Type } from '@angular/core';
import { TestBed, getTestBed } from '@angular/core/testing';

import { EraserToolService } from './eraser-tool.service';
import { DrawStackService } from '../../draw-stack/draw-stack.service';
import {
    createMouseEvent,
    createMockSVGGElementWithAttribute,
    createKeyBoardEvent,
} from 'src/classes/test-helpers.spec';
import { SVG_NS, Keys } from 'src/constants/constants';
import { SVGGElementInfo } from 'src/classes/svggelement-info';
import { HTMLAttribute } from 'src/constants/tool-constants';

fdescribe('EraserToolService', () => {
    let injector: TestBed;
    let service: EraserToolService;
    let leftMouseEvent: MouseEvent;
    let rightMouseEvent: MouseEvent;

    let spyOnremoveChild: jasmine.Spy;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                EraserToolService,
                {
                    provide: Renderer2,
                    useValue: {
                        createElement: () => null,
                        setAttribute: () => null,
                        appendChild: () => null,
                        removeChild: () => null,
                        setProperty: () => null,
                    },
                },
                {
                    provide: DrawStackService,
                    useValue: {
                        push: () => null,
                        currentStackTarget: {
                            subscribe: () => null,
                        },
                        getElementByPosition: () => {
                            const mockSVGGElement = {
                                getAttribute: () => null,
                            };
                            return (mockSVGGElement as unknown) as SVGGElement;
                        },
                        removeElementByPosition: () => null,
                        getDrawStackLength: () => 1,
                        drawStack: () => {
                            const mockdrawStack = {
                                getAttribute: () => null,
                            };
                            return (mockdrawStack as unknown) as Array<SVGGElement>;
                        },
                        renderer: () => {
                            const mockrenderer = {};
                            return (mockrenderer as unknown) as Renderer2;
                        },
                        changeTargetElement: () => null,
                    },
                },
                {
                    provide: ElementRef,
                    useValue: {
                        nativeElement: {
                            getBoundingClientRect: () => {
                                const boundleft = 0;
                                const boundtop = 0;
                                const boundRect = {
                                    left: boundleft,
                                    top: boundtop,
                                };
                                return boundRect;
                            },
                        },
                    },
                },
            ],
        });

        injector = getTestBed();
        service = injector.get(EraserToolService);
        const rendererMock = injector.get<Renderer2>(Renderer2 as Type<Renderer2>);
        const drawStackMock = injector.get<DrawStackService>(DrawStackService as Type<DrawStackService>);
        const elementRefMock = injector.get<ElementRef>(ElementRef as Type<ElementRef>);
        service.initializeService(elementRefMock, rendererMock, drawStackMock);

        leftMouseEvent = createMouseEvent(10, 10, 0);
        rightMouseEvent = createMouseEvent(10, 10, 2);

        spyOnremoveChild = spyOn(service.renderer, 'removeChild').and.returnValue();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should call onMouseDown if isLeftMouseDown is true', () => {
        service.isLeftMouseDown = true;
        const spyOnMouseDown: jasmine.Spy = spyOn(service, 'onMouseDown');
        const spyOncheckSelection: jasmine.Spy = spyOn(service, 'checkSelection');

        service.onMouseMove(leftMouseEvent);

        expect(spyOnMouseDown).toHaveBeenCalled();
        expect(spyOncheckSelection).toHaveBeenCalled();
    });

    it('should not call onMouseDown if isLeftMouseDown is false', () => {
        service.isLeftMouseDown = false;
        const spyOnMouseDown: jasmine.Spy = spyOn(service, 'onMouseDown');
        const spyOncheckSelection: jasmine.Spy = spyOn(service, 'checkSelection');

        service.onMouseMove(leftMouseEvent);

        expect(spyOnMouseDown).toHaveBeenCalledTimes(0);
        expect(spyOncheckSelection).toHaveBeenCalled();
    });

    it('should call appendSquare if isSquareAppended is false', () => {
        service.isSquareAppended = false;
        const spyOnappendSquare: jasmine.Spy = spyOn(service, 'appendSquare');

        service.setSquareToMouse(leftMouseEvent);

        expect(spyOnappendSquare).toHaveBeenCalled();
    });

    it('should not call appendSquare if isSquareAppended is true', () => {
        service.isSquareAppended = true;
        const spyOnappendSquare: jasmine.Spy = spyOn(service, 'appendSquare');

        service.setSquareToMouse(leftMouseEvent);

        expect(spyOnappendSquare).toHaveBeenCalledTimes(0);
    });

    it('should call removeChild if isOnTarget is true and getElementByPosition returns an element', () => {
        service.isOnTarget = true;
        const spyOncheckSelection: jasmine.Spy = spyOn(service, 'checkSelection');
        const spyOngetElementByPosition: jasmine.Spy = spyOn(service.drawStack, 'getElementByPosition').and.returnValue(
            service.renderer.createElement('rect', SVG_NS),
        );

        service.onMouseDown(leftMouseEvent);

        expect(service.isLeftMouseDown).toEqual(true);
        expect(spyOncheckSelection).toHaveBeenCalled();
        expect(spyOnremoveChild).toHaveBeenCalled();
        expect(spyOngetElementByPosition).toHaveBeenCalled();
    });

    it('should call checkSelection if isOnTarget is false and set isOnTarget to false', () => {
        service.isOnTarget = false;
        const spyOncheckSelection: jasmine.Spy = spyOn(service, 'checkSelection');

        service.onMouseDown(rightMouseEvent);

        expect(service.isOnTarget).toEqual(false);
        expect(spyOncheckSelection).toHaveBeenCalled();
    });

    it('#isInSelection should return true if selection box and elementBox are in touch', () => {
        const selectionBox = new DOMRect(0, 0, 0, 0);
        const elBox = new DOMRect(0, 0, 0, 0);

        expect(service.isInSelection(selectionBox, elBox, 1)).toEqual(true);
    });

    it('#isInSelection should return false if selection box and elementBox are not in touch', () => {
        const selectionBox = new DOMRect(0, 0, 0, 0);
        const elBox = new DOMRect(10, 10, 1, 1);

        expect(service.isInSelection(selectionBox, elBox)).toEqual(false);
    });

    it('#checkSelection should call get and set function of changedElements if an element does not exist', () => {
        const spyOngetDOMRect: jasmine.Spy = spyOn(service, 'getDOMRect').and.returnValue(new DOMRect(0, 0, 0, 0));
        const spyOngetDrawStackLength: jasmine.Spy = spyOn(service.drawStack, 'getDrawStackLength').and.returnValue(1);
        const spyOnisInSelection: jasmine.Spy = spyOn(service, 'isInSelection').and.returnValue(true);
        const spyOnget: jasmine.Spy = spyOn(service.changedElements, 'get').and.returnValue(undefined);
        const spyOnset: jasmine.Spy = spyOn(service.changedElements, 'set');

        service.drawStack.drawStack[0] = createMockSVGGElementWithAttribute('id_element');

        service.checkSelection();

        expect(spyOngetDOMRect).toHaveBeenCalled();
        expect(spyOngetDrawStackLength).toHaveBeenCalled();
        expect(spyOnisInSelection).toHaveBeenCalled();
        expect(spyOnget).toHaveBeenCalled();
        expect(spyOnset).toHaveBeenCalled();
    });

    it('#checkSelection should not call set function of changedElements if an element exists', () => {
        spyOn(service, 'getDOMRect').and.returnValue(new DOMRect(0, 0, 0, 0));
        spyOn(service.drawStack, 'getDrawStackLength').and.returnValue(1);
        spyOn(service, 'isInSelection').and.returnValue(true);
        const spyOnget: jasmine.Spy = spyOn(service.changedElements, 'get').and.returnValue(new SVGGElementInfo());
        const spyOnset: jasmine.Spy = spyOn(service.changedElements, 'set');

        service.drawStack.drawStack[0] = createMockSVGGElementWithAttribute('id_element');

        service.checkSelection();

        expect(spyOnget).toHaveBeenCalled();
        expect(spyOnset).toHaveBeenCalledTimes(0);
    });

    it('#checkSelection should not call set function of changedElements if lastElementColoredNumber equals "topElement"', () => {
        spyOn(service, 'getDOMRect').and.returnValue(new DOMRect(0, 0, 0, 0));
        spyOn(service.drawStack, 'getDrawStackLength').and.returnValue(1);
        spyOn(service, 'isInSelection').and.returnValue(true);
        service.lastElementColoredNumber = 0;
        const spyOnset: jasmine.Spy = spyOn(service.changedElements, 'set');

        service.drawStack.drawStack[0] = createMockSVGGElementWithAttribute('id_element');

        service.checkSelection();

        expect(spyOnset).toHaveBeenCalledTimes(0);
    });

    it('#checkSelection should call removeBorder if isInSelection returns false', () => {
        const spyOngetDOMRect: jasmine.Spy = spyOn(service, 'getDOMRect').and.returnValue(new DOMRect(0, 0, 0, 0));
        const spyOngetDrawStackLength: jasmine.Spy = spyOn(service.drawStack, 'getDrawStackLength').and.returnValue(1);
        const spyOnisInSelection: jasmine.Spy = spyOn(service, 'isInSelection').and.returnValue(false);

        service.drawStack.drawStack[0] = createMockSVGGElementWithAttribute('id_element');

        const spyOnremoveBorder: jasmine.Spy = spyOn(service, 'removeBorder');

        service.checkSelection();

        expect(spyOngetDOMRect).toHaveBeenCalled();
        expect(spyOngetDrawStackLength).toHaveBeenCalled();
        expect(spyOnisInSelection).toHaveBeenCalled();
        expect(spyOnremoveBorder).toHaveBeenCalled();
    });

    it('#mouseOverColorBorder should call setAttribute if border width is null', () => {
        const spyOnsetAttribute: jasmine.Spy = spyOn(service.renderer, 'setAttribute');

        service.mouseOverColorBorder(0, null);

        expect(spyOnsetAttribute).toHaveBeenCalled();
    });

    it('#mouseOverColorBorder should call setAttribute if border width is not null', () => {
        const spyOnsetAttribute: jasmine.Spy = spyOn(service.renderer, 'setAttribute');

        service.mouseOverColorBorder(0, '5');

        expect(spyOnsetAttribute).toHaveBeenCalled();
    });

    it('#mouseOutRestoreBorder should call setAttribute if border width is null', () => {
        const spyOnsetAttribute: jasmine.Spy = spyOn(service.renderer, 'setAttribute');

        service.mouseOutRestoreBorder(0, null, null);

        expect(spyOnsetAttribute).toHaveBeenCalled();
    });

    it('#mouseOutRestoreBorder should call setAttribute if border width is not null', () => {
        const spyOnsetAttribute: jasmine.Spy = spyOn(service.renderer, 'setAttribute');

        service.mouseOutRestoreBorder(0, 'ffffff', '1');

        expect(spyOnsetAttribute).toHaveBeenCalled();
    });

    it('#removeBorder should call mouseOutRestoreBorder if element is not undefined', () => {
        service.currentTarget = 0;
        service.drawStack.drawStack[0] = service.renderer.createElement('rect', SVG_NS);
        service.changedElements.set('0', new SVGGElementInfo());
        const spyOnmouseOutRestoreBorder: jasmine.Spy = spyOn(service, 'mouseOutRestoreBorder');
        const spyOnget: jasmine.Spy = spyOn(service.changedElements, 'get').and.returnValue(new SVGGElementInfo());

        service.removeBorder('0');

        expect(spyOnmouseOutRestoreBorder).toHaveBeenCalled();
        expect(spyOnget).toHaveBeenCalled();
    });

    it('#removeBorder should call get of changedElements if currentTraget is not undefined', () => {
        service.currentTarget = 0;
        service.drawStack.drawStack[0] = service.renderer.createElement('rect', SVG_NS);
        service.changedElements.set('0', new SVGGElementInfo());
        const spyOnmouseOutRestoreBorder: jasmine.Spy = spyOn(service, 'mouseOutRestoreBorder');
        const spyOnget: jasmine.Spy = spyOn(service.changedElements, 'get').and.returnValue(undefined);

        service.removeBorder('0');

        expect(spyOnmouseOutRestoreBorder).toHaveBeenCalledTimes(0);
        expect(spyOnget).toHaveBeenCalled();
    });

    it('#removeBorder should not call spyOnmouseOutRestoreBorder if currentTraget is undefined', () => {
        service.currentTarget = -1;
        const spyOnmouseOutRestoreBorder: jasmine.Spy = spyOn(service, 'mouseOutRestoreBorder');

        service.removeBorder('0');

        expect(spyOnmouseOutRestoreBorder).toHaveBeenCalledTimes(0);
    });

    it('#getDOMRect should return a new DOMRect object', () => {
        const mockDOMRect = {
            x: 500,
            y: 500,
            width: 50,
            height: 50,
        };

        expect(service.getDOMRect(createMockSVGGElementWithAttribute('test'))).toEqual(mockDOMRect as DOMRect);
    });

    it('#getStrokeWidth should return 10 if the getAttribute requested exists', () => {
        const element = createMockSVGGElementWithAttribute(HTMLAttribute.stroke_width);

        expect(service.getStrokeWidth(element)).toEqual(10);
    });

    it('#getStrokeWidth should return 0 if the getAttribute requested does not exist', () => {
        const element = createMockSVGGElementWithAttribute('test');

        expect(service.getStrokeWidth(element)).toEqual(0);
    });

    it('#onMouseUp should set isLeftMouseDown to false if it is a left mouse click ', () => {
        service.isLeftMouseDown = true;

        service.onMouseUp(leftMouseEvent);

        expect(service.isLeftMouseDown).toEqual(false);
    });

    it('#onMouseUp should not set isLeftMouseDown to false if it is a right mouse click ', () => {
        service.isLeftMouseDown = true;

        service.onMouseUp(rightMouseEvent);

        expect(service.isLeftMouseDown).toEqual(true);
    });

});
