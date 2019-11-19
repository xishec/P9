import { TestBed, getTestBed } from '@angular/core/testing';

import { QuillToolService } from './quill-tool.service';
import { Renderer2, ElementRef, Type } from '@angular/core';
import { DrawStackService } from '../../draw-stack/draw-stack.service';
import { createMouseEvent } from 'src/classes/test-helpers.spec';
import { MOUSE } from 'src/constants/constants';

fdescribe('QuillToolService', () => {
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
        spyOn(service, 'getXPos').and.returnValue(0);
        spyOn(service, 'getYPos').and.returnValue(0);
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
});
