import { ElementRef, Renderer2, Type } from '@angular/core';
import { getTestBed, TestBed } from '@angular/core/testing';

import { BehaviorSubject } from 'rxjs';
import { SVGGElementInfo } from 'src/classes/svggelement-info';
import {
    createKeyBoardEvent,
    createMockSVGGElementWithAttribute,
    createMouseEvent,
} from 'src/classes/test-helpers.spec';
import { KEYS, SVG_NS } from 'src/constants/constants';
import { HTML_ATTRIBUTE, TOOL_NAME } from 'src/constants/tool-constants';
import { DrawStackService } from '../../draw-stack/draw-stack.service';
import { UndoRedoerService } from '../../undo-redoer/undo-redoer.service';
import { AttributesManagerService } from '../attributes-manager/attributes-manager.service';
import { EraserToolService } from './eraser-tool.service';

describe('EraserToolService', () => {
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
                    provide: UndoRedoerService,
                    useValue: {
                        saveCurrentState: () => null,
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
                            return (mockdrawStack as unknown) as SVGGElement[];
                        },
                        renderer: () => {
                            const mockrenderer = {};
                            return (mockrenderer as unknown) as Renderer2;
                        },
                        changeTargetElement: () => null,
                        delete: () => null,
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

        spyOnremoveChild = spyOn(service[`renderer`], 'removeChild').and.returnValue();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should initialize AttributesManagerService on initializeAttributesManagerService', () => {
        service.initializeAttributesManagerService({
            eraserSize: new BehaviorSubject(1),
        } as AttributesManagerService);
        expect(service[`attributesManagerService`]).toBeTruthy({});
    });

    it('should call onMouseDown if isLeftMouseDown is true', () => {
        service[`isLeftMouseDown`] = true;
        const spyOnMouseDown: jasmine.Spy = spyOn(service, 'onMouseDown');
        const spyOncheckElementsToErase: jasmine.Spy = spyOn<any>(service, 'checkElementsToErase');

        service.onMouseMove(leftMouseEvent);

        expect(spyOnMouseDown).toHaveBeenCalled();
        expect(spyOncheckElementsToErase).toHaveBeenCalled();
    });

    it('should not call onMouseDown if isLeftMouseDown is false', () => {
        service[`isLeftMouseDown`] = false;
        const spyOnMouseDown: jasmine.Spy = spyOn(service, 'onMouseDown');
        const spyOncheckElementsToErase: jasmine.Spy = spyOn<any>(service, 'checkElementsToErase');

        service.onMouseMove(leftMouseEvent);

        expect(spyOnMouseDown).toHaveBeenCalledTimes(0);
        expect(spyOncheckElementsToErase).toHaveBeenCalled();
    });

    it('needToBeErased should return true if the left button is clicked', () => {
        service[`isOnTarget`] = true;

        expect(service[`needToBeErased`](leftMouseEvent.button)).toEqual(true);
    });

    it('needToBeErased should return false if the right button is clicked', () => {
        service[`isOnTarget`] = true;

        expect(service[`needToBeErased`](rightMouseEvent.button)).toEqual(false);
    });

    it('should call appendSquare if isSquareAppended is false', () => {
        service[`isEraserAppended`] = false;
        const spyOnappendSquare: jasmine.Spy = spyOn<any>(service, 'appendEraser');

        service[`setEraserToMouse`](leftMouseEvent);

        expect(spyOnappendSquare).toHaveBeenCalled();
    });

    it('should not call appendSquare if isSquareAppended is true', () => {
        service[`isEraserAppended`] = true;
        const spyOnappendEraser: jasmine.Spy = spyOn<any>(service, 'appendEraser');

        service[`setEraserToMouse`](leftMouseEvent);

        expect(spyOnappendEraser).toHaveBeenCalledTimes(0);
    });

    it('should call removeChild if isOnTarget is true and getElementByPosition returns an element', () => {
        service[`isOnTarget`] = true;
        const spyOncheckElementsToErase: jasmine.Spy = spyOn<any>(service, 'checkElementsToErase');
        const spyOngetElementByPosition: jasmine.Spy = spyOn(
            service[`drawStack`],
            'getElementByPosition',
        ).and.returnValue(service[`renderer`].createElement('rect', SVG_NS));
        service[`isHoveringText`] = true;

        service.onMouseDown(leftMouseEvent);

        expect(service[`isLeftMouseDown`]).toEqual(true);
        expect(spyOncheckElementsToErase).toHaveBeenCalled();
        expect(spyOnremoveChild).toHaveBeenCalled();
        expect(spyOngetElementByPosition).toHaveBeenCalled();
    });

    it('should call checkElementsToErase if isOnTarget is false and set isOnTarget to false', () => {
        service[`isOnTarget`] = false;
        const spyOncheckElementsToErase: jasmine.Spy = spyOn<any>(service, 'checkElementsToErase');

        service.onMouseDown(rightMouseEvent);

        expect(service[`isOnTarget`]).toEqual(false);
        expect(spyOncheckElementsToErase).toHaveBeenCalled();
    });

    it('isTouchingElementBox should return true if selection box and elementBox are in touch', () => {
        const selectionBox = new DOMRect(0, 0, 0, 0);
        const elBox = new DOMRect(0, 0, 0, 0);

        expect(service[`isEraserTouchingElement`](selectionBox, elBox, 1)).toEqual(true);
    });

    it('isTouchingElementBox should return false if selection box and elementBox are not in touch', () => {
        const selectionBox = new DOMRect(0, 0, 0, 0);
        const elBox = new DOMRect(10, 10, 1, 1);

        expect(service[`isEraserTouchingElement`](selectionBox, elBox)).toEqual(false);
    });

    it('checkElementsToErase should call get and set function of changedElements if an element does not exist', () => {
        const spyOngetDOMRect: jasmine.Spy = spyOn<any>(service, 'getDOMRect').and.returnValue(new DOMRect(0, 0, 0, 0));
        const spyOngetDrawStackLength: jasmine.Spy = spyOn(service[`drawStack`], 'getDrawStackLength').and.returnValue(
            1,
        );
        const spyOnisTouchingElementBox: jasmine.Spy = spyOn<any>(service, 'isEraserTouchingElement').and.returnValue(
            true,
        );
        const spyOnget: jasmine.Spy = spyOn(service[`changedElements`], 'get').and.returnValue(undefined);
        const spyOnset: jasmine.Spy = spyOn(service[`changedElements`], 'set');

        service[`drawStack`].drawStack[0] = createMockSVGGElementWithAttribute('id_element');

        service[`checkElementsToErase`]();

        expect(spyOngetDOMRect).toHaveBeenCalled();
        expect(spyOngetDrawStackLength).toHaveBeenCalled();
        expect(spyOnisTouchingElementBox).toHaveBeenCalled();
        expect(spyOnget).toHaveBeenCalled();
        expect(spyOnset).toHaveBeenCalled();
    });

    it('checkElementsToErase should not call set function of changedElements if an element exists', () => {
        spyOn<any>(service, 'getDOMRect').and.returnValue(new DOMRect(0, 0, 0, 0));
        spyOn(service[`drawStack`], 'getDrawStackLength').and.returnValue(1);
        spyOn<any>(service, 'isEraserTouchingElement').and.returnValue(true);
        const spyOnget: jasmine.Spy = spyOn(service[`changedElements`], 'get').and.returnValue({} as SVGGElementInfo);
        const spyOnset: jasmine.Spy = spyOn(service[`changedElements`], 'set');

        service[`drawStack`].drawStack[0] = createMockSVGGElementWithAttribute('id_element');

        service[`checkElementsToErase`]();

        expect(spyOnget).toHaveBeenCalled();
        expect(spyOnset).toHaveBeenCalledTimes(0);
    });

    it('checkElementsToErase should not call set function of changedElements if lastElementColoredNumber equals "topElement"', () => {
        spyOn<any>(service, 'getDOMRect').and.returnValue(new DOMRect(0, 0, 0, 0));
        spyOn(service[`drawStack`], 'getDrawStackLength').and.returnValue(1);
        spyOn<any>(service, 'isEraserTouchingElement').and.returnValue(true);
        service[`lastElementColoredNumber`] = 0;
        const spyOnset: jasmine.Spy = spyOn(service[`changedElements`], 'set');

        service[`drawStack`].drawStack[0] = createMockSVGGElementWithAttribute('id_element');

        service[`checkElementsToErase`]();

        expect(spyOnset).toHaveBeenCalledTimes(0);
    });

    it('checkElementsToErase should call removeBorder if isTouchingElementBox returns false', () => {
        const spyOngetDOMRect: jasmine.Spy = spyOn<any>(service, 'getDOMRect').and.returnValue(new DOMRect(0, 0, 0, 0));
        const spyOngetDrawStackLength: jasmine.Spy = spyOn(service[`drawStack`], 'getDrawStackLength').and.returnValue(
            1,
        );
        const spyOnisTouchingElementBox: jasmine.Spy = spyOn<any>(service, 'isEraserTouchingElement').and.returnValue(
            false,
        );

        service[`drawStack`].drawStack[0] = createMockSVGGElementWithAttribute('id_element');

        const spyOnremoveBorder: jasmine.Spy = spyOn<any>(service, 'removeBorder');

        service[`checkElementsToErase`]();

        expect(spyOngetDOMRect).toHaveBeenCalled();
        expect(spyOngetDrawStackLength).toHaveBeenCalled();
        expect(spyOnisTouchingElementBox).toHaveBeenCalled();
        expect(spyOnremoveBorder).toHaveBeenCalled();
    });

    it('colorBorder should call setAttribute if border width is null', () => {
        const spyOnsetAttribute: jasmine.Spy = spyOn(service[`renderer`], 'setAttribute');
        const spyOngetElementByPosition: jasmine.Spy = spyOn(
            service[`drawStack`],
            'getElementByPosition',
        ).and.returnValue(createMockSVGGElementWithAttribute('id_element'));

        service[`colorBorder`](0, null, TOOL_NAME.Pen);

        expect(spyOnsetAttribute).toHaveBeenCalled();
        expect(spyOngetElementByPosition).toHaveBeenCalled();
    });

    it('colorBorder should call setAttribute if border width is not null', () => {
        const spyOnsetAttribute: jasmine.Spy = spyOn(service[`renderer`], 'setAttribute');

        service[`colorBorder`](0, '5', TOOL_NAME.Rectangle);

        expect(spyOnsetAttribute).toHaveBeenCalled();
    });

    it('colorBorder should call appendEraser if tool is Text', () => {
        const spyOnappendEraser: jasmine.Spy = spyOn<any>(service, 'appendEraser');

        service[`isHoveringText`] = false;

        service[`colorBorder`](0, null, TOOL_NAME.Text);

        expect(spyOnappendEraser).toHaveBeenCalled();
        expect(service[`isHoveringText`]).toEqual(true);
    });

    it('colorBorder should call setAttribute if tool is Quill', () => {
        const spyOnsetAttribute: jasmine.Spy = spyOn(service[`renderer`], 'setAttribute');

        service[`colorBorder`](0, null, TOOL_NAME.Quill);

        expect(spyOnsetAttribute).toHaveBeenCalled();
    });

    it('colorBorder should call setAttribute if tool is Stamp', () => {
        const spyOnsetAttribute: jasmine.Spy = spyOn(service[`renderer`], 'setAttribute');
        const spyOngetElementByPosition: jasmine.Spy = spyOn(
            service[`drawStack`],
            'getElementByPosition',
        ).and.returnValue(createMockSVGGElementWithAttribute('id_element'));

        service[`colorBorder`](0, null, TOOL_NAME.Stamp);

        expect(spyOnsetAttribute).toHaveBeenCalled();
        expect(spyOngetElementByPosition).toHaveBeenCalled();
    });

    it('colorBorder should call setAttribute if tool is Line', () => {
        const spyOnsetAttribute: jasmine.Spy = spyOn(service[`renderer`], 'setAttribute');

        service[`colorBorder`](0, null, TOOL_NAME.Line);

        expect(spyOnsetAttribute).toHaveBeenCalled();
    });

    it('restoreBorder should call setAttribute if border width is null', () => {
        const spyOnsetAttribute: jasmine.Spy = spyOn(service[`renderer`], 'setAttribute');
        const spyOngetElementByPosition: jasmine.Spy = spyOn(
            service[`drawStack`],
            'getElementByPosition',
        ).and.returnValue(createMockSVGGElementWithAttribute('id_element'));

        service[`restoreBorder`](0, null, null, TOOL_NAME.Pen);

        expect(spyOnsetAttribute).toHaveBeenCalled();
        expect(spyOngetElementByPosition).toHaveBeenCalled();
    });

    it('restoreBorder should call appendEraser if tool is text', () => {
        const spyOnappendEraser: jasmine.Spy = spyOn<any>(service, 'appendEraser');
        service[`isHoveringText`] = true;

        service[`restoreBorder`](0, 'ffffff', '0', TOOL_NAME.Text);

        expect(spyOnappendEraser).not.toHaveBeenCalled();
        expect(service[`isHoveringText`]).toEqual(false);
    });

    it('restoreBorder should call setAttribute if tool is Quill', () => {
        const spyOnsetAttribute: jasmine.Spy = spyOn(service[`renderer`], 'setAttribute');

        service[`restoreBorder`](0, 'ffffff', '0', TOOL_NAME.Quill);

        expect(spyOnsetAttribute).toHaveBeenCalled();
    });

    it('restoreBorder should call setAttribute if tool is Line', () => {
        const spyOnsetAttribute: jasmine.Spy = spyOn(service[`renderer`], 'setAttribute');

        service[`restoreBorder`](0, 'ffffff', '0', TOOL_NAME.Line);

        expect(spyOnsetAttribute).toHaveBeenCalled();
    });

    it('restoreBorder should call setAttribute if border width is not null', () => {
        const spyOnsetAttribute: jasmine.Spy = spyOn(service[`renderer`], 'setAttribute');

        service[`restoreBorder`](0, 'ffffff', '1', TOOL_NAME.Rectangle);

        expect(spyOnsetAttribute).toHaveBeenCalled();
    });

    it('removeBorder should call restoreBorder if element is not undefined', () => {
        const spyOnget: jasmine.Spy = spyOn(service.changedElements, 'get').and.returnValue({} as SVGGElementInfo);
        service[`currentTarget`] = 0;
        service[`drawStack`].drawStack[0] = service[`renderer`].createElement('rect', SVG_NS);
        service[`changedElements`].set(0, {} as SVGGElementInfo);
        const spyOnrestoreBorder: jasmine.Spy = spyOn<any>(service, 'restoreBorder');

        service[`removeBorder`]('0', '');

        expect(spyOnrestoreBorder).toHaveBeenCalled();
        expect(spyOnget).toHaveBeenCalled();
    });

    it('removeBorder should call get of changedElements if currentTraget is not undefined', () => {
        service[`currentTarget`] = 0;
        service[`drawStack`].drawStack[0] = service[`renderer`].createElement('rect', SVG_NS);
        service[`changedElements`].set(0, {} as SVGGElementInfo);
        const spyOnrestoreBorder: jasmine.Spy = spyOn<any>(service, 'restoreBorder');
        const spyOnget: jasmine.Spy = spyOn(service.changedElements, 'get').and.returnValue(undefined);

        service[`removeBorder`]('0', TOOL_NAME.Rectangle);

        expect(spyOnrestoreBorder).toHaveBeenCalledTimes(0);
        expect(spyOnget).toHaveBeenCalled();
    });

    it('removeBorder should not call spyOnrestoreBorder if currentTraget is undefined', () => {
        service[`currentTarget`] = -1;
        const spyOnrestoreBorder: jasmine.Spy = spyOn<any>(service, 'restoreBorder');

        service[`removeBorder`]('0', TOOL_NAME.Pen);

        expect(spyOnrestoreBorder).toHaveBeenCalledTimes(0);
    });

    it('getDOMRect should return a new DOMRect object', () => {
        const mockDOMRect = {
            x: 500,
            y: 500,
            width: 50,
            height: 50,
        };

        expect(service[`getDOMRect`](createMockSVGGElementWithAttribute('test'))).toEqual(mockDOMRect as DOMRect);
    });

    it('getStrokeWidth should return 10 if the getAttribute requested exists', () => {
        const element = createMockSVGGElementWithAttribute(HTML_ATTRIBUTE.stroke_width);

        expect(service[`getStrokeWidth`](element)).toEqual(10);
    });

    it('getStrokeWidth should return 0 if the getAttribute requested does not exist', () => {
        const element = createMockSVGGElementWithAttribute('test');

        expect(service[`getStrokeWidth`](element)).toEqual(0);
    });

    it('onMouseUp should set isLeftMouseDown to false if it is a left mouse click ', () => {
        service[`isLeftMouseDown`] = true;

        service.onMouseUp(leftMouseEvent);

        expect(service[`isLeftMouseDown`]).toEqual(false);
    });

    it('onMouseUp should not set isLeftMouseDown to false if it is a right mouse click ', () => {
        service[`isLeftMouseDown`] = true;

        service.onMouseUp(rightMouseEvent);

        expect(service[`isLeftMouseDown`]).toEqual(true);
    });

    it('onMouseUp should  call removeChild if erasedSomething is true and currentChangedTargetIsValid is also true', () => {
        service[`erasedSomething`] = true;
        service[`currentTarget`] = 0;
        const spyOnget: jasmine.Spy = spyOn(service.changedElements, 'get').and.returnValue({} as SVGGElementInfo);

        service.onMouseUp(leftMouseEvent);

        expect(service[`isLeftMouseDown`]).toEqual(false);
        expect(spyOnremoveChild).toHaveBeenCalled();
        expect(spyOnget).toHaveBeenCalled();
    });

    it('onMouseEnter should call appendSquare', () => {
        const spyOnappendSquare: jasmine.Spy = spyOn<any>(service, 'appendEraser');

        service.onMouseEnter(leftMouseEvent);

        expect(spyOnappendSquare).toHaveBeenCalled();
    });

    it('onMouseOver should return undefined if onMouseOver is not implemented', () => {
        expect(service.onMouseOver(leftMouseEvent)).toBeUndefined();
    });

    it('onKeyDown should return undefined if onKeyDown is not implemented', () => {
        expect(service.onKeyDown(createKeyBoardEvent(KEYS.Alt))).toBeUndefined();
    });

    it('onKeyUp should return undefined if onKeyUp is not implemented', () => {
        expect(service.onKeyUp(createKeyBoardEvent(KEYS.Alt))).toBeUndefined();
    });

    it('onMouseLeave should call removeChild', () => {
        service.onMouseLeave(leftMouseEvent);

        expect(spyOnremoveChild).toHaveBeenCalled();
    });

    it('cleanUp should call removeChild', () => {
        service.cleanUp();

        expect(spyOnremoveChild).toHaveBeenCalled();
    });

    it('cleanUp should call removeBorder if lastElementColoredNumber is different than 1', () => {
        service[`lastElementColoredNumber`] = 1;
        const spyOnremoveBorder: jasmine.Spy = spyOn<any>(service, 'removeBorder');

        service.cleanUp();

        expect(spyOnremoveChild).toHaveBeenCalled();
        expect(spyOnremoveBorder).toHaveBeenCalled();
    });
});
