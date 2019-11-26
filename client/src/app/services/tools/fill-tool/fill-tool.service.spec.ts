import { getTestBed, TestBed } from '@angular/core/testing';

import { ElementRef, Renderer2, Type } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { BFSHelper } from 'src/classes/BFSHelper';
import { createKeyBoardEvent, createMouseEvent } from 'src/classes/test-helpers.spec';
import { provideAutoMock } from 'src/classes/test.helper.msTeams.spec';
import { KEYS } from 'src/constants/constants';
import { TRACE_TYPE } from 'src/constants/tool-constants';
import { DrawStackService } from '../../draw-stack/draw-stack.service';
import { AttributesManagerService } from '../attributes-manager/attributes-manager.service';
import { FillToolService } from './fill-tool.service';
import { Coords2D } from 'src/classes/Coords2D';

describe('FillToolService', () => {
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
                                            drawImage: () => null,
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
        const bool = service.shouldNotFill(createMouseEvent(0, 0, 21));
        expect(bool).toEqual(true);
    });
    it('should return false on call shouldNotFill', () => {
        service.isMouseInRef = (event: MouseEvent, elementRef: ElementRef): boolean => {
            return true;
        };
        service[`modalManagerService`].modalIsDisplayed = new BehaviorSubject(false);
        service.mouseDown = true;
        const bool = service.shouldNotFill(createMouseEvent(0, 0, 21));
        expect(bool).toEqual(false);
    });

    it('should do nothing on call non-implemented method', () => {
        service.onMouseMove(createMouseEvent(0, 0, 21));
        service.onMouseEnter(createMouseEvent(0, 0, 21));
        service.onMouseLeave(createMouseEvent(0, 0, 21));
        service.onKeyDown(createKeyBoardEvent(KEYS.Alt));
        service.onKeyUp(createKeyBoardEvent(KEYS.Alt));
        service.cleanUp();
        expect(service).toBeTruthy();
    });

    it('should call updateCanvas onMouseDown', () => {
        service.isMouseInRef = (event: MouseEvent, elementRef: ElementRef): boolean => {
            return true;
        };
        const spy = spyOn(service, 'updateCanvas');
        service.onMouseDown(createMouseEvent(0, 0, 21));

        expect(spy).toHaveBeenCalled();
    });
    it('should not call updateCanvas onMouseDown', () => {
        service.isMouseInRef = (event: MouseEvent, elementRef: ElementRef): boolean => {
            return false;
        };
        const spy = spyOn(service, 'updateCanvas');
        service.onMouseDown(createMouseEvent(0, 0, 21));

        expect(spy).not.toHaveBeenCalled();
    });

    it('should not call fill onMouseUp', () => {
        service.shouldNotFill = (event: MouseEvent): boolean => {
            return true;
        };
        const spy = spyOn(service, 'fill');
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
        service.fill = () => null;

        const spy = spyOn(service, 'fill');
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
        service.createSVGWrapper = () => null;
        service.createFillPath = () => '';
        service.fillStroke = () => null;
        service.fillBody = () => {
            return {} as SVGGElement;
        };
        const spy = spyOn(service, 'fillStroke');

        service.traceType = TRACE_TYPE.Outline;
        service.fill();

        expect(spy).toHaveBeenCalled();
    });
    it('should fillBody when TRACE_TYPE.Full on call fill', () => {
        service.createSVGWrapper = () => null;
        service.createFillPath = () => '';
        service.fillStroke = () => null;
        service.fillBody = () => {
            return {} as SVGGElement;
        };
        const spy = spyOn(service, 'fillBody');

        service.traceType = TRACE_TYPE.Full;
        service.fill();

        expect(spy).toHaveBeenCalled();
    });
    it('should fillBody when TRACE_TYPE.Both on call fill', () => {
        service.createSVGWrapper = () => null;
        service.createFillPath = () => '';
        service.fillStroke = () => null;
        service.fillBody = () => {
            return {} as SVGGElement;
        };
        const spy1 = spyOn(service, 'fillBody');
        const spy2 = spyOn(service, 'fillStroke');

        service.traceType = TRACE_TYPE.Both;
        service.fill();

        expect(spy1).toHaveBeenCalled();
        expect(spy2).toHaveBeenCalled();
    });

    it('should create SVG Wrapper on call createSVGWrapper', () => {
        const spy = spyOn(service.renderer, 'setAttribute');
        service.createSVGWrapper();
        expect(spy).toHaveBeenCalledTimes(1);
    });

    it('should update Canvas on call updateCanvas', () => {
        XMLSerializer.prototype.serializeToString = () => 'null';
        service.elementRef.nativeElement = {
            getBoundingClientRect: () => {
                return { width: 1, height: 1 } as ClientRect;
            },
        } as SVGElement;
        const spy = spyOn(service.renderer, 'setProperty');
        service.updateCanvas();
        expect(spy).toHaveBeenCalledTimes(3);
    });

    it('should create Fill Path on call createFillPath', () => {
        let pixel1 = new Coords2D(0, 1);
        let pixel2 = new Coords2D(0, 2);
        service.bfsHelper = {} as BFSHelper;
        service.bfsHelper.pathsToFill = [[pixel1, pixel2]] as Coords2D[][];

        expect(service.createFillPath()).toEqual(' M0.5 1.5 L0.5 2.5 z');
    });

    it('should append Mask on call appendMask', () => {
        const spy = spyOn(service.renderer, 'appendChild');
        service.appendMask('', {} as SVGGElement, '');
        expect(spy).toHaveBeenCalledTimes(2);
    });

    it('should fill Stroke on call fillStroke', () => {
        const spy = spyOn(service.renderer, 'appendChild');
        service.fillStroke('', {
            cloneNode: () => {
                null;
            },
        } as SVGGElement);
        expect(spy).toHaveBeenCalledTimes(4);
    });

    it('should fill Body on call fillBody', () => {
        const spy = spyOn(service.renderer, 'appendChild');
        service.fillBody('');
        expect(spy).toHaveBeenCalledTimes(2);
    });
});
