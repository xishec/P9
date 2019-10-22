import { TestBed, getTestBed } from '@angular/core/testing';

import { DropperToolService } from '../dropper-tool/dropper-tool.service';
import { Renderer2, ElementRef } from '@angular/core';
//import { Keys } from 'src/constants/constants';
import { MatDialog } from '@angular/material';
import { createMouseEvent } from 'src/classes/test-helpers';
import { ColorToolService } from '../color-tool/color-tool.service';

fdescribe('DropperToolService', () => {
    //const mockDrawRect: MockRect = new MockRect();

    let injector: TestBed;
    let service: DropperToolService;
    let positiveMouseEvent: MouseEvent;
    let negativeMouseEvent: MouseEvent;
    // let onAltKeyDown: KeyboardEvent;
    // let onOtherKeyDown: KeyboardEvent;

    // let spyOnStampWidth: jasmine.Spy;
    // let spyOnStampHeight: jasmine.Spy;
    // let spyOnSetAttribute: jasmine.Spy;
    // let spyOnAppendChild: jasmine.Spy;
    let spyOnSetProperty: jasmine.Spy;
    // let spyOnGetContext: jasmine.Spy;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                DropperToolService,
                {
                    provide: MatDialog,
                    useValue: {},
                },
                {
                    provide: Renderer2,
                    useValue: {
                        createElement: (elem: string) => {
                            if (elem === 'canvas') {
                                const mockCanvas = {
                                    // functions and values of HTMLCanvasElement needed
                                    getContext: () => null,
                                };
                                return (mockCanvas as unknown) as HTMLCanvasElement;
                            } else {
                                const mockImg = {
                                    // functions and values of HTMLImageElement
                                };
                                return mockImg as HTMLImageElement;
                            }
                        },
                        setAttribute: () => null,
                        appendChild: () => null,
                        removeChild: () => null,
                        setProperty: () => null,
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
                {
                    provide: HTMLCanvasElement,
                    useValue: {
                        getContext: () => null,
                    },
                },
            ],
        });

        injector = getTestBed();
        service = injector.get(DropperToolService);

        positiveMouseEvent = createMouseEvent(10, 10, 0);
        negativeMouseEvent = createMouseEvent(-10, -10, 0);

        // onAltKeyDown = createKeyBoardEvent(Keys.Alt);
        // onOtherKeyDown = createKeyBoardEvent(Keys.Shift);

        // spyOnSetAttribute = spyOn(service.renderer, 'setAttribute').and.returnValue();
        // spyOnAppendChild = spyOn(service.renderer, 'appendChild').and.returnValue();
        spyOnSetProperty = spyOn(service.renderer, 'setProperty').and.returnValue();
        //spyOnGetContext = spyOn(service.canvas, 'getContext').and.returnValue(new CanvasRenderingContext2D());

        // HTMLCanvasElement.prototype.getContext = () => {
        //     // return whatever getContext has to return
        // };

        // spyOnStampWidth = spyOnProperty(service, 'stampWidth', 'get').and.callFake(() => {
        //     return mockDrawRect.width;
        // });
        // spyOnStampHeight = spyOnProperty(service, 'stampHeight', 'get').and.callFake(() => {
        //     return mockDrawRect.height;
        //});
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should return true is the coordinates of the mouse are positive', () => {
        expect(service.verifyPosition(positiveMouseEvent)).toBeTruthy();
    });

    it('should return false is the coordinates of the mouse are negative', () => {
        expect(service.verifyPosition(negativeMouseEvent)).toBeFalsy();
    });

    it('should initialize the attribute colorTool to be the colorToolService', () => {
        service.initializeColorToolService(new ColorToolService());

        expect(service.colorTool).toEqual(new ColorToolService());
    });
});
