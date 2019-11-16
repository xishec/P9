import { ElementRef, Renderer2, Type } from '@angular/core';
import { getTestBed, TestBed } from '@angular/core/testing';

import { createMouseEvent } from 'src/classes/test-helpers.spec';
import { DrawStackService } from '../../draw-stack/draw-stack.service';
import { SprayCanToolService } from './spray-can-tool.service';

fdescribe('SprayCanToolService', () => {
    let injector: TestBed;
    let service: SprayCanToolService;
    let leftMouseEvent: MouseEvent;
    let rightMouseEvent: MouseEvent;

    // let spyOnremoveChild: jasmine.Spy;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                SprayCanToolService,
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
        service = injector.get(SprayCanToolService);
        const rendererMock = injector.get<Renderer2>(Renderer2 as Type<Renderer2>);
        const drawStackMock = injector.get<DrawStackService>(DrawStackService as Type<DrawStackService>);
        const elementRefMock = injector.get<ElementRef>(ElementRef as Type<ElementRef>);
        service.initializeService(elementRefMock, rendererMock, drawStackMock);

        leftMouseEvent = createMouseEvent(10, 10, 0);
        rightMouseEvent = createMouseEvent(10, 10, 2);

        // spyOnremoveChild = spyOn(service.renderer, 'removeChild').and.returnValue();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('onMouseDown should set the event to be a left click if the event is left click', () => {
        service.event = rightMouseEvent;

        service.onMouseDown(leftMouseEvent);

        expect(service.event).toEqual(leftMouseEvent);
    });

    it('onMouseDown should not set the event to be a right click if the event is right click', () => {
        service.event = leftMouseEvent;

        service.onMouseDown(rightMouseEvent);

        expect(service.event).not.toEqual(rightMouseEvent);
    });

    // it('onMouseUp should call clearInterval', () => {
    //     const spy = spyOn(this, 'clearInterval');

    //     service.onMouseUp(leftMouseEvent);

    //     expect(service.event).not.toEqual(rightMouseEvent);
    // });

    it('onMouseMove should call setSprayerToMouse', () => {
        const spyOnsetSprayerToMouse = spyOn(service, 'setSprayerToMouse');

        service.onMouseMove(leftMouseEvent);

        expect(spyOnsetSprayerToMouse).toHaveBeenCalled();
    });

    it('setSprayerToMouse should call appendSprayer if isSprayerAppended is false', () => {
        service.isSprayerAppended = false;
        const spyOnsappendSprayer = spyOn(service, 'appendSprayer');

        service.setSprayerToMouse(leftMouseEvent);

        expect(spyOnsappendSprayer).toHaveBeenCalled();
    });

    it('setSprayerToMouse should not call appendSprayer if isSprayerAppended is true', () => {
        service.isSprayerAppended = true;
        const spyOnsappendSprayer = spyOn(service, 'appendSprayer');

        service.setSprayerToMouse(leftMouseEvent);

        expect(spyOnsappendSprayer).not.toHaveBeenCalled();
    });
});
