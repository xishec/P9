import { getTestBed, TestBed } from '@angular/core/testing';

import { ElementRef, Renderer2, Type } from '@angular/core';
import { Coords2D } from 'src/classes/Coords2D';
import { createKeyBoardEvent, createMouseEvent } from 'src/classes/test-helpers.spec';
import { KEYS, MOUSE } from 'src/constants/constants';
import { ROTATION_ANGLE } from 'src/constants/tool-constants';
import { DrawStackService } from '../../draw-stack/draw-stack.service';
import { QuillToolService } from './quill-tool.service';

describe('QuillToolService', () => {
    let injector: TestBed;
    let service: QuillToolService;
    let rendererMock: Renderer2;

    let elementRefMock: ElementRef;
    let drawStackMock: DrawStackService;

    const MOCK_MOUSE_EVENT = createMouseEvent(10, 10, MOUSE.LeftButton);
    const MOCK_WHEEL_EVENT = new WheelEvent('wheelEvent');
    const MOCK_KEYBOARD_ALT = createKeyBoardEvent(KEYS.Alt);
    const MOCK_KEYBOARD_SHIFT = createKeyBoardEvent(KEYS.Shift);

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                QuillToolService,
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
                        nativeElement: {},
                    },
                },
                {
                    provide: DrawStackService,
                    useValue: {
                      push: () => null,
                    },
                },
            ],
        });
        injector = getTestBed();
        service = injector.get(QuillToolService);

        rendererMock = injector.get<Renderer2>(Renderer2 as Type<Renderer2>);
        drawStackMock = injector.get<DrawStackService>(DrawStackService as Type<DrawStackService>);
        elementRefMock = injector.get<ElementRef>(ElementRef as Type<ElementRef>);
        service.initializeService(elementRefMock, rendererMock, drawStackMock);

        service.currentMousePosition = new Coords2D(0, 0);
        spyOn(service, 'getXPos').and.returnValue(0);
        spyOn(service, 'getYPos').and.returnValue(0);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('initializeService should set the corresponding values', () => {
        service.initializeService(elementRefMock, rendererMock, drawStackMock);

        expect(service.elementRef).toBe(elementRefMock);
        expect(service.renderer).toBe(rendererMock);
        expect(service.drawStack).toBe(drawStackMock);
    });

    it('onMouseEnter should call appendPreview()', () => {
        const spy = spyOn(service, 'appendPreview').and.returnValue();

        service.onMouseEnter(MOCK_MOUSE_EVENT);

        expect(spy).toHaveBeenCalled();
    });

    it('onMouseLeave should call removePreview()', () => {
        const spy = spyOn(service, 'removePreview').and.returnValue();

        service.onMouseLeave(MOCK_MOUSE_EVENT);

        expect(spy).toHaveBeenCalled();
    });

    it('onMouseDown should not set isDrawing to true if RightMouseDown', () => {
        const mockRightMouseDown = createMouseEvent(0, 0, MOUSE.RightButton);
        service.isDrawing = false;

        service.onMouseDown(mockRightMouseDown);

        expect(service.isDrawing).toBeFalsy();
    });

    it('onMouseDown should set isDrawing to true and call getColorAndOpacity if LeftMouseDown', () => {
        const spy = spyOn(service, 'setColorAndOpacity').and.returnValue();

        service.onMouseDown(MOCK_MOUSE_EVENT);

        expect(service.isDrawing).toBeTruthy();
        expect(spy).toHaveBeenCalled();
    });

    it('appendPreview should set previewEnabled to true and call renderer.createElement and appendChild', () => {
        const spyCreateElement = spyOn(service.renderer, 'createElement');
        const spySetAttribute = spyOn(service.renderer, 'setAttribute');
        service.previewEnabled = false;

        service.appendPreview();

        expect(spyCreateElement).toHaveBeenCalled();
        expect(spySetAttribute).toHaveBeenCalled();
        expect(service.previewEnabled).toBeTruthy();
    });

    it('removePreview should set previewEnabled to false and call renderer.Removechild', () => {
        const spy = spyOn(service.renderer, 'removeChild');
        service.previewEnabled = true;

        service.removePreview();

        expect(spy).toHaveBeenCalled();
        expect(service.previewEnabled).toBeFalsy();
    });

    it('updatePreview should call setAttribute 4 times', () => {
        const spy = spyOn(service.renderer, 'setAttribute');

        service.updatePreview();

        expect(spy).toHaveBeenCalledTimes(4);
    });

    it('onMouseMove should call updatePreview', () => {
        const spy = spyOn(service, 'updatePreview').and.returnValue();
        spyOn(service, 'tracePolygon').and.returnValue();

        service.onMouseMove(MOCK_MOUSE_EVENT);

        expect(spy).toHaveBeenCalled();
    });

    it('onMouseMove should not call tracePolygon if !isDrawing', () => {
        service.isDrawing = false;
        spyOn(service, 'updatePreview').and.returnValue();
        const spy = spyOn(service, 'tracePolygon');

        service.onMouseDown(MOCK_MOUSE_EVENT);

        expect(spy).not.toHaveBeenCalled();
    });

    it('onWheel should call computeOffset', () => {
        const spy = spyOn(service, 'computeOffset');

        service.onWheel(MOCK_WHEEL_EVENT);

        expect(spy).toHaveBeenCalled();
    });

    it('onWheel should call updatePreview', () => {
        const spy = spyOn(service, 'updatePreview');

        service.onWheel(MOCK_WHEEL_EVENT);

        expect(spy).toHaveBeenCalled();
    });

    it('angle should increase by 1 degree if Alt is pressed and wheel is scrolled upwards when onWheel is called', () => {
        service.angle = 0;
        service.isAlterRotation = true;

        const MOCK_UNIQUE_WHEEL_EVENT = new WheelEvent('wheelEvent', { deltaY: 1 });

        service.onWheel(MOCK_UNIQUE_WHEEL_EVENT);

        expect(service.angle).toEqual(ROTATION_ANGLE.Alter);
    });

    it('angle should increase by 15 degree if Alt is not pressed and wheel is scrolled upwards when onWheel is called', () => {
        service.angle = 0;
        service.isAlterRotation = false;

        const MOCK_UNIQUE_WHEEL_EVENT = new WheelEvent('wheelEvent', { deltaY: 1 });

        service.onWheel(MOCK_UNIQUE_WHEEL_EVENT);

        expect(service.angle).toEqual(ROTATION_ANGLE.Base);
    });

    it('angle should decrease by 1 degree if Alt is pressed and wheel is scrolled downwards when onWheel is called', () => {
        service.angle = 0;
        service.isAlterRotation = true;

        const MOCK_UNIQUE_WHEEL_EVENT = new WheelEvent('wheelEvent', { deltaY: -1 });

        service.onWheel(MOCK_UNIQUE_WHEEL_EVENT);

        expect(service.angle).toEqual(-ROTATION_ANGLE.Alter);
    });

    it('angle should decrease by 15 degree if Alt is not pressed and wheel is scrolled downwards when onWheel is called', () => {
        service.angle = 0;
        service.isAlterRotation = false;

        const MOCK_UNIQUE_WHEEL_EVENT = new WheelEvent('wheelEvent', { deltaY: -1 });

        service.onWheel(MOCK_UNIQUE_WHEEL_EVENT);

        expect(service.angle).toEqual(-ROTATION_ANGLE.Base);
    });

    it('isAlterRotation should be set to true when Alt key is pressed', () => {
        service.isAlterRotation = false;

        service.onKeyDown(MOCK_KEYBOARD_ALT);

        expect(service.isAlterRotation).toEqual(true);
    });

    it('isAlterRotation should not do anything when any key other than Alt is pressed', () => {
        service.isAlterRotation = false;

        service.onKeyDown(MOCK_KEYBOARD_SHIFT);

        expect(service.isAlterRotation).toEqual(false);
    });

    it('isAlterRotation should be set to false when Alt key is unpressed', () => {
        service.isAlterRotation = true;

        service.onKeyUp(MOCK_KEYBOARD_ALT);

        expect(service.isAlterRotation).toEqual(false);
    });

    it('isAlterRotation should not do anything when any key other than Alt is unpressed', () => {
        service.isAlterRotation = true;

        service.onKeyUp(MOCK_KEYBOARD_SHIFT);

        expect(service.isAlterRotation).toEqual(true);
    });

    it('onMouseUp should set isDrawing to false if true', () => {
        service.isDrawing = true;
        spyOn(service, 'saveState').and.returnValue();

        service.onMouseUp();

        expect(service.isDrawing).toBeFalsy();
    });

    it('onMouseUp should call saveState if isDrawing is true', () => {
        const spy = spyOn(service, 'saveState').and.returnValue();
        service.isDrawing = true;

        service.onMouseUp();

        expect(spy).toHaveBeenCalled();
    });

    it('tracePolygon should call render setAttributes and appendChild', () => {
        const setAttributeSpy = spyOn(service.renderer, 'setAttribute');
        const appendChildSpy = spyOn(service.renderer, 'appendChild');
        service.previousCoords = [
            { x: 0, y: 0 },
            { x: 1, y: 1 },
        ];
        service.currentCoords = [
            { x: 2, y: 2 },
            { x: 3, y: 3 },
        ];

        service.tracePolygon();

        expect(setAttributeSpy).toHaveBeenCalled();
        expect(appendChildSpy).toHaveBeenCalled();
    });

    it('computeOffset sets the right values to offsets when angle is equal to 0 degrees', () => {
        service.thickness = 2;
        service.angle = 0;

        service.computeOffset();

        expect(service.offsets[0].x).toEqual(0);
        expect(service.offsets[0].y).toEqual(1);
        expect(service.offsets[1].x).toEqual(0);
        expect(service.offsets[1].y).toEqual(-1);
    });

    it('computeOffset sets the right values to offsets when angle is equal to 90 degrees', () => {
        service.thickness = 2;
        service.angle = 90;

        service.computeOffset();

        expect(service.offsets[0].x).toEqual(1);
        expect(service.offsets[0].y).toBeCloseTo(0); // y = 6.123233995736766e-17
        expect(service.offsets[1].x).toEqual(-1);
        expect(service.offsets[1].y).toBeCloseTo(0);
    });

    it('degreesToRadians converts degree values to proper radian values', () => {
        expect(service.degreesToRadians(0)).toEqual(0);
        expect(service.degreesToRadians(30)).toEqual(Math.PI / 6);
        expect(service.degreesToRadians(45)).toEqual(Math.PI / 4);
        expect(service.degreesToRadians(60)).toEqual(Math.PI / 3);
        expect(service.degreesToRadians(90)).toEqual(Math.PI / 2);
        expect(service.degreesToRadians(180)).toEqual(Math.PI);
        expect(service.degreesToRadians(270)).toEqual(Math.PI * (3 / 2));
    });

    it('cleanUp calls removePreview', () => {
        const spy = spyOn(service, 'removePreview');

        service.cleanUp();

        expect(spy).toHaveBeenCalled();
    });

    it('cleanUp calls removeChild if isDrawing is equal to true', () => {
        const spy = spyOn(service.renderer, 'removeChild');
        service.isDrawing = true;

        service.cleanUp();

        expect(spy).toHaveBeenCalled();
    });
});
