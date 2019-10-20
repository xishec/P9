import { MatDialog } from '@angular/material';
import { Renderer2, ElementRef } from '@angular/core';
import { TestBed, getTestBed } from '@angular/core/testing';

import { SelectionToolService } from './selection-tool.service';

fdescribe('SelectionToolService', () => {
    let injector: TestBed;
    let service: SelectionToolService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                SelectionToolService,
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
        service = injector.get(SelectionToolService);


    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
