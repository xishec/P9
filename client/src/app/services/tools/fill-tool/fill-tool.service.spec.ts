import { getTestBed, TestBed } from '@angular/core/testing';

import { ElementRef, Renderer2, Type } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { BFSHelper } from 'src/classes/BFSHelper';
import { Coords2D } from 'src/classes/Coords2D';
import { FillStructure } from 'src/classes/FillStructure';
import { createKeyBoardEvent, createMouseEvent } from 'src/classes/test-helpers.spec';
import { provideAutoMock } from 'src/classes/test.helper.msTeams.spec';
import { KEYS } from 'src/constants/constants';
import { TRACE_TYPE } from 'src/constants/tool-constants';
import { DrawStackService } from '../../draw-stack/draw-stack.service';
import { AttributesManagerService } from '../attributes-manager/attributes-manager.service';
import { FillToolService } from './fill-tool.service';

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
        service.divideLinesToSegments = () => null;
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

    it('should fill segmentsToDraw on call divideLinesToSegments', () => {
        service.bfsHelper = {} as BFSHelper;
        service.bfsHelper.bodyGrid = new Map([
            [1, [1, 2, 3]],
            [2, [1, 2, 3]],
            [3, [1, 2, 3, 1000]],
        ]);
        service.divideLinesToSegments();
        expect(service.segmentsToDraw.size).toBeGreaterThan(0);
    });

    it('should addToMap on call addToMap with an absent key', () => {
        const map: Map<number, FillStructure[]> = new Map([]);
        service.addToMap(1, { top: new Coords2D(0, 1), bottom: new Coords2D(0, 10) } as FillStructure, map);
        expect(map.size).toEqual(1);
        expect((map.get(1) as FillStructure[])[0].top.x).toEqual(0);
        expect((map.get(1) as FillStructure[])[0].top.y).toEqual(1);
        expect((map.get(1) as FillStructure[])[0].bottom.x).toEqual(0);
        expect((map.get(1) as FillStructure[])[0].bottom.y).toEqual(10);
    });
    it('should addToMap on call addToMap with an existing key', () => {
        const map: Map<number, FillStructure[]> = new Map([
            [1, [{ top: new Coords2D(0, 1), bottom: new Coords2D(0, 10) } as FillStructure]],
        ]);
        service.addToMap(1, { top: new Coords2D(3, 1), bottom: new Coords2D(3, 10) } as FillStructure, map);
        expect(map.size).toEqual(1);
        expect((map.get(1) as FillStructure[])[1].top.x).toEqual(3);
        expect((map.get(1) as FillStructure[])[1].top.y).toEqual(1);
        expect((map.get(1) as FillStructure[])[1].bottom.x).toEqual(3);
        expect((map.get(1) as FillStructure[])[1].bottom.y).toEqual(10);
    });

    it('should push to strokePaths on call updateVerticalStrokePaths', () => {
        service.strokePaths = [];
        service.bfsHelper = {} as BFSHelper;
        service.bfsHelper.strokeGrid = new Map([
            [1, [1, 2, 3]],
            [2, [1, 2, 30]],
            [3, [1, 2, 3, 1000]],
        ]);

        service.updateVerticalStrokePaths(1);
        expect(service.strokePaths.length).toEqual(1);
    });
    it('should not push to strokePaths on call updateVerticalStrokePaths with invalid stroke path', () => {
        service.strokePaths = [];
        service.bfsHelper = {} as BFSHelper;
        service.bfsHelper.strokeGrid = new Map([
            [1, [1, 7, 3]],
            [2, [1, 2, 30]],
            [3, [1, 2, 3, 1000]],
        ]);

        service.updateVerticalStrokePaths(1);
        expect(service.strokePaths.length).not.toEqual(1);
    });

    it('should append BodyPaths to bodyPaths on call appendBodyPaths', () => {
        const spy = spyOn(service.renderer, 'appendChild');
        service.appendBodyPaths({} as SVGGElement, ['1', '2']);
        expect(spy).toHaveBeenCalledTimes(2);
    });
    it('should add to bodyPaths on call updateBodyPaths', () => {
        const bodyPaths = ['1', '2'];
        service.updateBodyPaths(
            bodyPaths,
            { top: new Coords2D(0, 1), bottom: new Coords2D(0, 10) } as FillStructure,
            0,
        );

        expect(bodyPaths.length).toEqual(2);
    });

    it('should append StrokePaths to bodyPaths on call appendStrokePaths', () => {
        service.strokePaths = [];
        service.appendStrokePaths(['3', '4'], ['1', '2']);
        expect(service.strokePaths.length).toEqual(4);
    });
    it('should add L to bodyPaths on call updateStrokePaths', () => {
        const fillStructure1: FillStructure = { top: new Coords2D(0, 1), bottom: new Coords2D(0, 10) } as FillStructure;
        const fillStructure2: FillStructure = { top: new Coords2D(0, 1), bottom: new Coords2D(0, 10) } as FillStructure;
        service.segmentsToDraw = new Map([]);
        service.segmentsToDraw.set(1, [fillStructure1]);
        const topStrokePaths = ['1', '2'];
        const bottomStrokePaths = ['3', '4'];
        service.updateStrokePaths(fillStructure2, 2, 0, topStrokePaths, bottomStrokePaths);

        expect(topStrokePaths[0].includes('L')).toEqual(true);
        expect(bottomStrokePaths[0].includes('L')).toEqual(true);
    });
    it('should add M to bodyPaths on call updateStrokePaths', () => {
        const fillStructure1: FillStructure = { top: new Coords2D(0, 1), bottom: new Coords2D(0, 10) } as FillStructure;
        const fillStructure2: FillStructure = {
            top: new Coords2D(1110, 1111),
            bottom: new Coords2D(1110, 11110),
        } as FillStructure;
        service.segmentsToDraw = new Map([]);
        service.segmentsToDraw.set(1, [fillStructure1]);
        const topStrokePaths = ['1', '2'];
        const bottomStrokePaths = ['3', '4'];
        service.updateStrokePaths(fillStructure2, 2, 0, topStrokePaths, bottomStrokePaths);

        expect(topStrokePaths[0].includes('M')).toEqual(true);
        expect(bottomStrokePaths[0].includes('M')).toEqual(true);
    });

    it('should reset BodyAndStrokePaths on call resetBodyAndStrokePaths', () => {
        const fillStructure1: FillStructure = { top: new Coords2D(0, 1), bottom: new Coords2D(0, 10) } as FillStructure;
        const fillStructure2: FillStructure = {
            top: new Coords2D(1110, 1111),
            bottom: new Coords2D(1110, 11110),
        } as FillStructure;
        const topStrokePaths = ['1'];
        const bottomStrokePaths = ['3'];
        const bodyPaths: string[] = ['123'];
        service.resetBodyAndStrokePaths([fillStructure1, fillStructure2], bodyPaths, topStrokePaths, bottomStrokePaths);

        expect(bodyPaths.length).toEqual(2);
        expect(topStrokePaths.length).toEqual(2);
        expect(bottomStrokePaths.length).toEqual(2);
    });

    it('should append Body on call appendBody', () => {
        const bodyPaths: string[] = ['1', '2'];
        const spy = spyOn(service.renderer, 'appendChild');
        service.appendBody(bodyPaths, {} as SVGGElement);
        expect(spy).toHaveBeenCalledTimes(2);
    });

    it('should fill stroke on call fillStroke', () => {
        service.appendMask = () => null;
        service.appendStroke = () => null;
        const spy1 = spyOn(service, 'appendMask');
        const spy2 = spyOn(service, 'appendStroke');
        service.fillStroke(({ cloneNode: () => null } as unknown) as SVGGElement);
        expect(spy1).toHaveBeenCalled();
        expect(spy2).toHaveBeenCalled();
    });

    it('should append Mask on call appendMask', () => {
        const spy = spyOn(service.renderer, 'appendChild');
        service.appendMask({} as SVGGElement, '123');
        expect(spy).toHaveBeenCalled();
    });

    it('should append Stroke on call appendStroke', () => {
        service.strokePaths = ['1', '2'];
        const spy = spyOn(service.renderer, 'appendChild');
        service.appendStroke('123');
        expect(spy).toHaveBeenCalledTimes(3);
    });

    it('should create SVGWrapper on call createSVGWrapper', () => {
        const spy = spyOn(service.renderer, 'createElement');
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

    it('should fill Body on call fillBody', () => {
        service.bfsHelper = {} as BFSHelper;
        service.bfsHelper.mostLeft = 1;
        service.bfsHelper.mostRight = 1;
        service.updateVerticalStrokePaths = () => null;
        service.appendBodyPaths = () => null;
        service.appendStrokePaths = () => null;
        service.resetBodyAndStrokePaths = () => null;
        service.updateBodyPaths = () => null;
        service.updateStrokePaths = () => null;
        const fillStructure1: FillStructure = { top: new Coords2D(0, 1), bottom: new Coords2D(0, 10) } as FillStructure;
        service.segmentsToDraw = new Map([]);
        service.segmentsToDraw.set(1, [fillStructure1]);
        service.segmentsToDraw.set(2, [fillStructure1]);

        const spy = spyOn(service.renderer, 'appendChild');
        service.fillBody();
        expect(spy).toHaveBeenCalled();
    });
});
