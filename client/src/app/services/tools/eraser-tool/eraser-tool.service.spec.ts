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
});
