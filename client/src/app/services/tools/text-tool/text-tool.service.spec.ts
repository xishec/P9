import { TestBed, getTestBed } from '@angular/core/testing';
import { Renderer2, ElementRef, Type } from '@angular/core';

import { TextToolService } from './text-tool.service';
import { DrawStackService } from '../../draw-stack/draw-stack.service';
import { AttributesManagerService } from '../attributes-manager/attributes-manager.service';
import { createMockSVGTextElement } from 'src/classes/test-helpers.spec';

fdescribe('TextToolService', () => {
    let injector: TestBed;
    let service: TextToolService;
    let attServ: AttributesManagerService;
    // let leftMouseEvent: MouseEvent;
    // let rightMouseEvent: MouseEvent;
    // let keyboardEvent: KeyboardEvent

    let spyOnsetAttributed: jasmine.Spy;

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

        attServ = injector.get<AttributesManagerService>(AttributesManagerService as Type<AttributesManagerService>);

        // const attributeManagerService: AttributesManagerService = new AttributesManagerService();
        service.initializeAttributesManagerService(attServ);

        service.textBox = createMockSVGTextElement();
        // leftMouseEvent = createMouseEvent(10, 10, 0);
        //rightMouseEvent = createMouseEvent(10, 10, 2);

        spyOnsetAttributed = spyOn(service.renderer, 'setAttribute').and.returnValue();
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

    it('updateFontSize should change the fontSize', () => {
        service.updateFontSize(10);

        expect(service.fontSize).toEqual(10);
    });

    it('updateFontSize should change the fontSize and call updatePreviewBox if isWriting is true', () => {
        const spyOnupdatePreviewBox = spyOn(service, 'updatePreviewBox');
        service.attributesManagerService.changeIsWriting(true);

        service.updateFontSize(10);

        expect(service.fontSize).toEqual(10);
        expect(spyOnupdatePreviewBox).toHaveBeenCalled();
    });

    //doesn't work yet
    it('updateAlign should change the textBoxXPosition to bBoxAnchorLeft + bBoxWidth / 2', () => {
        service.attributesManagerService.changeIsWriting(true);
        service.bBoxAnchorLeft = 2;
        service.bBoxWidth = 2;

        attServ.changeIsWriting(true);

        service.updateAlign('middle');

        expect(service.textBoxXPosition).toEqual(service.bBoxAnchorLeft + service.bBoxWidth / 2);
        expect(spyOnsetAttributed).toHaveBeenCalled();
    });

    //doesn't work yet
    it('updateAlign should change the textBoxXPosition to bBoxAnchorLeft', () => {
        service.attributesManagerService.changeIsWriting(true);
        service.bBoxAnchorLeft = 2;

        service.updateAlign('start');

        expect(service.textBoxXPosition).toEqual(service.bBoxAnchorLeft);
        expect(spyOnsetAttributed).toHaveBeenCalled();
    });

    //doesn't work yet
    it('updateAlign should change the textBoxXPosition to bBoxAnchorLeft + bBoxWidth', () => {
        service.attributesManagerService.changeIsWriting(true);
        service.bBoxAnchorLeft = 2;
        service.bBoxWidth = 2;

        service.updateAlign('end');

        expect(service.textBoxXPosition).toEqual(service.bBoxAnchorLeft);
        expect(spyOnsetAttributed).toHaveBeenCalled();
    });
});
