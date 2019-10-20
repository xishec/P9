import { TestBed, getTestBed } from '@angular/core/testing';

import { EllipsisToolService } from './ellipsis-tool.service';
import { ElementRef, Renderer2 } from '@angular/core';
import { MatDialog } from '@angular/material';

fdescribe('EllipsisToolService', () => {
    let injector: TestBed;
    let service: EllipsisToolService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                EllipsisToolService,
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
        service = injector.get(EllipsisToolService);


        // onAltKeyDown = createKeyBoardEvent(Keys.Alt);

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
