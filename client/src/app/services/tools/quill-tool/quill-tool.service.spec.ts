import { TestBed, getTestBed } from '@angular/core/testing';

import { QuillToolService } from './quill-tool.service';
import { Renderer2, ElementRef } from '@angular/core';
import { DrawStackService } from '../../draw-stack/draw-stack.service';

fdescribe('QuillToolService', () => {
    let injector: TestBed;
    let service: QuillToolService;

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
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    
});
