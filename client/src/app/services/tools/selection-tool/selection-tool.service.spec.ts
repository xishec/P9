import { MatDialog } from '@angular/material';
import { Renderer2, ElementRef } from '@angular/core';
import { TestBed, getTestBed } from '@angular/core/testing';

import { SelectionToolService } from './selection-tool.service';
import { createMockSVGGElementWithAttribute, createMouseEvent } from 'src/classes/test-helpers';
import { Mouse } from 'src/constants/constants';
//import { MockRect } from 'src/classes/test-helpers';

fdescribe('SelectionToolService', () => {
    //const mockDrawRect: MockRect = new MockRect();
    const MOCK_LEFT_CLICK = createMouseEvent(0,0,Mouse.LeftButton);
    const MOCK_RIGHT_CLICK = createMouseEvent(0,0,Mouse.RightButton);

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

        let mockDOMRect = {
            x: 500,
            y: 500,
            width: 50,
            height: 50,
        };

        spyOn(service, 'getDOMRect').and.returnValue(mockDOMRect as DOMRect);
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

    it('getStrokeWidth should return 0 if el has no stroke-width', () => {
        const el = createMockSVGGElementWithAttribute('');

        const resNumber = service.getStrokeWidth(el);

        expect(resNumber).toBe(0);
    });

    it('mousIsInSelectionBox should return true if mouseX is in selection box', () => {
        service.currentMouseX = 160;
        service.currentMouseY = 520;

        let res = service.mouseIsInSelectionBox();

        expect(res).toBeTruthy();
    });

    it('mousIsInSelectionBox should return false if mouseX not in selection box', () => {
        service.currentMouseX = 1600;
        service.currentMouseY = 5200;

        let res = service.mouseIsInSelectionBox();

        expect(res).toBeFalsy();
    });

    it('mouseIsInControlPoint should return true if mouseX and mouseY in one of controlPoint', () => {
        
    });

    it('', () => {
        
    });

    it('', () => {
        
    });

    // HANDLERS AND MOUSE EVENTS

    it('handleLeftMouseDrag should call checkSelection if this.isSelecting', () => {
        service.isSelecting = true;
        const spy = spyOn(service, 'checkSelection');

        service.handleLeftMouseDrag();

        expect(spy).toHaveBeenCalled();
    });

    it('handleLeftMouseDrag should call translateSelection if !this.isSelecting and !mouseInControlPoint', () => {
        service.isSelecting = false;
        spyOn(service, 'mouseIsInControlPoint').and.returnValue(false);
        const spy = spyOn(service, 'translateSelection');
        
        service.handleLeftMouseDrag();

        expect(spy).toHaveBeenCalled();
    });

    it('handleRightMouseDrag should call checkSelection if this.isSelecting', () => {
        const spy = spyOn(service, 'checkSelection');
        service.isSelecting = true;

        service.checkSelection();

        expect(spy).toHaveBeenCalled();
    });

    it('onMouseMove should call handleLeftMouseDrag if isLeftMouseDown', () => {
        const spy = spyOn(service, 'handleLeftMouseDrag');
        service.isLeftMouseDown = true;

        service.onMouseMove(MOCK_LEFT_CLICK);

        expect(spy).toHaveBeenCalled();
    });

    it('onMouseMove should call handleRightMouseDrag if isRightMouseDown', () => {
        const spy = spyOn(service, 'handleRightMouseDrag');
        service.isRightMouseDown = true;

        service.onMouseMove(MOCK_RIGHT_CLICK);

        expect(spy).toHaveBeenCalled();
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
