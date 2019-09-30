import { TestBed, getTestBed } from '@angular/core/testing';

import { RectangleToolService } from './rectangle-tool.service';
import { ElementRef, Renderer2, Type } from '@angular/core';
import { DrawStackService } from '../../draw-stack/draw-stack.service';
import { Keys, Mouse } from 'src/constants/constants';
import { createMouseEvent, createKeyBoardEvent, getRandomNumber, MockRect } from '../../../../classes/test-helpers';
import { TraceType } from 'src/constants/tool-constants';

const MOUSEENTER_EVENT = createMouseEvent(0, 0, Mouse.LeftButton);
const MOUSELEAVE_EVENT = createMouseEvent(0, 0, Mouse.LeftButton);
const RANDOM_MOUSEMOVE_EVENT = (): MouseEvent => {
    return createMouseEvent(getRandomNumber(), getRandomNumber(), Mouse.LeftButton);
};
const RANDOM_MOUSEDOWN_EVENT = (): MouseEvent => {
    return createMouseEvent(getRandomNumber(), getRandomNumber(), Mouse.LeftButton);
};
const MOUSEUP_EVENT = createMouseEvent(0, 0, Mouse.LeftButton);
const KEYDOWN_EVENT_SHIFT_KEY = createKeyBoardEvent(Keys.Shift);
const KEYUP_EVENT_SHIFT_KEY = createKeyBoardEvent(Keys.Shift);

