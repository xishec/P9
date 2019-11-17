import { TestBed, getTestBed } from '@angular/core/testing';

import { FillToolService } from './fill-tool.service';
import { Renderer2, ElementRef, Type } from '@angular/core';
import { DrawStackService } from '../../draw-stack/draw-stack.service';
import { provideAutoMock } from 'src/classes/test.helper.msTeams.spec';
import { AttributesManagerService } from '../attributes-manager/attributes-manager.service';
import { BehaviorSubject } from 'rxjs';
import { TRACE_TYPE } from 'src/constants/tool-constants';
import { createMouseEvent } from 'src/classes/test-helpers.spec';
import { BFSHelper } from 'src/classes/BFSHelper';

fdescribe('FillToolService', () => {
    let service: FillToolService;
    let injector: TestBed;
    let mockRenderer: Renderer2;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
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
                        setAttribute: () => true,
                        appendChild: () => null,
                        removeChild: () => null,
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
                    },
                },
                provideAutoMock(ElementRef),
                provideAutoMock(AttributesManagerService),
            ],
        });
        injector = getTestBed();
        service = injector.get(FillToolService);

        mockRenderer = injector.get(Renderer2);
        const drawStackMock = injector.get<DrawStackService>(DrawStackService as Type<DrawStackService>);
        const elementRefMock = injector.get<ElementRef>(ElementRef as Type<ElementRef>);
        service.initializeService(elementRefMock, mockRenderer, drawStackMock);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should initialize AttributesManagerService on initializeAttributesManagerService', () => {
        service.initializeAttributesManagerService({
            thickness: new BehaviorSubject(1),
            traceType: new BehaviorSubject(TRACE_TYPE.Both),
        } as AttributesManagerService);
        expect(service[`attributesManagerService`]).toBeTruthy({});
    });

    it('should return true on call shouldNotFill', () => {
        service.isMouseInRef = (event: MouseEvent, elementRef: ElementRef): boolean => {
            return false;
        };
        service[`modalManagerService`].modalIsDisplayed = new BehaviorSubject(true);
        service.mouseDown = false;
        let bool = service.shouldNotFill(createMouseEvent(0, 0, 21));
        expect(bool).toEqual(true);
    });
    it('should return false on call shouldNotFill', () => {
        service.isMouseInRef = (event: MouseEvent, elementRef: ElementRef): boolean => {
            return true;
        };
        service[`modalManagerService`].modalIsDisplayed = new BehaviorSubject(false);
        service.mouseDown = true;
        let bool = service.shouldNotFill(createMouseEvent(0, 0, 21));
        expect(bool).toEqual(false);
    });

    it('should call updateCanvas onMouseDown', () => {
        service.isMouseInRef = (event: MouseEvent, elementRef: ElementRef): boolean => {
            return true;
        };
        let spy = spyOn(service, 'updateCanvas');
        service.onMouseDown(createMouseEvent(0, 0, 21));

        expect(spy).toHaveBeenCalled();
    });
    it('should not call updateCanvas onMouseDown', () => {
        service.isMouseInRef = (event: MouseEvent, elementRef: ElementRef): boolean => {
            return false;
        };
        let spy = spyOn(service, 'updateCanvas');
        service.onMouseDown(createMouseEvent(0, 0, 21));

        expect(spy).not.toHaveBeenCalled();
    });

    it('should not call fill onMouseUp', () => {
        service.shouldNotFill = (event: MouseEvent): boolean => {
            return true;
        };
        let spy = spyOn(service, 'fill');
        service.onMouseUp(createMouseEvent(0, 0, 21));

        expect(spy).not.toHaveBeenCalled();
    });
    it('should call updateCanvas onMouseUp', () => {
        service.shouldNotFill = (event: MouseEvent): boolean => {
            return false;
        };
        service.updateCanvas = () => null;
        service.updateMousePosition = () => null;
        service.createBFSHelper = () => {
            service.bfsHelper = {} as BFSHelper;
            service.bfsHelper.computeBFS = () => null;
        };
        service.divideLinesToSegments = () => null;
        service.fill = () => null;

        let spy = spyOn(service, 'fill');
        service.onMouseUp(createMouseEvent(0, 0, 21));

        expect(spy).toHaveBeenCalled();
    });

    it('should create bfsHelper', () => {
        service.initializeAttributesManagerService({
            tolerance: new BehaviorSubject(0),
            thickness: new BehaviorSubject(1),
            traceType: new BehaviorSubject(TRACE_TYPE.Both),
        } as AttributesManagerService);
        service.createBFSHelper();
        expect(service.bfsHelper).toBeTruthy();
    });

    it('should update mouse position on call updateMousePosition', () => {
        service.currentMouseCoords.x = 0;
        service.currentMouseCoords.y = 0;
        service.elementRef.nativeElement = {
            getBoundingClientRect: () => {
                return { left: 123, top: 123 } as DOMRect;
            },
        } as SVGElement;
        service.updateMousePosition(createMouseEvent(10, 10, 21));

        expect(service.currentMouseCoords.x).not.toEqual(0);
        expect(service.currentMouseCoords.y).not.toEqual(0);
    });

    it('should fillStroke when TRACE_TYPE.Outline on call fill', () => {
        service.fillStroke = () => null;
        service.fillBody = () => {
            return {} as SVGGElement;
        };
        let spy = spyOn(service, 'fillStroke');

        service.traceType = TRACE_TYPE.Outline;
        service.fill();

        expect(spy).toHaveBeenCalled();
    });
    it('should fillBody when TRACE_TYPE.Full on call fill', () => {
        service.fillStroke = () => null;
        service.fillBody = () => {
            return {} as SVGGElement;
        };
        let spy = spyOn(service, 'fillBody');

        service.traceType = TRACE_TYPE.Full;
        service.fill();

        expect(spy).toHaveBeenCalled();
    });
    it('should fillBody when TRACE_TYPE.Both on call fill', () => {
        service.fillStroke = () => null;
        service.fillBody = () => {
            return {} as SVGGElement;
        };
        let spy1 = spyOn(service, 'fillBody');
        let spy2 = spyOn(service, 'fillStroke');

        service.traceType = TRACE_TYPE.Both;
        service.fill();

        expect(spy1).toHaveBeenCalled();
        expect(spy2).toHaveBeenCalled();
    });
});
