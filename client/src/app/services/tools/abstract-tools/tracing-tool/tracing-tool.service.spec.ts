import { ElementRef, Renderer2, Type } from '@angular/core';
import { getTestBed, TestBed } from '@angular/core/testing';

import { Mouse } from 'src/constants/constants';
import { createMouseEvent, MockElementRef } from '../test-helpers';
import { TracingToolService } from './tracing-tool.service';

fdescribe('TracingToolService', () => {
    let injector: TestBed;
    let service: TracingToolService;
    const mockMouseLeftButton = createMouseEvent(10, 10, Mouse.LeftButton);
    let renderer: Renderer2;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [TracingToolService,
            {
                provide: Renderer2,
                useValue: {
                    createElement: () => null,
                    setAttribute: () => null,
                    appendChild: () => null,
                },
            }, {
                provide: ElementRef,
                useClass: MockElementRef,
            }],
        });

        injector = getTestBed();
        service = injector.get(TracingToolService);
        renderer = injector.get<Renderer2>(Renderer2 as Type<Renderer2>);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('when MouseEvent is left button currentPath contains M and mouse position', () => {
        spyOn(service, 'createSVGWrapper').and.returnValue();
        //spyOn(service, 'createSVGCircle').and.callFake();
    })

    it('when createSVGWrapper renderer.creteElement should be called before renderer.setAttribute', () => {
        const createElementSpy = spyOn(renderer, 'createElement').and.callThrough();
        const setAttributeSpy = spyOn(renderer, 'setAttribute').and.callThrough();
        service.createSVGWrapper();
        expect(createElementSpy).toHaveBeenCalledBefore(setAttributeSpy);
    });

    it('when onMouseDown if LeftButton createSVGWrapper is called', () => {
        const createSVGWrapperSpy = spyOn(service, 'createSVGWrapper').and.returnValue();
        service.onMouseDown(mockMouseLeftButton);
        expect(createSVGWrapperSpy).toHaveBeenCalled();
    })

});
