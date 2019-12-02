import { getTestBed, TestBed } from '@angular/core/testing';

import { ElementRef, Renderer2, Type } from '@angular/core';
import { createMouseEvent, MockPolygon, MockRect } from 'src/classes/test-helpers.spec';
import { MOUSE } from 'src/constants/constants';
import { TRACE_TYPE } from 'src/constants/tool-constants';
import { DrawStackService } from '../../draw-stack/draw-stack.service';
import { PolygonToolService } from './polygon-tool.service';

const MOUSEENTER_EVENT = createMouseEvent(0, 0, MOUSE.LeftButton);
const MOUSELEAVE_EVENT = createMouseEvent(0, 0, MOUSE.LeftButton);
const MOUSEMOVE_EVENT = createMouseEvent(20, 30, MOUSE.LeftButton);
const MOUSEDOWN_EVENT = createMouseEvent(0, 0, MOUSE.LeftButton);
const MOUSEUP_EVENT = createMouseEvent(0, 0, MOUSE.LeftButton);

describe('PolygonToolService', () => {
    let injector: TestBed;
    let polygonTool: PolygonToolService;
    let rendererMock: Renderer2;
    let elementRefMock: ElementRef;
    let drawStackMock: DrawStackService;
    const mockPreviewRect: MockRect = new MockRect();
    const mockDrawPolygon: MockPolygon = new MockPolygon();
    let spyPreviewRectWidth: jasmine.Spy;
    let spyPreviewRectHeight: jasmine.Spy;
    let spyPreviewRectX: jasmine.Spy;
    let spyPreviewRectY: jasmine.Spy;
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                PolygonToolService,
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
                    provide: DrawStackService,
                    useValue: {
                        push: () => null,
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
        polygonTool = injector.get(PolygonToolService);
        polygonTool.initializeService(elementRefMock, rendererMock, drawStackMock);
        polygonTool.previewRectangle = (mockPreviewRect as unknown) as SVGRectElement;
        polygonTool.drawPolygon = (mockDrawPolygon as unknown) as SVGPolygonElement;

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

    it('should make an invalid polygon by setting null attributes when calling makeInvalidPolygon', () => {
        const spySetAttribute = spyOn(rendererMock, 'setAttribute');

        polygonTool.makeInvalidPolygon();

        expect(spySetAttribute).toHaveBeenCalled();
    });

    it('should calculate the good vertex points', () => {
        interface Vertex {
            x: number;
            y: number;
        }
        polygonTool.radius = 5;
        polygonTool.currentMouseCoords.x = 10;
        polygonTool.currentMouseCoords.y = 10;

        let vertex: Vertex;
        vertex = polygonTool.calculateVertex(5);
        expect(vertex.x).toEqual(0.6698729810778055);
        expect(vertex.y).toEqual(7.499999999999999);
    });

    it('should not call the renderer when clicking outside of workzone', () => {
        spyOn(polygonTool, 'isMouseInRef').and.callFake(() => false);
        const spySetAttribute = spyOn(rendererMock, 'setAttribute');
        const spyAppendChild = spyOn(rendererMock, 'appendChild');

        polygonTool.onMouseLeave(MOUSELEAVE_EVENT);
        polygonTool.onMouseDown(MOUSEDOWN_EVENT);
        polygonTool.onMouseMove(MOUSEMOVE_EVENT);

        expect(spySetAttribute).not.toHaveBeenCalled();
        expect(spyAppendChild).not.toHaveBeenCalled();
    });

    it('should appendChild when createSVG is called', () => {
        const spyAppendChild = spyOn(rendererMock, 'appendChild');

        polygonTool.createSVG();

        expect(spyAppendChild).toHaveBeenCalled();
    });

    it('should append the the draw polygon when left click in workzone', () => {
        const spySetAttribute = spyOn(rendererMock, 'setAttribute');
        const spyAppendChild = spyOn(rendererMock, 'appendChild');
        spyOn(polygonTool, 'isMouseInRef').and.callFake(() => true);
        polygonTool.onMouseEnter(MOUSEENTER_EVENT);
        polygonTool.onMouseDown(MOUSEDOWN_EVENT);
        expect(spySetAttribute).toHaveBeenCalledBefore(spyAppendChild);
        expect(spyAppendChild).toHaveBeenCalledTimes(1);
    });

    it('should correctly update the draw polygon in the workzone on random mouse position even if userfillColor is none', () => {
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
                    case 'points':
                        el.points = String(value);
                        break;
                    default:
                        break;
                }
            },
        );
        spyOn(polygonTool, 'isMouseInRef').and.callFake(() => true);
        polygonTool.userFillColor = 'none';
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
        polygonTool.updateTraceType(TRACE_TYPE.Both);
        expect(polygonTool.traceType).toEqual(TRACE_TYPE.Both);

        polygonTool.updateTraceType(TRACE_TYPE.Full);
        expect(polygonTool.traceType).toEqual(TRACE_TYPE.Full);

        polygonTool.updateTraceType(TRACE_TYPE.Outline);
        expect(polygonTool.traceType).toEqual(TRACE_TYPE.Outline);
    });

    it('should cleanup correctly when creating a polygon', () => {
        spyOn(polygonTool, 'isMouseInRef').and.callFake(() => true);
        const spyRemove = spyOn(rendererMock, 'removeChild');
        const spyAppendChild = spyOn(rendererMock, 'appendChild');
        polygonTool.onMouseEnter(MOUSEENTER_EVENT);
        polygonTool.onMouseDown(MOUSEDOWN_EVENT);
        polygonTool.onMouseMove(MOUSEMOVE_EVENT);
        polygonTool.onMouseUp(MOUSEUP_EVENT);

        expect(polygonTool.isPreviewing).toBeFalsy();
        expect(spyRemove).toHaveBeenCalled();
        expect(spyAppendChild).toHaveBeenCalled();
    });

    it('should give positive dimensions on negative input', () => {
        spyOn(polygonTool, 'isMouseInRef').and.callFake(() => true);
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
        polygonTool.onMouseEnter(MOUSEENTER_EVENT);
        polygonTool.onMouseDown(createMouseEvent(0, 0, MOUSE.LeftButton));
        polygonTool.onMouseMove(createMouseEvent(-30, -40, MOUSE.LeftButton));

        expect(polygonTool.isPreviewing).toBeTruthy();
        expect(spySetAttribute).toHaveBeenCalled();
        expect(polygonTool.previewRectangleHeight).toBeGreaterThan(0);
        expect(polygonTool.previewRectangleWidth).toBeGreaterThan(0);
    });
});
