import { TestBed, getTestBed } from '@angular/core/testing';

import { QuillToolService } from './quill-tool.service';
import { Renderer2, ElementRef, Type } from '@angular/core';
import { DrawStackService } from '../../draw-stack/draw-stack.service';
import { createMouseEvent } from 'src/classes/test-helpers.spec';
import { MOUSE } from 'src/constants/constants';
import { Coords2D } from 'src/classes/Coords2D';

describe('QuillToolService', () => {
    let injector: TestBed;
    let service: QuillToolService;
    let rendererMock: Renderer2;

    let MOCK_MOUSE_EVENT = createMouseEvent(10,10,MOUSE.LeftButton);

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                QuillToolService,
                {
                    provide: Renderer2,
                    useValue: {
                        createElement: () => null,
                        setAttribute: () => null,
                        appendChild: () => null,
                        removeChild: () => null,
                    },
                },
                {
                    provide: ElementRef,
                    useValue: {
                        nativeElement: {},
                    },
                },
                {
                    provide: DrawStackService,
                    useValue: {},
                },
            ],
        });
        injector = getTestBed();
        service = injector.get(QuillToolService);

        rendererMock = injector.get<Renderer2>(Renderer2 as Type<Renderer2>);
        const drawStackMock = injector.get<DrawStackService>(DrawStackService as Type<DrawStackService>);
        const elementRefMock = injector.get<ElementRef>(ElementRef as Type<ElementRef>);
        service.initializeService(elementRefMock, rendererMock, drawStackMock);
        
        service.currentMousePosition = new Coords2D(0,0);
        spyOn(service, 'getXPos').and.returnValue(0);
        spyOn(service, 'getYPos').and.returnValue(0);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('onMouseEnter should call appendPreview()', () => {
        const spy = spyOn(service, 'appendPreview').and.returnValue();

        service.onMouseEnter(MOCK_MOUSE_EVENT);

        expect(spy).toHaveBeenCalled();
    });

    it('onMouseLeave should call removePreview()', () => {
        const spy = spyOn(service, 'removePreview').and.returnValue();

        service.onMouseLeave(MOCK_MOUSE_EVENT);

        expect(spy).toHaveBeenCalled();
    });

    it('onMouseDown should not set isDrawing to true if RightMouseDown', () => {
        const mockRightMouseDown = createMouseEvent(0,0,MOUSE.RightButton);
        service.isDrawing = false;

        service.onMouseDown(mockRightMouseDown);

        expect(service.isDrawing).toBeFalsy();
    });

    it('onMouseDown should set isDrawing to true and call getColorAndOpacity if LeftMouseDown', () => {
        const spy = spyOn(service, 'getColorAndOpacity').and.returnValue();

        service.onMouseDown(MOCK_MOUSE_EVENT);

        expect(service.isDrawing).toBeTruthy();
        expect(spy).toHaveBeenCalled();
    });

    it('appendPreview should set previewEnabled to true and call renderer.createElement and appendChild', () => {
        const spyCreateElement = spyOn(service.renderer, 'createElement');
        const spySetAttribute = spyOn(service.renderer, 'setAttribute');
        service.previewEnabled = false;

        service.appendPreview();

        expect(spyCreateElement).toHaveBeenCalled();
        expect(spySetAttribute).toHaveBeenCalled();
        expect(service.previewEnabled).toBeTruthy();
    });

    it('removePreview should set previewEnabled to false and call renderer.Removechild', () => {
        const spy = spyOn(service.renderer, 'removeChild');
        service.previewEnabled = true;

        service.removePreview();

        expect(spy).toHaveBeenCalled();
        expect(service.previewEnabled).toBeFalsy();
    });

    it('updatePreview should call setAttribute 4 times', () => {
        const spy = spyOn(service.renderer, 'setAttribute');

        service.updatePreview();

        expect(spy).toHaveBeenCalledTimes(4);
    });

    it('onMouseMove should call updatePreview', () => {
        const spy = spyOn(service, 'updatePreview').and.returnValue();
        spyOn(service, 'tracePolygon').and.returnValue();
        

        service.onMouseMove(MOCK_MOUSE_EVENT);

        expect(spy).toHaveBeenCalled();
    });

    it('onMouseMove should not call tracePolygon if !isDrawing', () => {
        service.isDrawing = false;
        spyOn(service, 'updatePreview').and.returnValue();
        const spy = spyOn(service, 'tracePolygon');

        service.onMouseDown(MOCK_MOUSE_EVENT);

        expect(spy).not.toHaveBeenCalled();
    });

    it('onMouseMove should call tracePolygon if isDrawing', () => {
        service.isDrawing = true;
        const spy = spyOn(service, 'tracePolygon').and.returnValue();

        service.onMouseMove(MOCK_MOUSE_EVENT);

        expect(spy).toHaveBeenCalled();
    });

});
