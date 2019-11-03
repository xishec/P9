import { ElementRef, Renderer2, Type } from '@angular/core';
import { getTestBed, TestBed } from '@angular/core/testing';

import * as TestHelpers from 'src/classes/test-helpers.spec';
import { provideAutoMock } from 'src/classes/test.helper.msTeams.spec';
import { Keys, Mouse, /*SIDEBAR_WIDTH*/ } from 'src/constants/constants';
import { DrawStackService } from '../../draw-stack/draw-stack.service';
import { SelectionToolService } from './selection-tool.service';
import { Selection } from '../../../../classes/selection/selection';

describe('SelectionToolService', () => {
    const MOCK_LEFT_CLICK = TestHelpers.createMouseEvent(0, 0, Mouse.LeftButton);
    const MOCK_RIGHT_CLICK = TestHelpers.createMouseEvent(0, 0, Mouse.RightButton);

    let injector: TestBed;
    let service: SelectionToolService;

    let rendererMock: Renderer2;
    let drawStackMock: DrawStackService;
    let elementRefMock: ElementRef<SVGElement>;

    let spyOnSetAttribute: jasmine.Spy;
    let spyOnAppendChild: jasmine.Spy;
    let spyOnRemoveChild: jasmine.Spy;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                SelectionToolService,
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
                provideAutoMock(Selection),
            ],
        });

        injector = getTestBed();
        service = injector.get(SelectionToolService);
        rendererMock = injector.get<Renderer2>(Renderer2 as Type<Renderer2>);
        drawStackMock = injector.get<DrawStackService>(DrawStackService as Type<DrawStackService>);
        elementRefMock = injector.get<ElementRef>(ElementRef as Type<ElementRef>);
        service.initializeService(elementRefMock, rendererMock, drawStackMock);

        spyOnSetAttribute = spyOn(service.renderer, 'setAttribute').and.returnValue();
        spyOnAppendChild = spyOn(service.renderer, 'appendChild').and.returnValue();
        spyOnRemoveChild = spyOn(service.renderer, 'removeChild').and.returnValue();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should initialize the selectionRectangle and Selection on creation',() => {
        service.initializeService(elementRefMock, rendererMock, drawStackMock);
        expect(spyOnSetAttribute).toHaveBeenCalled();
        expect(service.selection).toBeTruthy();
    });

    it('should call cleanUp of Selection and set isTheCurrentTool to false', () => {
        const spyOnSelectionCleanUp: jasmine.Spy = spyOn(service.selection, 'cleanUp');
        service.isTheCurrentTool = true;

        service.cleanUp();

        expect(spyOnSelectionCleanUp).toHaveBeenCalled();
        expect(service.isTheCurrentTool).toBeFalsy();
    });

    it('should update the selection rectangle for a negative X/Y difference', () => {
        service.currentMouseCoords.x = 10;
        service.initialMouseCoords.x = 5;
        service.currentMouseCoords.y = 10;
        service.initialMouseCoords.y = 5;

        service.updateSelectionRectangle();

        expect(spyOnSetAttribute).toHaveBeenCalled();
    });

    it('should update the selection rectangle for a positive X/Y difference', () => {
        service.currentMouseCoords.x = 5;
        service.initialMouseCoords.x = 10;
        service.currentMouseCoords.y = 5;
        service.initialMouseCoords.y = 10;

        service.updateSelectionRectangle();

        expect(spyOnSetAttribute).toHaveBeenCalled();
    });

    it('should call setAttribute 8 times when calling updateSelectionRectangle', () => {
        service.updateSelectionRectangle();

        expect(spyOnSetAttribute).toHaveBeenCalledTimes(8);
    });

    it('getStrokeWidth should return 0 if el has no stroke-width', () => {
        const el = TestHelpers.createMockSVGGElementWithAttribute('');

        const resNumber = service.getStrokeWidth(el);

        expect(resNumber).toBe(0);
    });

    it('getStrokeWidth should return 10 if el has stroke-width', () => {
        const el = TestHelpers.createMockSVGGElementWithAttribute('stroke-width');

        const resNumber = service.getStrokeWidth(el);

        expect(resNumber).toBe(10);
    });

    it('should append selectionRectangle, update it once and set isSelecting to true when calling startSelection', () => {
        const spy = spyOn(service, 'updateSelectionRectangle');

        service.startSelection();

        expect(spy).toHaveBeenCalled();
        expect(service.isSelecting).toBeTruthy();
        expect(spyOnAppendChild).toHaveBeenCalled();
    });

    it('isInSelection should return true if elBottom >= boxTop && boxBottom >= elTop && elRight >= boxLeft && boxRight >= elLeft', () => {
        const mockSelectionBox = {
            x: 500,
            y: 500,
            width: 50,
            height: 50,
        } as DOMRect;

        const mockElementBox = {
            x: 500,
            y: 500,
            width: 50,
            height: 50,
        } as DOMRect;

        const res = service.isInSelection(mockSelectionBox, mockElementBox);

        expect(res).toBeTruthy();
    });

    it('isInSelection should return false if elBottom < boxTop ', () => {
        const mockSelectionBox = {
            x: 500,
            y: 10,
            width: 50,
            height: 50,
        } as DOMRect;

        const mockElementBox = {
            x: 500,
            y: 500,
            width: 50,
            height: 50,
        } as DOMRect;

        const res = service.isInSelection(mockSelectionBox, mockElementBox);

        expect(res).toBeFalsy();
    });

    it('singlySelect should empty the selection, add the target to the selection and set isOnTarget to false', () => {
        const spyEmptySelection = spyOn(service.selection, 'emptySelection');
        const spyAddToSelection = spyOn(service.selection, 'addToSelection');

        service.singlySelect(1);

        expect(spyEmptySelection).toHaveBeenCalled();
        expect(spyAddToSelection).toHaveBeenCalled();
        expect(service.isOnTarget).toBeFalsy();
    });

    it('singlyInvert should call invertAddToSelection from Selection and set isOnTarget to false', () => {
        const spyInvertAddToSelection = spyOn(service.selection, 'invertAddToSelection');

        service.singlySelectInvert(1);

        expect(spyInvertAddToSelection).toHaveBeenCalled();
        expect(service.isOnTarget).toBeFalsy();
    });

    it('startSelection should set isSelecting to true', () => {
        service.isSelecting = false;

        service.startSelection();

        expect(service.isSelecting).toBeTruthy();
    });

    it('handleLeftMouseDrag should call checkSelection if mouse is not in selection or not translating and is not on target', () => {
        service.isOnTarget = false;
        const spy = spyOn(service, 'checkSelection');
        const spyselection = spyOn(service.selection, 'mouseIsInSelectionBox').and.callFake(()=>{return false;});

        service.handleLeftMouseDrag();

        expect(spy).toHaveBeenCalled();
        expect(spyselection).toHaveBeenCalled();
    });

    it('handleLeftMouseDrag should call moveBy of Selection if mouse is in selection and not selecting or was already translating', () => {
        service.isOnTarget = false;
        service.isSelecting = false;
        service.isTranslatingSelection = true;
        const spy = spyOn(service.selection, 'moveBy');
        const spyselection = spyOn(service.selection, 'mouseIsInSelectionBox').and.callFake(()=>{return true;});

        service.handleLeftMouseDrag();

        expect(spy).toHaveBeenCalled();
        expect(spyselection).toHaveBeenCalled();
    });

    it('handleLeftMouseDrag should call singlySelect if on target and target not in Selection', () => {
        service.isOnTarget = true;
        const spy = spyOn(service, 'singlySelect');
        const spySelection = spyOn(service.selection.selectedElements, 'has').and.callFake(()=>{return false;});

        service.handleLeftMouseDrag();

        expect(spy).toHaveBeenCalled();
        expect(spySelection).toHaveBeenCalled();
    });

    it('handleRightMouseDrag should call checkSelectionInverse if this.isSelecting', () => {
        const spy = spyOn(service, 'checkSelectionInverse');
        service.isSelecting = true;

        service.handleRightMouseDrag();

        expect(spy).toHaveBeenCalled();
    });

    it('onMouseMove should call handleLeftMouseDrag if isLeftMouseDown', () => {
        const spy = spyOn(service, 'handleLeftMouseDrag');
        service.isLeftMouseDown = true;
        service.isRightMouseDown = false;

        service.onMouseMove(MOCK_LEFT_CLICK);

        expect(spy).toHaveBeenCalled();
    });

    it('onMouseMove should call handleRightMouseDrag if isRightMouseDown', () => {
        const spy = spyOn(service, 'handleRightMouseDrag');
        service.isRightMouseDown = true;
        service.isLeftMouseDown = false;

        service.onMouseMove(MOCK_RIGHT_CLICK);

        expect(spy).toHaveBeenCalled();
    });

    it('handleRightMouseDown should clear the invert selection buffer of Selection', () => {
        const spy = spyOn(service.selection.invertSelectionBuffer, 'clear');

        service.handleRightMouseDown();

        expect(spy).toHaveBeenCalled();
    });

    it('onMouseDown should call handleLeftMouseDown if mouseEvent is left button', () => {
        const spy = spyOn(service, 'handleLeftMouseDown');

        service.onMouseDown(MOCK_LEFT_CLICK);

        expect(spy).toHaveBeenCalled();
    });

    it('onMouseDown should call handleRightMouseDown if mouseEvent is right button', () => {
        const spy = spyOn(service, 'handleRightMouseDown');

        service.onMouseDown(MOCK_RIGHT_CLICK);

        expect(spy).toHaveBeenCalled();
    });

    it('should remove the selection rectangle when handling a right mouse up', () => {
        service.handleRightMouseUp();

        expect(spyOnRemoveChild).toHaveBeenCalled();
    });

    it('should isSelecting to false when handling a right mouse up and isSelecting was true', () => {
        service.handleRightMouseUp();

        expect(service.isSelecting).toBeFalsy();
    });

    it('should singly invert select and set isOnTarget to false when handling a right mouse up, isOnTarget was true and isSelecting was false', () => {
        const spy = spyOn(service, 'singlySelectInvert');
        service.isSelecting = false;
        service.isOnTarget = true;

        service.handleRightMouseUp();

        expect(spy).toHaveBeenCalled();
        expect(service.isOnTarget).toBeFalsy();
    });

    it('should remove the selection rectangle when handling a left mouse up', () => {
        service.handleLeftMouseUp();

        expect(spyOnRemoveChild).toHaveBeenCalled();
    });

    it('onMouseUp should call handleLeftMouseUp if event.button is Left Button', () => {
        const spy = spyOn(service, 'handleLeftMouseUp');

        service.onMouseUp(MOCK_LEFT_CLICK);

        expect(spy).toHaveBeenCalled();
    });

    it('onMouseUp should call handleRightMouseUp if event.button is Right Button', () => {
        const spy = spyOn(service, 'handleRightMouseUp');

        service.onMouseUp(MOCK_RIGHT_CLICK);

        expect(spy).toHaveBeenCalled();
    });

    it('onMouseEnter should set isTheCurrentTool true', () => {
        service.isTheCurrentTool = false;

        service.onMouseEnter(MOCK_LEFT_CLICK);

        expect(service.isTheCurrentTool).toBeTruthy();
    });

    it('onMouseLeave should set isTheCurrentTool true', () => {
        service.isTheCurrentTool = false;

        service.onMouseLeave(MOCK_LEFT_CLICK);

        expect(service.isTheCurrentTool).toBeTruthy();
    });

    it('onKeyUp should set isTheCurrentTool to true if key is s', () => {
        service.isTheCurrentTool = false;

        const mockKeyS = {
            key: Keys.s,
        } as KeyboardEvent;

        service.onKeyUp(mockKeyS);

        expect(service.isTheCurrentTool).toBeTruthy();
    });
});
