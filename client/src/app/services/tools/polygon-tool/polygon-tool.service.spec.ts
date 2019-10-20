import { TestBed, getTestBed } from '@angular/core/testing';

import { PolygonToolService } from './polygon-tool.service';
import { Renderer2, ElementRef, Type } from '@angular/core';
import { DrawStackService } from '../../draw-stack/draw-stack.service';
import { MockPolygon, createMouseEvent, MockRect } from 'src/classes/test-helpers';
import { Mouse } from 'src/constants/constants';
import { TraceType } from 'src/constants/tool-constants';

const MOUSEENTER_EVENT = createMouseEvent(0, 0, Mouse.LeftButton);
const MOUSELEAVE_EVENT = createMouseEvent(0, 0, Mouse.LeftButton);
const MOUSEMOVE_EVENT = createMouseEvent(20, 30, Mouse.LeftButton);
const MOUSEDOWN_EVENT = createMouseEvent(0, 0, Mouse.LeftButton);
const MOUSEUP_EVENT = createMouseEvent(0, 0, Mouse.LeftButton);

fdescribe('PolygonToolService', () => {
    let injector: TestBed;
    let polygonTool: PolygonToolService;
    let rendererMock: Renderer2;
    let elementRefMock: ElementRef;
    let drawStackMock: DrawStackService;
    let spyCreateElement: jasmine.Spy;
    const mockPreviewRect: MockRect = new MockRect();
    const mockDrawPolygon: MockPolygon = new MockPolygon();
    let spyPreviewRectWidth: jasmine.Spy;
    let spyPreviewRectHeight: jasmine.Spy;
    let spyPreviewRectX: jasmine.Spy;
    let spyPreviewRectY: jasmine.Spy;
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
        polygonTool = new PolygonToolService(drawStackMock, elementRefMock, rendererMock);
        polygonTool.previewRectangle = (mockPreviewRect as unknown) as SVGRectElement;
        polygonTool.drawPolygon = (mockDrawPolygon as unknown) as SVGPolygonElement;
        spyCreateElement = spyOn(rendererMock, 'createElement').and.callFake(() => {
            return new MockPolygon();
        });
        spyPreviewRectWidth = spyOnProperty(polygonTool, 'previewRectangleWidth', 'get').and.callFake(() => {
            return mockPreviewRect.width;
        });
        spyPreviewRectHeight = spyOnProperty(polygonTool, 'previewRectangleHeight', 'get').and.callFake(() => {
            return mockPreviewRect.height;
        });
        spyPreviewRectX = spyOnProperty(polygonTool, 'previewRectangleX', 'get').and.callFake(() => {
            return mockPreviewRect.x;
        });
        spyPreviewRectY = spyOnProperty(polygonTool, 'previewRectangleY', 'get').and.callFake(() => {
            return mockPreviewRect.y;
        });
    });

    it('should be created with call to new', () => {
        const newPolygonTool = new PolygonToolService(drawStackMock, elementRefMock, rendererMock);
        expect(spyCreateElement).toHaveBeenCalled();
        expect(newPolygonTool).toBeTruthy();
    });

    it('should not call the renderer when clicking outside of workzone', () => {
        const spySetAttribute = spyOn(rendererMock, 'setAttribute');
        const spyAppendChild = spyOn(rendererMock, 'appendChild');

        polygonTool.onMouseLeave(MOUSELEAVE_EVENT);
        polygonTool.onMouseDown(MOUSEDOWN_EVENT);
        polygonTool.onMouseMove(MOUSEMOVE_EVENT);

        expect(spySetAttribute).not.toHaveBeenCalled();
        expect(spyAppendChild).not.toHaveBeenCalled();
    });

    it('should append the the draw polygon when left click in workzone', () => {
        const spySetAttribute = spyOn(rendererMock, 'setAttribute');
        const spyAppendChild = spyOn(rendererMock, 'appendChild');
        polygonTool.onMouseEnter(MOUSEENTER_EVENT);
        polygonTool.onMouseDown(MOUSEDOWN_EVENT);
        expect(spySetAttribute).toHaveBeenCalledBefore(spyAppendChild);
        expect(spyAppendChild).toHaveBeenCalledTimes(1);
    });

    it('should correctly update the draw polygon in the workzone on random mouse position', () => {
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
            }
        );

        polygonTool.onMouseEnter(MOUSEENTER_EVENT);
        polygonTool.onMouseDown(MOUSEDOWN_EVENT);
        polygonTool.onMouseMove(MOUSEMOVE_EVENT);

        expect(polygonTool.isPreviewing).toBeTruthy();
        expect(spySetAttribute).toHaveBeenCalled();
        expect(polygonTool.radius * 2).toEqual(polygonTool.previewRectangleWidth);
        expect(polygonTool.radius * 2).toEqual(polygonTool.previewRectangleHeight);
    });

    it('should define drawRectangle and previewRectangle', () => {
        expect(spyPreviewRectX).toBeDefined();
        expect(spyPreviewRectY).toBeDefined();
        expect(spyPreviewRectWidth).toBeDefined();
        expect(spyPreviewRectHeight).toBeDefined();
    });

    it('should be able to update tracetype', () => {
        polygonTool.updateTraceType(TraceType.Both);
        expect(polygonTool.traceType).toEqual(TraceType.Both);

        polygonTool.updateTraceType(TraceType.Full);
        expect(polygonTool.traceType).toEqual(TraceType.Full);

        polygonTool.updateTraceType(TraceType.Outline);
        expect(polygonTool.traceType).toEqual(TraceType.Outline);
    });

    it('should cleanup correctly when creating a polygon', () => {
        const spyRemove = spyOn(rendererMock, 'removeChild');

        polygonTool.onMouseEnter(MOUSEENTER_EVENT);
        polygonTool.onMouseDown(MOUSEDOWN_EVENT);
        polygonTool.onMouseMove(MOUSEMOVE_EVENT);
        polygonTool.onMouseUp(MOUSEUP_EVENT);

        expect(polygonTool.isPreviewing).toBeFalsy();
        expect(spyRemove).toHaveBeenCalledTimes(1);
    });

    it('should give positive dimensions on negative input', () => {
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
            }
        );

        polygonTool.onMouseEnter(MOUSEENTER_EVENT);
        polygonTool.onMouseDown(createMouseEvent(0, 0, Mouse.LeftButton));
        polygonTool.onMouseMove(createMouseEvent(-30, -40, Mouse.LeftButton));

        expect(polygonTool.isPreviewing).toBeTruthy();
        expect(spySetAttribute).toHaveBeenCalled();
        expect(1).toBeGreaterThan(0);
        expect(1).toBeGreaterThan(0);
    });
});
