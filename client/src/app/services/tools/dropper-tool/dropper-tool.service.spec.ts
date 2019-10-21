import { TestBed, getTestBed } from '@angular/core/testing';

import { DropperToolService } from '../dropper-tool/dropper-tool.service';
import { Renderer2, ElementRef } from '@angular/core';
//import { createMouseEvent, createKeyBoardEvent } from 'src/classes/test-helpers';
//import { Keys } from 'src/constants/constants';
import { MatDialog } from '@angular/material';

fdescribe('DropperToolService', () => {
    //const mockDrawRect: MockRect = new MockRect();

    let injector: TestBed;
    let service: DropperToolService;
    // let positiveMouseEvent: MouseEvent;
    // let negativeMouseEvent: MouseEvent;
    // let onAltKeyDown: KeyboardEvent;
    // let onOtherKeyDown: KeyboardEvent;

    // let spyOnStampWidth: jasmine.Spy;
    // let spyOnStampHeight: jasmine.Spy;
    // let spyOnSetAttribute: jasmine.Spy;
    // let spyOnAppendChild: jasmine.Spy;
    // let spyOnRemoveChild: jasmine.Spy;
    let spyOnCreateElement: jasmine.Spy;
    // let spyOnGetContext: jasmine.Spy;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                DropperToolService,
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
                {
                    provide: HTMLCanvasElement,
                    useValue: {
                        getContext: () => null,
                    },
                },
            ],
        });

        injector = getTestBed();
        service = injector.get(DropperToolService);

        // positiveMouseEvent = createMouseEvent(10, 10, 0);
        //negativeMouseEvent = createMouseEvent(-10, -10, 0);

        // onAltKeyDown = createKeyBoardEvent(Keys.Alt);
        // onOtherKeyDown = createKeyBoardEvent(Keys.Shift);

        // spyOnSetAttribute = spyOn(service.renderer, 'setAttribute').and.returnValue();
        // spyOnAppendChild = spyOn(service.renderer, 'appendChild').and.returnValue();
        // spyOnRemoveChild = spyOn(service.renderer, 'removeChild').and.returnValue();
        spyOnCreateElement = spyOn(service.renderer, 'createElement').and.returnValue(HTMLCanvasElement);
        //spyOnGetContext = spyOn(service.canvas, 'getContext').and.returnValue(new CanvasRenderingContext2D());

        // HTMLCanvasElement.prototype.getContext = () => {
        //     // return whatever getContext has to return
        // };

        // spyOnStampWidth = spyOnProperty(service, 'stampWidth', 'get').and.callFake(() => {
        //     return mockDrawRect.width;
        // });
        // spyOnStampHeight = spyOnProperty(service, 'stampHeight', 'get').and.callFake(() => {
        //     return mockDrawRect.height;
        //});
    });

    it('should be created', () => {
        //const service: DropperToolService = TestBed.get(DropperToolService);
        expect(service).toBeTruthy();
        //expect(spyOnGetContext).toBeDefined();
        expect(spyOnCreateElement).toBeDefined();
    });
});
