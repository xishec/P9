import { TestBed, getTestBed } from '@angular/core/testing';

import { QuillToolService } from './quill-tool.service';
import { Renderer2, ElementRef, Type } from '@angular/core';
import { DrawStackService } from '../../draw-stack/draw-stack.service';

fdescribe('QuillToolService', () => {
    let injector: TestBed;
    let service: QuillToolService;
    let rendererMock: Renderer2;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                QuillToolService,
                {
                    provide: Renderer2,
                    useValue: {
                        createElement: () => null,
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
});
