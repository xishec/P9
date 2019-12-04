import { ElementRef, Renderer2, Type } from '@angular/core';
import { getTestBed, TestBed } from '@angular/core/testing';

import { MatSnackBar } from '@angular/material';
import * as TestHelpers from 'src/classes/test-helpers.spec';
import { provideAutoMock } from 'src/classes/test.helper.msTeams.spec';
import { KEYS, MOUSE } from 'src/constants/constants';
import { CURSOR_STYLES, ROTATION_ANGLE } from 'src/constants/tool-constants';
import { Selection } from '../../../../classes/selection/selection';
import { ClipboardService } from '../../clipboard/clipboard.service';
import { DrawStackService } from '../../draw-stack/draw-stack.service';
import { ManipulatorService } from '../../manipulator/manipulator.service';
import { MagnetismToolService } from '../magnetism-tool/magnetism-tool.service';
import { SelectionToolService } from './selection-tool.service';

describe('SelectionToolService', () => {
    const MOCK_LEFT_CLICK = TestHelpers.createMouseEvent(0, 0, MOUSE.LeftButton);
    const MOCK_RIGHT_CLICK = TestHelpers.createMouseEvent(0, 0, MOUSE.RightButton);

    let injector: TestBed;
    let service: SelectionToolService;

    let rendererMock: Renderer2;
    let drawStackMock: DrawStackService;
    let elementRefMock: ElementRef<SVGElement>;

    let spyOnSetAttribute: jasmine.Spy;
    let spyOnAppendChild: jasmine.Spy;
    let spyOnRemoveChild: jasmine.Spy;
    let spyOnCreateElement: jasmine.Spy;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                SelectionToolService,
                ClipboardService,
                ManipulatorService,
                MagnetismToolService,
                {
                    provide: DrawStackService,
                    useValue: {
                        currentStackTarget: {
                            subscribe: () => null,
                        },
                        drawStack: new Array<SVGGElement>(),
                        getDrawStackLength: () => null,
                    },
                },
                {
                    provide: Renderer2,
                    useValue: {
                        createElement: () => null,
                        setAttribute: () => null,
                        appendChild: () => null,
                        removeChild: () => null,
                        listen: () => null,
                        setStyle: () => null,
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
                {
                    provide: MatSnackBar,
                    useValue: {},
                },
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
        spyOnCreateElement = spyOn(service.renderer, 'createElement').and.callFake(() => null);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should select all drawStack, update origins and restart duplication when calling selectAll', () => {
        const spyOnAddToSelection = spyOn(service.selection, 'addToSelection');
        const spyOnUpdateOrigins = spyOn(service[`manipulator`], 'updateOrigins').and.callFake(() => null);
        const spyOnRestartDuplication = spyOn(service[`clipBoard`], 'restartDuplication').and.callFake(() => null);
        const spyOnStyle = spyOn<any>(service, 'updateCursorStyleOnSelectionBox').and.callFake(() => null);
        spyOn(service.drawStack, 'getDrawStackLength').and.callFake(() => service.drawStack.drawStack.length);

        service.drawStack.drawStack.push(TestHelpers.createMockSVGGElement());
        service.drawStack.drawStack.push(TestHelpers.createMockSVGGElement());
        service.drawStack.drawStack.push(TestHelpers.createMockSVGGElement());
        service.selectAll();

        expect(spyOnAddToSelection).toHaveBeenCalledTimes(service.drawStack.getDrawStackLength());
        expect(spyOnUpdateOrigins).toHaveBeenCalled();
        expect(spyOnRestartDuplication).toHaveBeenCalled();
        expect(spyOnStyle).toHaveBeenCalled();
    });

    it('should initialize the selectionRectangle and Selection on creation', () => {
        const spyClipboard = spyOn(service[`clipBoard`], 'initializeService');
        const spyManipulator = spyOn(service[`manipulator`], 'initializeService');
        const spySubscribe = spyOn(service.drawStack.currentStackTarget, 'subscribe');
        service.initializeService(elementRefMock, rendererMock, drawStackMock);
        expect(spyOnSetAttribute).toHaveBeenCalled();
        expect(spyOnCreateElement).toHaveBeenCalled();
        expect(spyClipboard).toHaveBeenCalled();
        expect(spyManipulator).toHaveBeenCalled();
        expect(spySubscribe).toHaveBeenCalled();
        expect(service.selection).toBeTruthy();
    });

    it('should set all behavioral booleans to false and remove the selection rectangle on cleanUp', () => {
        service[`isSelecting`] = true;
        service[`isLeftMouseDown`] = true;
        service[`isRightMouseDown`] = true;
        service[`isSelecting`] = true;
        service[`isTranslatingSelection`] = true;

        service.cleanUp();

        expect(spyOnRemoveChild).toHaveBeenCalled();
        expect(service[`isLeftMouseDown`]).toBeFalsy();
        expect(service[`isRightMouseDown`]).toBeFalsy();
        expect(service[`isSelecting`]).toBeFalsy();
        expect(service[`isTranslatingSelection`]).toBeFalsy();
    });

    it('should update the selection rectangle for a negative X/Y difference', () => {
        service[`currentMouseCoords`].x = 10;
        service[`initialMouseCoords`].x = 5;
        service[`currentMouseCoords`].y = 10;
        service[`initialMouseCoords`].y = 5;

        service[`updateSelectionRectangle`]();

        expect(spyOnSetAttribute).toHaveBeenCalled();
    });

    it('should update the selection rectangle for a positive X/Y difference', () => {
        service[`currentMouseCoords`].x = 5;
        service[`initialMouseCoords`].x = 10;
        service[`currentMouseCoords`].y = 5;
        service[`initialMouseCoords`].y = 10;

        service[`updateSelectionRectangle`]();

        expect(spyOnSetAttribute).toHaveBeenCalled();
    });

    it('should not update cursor style if mouse is in control point or inputIsOnControlPoint', () => {
        service[`selection`][`isInputOnControlPoint`] = true;
        const spyOnMouseIsInControlPoint = spyOn<any>(service.selection, 'mouseIsInControlPoint').and.callFake(() => false);
        const spyOnMouseIsInSelectionBox = spyOn<any>(service.selection, 'mouseIsInSelectionBox').and.callFake(() => false);
        const spyOnStyle = spyOn<any>(service.renderer, 'setStyle');

        service[`updateCursorStyleOnSelectionBox`]();

        expect(spyOnMouseIsInControlPoint).toHaveBeenCalled();
        expect(spyOnMouseIsInSelectionBox).not.toHaveBeenCalled();
        expect(spyOnStyle).not.toHaveBeenCalled();

        service[`selection`][`isInputOnControlPoint`] = false;
        spyOnMouseIsInControlPoint.and.callFake(() => true);

        service[`updateCursorStyleOnSelectionBox`]();

        expect(spyOnMouseIsInControlPoint).toHaveBeenCalled();
        expect(spyOnMouseIsInSelectionBox).not.toHaveBeenCalled();
        expect(spyOnStyle).not.toHaveBeenCalled();
    });

    it('should not update cursor style if mouse is not in selection box', () => {
        service[`selection`][`isInputOnControlPoint`] = false;
        const spyOnMouseIsInControlPoint = spyOn<any>(service.selection, 'mouseIsInControlPoint').and.callFake(() => false);
        const spyOnMouseIsInSelectionBox = spyOn<any>(service.selection, 'mouseIsInSelectionBox').and.callFake(() => false);
        const spyOnStyle = spyOn<any>(service.renderer, 'setStyle');

        service[`updateCursorStyleOnSelectionBox`]();

        expect(spyOnMouseIsInControlPoint).toHaveBeenCalled();
        expect(spyOnMouseIsInSelectionBox).toHaveBeenCalled();
        expect(spyOnStyle).toHaveBeenCalledWith(service[`elementRef`].nativeElement, 'cursor', CURSOR_STYLES.Default);
    });

    it('should update cursor style if mouse is in selection box and is not in control point or not inputIsOnControlPoint', () => {
        service[`selection`][`isInputOnControlPoint`] = false;
        const spyOnMouseIsInControlPoint = spyOn<any>(service.selection, 'mouseIsInControlPoint').and.callFake(() => false);
        const spyOnMouseIsInSelectionBox = spyOn<any>(service.selection, 'mouseIsInSelectionBox').and.callFake(() => true);
        const spyOnStyle = spyOn<any>(service.renderer, 'setStyle');

        service[`updateCursorStyleOnSelectionBox`]();

        expect(spyOnMouseIsInControlPoint).toHaveBeenCalled();
        expect(spyOnMouseIsInSelectionBox).toHaveBeenCalled();
        expect(spyOnStyle).toHaveBeenCalledWith(service[`elementRef`].nativeElement, 'cursor', CURSOR_STYLES.Move);
    });

    it('should call setAttribute 8 times when calling updateSelectionRectangle', () => {
        service[`updateSelectionRectangle`]();

        expect(spyOnSetAttribute).toHaveBeenCalledTimes(8);
    });

    it('getStrokeWidth should return 0 if el has no stroke-width', () => {
        const el = TestHelpers.createMockSVGGElementWithAttribute('');

        const resNumber = service[`getStrokeWidth`](el);

        expect(resNumber).toBe(0);
    });

    it('getStrokeWidth should return 10 if el has stroke-width', () => {
        const el = TestHelpers.createMockSVGGElementWithAttribute('stroke-width');

        const resNumber = service[`getStrokeWidth`](el);

        expect(resNumber).toBe(10);
    });

    it('should append selectionRectangle, update it once and set isSelecting to true when calling startSelection', () => {
        const spy = spyOn<any>(service, 'updateSelectionRectangle');

        service[`startSelection`]();

        expect(spy).toHaveBeenCalled();
        expect(service[`isSelecting`]).toBeTruthy();
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

        const res = service[`isInSelection`](mockSelectionBox, mockElementBox);

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

        const res = service[`isInSelection`](mockSelectionBox, mockElementBox);

        expect(res).toBeFalsy();
    });

    it('singlySelect should empty the selection, add the target to the selection and set isOnTarget to false', () => {
        const spyEmptySelection = spyOn(service.selection, 'emptySelection');
        const spyAddToSelection = spyOn(service.selection, 'addToSelection');

        service[`singlySelect`](1);

        expect(spyEmptySelection).toHaveBeenCalled();
        expect(spyAddToSelection).toHaveBeenCalled();
        expect(service[`isOnTarget`]).toBeFalsy();
    });

    it('singlyInvert should call invertAddToSelection from Selection and set isOnTarget to false', () => {
        const spyInvertAddToSelection = spyOn(service.selection, 'invertAddToSelection');

        service[`singlySelectInvert`](1);

        expect(spyInvertAddToSelection).toHaveBeenCalled();
        expect(service[`isOnTarget`]).toBeFalsy();
    });

    it('startSelection should set isSelecting to true', () => {
        service[`isSelecting`] = false;

        service[`startSelection`]();

        expect(service[`isSelecting`]).toBeTruthy();
    });

    it('handleLeftMouseDrag should call checkSelection if mouse is not in selection or not translating and is not on target', () => {
        service[`isOnTarget`] = false;
        const spy = spyOn<any>(service, 'checkSelection');
        spyOn(service.selection, 'mouseIsInControlPoint').and.returnValue(false);
        const spyselection = spyOn(service.selection, 'mouseIsInSelectionBox').and.callFake(() => false);

        service[`handleLeftMouseDrag`]();

        expect(spy).toHaveBeenCalled();
        expect(spyselection).toHaveBeenCalled();
    });

    it('should pass the DOMRect of selection box and of each element in draw stack to selection on checkSelection', () => {
        const sizeOfDrawStack = 3;
        const spyOnDomRect = spyOn<any>(service, 'getDOMRect').and.callFake(() => (null as unknown) as DOMRect);
        const spyOnSelection = spyOn(service.selection, 'handleSelection').and.callFake(
            () => (null as unknown) as DOMRect,
        );
        const spyOnIsInSelection = spyOn<any>(service, 'isInSelection').and.callFake(() => true);
        const spyOnStrokeWidth = spyOn<any>(service, 'getStrokeWidth').and.callFake(() => 0);

        service.drawStack.drawStack.push(TestHelpers.createMockSVGGElement());
        service.drawStack.drawStack.push(TestHelpers.createMockSVGGElement());
        service.drawStack.drawStack.push(TestHelpers.createMockSVGGElement());

        service[`checkSelection`]();

        expect(spyOnDomRect).toHaveBeenCalledTimes(sizeOfDrawStack + 1);
        expect(spyOnSelection).toHaveBeenCalledTimes(sizeOfDrawStack);
        expect(spyOnIsInSelection).toHaveBeenCalled();
        expect(spyOnStrokeWidth).toHaveBeenCalled();
    });

    it('handleLeftMouseDrag should use manipulator if mouse is in selection and not selecting or was already translating', () => {
        service[`isOnTarget`] = false;
        service[`isSelecting`] = false;
        const spySelection = spyOn(service.selection, 'mouseIsInSelectionBox').and.callFake(() => true);
        spyOn(service.selection, 'mouseIsInControlPoint').and.returnValue(false);
        const spyManipulator = spyOn(service[`manipulator`], 'translateSelection').and.callFake(() => null);

        service[`handleLeftMouseDrag`]();

        expect(spySelection).toHaveBeenCalled();
        expect(spyManipulator).toHaveBeenCalled();
    });

    it('handleLeftMouseDrag should call singlySelect if on target and target not in Selection', () => {
        service[`isOnTarget`] = true;
        const spy = spyOn<any>(service, 'singlySelect');
        const spySelection = spyOn(service.selection.selectedElements, 'has').and.callFake(() => false);

        service[`handleLeftMouseDrag`]();

        expect(spy).toHaveBeenCalled();
        expect(spySelection).toHaveBeenCalled();
    });

    it('handleRightMouseDrag should call checkSelectionInverse if this.isSelecting', () => {
        const spy = spyOn<any>(service, 'checkSelectionInverse');
        service[`isSelecting`] = true;

        service[`handleRightMouseDrag`]();

        expect(spy).toHaveBeenCalled();
    });

    it('should pass the DOMRect of selection box and of each element in draw stack to selection on checkSelectionInverse', () => {
        const sizeOfDrawStack = 3;
        const spyOnDomRect = spyOn<any>(service, 'getDOMRect').and.callFake(() => (null as unknown) as DOMRect);
        const spyOnSelection = spyOn(service.selection, 'handleInvertSelection').and.callFake(
            () => (null as unknown) as DOMRect,
        );
        const spyOnIsInSelection = spyOn<any>(service, 'isInSelection').and.callFake(() => true);
        const spyOnStrokeWidth = spyOn<any>(service, 'getStrokeWidth').and.callFake(() => 0);

        service.drawStack.drawStack.push(TestHelpers.createMockSVGGElement());
        service.drawStack.drawStack.push(TestHelpers.createMockSVGGElement());
        service.drawStack.drawStack.push(TestHelpers.createMockSVGGElement());

        service[`checkSelectionInverse`]();

        expect(spyOnDomRect).toHaveBeenCalledTimes(sizeOfDrawStack + 1);
        expect(spyOnSelection).toHaveBeenCalledTimes(sizeOfDrawStack);
        expect(spyOnIsInSelection).toHaveBeenCalled();
        expect(spyOnStrokeWidth).toHaveBeenCalled();
    });

    it('onMouseMove should call handleLeftMouseDrag if isLeftMouseDown', () => {
        const spy = spyOn<any>(service, 'handleLeftMouseDrag');
        const spyOnStyle = spyOn<any>(service, 'updateCursorStyleOnSelectionBox').and.callFake(() => null);
        service[`isLeftMouseDown`] = true;
        service[`isRightMouseDown`] = false;

        service.onMouseMove(MOCK_LEFT_CLICK);

        expect(spy).toHaveBeenCalled();
        expect(spyOnStyle).toHaveBeenCalled();
    });

    it('onMouseMove should call handleRightMouseDrag if isRightMouseDown', () => {
        const spy = spyOn<any>(service, 'handleRightMouseDrag');
        const spyOnStyle = spyOn<any>(service, 'updateCursorStyleOnSelectionBox').and.callFake(() => null);
        service[`isRightMouseDown`] = true;
        service[`isLeftMouseDown`] = false;

        service.onMouseMove(MOCK_RIGHT_CLICK);

        expect(spy).toHaveBeenCalled();
        expect(spyOnStyle).toHaveBeenCalled();
    });

    it('handleRightMouseDown should clear the invert selection buffer of Selection', () => {
        const spy = spyOn(service.selection.invertSelectionBuffer, 'clear');

        service[`handleRightMouseDown`]();

        expect(spy).toHaveBeenCalled();
    });

    it('onMouseDown should call handleLeftMouseDown if mouseEvent is left button', () => {
        const spyOnStyle = spyOn<any>(service, 'updateCursorStyleOnSelectionBox').and.callFake(() => null);
        const spy = spyOn<any>(service, 'handleLeftMouseDown');

        service.onMouseDown(MOCK_LEFT_CLICK);

        expect(spy).toHaveBeenCalled();
        expect(spyOnStyle).toHaveBeenCalled();
    });

    it('should set the initialMouseCoords to currentMouseCoords and isLeftMouseDOwn to true when calling handleLeftMouseDown', () => {
        service[`currentMouseCoords`].x = 10;
        service[`currentMouseCoords`].y = 20;
        service[`isLeftMouseDown`] = false;
        spyOn(service.selection, 'mouseIsInControlPoint').and.returnValue(false);

        service[`handleLeftMouseDown`]();

        expect(service[`initialMouseCoords`].x).toEqual(service[`currentMouseCoords`].x);
        expect(service[`initialMouseCoords`].y).toEqual(service[`currentMouseCoords`].y);
        expect(service[`isLeftMouseDown`]).toBeTruthy();
    });

    it('onMouseDown should call handleRightMouseDown if mouseEvent is right button', () => {
        const spyOnStyle = spyOn<any>(service, 'updateCursorStyleOnSelectionBox').and.callFake(() => null);
        const spy = spyOn<any>(service, 'handleRightMouseDown');

        service.onMouseDown(MOCK_RIGHT_CLICK);

        expect(spy).toHaveBeenCalled();
        expect(spyOnStyle).toHaveBeenCalled();
    });

    it('should remove the selection rectangle when handling a right mouse up', () => {
        service[`handleRightMouseUp`]();

        expect(spyOnRemoveChild).toHaveBeenCalled();
    });

    it('should set isSelecting to false when handling a right mouse up and isSelecting was true', () => {
        service[`isSelecting`] = true;

        service[`handleRightMouseUp`]();

        expect(service[`isSelecting`]).toBeFalsy();
    });

    it('should singly invert select when handling a right mouse up, isOnTarget was true and isSelecting was false', () => {
        const spy = spyOn<any>(service, 'singlySelectInvert');
        service[`isSelecting`] = false;
        service[`isOnTarget`] = true;

        service[`handleRightMouseUp`]();

        expect(spy).toHaveBeenCalled();
        expect(service[`isOnTarget`]).toBeFalsy();
        expect(spyOnRemoveChild).toHaveBeenCalled();
    });

    it('should set isSelecting to false when handling a left mouse up and isSelecting was true', () => {
        service[`isSelecting`] = true;

        service[`handleLeftMouseUp`]();

        expect(spyOnRemoveChild).toHaveBeenCalled();
        expect(service[`isSelecting`]).toBeFalsy();
    });

    it('should set isOnTarget to false when handling a left mouse up, isTarget is true and was not translating', () => {
        service[`isOnTarget`] = true;
        service[`isTranslatingSelection`] = false;
        const spyOnSinglySelect = spyOn<any>(service, 'singlySelect');

        service[`handleLeftMouseUp`]();

        expect(service[`isOnTarget`]).toBeFalsy();
        expect(spyOnSinglySelect).toHaveBeenCalled();
    });

    it('should set isTranslatinSelection to false when handling a left mouse up and was translating', () => {
        const spyUndoRedo = spyOn<any>(service, 'saveState').and.callFake(() => null);
        service[`isTranslatingSelection`] = true;

        service[`handleLeftMouseUp`]();

        expect(service[`isTranslatingSelection`]).toBeFalsy();
        expect(spyUndoRedo).toHaveBeenCalled();
    });

    it('should empty selection when handling a left mouse up outside of selection', () => {
        const spyOnEmptySelection = spyOn(service.selection, 'emptySelection');

        service[`handleLeftMouseUp`]();

        expect(spyOnEmptySelection).toHaveBeenCalled();
    });

    it('onMouseUp should call handleLeftMouseUp and restartDuplication from clipboard if event.button is Left Button', () => {
        const spy = spyOn<any>(service, 'handleLeftMouseUp');
        const spyClipboard = spyOn(service[`clipBoard`], 'restartDuplication').and.callFake(() => null);
        const spyOnStyle = spyOn<any>(service, 'updateCursorStyleOnSelectionBox').and.callFake(() => null);
        spyOn(service, 'isMouseInRef').and.callFake(() => true);
        spyOn(service[`manipulator`], 'updateOrigins').and.callFake(() => null);

        service.onMouseUp(MOCK_LEFT_CLICK);

        expect(spy).toHaveBeenCalled();
        expect(spyClipboard).toHaveBeenCalled();
        expect(spyOnStyle).toHaveBeenCalled();
    });

    it('onMouseUp should not do anything if mouse is not in workzone', () => {
        const spy = spyOn<any>(service, 'handleLeftMouseUp');
        const spyOnStyle = spyOn<any>(service, 'updateCursorStyleOnSelectionBox').and.callFake(() => null);
        spyOn(service, 'isMouseInRef').and.callFake(() => false);

        service.onMouseUp(MOCK_LEFT_CLICK);

        expect(spy).not.toHaveBeenCalled();
        expect(spyOnStyle).not.toHaveBeenCalled();
    });

    it('onMouseUp should call handleRightMouseUp if event.button is Right Button', () => {
        const spy = spyOn<any>(service, 'handleRightMouseUp');
        const spyClipboard = spyOn(service[`clipBoard`], 'restartDuplication').and.callFake(() => null);
        const spyOnStyle = spyOn<any>(service, 'updateCursorStyleOnSelectionBox').and.callFake(() => null);
        spyOn(service, 'isMouseInRef').and.callFake(() => true);
        spyOn(service[`manipulator`], 'updateOrigins').and.callFake(() => null);

        service.onMouseUp(MOCK_RIGHT_CLICK);

        expect(spy).toHaveBeenCalled();
        expect(spyClipboard).toHaveBeenCalled();
        expect(spyOnStyle).toHaveBeenCalled();
    });

    it('should not do anything if translating or selecting on mouse wheel', () => {
        const spyUndoRedo = spyOn<any>(service, 'saveState').and.callFake(() => null);
        const spyManipulator = spyOn(service[`manipulator`], 'rotateSelection').and.callFake(() => null);
        const spyClipboard = spyOn(service[`clipBoard`], 'restartDuplication').and.callFake(() => null);
        const spyOnStyle = spyOn<any>(service, 'updateCursorStyleOnSelectionBox').and.callFake(() => null);
        service[`isTranslatingSelection`] = true;
        service[`isSelecting`] = true;

        service.onWheel(TestHelpers.createWheelEvent(0, 150));

        expect(spyUndoRedo).not.toHaveBeenCalled();
        expect(spyManipulator).not.toHaveBeenCalled();
        expect(spyClipboard).not.toHaveBeenCalled();
        expect(spyOnStyle).toHaveBeenCalled();
    });

    it('should rotate selection if not translating and not selecting on mouse wheel', () => {
        const spyUndoRedo = spyOn<any>(service, 'saveState').and.callFake(() => null);
        const spyManipulator = spyOn(service[`manipulator`], 'rotateSelection').and.callFake(() => null);
        const spyClipboard = spyOn(service[`clipBoard`], 'restartDuplication').and.callFake(() => null);
        const spyOnStyle = spyOn<any>(service, 'updateCursorStyleOnSelectionBox').and.callFake(() => null);
        service[`isTranslatingSelection`] = false;
        service[`isSelecting`] = false;
        service.selection.isAppended = true;

        service.onWheel(TestHelpers.createWheelEvent(0, 150));

        expect(spyUndoRedo).toHaveBeenCalled();
        expect(spyManipulator).toHaveBeenCalled();
        expect(spyClipboard).toHaveBeenCalled();
        expect(spyOnStyle).toHaveBeenCalled();
    });

    it('should set isRotateOnSelf, isShiftDown to true and scaleSelection if scaling when keydown on shift', () => {
        const spyOnManipulator = spyOn(service[`manipulator`], 'scaleSelection').and.callFake(() => null);
        service[`isScalingSelection`] = true;
        service.onKeyDown(TestHelpers.createKeyBoardEvent(KEYS.Shift));

        expect(service[`manipulator`].isRotateOnSelf).toBeTruthy();
        expect(service[`manipulator`].isShiftDown).toBeTruthy();
        expect(spyOnManipulator).toHaveBeenCalled();
        expect(service[`manipulator`].isRotateOnSelf).toBeTruthy();
    });

    it('should set rotationStep to ROTATION_ANGLE.Alter, isAltDown to true and scaleSelection if scaling when keydown on alt', () => {
        const spyOnManipulator = spyOn(service[`manipulator`], 'scaleSelection').and.callFake(() => null);
        service[`isScalingSelection`] = true;
        service.onKeyDown(TestHelpers.createKeyBoardEvent(KEYS.Alt));

        expect(service[`manipulator`].rotationStep).toEqual(ROTATION_ANGLE.Alter);
        expect(service[`manipulator`].isAltDown).toBeTruthy();
        expect(spyOnManipulator).toHaveBeenCalled();
        expect(service[`manipulator`].rotationStep).toEqual(ROTATION_ANGLE.Alter);
    });

    it('should set isRotateOnSelf, isShiftDown to false and scaleSelection if scaling when keyup on shift', () => {
        const spyOnManipulator = spyOn(service[`manipulator`], 'scaleSelection').and.callFake(() => null);
        service[`isScalingSelection`] = true;
        service.onKeyUp(TestHelpers.createKeyBoardEvent(KEYS.Shift));

        expect(service[`manipulator`].isRotateOnSelf).toBeFalsy();
        expect(service[`manipulator`].isShiftDown).toBeFalsy();
        expect(spyOnManipulator).toHaveBeenCalled();
        expect(service[`manipulator`].isRotateOnSelf).toBeFalsy();
    });

    it('should set rotationStep to ROTATION_ANGLE.Base, isAltDown to false and scaleSelection if scaling when keyup on alt', () => {
        const spyOnManipulator = spyOn(service[`manipulator`], 'scaleSelection').and.callFake(() => null);
        service[`isScalingSelection`] = true;
        service.onKeyUp(TestHelpers.createKeyBoardEvent(KEYS.Alt));

        expect(service[`manipulator`].rotationStep).toEqual(ROTATION_ANGLE.Base);
        expect(service[`manipulator`].isAltDown).toBeFalsy();
        expect(spyOnManipulator).toHaveBeenCalled();
        expect(service[`manipulator`].rotationStep).toEqual(ROTATION_ANGLE.Base);
    });
});