describe('RectangleToolService', () => {
    let injector: TestBed;
    let rectangleTool: RectangleToolService;
    let rendererMock: Renderer2;
    let elementRefMock: ElementRef;
    let drawStackMock: DrawStackService;
    let spyCreateElement: jasmine.Spy;
    let mockPreviewRect: MockRect = new MockRect();
    let mockDrawRect: MockRect = new MockRect();
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
                DrawStackService,
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
                                let boundleft = 0;
                                let boundtop = 0;
                                let boundRect = {
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
        rectangleTool = new RectangleToolService(drawStackMock, elementRefMock, rendererMock);
        rectangleTool.previewRectangle = (mockPreviewRect as unknown) as SVGRectElement;
        rectangleTool.drawRectangle = (mockDrawRect as unknown) as SVGRectElement;
        spyCreateElement = spyOn(rendererMock, 'createElement').and.callFake(() => {
            return new MockRect();
        });
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
    });

    it('should be created with call to new', () => {
        const newRectangleTool = new RectangleToolService(drawStackMock, elementRefMock, rendererMock);
        expect(spyCreateElement).toHaveBeenCalled();
        expect(newRectangleTool).toBeTruthy();
    });

    it('should not call the renderer when clicking outside of workzone', () => {
        let spySetAttribute = spyOn(rendererMock, 'setAttribute');
        let spyAppendChild = spyOn(rendererMock, 'appendChild');

        rectangleTool.onMouseLeave(MOUSELEAVE_EVENT);
        rectangleTool.onMouseDown(RANDOM_MOUSEDOWN_EVENT());
        rectangleTool.onMouseMove(RANDOM_MOUSEMOVE_EVENT());

        expect(spySetAttribute).not.toHaveBeenCalled();
        expect(spyAppendChild).not.toHaveBeenCalled();
    });

    it('should append the preview and the draw rectangle when left click in workzone', () => {
        let spySetAttribute = spyOn(rendererMock, 'setAttribute');
        let spyAppendChild = spyOn(rendererMock, 'appendChild');
        rectangleTool.onMouseEnter(MOUSEENTER_EVENT);
        rectangleTool.onMouseDown(RANDOM_MOUSEDOWN_EVENT());
        expect(spySetAttribute).toHaveBeenCalledBefore(spyAppendChild);
        expect(spyAppendChild).toHaveBeenCalledTimes(2);
    });

    it('should correctly update the draw rectangle in the workzone on random mouse position', () => {
        let spySetAttribute = spyOn(rendererMock, 'setAttribute').and.callFake(
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
            }
        );

        rectangleTool.onMouseEnter(MOUSEENTER_EVENT);
        rectangleTool.onMouseDown(RANDOM_MOUSEDOWN_EVENT());
        rectangleTool.onMouseMove(RANDOM_MOUSEMOVE_EVENT());

        expect(rectangleTool.isPreviewing).toBeTruthy();
        expect(spySetAttribute).toHaveBeenCalled();
        expect(rectangleTool.drawRectangleWidth).toEqual(rectangleTool.previewRectangleWidth);
        expect(rectangleTool.drawRectangleHeight).toEqual(rectangleTool.previewRectangleHeight);
        expect(rectangleTool.drawRectangleX).toEqual(rectangleTool.previewRectangleX);
        expect(rectangleTool.drawRectangleY).toEqual(rectangleTool.previewRectangleY);
    });

    it('should give positive dimensions on negative input', () => {
        let spySetAttribute = spyOn(rendererMock, 'setAttribute').and.callFake(
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
            }
        );

        rectangleTool.onMouseEnter(MOUSEENTER_EVENT);
        rectangleTool.onMouseDown(createMouseEvent(0, 0, Mouse.LeftButton));
        rectangleTool.onMouseMove(createMouseEvent(-30, -40, Mouse.LeftButton));

        expect(rectangleTool.isPreviewing).toBeTruthy();
        expect(spySetAttribute).toHaveBeenCalled();
        expect(rectangleTool.drawRectangleWidth).toBeGreaterThan(0);
        expect(rectangleTool.drawRectangleHeight).toBeGreaterThan(0);
    });

    it('should be square when shift is down', () => {
        let spy = spyOn(rectangleTool, 'updatePreviewSquare');

        rectangleTool.onMouseEnter(MOUSEENTER_EVENT);
        rectangleTool.onKeyDown(KEYDOWN_EVENT_SHIFT_KEY);
        rectangleTool.onMouseDown(RANDOM_MOUSEDOWN_EVENT());
        rectangleTool.onMouseMove(RANDOM_MOUSEMOVE_EVENT());
        rectangleTool.onKeyDown(KEYDOWN_EVENT_SHIFT_KEY);

        expect(rectangleTool.isSquarePreview).toBeTruthy();
        expect(rectangleTool.drawRectangleWidth).toEqual(rectangleTool.drawRectangleWidth);
        expect(rectangleTool.drawRectangleHeight).toEqual(rectangleTool.drawRectangleHeight);
        expect(spy).toHaveBeenCalled();
    });

    it('should not be square when pressing and releasing shift', () => {
        rectangleTool.onKeyDown(KEYDOWN_EVENT_SHIFT_KEY);
        rectangleTool.onKeyUp(KEYUP_EVENT_SHIFT_KEY);

        expect(rectangleTool.isSquarePreview).toBeFalsy();
    });

    it('should call remove 2 times and append 4 time for a full rectangle', () => {
        let spyAppend = spyOn(rendererMock, 'appendChild');
        let spyRemove = spyOn(rendererMock, 'removeChild');

        rectangleTool.onMouseEnter(MOUSEENTER_EVENT);
        rectangleTool.onMouseDown(RANDOM_MOUSEDOWN_EVENT());
        rectangleTool.onMouseMove(RANDOM_MOUSEMOVE_EVENT());
        rectangleTool.onMouseUp(MOUSEUP_EVENT);

        expect(rectangleTool.isPreviewing).toBeFalsy();
        expect(rectangleTool.isSquarePreview).toBeFalsy();
        expect(spyRemove).toHaveBeenCalledTimes(2);
        expect(spyAppend).toHaveBeenCalledTimes(4);
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
        rectangleTool.updateTraceType(TraceType.Both);
        expect(rectangleTool.traceType).toEqual(TraceType.Both);

        rectangleTool.updateTraceType(TraceType.Full);
        expect(rectangleTool.traceType).toEqual(TraceType.Full);

        rectangleTool.updateTraceType(TraceType.Outline);
        expect(rectangleTool.traceType).toEqual(TraceType.Outline);
    });
});
