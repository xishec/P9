import { ElementRef, Renderer2, Type } from '@angular/core';
import { getTestBed, TestBed } from '@angular/core/testing';

import { KEYS, MOUSE } from 'src/constants/constants';
import { TRACE_TYPE } from 'src/constants/tool-constants';
import { createKeyBoardEvent, createMouseEvent, MockRect } from '../../../../classes/test-helpers.spec';
import { DrawStackService } from '../../draw-stack/draw-stack.service';
import { RectangleToolService } from './rectangle-tool.service';

const MOUSEMOVE_EVENT = createMouseEvent(20, 30, MOUSE.LeftButton);
const MOUSEDOWN_EVENT = createMouseEvent(0, 0, MOUSE.LeftButton);
const MOUSEUP_EVENT = createMouseEvent(0, 0, MOUSE.LeftButton);
const KEYDOWN_EVENT_SHIFT_KEY = createKeyBoardEvent(KEYS.Shift);
const KEYUP_EVENT_SHIFT_KEY = createKeyBoardEvent(KEYS.Shift);

describe('RectangleToolService', () => {
    let injector: TestBed;
    let rectangleTool: RectangleToolService;
    let rendererMock: Renderer2;
    let elementRefMock: ElementRef;
    let drawStackMock: DrawStackService;
    const mockPreviewRect: MockRect = new MockRect();
    const mockDrawRect: MockRect = new MockRect();
    let spyPreviewRectWidth: jasmine.Spy;
    let spyPreviewRectHeight: jasmine.Spy;
    let spyPreviewRectX: jasmine.Spy;
    let spyPreviewRectY: jasmine.Spy;
    let spyDrawRectWidth: jasmine.Spy;
    let spyDrawRectHeight: jasmine.Spy;
    let spyDrawRectX: jasmine.Spy;
    let spyDrawRectY: jasmine.Spy;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                RectangleToolService,
                {
                    provide: DrawStackService,
                    useValue: {
                        makeTargetable: () => null,
                        push: () => null,
                    },
                },
                {
                    provide: Renderer2,
                    useValue: {
                        setAttribute: () => null,
                        createElement: () => null,
                        appendChild: () => null,
                        removeChild: () => null,
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
        rendererMock = injector.get<Renderer2>(Renderer2 as Type<Renderer2>);
        drawStackMock = injector.get<DrawStackService>(DrawStackService as Type<DrawStackService>);
        elementRefMock = injector.get<ElementRef>(ElementRef as Type<ElementRef>);
        rectangleTool = injector.get(RectangleToolService);
        rectangleTool.initializeService(elementRefMock, rendererMock, drawStackMock);
        rectangleTool.previewRectangle = (mockPreviewRect as unknown) as SVGRectElement;
        rectangleTool.drawRectangle = (mockDrawRect as unknown) as SVGRectElement;

        spyPreviewRectWidth = spyOnProperty(rectangleTool, 'previewRectangleWidth', 'get').and.callFake(() => {
            return mockPreviewRect.width;
        });
        spyPreviewRectHeight = spyOnProperty(rectangleTool, 'previewRectangleHeight', 'get').and.callFake(() => {
            return mockPreviewRect.height;
        });
        spyPreviewRectX = spyOnProperty(rectangleTool, 'previewRectangleX', 'get').and.callFake(() => {
            return mockPreviewRect.x;
        });
        spyPreviewRectY = spyOnProperty(rectangleTool, 'previewRectangleY', 'get').and.callFake(() => {
            return mockPreviewRect.y;
        });
        spyDrawRectWidth = spyOnProperty(rectangleTool, 'drawRectangleWidth', 'get').and.callFake(() => {
            return mockDrawRect.width;
        });
        spyDrawRectHeight = spyOnProperty(rectangleTool, 'drawRectangleHeight', 'get').and.callFake(() => {
            return mockDrawRect.height;
        });
        spyDrawRectX = spyOnProperty(rectangleTool, 'drawRectangleX', 'get').and.callFake(() => {
            return mockDrawRect.x;
        });
        spyDrawRectY = spyOnProperty(rectangleTool, 'drawRectangleY', 'get').and.callFake(() => {
            return mockDrawRect.y;
        });

        jasmine.clock().install();
    });

    afterEach(() => {
        jasmine.clock().uninstall();
    });

    it('should return the draw rectangle height when getting draw rectangle height', () => {
        const HEIGHT = 10;
        const mockRect = ({
            height: {
                baseVal: {
                    value: HEIGHT,
                },
            },
        } as unknown) as SVGRectElement;

        const newRectangleTool = injector.get(RectangleToolService);
        newRectangleTool.initializeService(elementRefMock, rendererMock, drawStackMock);
        spyDrawRectHeight.and.callThrough();

        newRectangleTool.drawRectangle = (mockRect as unknown) as SVGRectElement;

        expect(newRectangleTool.drawRectangleHeight).toEqual(HEIGHT);
    });

    it('should return the draw rectangle width when getting draw rectangle width', () => {
        const WIDTH = 10;
        const mockRect = ({
            width: {
                baseVal: {
                    value: WIDTH,
                },
            },
        } as unknown) as SVGRectElement;

        const newRectangleTool = injector.get(RectangleToolService);
        newRectangleTool.initializeService(elementRefMock, rendererMock, drawStackMock);
        spyDrawRectWidth.and.callThrough();

        newRectangleTool.drawRectangle = (mockRect as unknown) as SVGRectElement;

        expect(newRectangleTool.drawRectangleWidth).toEqual(WIDTH);
    });

    it('should return the draw rectangle x when getting draw rectangle x', () => {
        const X = 10;
        const mockRect = ({
            x: {
                baseVal: {
                    value: X,
                },
            },
        } as unknown) as SVGRectElement;

        const newRectangleTool = injector.get(RectangleToolService);
        newRectangleTool.initializeService(elementRefMock, rendererMock, drawStackMock);
        spyDrawRectX.and.callThrough();

        newRectangleTool.drawRectangle = (mockRect as unknown) as SVGRectElement;

        expect(newRectangleTool.drawRectangleX).toEqual(X);
    });

    it('should return the draw rectangle y when getting draw rectangle y', () => {
        const Y = 10;
        const mockRect = ({
            y: {
                baseVal: {
                    value: Y,
                },
            },
        } as unknown) as SVGRectElement;

        const newRectangleTool = injector.get(RectangleToolService);
        newRectangleTool.initializeService(elementRefMock, rendererMock, drawStackMock);
        spyDrawRectY.and.callThrough();

        newRectangleTool.drawRectangle = (mockRect as unknown) as SVGRectElement;

        expect(newRectangleTool.drawRectangleY).toEqual(Y);
    });

    it('should not call the renderer when clicking outside of workzone', () => {
        const spySetAttribute = spyOn(rendererMock, 'setAttribute');
        const spyAppendChild = spyOn(rendererMock, 'appendChild');
        spyOn(rectangleTool, 'isMouseInRef').and.callFake(
            (event: MouseEvent, elementRef: ElementRef<SVGElement>) => false,
        );

        rectangleTool.onMouseDown(MOUSEDOWN_EVENT);
        rectangleTool.onMouseMove(MOUSEMOVE_EVENT);

        expect(spySetAttribute).not.toHaveBeenCalled();
        expect(spyAppendChild).not.toHaveBeenCalled();
    });

    it('should append the preview and the draw rectangle when left click in workzone', () => {
        const spySetAttribute = spyOn(rendererMock, 'setAttribute');
        const spyAppendChild = spyOn(rendererMock, 'appendChild');
        spyOn(rectangleTool, 'isMouseInRef').and.callFake(
            (event: MouseEvent, elementRef: ElementRef<SVGElement>) => true,
        );
        rectangleTool.onMouseDown(MOUSEDOWN_EVENT);
        expect(spySetAttribute).toHaveBeenCalledBefore(spyAppendChild);
        expect(spyAppendChild).toHaveBeenCalledTimes(2);
    });

    it('should correctly update the draw rectangle in the workzone on random mouse position', () => {
        spyOn(rectangleTool, 'isMouseInRef').and.callFake(
            (event: MouseEvent, elementRef: ElementRef<SVGElement>) => true,
        );
        const spySetAttribute = spyOn(rendererMock, 'setAttribute').and.callFake(
            (el: any, name: string, value: string) => {
                switch (name) {
                    case 'x':
                        el.x = Number(value);
                        break;
                    case 'y':
                        el.y = Number(value);
                        break;
                    case 'width':
                        el.width = Number(value);
                        break;
                    case 'height':
                        el.height = Number(value);
                        break;
                    default:
                        break;
                }
            },
        );

        rectangleTool.onMouseDown(MOUSEDOWN_EVENT);
        rectangleTool.onMouseMove(MOUSEMOVE_EVENT);

        expect(rectangleTool.isPreviewing).toBeTruthy();
        expect(spySetAttribute).toHaveBeenCalled();
        expect(rectangleTool.drawRectangleWidth).toEqual(rectangleTool.previewRectangleWidth);
        expect(rectangleTool.drawRectangleHeight).toEqual(rectangleTool.previewRectangleHeight);
        expect(rectangleTool.drawRectangleX).toEqual(rectangleTool.previewRectangleX);
        expect(rectangleTool.drawRectangleY).toEqual(rectangleTool.previewRectangleY);
    });

    it('should give positive dimensions on negative input', () => {
        spyOn(rectangleTool, 'isMouseInRef').and.callFake(
            (event: MouseEvent, elementRef: ElementRef<SVGElement>) => true,
        );
        const spySetAttribute = spyOn(rendererMock, 'setAttribute').and.callFake(
            (el: any, name: string, value: string) => {
                switch (name) {
                    case 'x':
                        el.x = Number(value);
                        break;
                    case 'y':
                        el.y = Number(value);
                        break;
                    case 'width':
                        el.width = Number(value);
                        break;
                    case 'height':
                        el.height = Number(value);
                        break;
                    default:
                        break;
                }
            },
        );

        rectangleTool.onMouseDown(createMouseEvent(0, 0, MOUSE.LeftButton));
        rectangleTool.onMouseMove(createMouseEvent(-30, -40, MOUSE.LeftButton));

        expect(rectangleTool.isPreviewing).toBeTruthy();
        expect(spySetAttribute).toHaveBeenCalled();
        expect(rectangleTool.drawRectangleWidth).toBeGreaterThan(0);
        expect(rectangleTool.drawRectangleHeight).toBeGreaterThan(0);
    });

    it('should be square when shift is down', () => {
        const spy = spyOn(rectangleTool, 'updatePreviewSquare');

        rectangleTool.onKeyDown(KEYDOWN_EVENT_SHIFT_KEY);
        rectangleTool.onMouseDown(MOUSEDOWN_EVENT);
        rectangleTool.onMouseMove(MOUSEMOVE_EVENT);
        rectangleTool.onKeyDown(KEYDOWN_EVENT_SHIFT_KEY);

        expect(rectangleTool.isSquarePreview).toBeTruthy();
        expect(rectangleTool.drawRectangleWidth).toEqual(rectangleTool.drawRectangleWidth);
        expect(rectangleTool.drawRectangleHeight).toEqual(rectangleTool.drawRectangleHeight);
        expect(spy).toHaveBeenCalled();
    });

    it('should update drawRectangle as square when calling updatePreviewSquare with positive deltas', () => {
        const Y = 10;
        const X = 10;
        const WIDTH = 5;
        const HEIGHT = 10;
        const mockRect = ({
            x: {
                baseVal: {
                    value: X,
                },
            },
            y: {
                baseVal: {
                    value: Y,
                },
            },
            width: {
                baseVal: {
                    value: WIDTH,
                },
            },
            height: {
                baseVal: {
                    value: HEIGHT,
                },
            },
        } as unknown) as SVGRectElement;

        const newRectangleTool = injector.get(RectangleToolService);
        newRectangleTool.initializeService(elementRefMock, rendererMock, drawStackMock);
        newRectangleTool.drawRectangle = mockRect;
        newRectangleTool.currentMouseCoords.x = X;
        newRectangleTool.currentMouseCoords.y = Y;
        newRectangleTool.initialMouseCoords.x = 0;
        newRectangleTool.initialMouseCoords.y = 0;

        const spy = spyOn(rendererMock, 'setAttribute');

        newRectangleTool.updatePreviewSquare();

        expect(spy).toHaveBeenCalled();
    });

    it('should update drawRectangle as square when calling updatePreviewSquare with positive deltas', () => {
        const Y = 10;
        const X = 10;
        const WIDTH = 5;
        const HEIGHT = 10;
        const mockRect = ({
            x: {
                baseVal: {
                    value: X,
                },
            },
            y: {
                baseVal: {
                    value: Y,
                },
            },
            width: {
                baseVal: {
                    value: WIDTH,
                },
            },
            height: {
                baseVal: {
                    value: HEIGHT,
                },
            },
        } as unknown) as SVGRectElement;

        const newRectangleTool = injector.get(RectangleToolService);
        newRectangleTool.initializeService(elementRefMock, rendererMock, drawStackMock);
        newRectangleTool.drawRectangle = mockRect;
        newRectangleTool.currentMouseCoords.x = 0;
        newRectangleTool.currentMouseCoords.y = 0;
        newRectangleTool.initialMouseCoords.x = X;
        newRectangleTool.initialMouseCoords.y = Y;

        const spy = spyOn(rendererMock, 'setAttribute');

        newRectangleTool.updatePreviewSquare();

        expect(spy).toHaveBeenCalled();
    });

    it('should not be square when pressing and releasing shift', () => {
        rectangleTool.onKeyDown(KEYDOWN_EVENT_SHIFT_KEY);
        rectangleTool.onKeyUp(KEYUP_EVENT_SHIFT_KEY);

        expect(rectangleTool.isSquarePreview).toBeFalsy();
    });

    it('should cleanup correctly when creating a full rectangle', () => {
        const spyRemove = spyOn(rendererMock, 'removeChild');

        rectangleTool.onMouseDown(MOUSEDOWN_EVENT);
        rectangleTool.onMouseMove(MOUSEMOVE_EVENT);
        rectangleTool.onMouseUp(MOUSEUP_EVENT);

        jasmine.clock().tick(1);

        expect(rectangleTool.isPreviewing).toBeFalsy();
        expect(rectangleTool.isSquarePreview).toBeFalsy();
        expect(spyRemove).toHaveBeenCalledTimes(2);
    });

    it('should define drawRectangle and previewRectangle', () => {
        expect(spyPreviewRectX).toBeDefined();
        expect(spyPreviewRectY).toBeDefined();
        expect(spyPreviewRectWidth).toBeDefined();
        expect(spyPreviewRectHeight).toBeDefined();
        expect(spyDrawRectX).toBeDefined();
        expect(spyDrawRectY).toBeDefined();
        expect(spyDrawRectWidth).toBeDefined();
        expect(spyDrawRectHeight).toBeDefined();
    });

    it('should be able to update tracetype', () => {
        rectangleTool.updateTraceType(TRACE_TYPE.Both);
        expect(rectangleTool.traceType).toEqual(TRACE_TYPE.Both);

        rectangleTool.updateTraceType(TRACE_TYPE.Full);
        expect(rectangleTool.traceType).toEqual(TRACE_TYPE.Full);

        rectangleTool.updateTraceType(TRACE_TYPE.Outline);
        expect(rectangleTool.traceType).toEqual(TRACE_TYPE.Outline);
    });

    it('should create SVGRect and cleanUp when left mouse up in work zone with a valid rectangle', () => {
        spyOn(rectangleTool, 'isMouseInRef').and.callFake(() => true);
        spyOn(rectangleTool, 'isValidRectangle').and.callFake(() => true);
        const spyOnCreate = spyOn(rectangleTool, 'createSVG');
        const spyOnCleanUp = spyOn(rectangleTool, 'cleanUp');

        rectangleTool.onMouseUp(MOUSEUP_EVENT);

        expect(spyOnCreate).toHaveBeenCalled();
        expect(spyOnCleanUp).toHaveBeenCalled();
    });

    it('should only cleanUp when left mouse up out of work zone with a invalid rectangle', () => {
        spyOn(rectangleTool, 'isMouseInRef').and.callFake(() => false);
        spyOn(rectangleTool, 'isValidRectangle').and.callFake(() => false);
        const spyOnCreate = spyOn(rectangleTool, 'createSVG');
        const spyOnCleanUp = spyOn(rectangleTool, 'cleanUp');

        rectangleTool.onMouseUp(MOUSEUP_EVENT);

        expect(spyOnCreate).not.toHaveBeenCalled();
        expect(spyOnCleanUp).toHaveBeenCalled();
    });

    it('should copy all 4 previewRect attibutes into draw rectangle when calling copyPreviewRectangleAttributes stroke < width', () => {
        const Y = 10;
        const X = 10;
        const WIDTH = 10;
        const HEIGHT = 10;
        const mockRect = ({
            x: {
                baseVal: {
                    value: X,
                },
            },
            y: {
                baseVal: {
                    value: Y,
                },
            },
            width: {
                baseVal: {
                    value: WIDTH,
                },
            },
            height: {
                baseVal: {
                    value: HEIGHT,
                },
            },
        } as unknown) as SVGRectElement;

        const newRectangleTool = injector.get(RectangleToolService);
        newRectangleTool.initializeService(elementRefMock, rendererMock, drawStackMock);
        newRectangleTool.previewRectangle = mockRect;
        newRectangleTool.userStrokeWidth = 0;

        const spy = spyOn(rendererMock, 'setAttribute');
        rectangleTool.copyPreviewRectangleAttributes();
        expect(spy).toHaveBeenCalledTimes(4);
    });

    it('should copy all 4 previewRect attibutes into draw rectangle when calling copyPreviewRectangleAttributes stroke > width', () => {
        const Y = 10;
        const X = 10;
        const WIDTH = 10;
        const HEIGHT = 10;
        const mockRect = ({
            x: {
                baseVal: {
                    value: X,
                },
            },
            y: {
                baseVal: {
                    value: Y,
                },
            },
            width: {
                baseVal: {
                    value: WIDTH,
                },
            },
            height: {
                baseVal: {
                    value: HEIGHT,
                },
            },
        } as unknown) as SVGRectElement;

        const newRectangleTool = injector.get(RectangleToolService);
        newRectangleTool.initializeService(elementRefMock, rendererMock, drawStackMock);
        newRectangleTool.previewRectangle = mockRect;
        newRectangleTool.userStrokeWidth = 20;

        const spy = spyOn(rendererMock, 'setAttribute');
        rectangleTool.copyPreviewRectangleAttributes();
        expect(spy).toHaveBeenCalledTimes(4);
    });

    it('should create g tag with drawRectangle copy as child with a fill color and push it when calling createSVG', () => {
        const RED_COLOR = 'red';
        const spyOnAppend = spyOn(rendererMock, 'appendChild');
        const spyCreateElement = spyOn(rendererMock, 'createElement');
        const spyOnSetAttribute = spyOn(rendererMock, 'setAttribute');
        const spyOnPush = spyOn(drawStackMock, 'push');

        rectangleTool.userFillColor = RED_COLOR;
        rectangleTool.createSVG();

        jasmine.clock().tick(1);

        expect(spyOnAppend).toHaveBeenCalled();
        expect(spyOnSetAttribute).toHaveBeenCalled();
        expect(spyOnPush).toHaveBeenCalled();
        expect(spyCreateElement).toHaveBeenCalled();
    });

    it('should create g tag with drawRectangle copy as child with no color and push it when calling createSVG', () => {
        const NONE_COLOR = 'none';
        const spyOnAppend = spyOn(rendererMock, 'appendChild');
        const spyOnSetAttribute = spyOn(rendererMock, 'setAttribute');
        const spyCreateElement = spyOn(rendererMock, 'createElement');
        const spyOnPush = spyOn(drawStackMock, 'push');

        rectangleTool.userFillColor = NONE_COLOR;
        rectangleTool.createSVG();

        jasmine.clock().tick(1);

        expect(spyOnAppend).toHaveBeenCalled();
        expect(spyOnSetAttribute).toHaveBeenCalled();
        expect(spyOnPush).toHaveBeenCalled();
        expect(spyCreateElement).toHaveBeenCalled();
    });
});
