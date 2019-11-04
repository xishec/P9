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
});
