import { ElementRef, Renderer2, Type } from '@angular/core';
import { TestBed, getTestBed } from '@angular/core/testing';

import { EraserToolService } from './eraser-tool.service';
import { DrawStackService } from '../../draw-stack/draw-stack.service';

fdescribe('EraserToolService', () => {
    let injector: TestBed;
    let service: EraserToolService;
    //let positiveMouseEvent: MouseEvent;
    //  let negativeMouseEvent: MouseEvent;
    //  let onAltKeyDown: KeyboardEvent;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                EraserToolService,
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
        service = injector.get(EraserToolService);
        const rendererMock = injector.get<Renderer2>(Renderer2 as Type<Renderer2>);
        const drawStackMock = injector.get<DrawStackService>(DrawStackService as Type<DrawStackService>);
        const elementRefMock = injector.get<ElementRef>(ElementRef as Type<ElementRef>);
        service.initializeService(elementRefMock, rendererMock, drawStackMock);

        //  positiveMouseEvent = createMouseEvent(10, 10, 0);
        //  negativeMouseEvent = createMouseEvent(-10, -10, 0);

        // onAltKeyDown = createKeyBoardEvent(Keys.Alt);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
