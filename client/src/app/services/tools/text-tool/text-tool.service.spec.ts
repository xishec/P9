import { TestBed, getTestBed } from '@angular/core/testing';
import { Renderer2, ElementRef, Type } from '@angular/core';

import { TextToolService } from './text-tool.service';
import { DrawStackService } from '../../draw-stack/draw-stack.service';
import { AttributesManagerService } from '../attributes-manager/attributes-manager.service';

fdescribe('TextToolService', () => {
    let injector: TestBed;
    let service: TextToolService;
    // let leftMouseEvent: MouseEvent;
    // let rightMouseEvent: MouseEvent;
    // let keyboardEvent: KeyboardEvent

    //let spyOnremoveChild: jasmine.Spy;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                TextToolService,
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
                                const boundleft = 1;
                                const boundtop = 1;
                                const boundRect = {
                                    left: boundleft,
                                    top: boundtop,
                                };
                                return boundRect;
                            },
                        },
                    },
                },
                {
                    provide: AttributesManagerService,
                    useValue: {
                        changeIsWriting: () => null,
                        changeIsOnInput: () => null,
                        isWriting: false,
                    },
                },
            ],
        });

        injector = getTestBed();
        service = injector.get(TextToolService);
        const rendererMock = injector.get<Renderer2>(Renderer2 as Type<Renderer2>);
        const drawStackMock = injector.get<DrawStackService>(DrawStackService as Type<DrawStackService>);
        const elementRefMock = injector.get<ElementRef>(ElementRef as Type<ElementRef>);
        service.initializeService(elementRefMock, rendererMock, drawStackMock);

        const attributeManagerService: AttributesManagerService = new AttributesManagerService();
        service.initializeAttributesManagerService(attributeManagerService);

        // leftMouseEvent = createMouseEvent(10, 10, 0);
        //rightMouseEvent = createMouseEvent(10, 10, 2);

        //spyOnremoveChild = spyOn(service.renderer, 'removeChild').and.returnValue();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('getXPos should return a number that is smaller than the original number', () => {
        expect(service.getXPos(2)).toBeLessThan(2);
    });

    it('getYPos should return a number that is smaller than the original number', () => {
        expect(service.getYPos(2)).toBeLessThan(2);
    });

    it('updateFont should change the fontType', () => {
        service.updateFont('Times');

        expect(service.fontType).toEqual('Times');
    });

    it('updateFont should change the fontType and call updatePreviewBox if isWriting is true', () => {
        const spyOnupdatePreviewBox = spyOn(service, 'updatePreviewBox');
        service.attributesManagerService.changeIsWriting(true);

        service.updateFont('Times');

        expect(service.fontType).toEqual('Times');
        expect(spyOnupdatePreviewBox).toHaveBeenCalled();
    });
});
