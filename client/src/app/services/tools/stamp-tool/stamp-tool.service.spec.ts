import { TestBed, getTestBed } from '@angular/core/testing';

import { StampToolService } from './stamp-tool.service';
import { MatDialog } from '@angular/material';
import { Renderer2, ElementRef } from '@angular/core';

fdescribe('StampToolService', () => {
    let injector: TestBed;
    let service: StampToolService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                StampToolService,
                {
                    provide: MatDialog,
                    useValue: {},
                },
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
            ],
        });

        injector = getTestBed();
        service = injector.get(StampToolService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
