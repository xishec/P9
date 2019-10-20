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

    it('should define drawRectangle and previewRectangle', () => {
        expect(spyPreviewRectX).toBeDefined();
        expect(spyPreviewRectY).toBeDefined();
  });
});
