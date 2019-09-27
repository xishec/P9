import { Renderer2, ElementRef } from '@angular/core';
import { getTestBed, TestBed } from '@angular/core/testing';

import { TracingToolService } from './tracing-tool.service';

fdescribe('TracingToolService', () => {
    let injector: TestBed;
    let service: TracingToolService;
    let mockMouseEvent: MouseEvent;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [TracingToolService,
            {
                provide: Renderer2,
                useValue: {
                    createElement: () => 0,
                },
            }, {
                provide: ElementRef,
                useValue: {
                    nativeElement: 'allo',
                },
            }],
        });

        injector = getTestBed();
        service = injector.get(TracingToolService);

        Object.defineProperty(mockMouseEvent, 'offsetX')
        mockMouseEvent.offsetX = 0;
        mockMouseEvent.offsetY = 0;
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('onMouseDown isDrawing should be true', () => {
        service.onMouseDown()
    })
});
