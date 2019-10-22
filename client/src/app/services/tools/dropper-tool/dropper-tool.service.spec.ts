import { TestBed, getTestBed } from '@angular/core/testing';

import { DropperToolService } from '../dropper-tool/dropper-tool.service';
import { Renderer2, ElementRef } from '@angular/core';
import { createMouseEvent, createKeyBoardEvent } from 'src/classes/test-helpers';
import { ColorToolService } from '../color-tool/color-tool.service';
import { Keys } from 'src/constants/constants';

fdescribe('DropperToolService', () => {
    let injector: TestBed;
    let service: DropperToolService;
    let positiveMouseEvent: MouseEvent;
    let negativeMouseEvent: MouseEvent;
    let onAltKeyDown: KeyboardEvent;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                DropperToolService,
                {
                    provide: Renderer2,
                    useValue: {
                        createElement: (elem: string) => {
                            if (elem === 'canvas') {
                                const mockCanvas = {
                                    getContext: (dimention: string) => {
                                        const mockContext = {
                                            getImageData: (x: number, y: number, sw: number, sh: number) => {
                                                const mockImageData = {};
                                                return (mockImageData as unknown) as ImageData;
                                            },
                                        };
                                        return (mockContext as unknown) as CanvasRenderingContext2D;
                                    },
                                };
                                return (mockCanvas as unknown) as HTMLCanvasElement;
                            } else {
                                const mockImg = {};
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
                    provide: CanvasRenderingContext2D,
                    useValue: {
                        getImageData: () => null,
                        drawImage: () => null,
                    },
                },
            ],
        });

        injector = getTestBed();
        service = injector.get(DropperToolService);

        positiveMouseEvent = createMouseEvent(10, 10, 0);
        negativeMouseEvent = createMouseEvent(-10, -10, 0);

        onAltKeyDown = createKeyBoardEvent(Keys.Alt);
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

    it('should call updateSVGCopy after color is picked', () => {
        let spyOnUpdateSVGCopy: jasmine.Spy = spyOn(service, 'updateSVGCopy').and.returnValue();

        service.pickColor();

        expect(spyOnUpdateSVGCopy).toHaveBeenCalled();
    });
});
