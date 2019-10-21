import { MatDialog } from '@angular/material';
import { Renderer2, ElementRef } from '@angular/core';
import { TestBed, getTestBed } from '@angular/core/testing';

import { SelectionToolService } from './selection-tool.service';
import { createMockSVGGElementWithAttribute } from 'src/classes/test-helpers';
//import { MockRect } from 'src/classes/test-helpers';

fdescribe('SelectionToolService', () => {
    //const mockDrawRect: MockRect = new MockRect();

    let injector: TestBed;
    let service: SelectionToolService;
    // let positiveMouseEvent: MouseEvent;
    // let negativeMouseEvent: MouseEvent;
    // let onAltKeyDown: KeyboardEvent;
    // let onOtherKeyDown: KeyboardEvent;

    let spyOnSetAttribute: jasmine.Spy;
    // let spyOnAppendChild: jasmine.Spy;
    // let spyOnRemoveChild: jasmine.Spy;
    // let spyOnDrawStackPush: jasmine.Spy;
    // let spyOnPreventDefault: jasmine.Spy;

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

        // positiveMouseEvent = createMouseEvent(10, 10, 0);
        // negativeMouseEvent = createMouseEvent(-10, -10, 0);

        // onAltKeyDown = createKeyBoardEvent(Keys.Alt);
        // onOtherKeyDown = createKeyBoardEvent(Keys.Shift);

        spyOnSetAttribute = spyOn(service.renderer, 'setAttribute').and.returnValue();
        // spyOnAppendChild = spyOn(service.renderer, 'appendChild').and.returnValue();
        // spyOnRemoveChild = spyOn(service.renderer, 'removeChild').and.returnValue();
        // spyOnDrawStackPush = spyOn(service.drawStack, 'push').and.returnValue();
        // spyOnPreventDefault = spyOn(onAltKeyDown, 'preventDefault').and.returnValue();

        // spyOnStampWidth = spyOnProperty(service, 'stampWidth', 'get').and.callFake(() => {
        //     return mockDrawRect.width;
        // });
        // spyOnStampHeight = spyOnProperty(service, 'stampHeight', 'get').and.callFake(() => {
        //     return mockDrawRect.height;
        // });
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should call the function removeFullSelectionBox and set isTheCurrentTool to false', () => {
        let spyOnRemoveFullSelectionBox: jasmine.Spy = spyOn(service, 'removeFullSelectionBox');
        service.isTheCurrentTool = true;

        service.cleanUp();

        expect(spyOnRemoveFullSelectionBox).toHaveBeenCalled();
        expect(service.isTheCurrentTool).toBeFalsy();
    });

    it('should call renderer.setAttribute for each control point', () => {
        const nbPoints = 8;
        const nbCallPerPoint = 3;
        
        service.initControlPoints();

        expect(spyOnSetAttribute).toHaveBeenCalledTimes(nbPoints*nbCallPerPoint);
    });

    it('should call renderer.setAttribute to set the attributes of selection box', () => {
        service.initSelectionBox();

        expect(spyOnSetAttribute).toHaveBeenCalled();
    });

    it('should call renderer.setAttribute to set the attributes of selectionRectangle even if deltaX/Y is negative', () => {
        service.currentMouseX = 5;
        service.initialMouseX = 10;
        service.currentMouseY = 5;
        service.initialMouseY = 10;

        service.updateSelectionRectangle();

        expect(spyOnSetAttribute).toHaveBeenCalled();
    });

    it('should call renderer.setAttribute to set the attributes of selectionRectangle when deltaX/Y is positive', () => {
        service.currentMouseX = 10;
        service.initialMouseX = 5;
        service.currentMouseY = 10;
        service.initialMouseY = 5;

        service.updateSelectionRectangle();

        expect(spyOnSetAttribute).toHaveBeenCalled();
    });

    it('getStrokeWidth should return 0 if el has no stroke-width', () => {
        const el = createMockSVGGElementWithAttribute(''    );
        
        const resNumber = service.getStrokeWidth(el);

        expect(resNumber).toBe(0);
    });

    it('getStrokeWidth should return 10 if el has stroke-width', () => {
        const el = createMockSVGGElementWithAttribute('stroke-width');

        const resNumber = service.getStrokeWidth(el);

        expect(resNumber).toBe(10);
    });

    it('mouseIsInSelectionBox should return true if mouse is in SelectionBonx', () => {
        //
    });

    it('', () => {

    });

    it('', () => {

    });

    it('', () => {

    });

    it('', () => {

    });

    it('', () => {

    });

    it('', () => {

    });

    it('', () => {

    });

    it('', () => {

    });

    it('', () => {

    });

    it('', () => {

    });

    it('', () => {

    });
});
