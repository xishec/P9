import { TestBed, getTestBed } from '@angular/core/testing';

import { StampToolService } from './stamp-tool.service';
import { MatDialog } from '@angular/material';
import { Renderer2, ElementRef } from '@angular/core';
import { createMouseEvent, MockRect, createKeyBoardEvent } from 'src/classes/test-helpers';
import { Keys } from 'src/constants/constants';

fdescribe('StampToolService', () => {
    let injector: TestBed;
    let service: StampToolService;
    const mockDrawRect: MockRect = new MockRect();
    let positiveMouseEvent: MouseEvent;
    let negativeMouseEvent: MouseEvent;
    let onAltKeyDown: KeyboardEvent;
    let onOtherKeyDown: KeyboardEvent;

    let spyOnStampWidth: jasmine.Spy;
    let spyOnStampHeight: jasmine.Spy;
    let spyOnSetAttribute: jasmine.Spy;
    let spyOnAppendChild: jasmine.Spy;
    let spyOnRemoveChild: jasmine.Spy;
    let spyOnPreventDefault: jasmine.Spy;

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
        service = injector.get(StampToolService);

        positiveMouseEvent = createMouseEvent(10, 10, 0);
        negativeMouseEvent = createMouseEvent(-10, -10, 0);

        onAltKeyDown = createKeyBoardEvent(Keys.Alt);
        onOtherKeyDown = createKeyBoardEvent(Keys.Shift);

        spyOnSetAttribute = spyOn(service.renderer, 'setAttribute').and.returnValue();
        spyOnAppendChild = spyOn(service.renderer, 'appendChild').and.returnValue();
        spyOnRemoveChild = spyOn(service.renderer, 'removeChild').and.returnValue();
        spyOnPreventDefault = spyOn(onAltKeyDown, 'preventDefault').and.returnValue();

        spyOnStampWidth = spyOnProperty(service, 'stampWidth', 'get').and.callFake(() => {
            return mockDrawRect.width;
        });
        spyOnStampHeight = spyOnProperty(service, 'stampHeight', 'get').and.callFake(() => {
            return mockDrawRect.height;
        });
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should define width and height of stamp', () => {
        expect(spyOnStampWidth).toBeDefined();
        expect(spyOnStampHeight).toBeDefined();
    });

    it('should return true if the mouseEvent is inside the window', () => {
        expect(service.verifyPosition(positiveMouseEvent)).toBeTruthy();
    });

    it('should return false if the mouseEvent is outside the window', () => {
        expect(service.verifyPosition(negativeMouseEvent)).toBeFalsy();
    });

    it('should call initStamp appendChild if stampIsAppended is false', () => {
        service.stampIsAppended = true;
        service.initStamp();
        expect(spyOnAppendChild).toHaveBeenCalledTimes(0);

        service.stampIsAppended = false;
        service.initStamp();
        expect(spyOnAppendChild).toHaveBeenCalledTimes(1);
    });

    it('should call removeChild if stampIsAppended is true', () => {
        service.stampIsAppended = false;
        service.cleanUpStamp();
        expect(spyOnRemoveChild).toHaveBeenCalledTimes(0);

        service.stampIsAppended = true;
        service.cleanUpStamp();
        expect(spyOnRemoveChild).toHaveBeenCalledTimes(1);
    });

    it('should call setAttribute 3 times', () => {
        service.setStamp();
        expect(spyOnSetAttribute).toHaveBeenCalledTimes(3);
    });

    it('should call applyTransformation if shouldStamp is true', () => {
        service.shouldStamp = false;
        service.applyTransformation();
        expect(spyOnSetAttribute).toHaveBeenCalledTimes(0);

        service.shouldStamp = true;
        service.applyTransformation();
        expect(spyOnSetAttribute).toHaveBeenCalled();
    });

    it('should call applyTransformation once after a call to positionStamp', () => {
        let spyOnApplyTransformation: jasmine.Spy = spyOn(service, 'applyTransformation');
        service.positionStamp();
        expect(spyOnApplyTransformation).toHaveBeenCalled();
    });

    it('should call setAttribute 4 times and appendChild 2 times after a stamp is added', () => {
        service.addStamp();
        expect(spyOnSetAttribute).toHaveBeenCalledTimes(4);
        expect(spyOnAppendChild).toHaveBeenCalledTimes(2);
    });

    it('should increase the current angle by 15 degrees if the direction is positive', () => {
        service.rotateStamp(1);
        expect(service.currentAngle).toEqual(15);
    });

    it('should decrease the current angle by 15 degrees if the direction is negative', () => {
        service.rotateStamp(-1);
        expect(service.currentAngle).toEqual(-15);
    });

    it('should increase the current angle by 1 degree if the direction is positive', () => {
        service.alterRotateStamp(10);
        expect(service.currentAngle).toEqual(1);
    });

    it('should decrease the current angle by 1 degree if the direction is negative', () => {
        service.alterRotateStamp(-10);
        expect(service.currentAngle).toEqual(-1);
    });

    it('should call positionStamp and increase the current position of the mouse if the position is positive', () => {
        let spyOnPositionStamp: jasmine.Spy = spyOn(service, 'positionStamp').and.returnValue();

        let currentMouseX = service.currentMouseX;
        let currentMouseY = service.currentMouseY;
        service.onMouseMove(positiveMouseEvent);

        expect(service.currentMouseX).toBeGreaterThan(currentMouseX);
        expect(service.currentMouseY).toBeGreaterThan(currentMouseY);
        expect(spyOnPositionStamp).toHaveBeenCalled();
    });

    it('should call positionStamp and decrease the current position of the mouse if the position is negative', () => {
        let spyOnPositionStamp: jasmine.Spy = spyOn(service, 'positionStamp').and.returnValue();

        let currentMouseX = service.currentMouseX;
        let currentMouseY = service.currentMouseY;
        service.onMouseMove(negativeMouseEvent);

        expect(service.currentMouseX).toBeLessThan(currentMouseX);
        expect(service.currentMouseY).toBeLessThan(currentMouseY);
        expect(spyOnPositionStamp).toHaveBeenCalled();
    });

    it('should call cleanUpStamp if event is left click, shouldStamp is true and the position is correct', () => {
        let spyOnCleanUpStamp: jasmine.Spy = spyOn(service, 'cleanUpStamp').and.returnValue();

        service.shouldStamp = false;
        service.onMouseDown(positiveMouseEvent);
        expect(spyOnCleanUpStamp).toHaveBeenCalledTimes(0);

        service.isIn = true;
        service.shouldStamp = true;
        service.onMouseDown(positiveMouseEvent);
        expect(spyOnCleanUpStamp).toHaveBeenCalled();
    });

    it('should call initStamp if event is left click, shouldStamp is true and the position is correct', () => {
        let spyOnInitStamp: jasmine.Spy = spyOn(service, 'initStamp').and.returnValue();

        service.shouldStamp = false;
        service.onMouseUp(positiveMouseEvent);
        expect(spyOnInitStamp).toHaveBeenCalledTimes(0);

        service.isIn = true;
        service.shouldStamp = true;
        service.onMouseUp(positiveMouseEvent);
        expect(spyOnInitStamp).toHaveBeenCalled();
    });

    it('should call initStamp if shouldStamp is true and it should set isIn to true', () => {
        let spyOnInitStamp: jasmine.Spy = spyOn(service, 'initStamp').and.returnValue();
        service.isIn = false;
        service.shouldStamp = false;

        service.onMouseEnter(positiveMouseEvent);
        expect(service.isIn).toBeTruthy();
        expect(spyOnInitStamp).toHaveBeenCalledTimes(0);

        service.shouldStamp = true;
        service.onMouseEnter(positiveMouseEvent);
        expect(spyOnInitStamp).toHaveBeenCalledTimes(1);
    });

    it('should call cleanUpStamp if shouldStamp is true and it should set isIn to false', () => {
        let spyOnCleanUpStamp: jasmine.Spy = spyOn(service, 'cleanUpStamp').and.returnValue();
        service.isIn = true;
        service.shouldStamp = false;

        service.onMouseLeave(positiveMouseEvent);
        expect(service.isIn).toBeFalsy();
        expect(spyOnCleanUpStamp).toHaveBeenCalledTimes(0);

        service.shouldStamp = true;
        service.onMouseLeave(positiveMouseEvent);
        expect(spyOnCleanUpStamp).toHaveBeenCalledTimes(1);
    });

    it('should call alterRotateStamp if isAlterRotation is true and rotateStamp if isAlterRotation is false', () => {
        let wheelEvent: WheelEvent = new WheelEvent('wheelEvent');
        let spyOnApplyTransformation: jasmine.Spy = spyOn(service, 'applyTransformation').and.returnValue();

        service.isAlterRotation = true;
        let spyOnAlterRotateStamp: jasmine.Spy = spyOn(service, 'alterRotateStamp').and.returnValue();

        service.onWheel(wheelEvent);
        expect(spyOnAlterRotateStamp).toHaveBeenCalled();
        expect(spyOnApplyTransformation).toHaveBeenCalled();

        service.isAlterRotation = false;
        let spyOnRotateStamp: jasmine.Spy = spyOn(service, 'rotateStamp').and.returnValue();

        service.onWheel(wheelEvent);
        expect(spyOnRotateStamp).toHaveBeenCalled();
    });

    it('should call preventDefault on event and change isAlterRotation to true if it is false', () => {
        service.onKeyDown(onOtherKeyDown);
        service.isAlterRotation = false;
        service.onKeyDown(onAltKeyDown);

        expect(service.isAlterRotation).toBeTruthy();
        expect(spyOnPreventDefault).toHaveBeenCalled();

        service.isAlterRotation = true;
        service.onKeyDown(onAltKeyDown);

        expect(service.isAlterRotation).toBeTruthy();
        expect(spyOnPreventDefault).toHaveBeenCalled();
    });

    it('should call preventDefault on event and change isAlterRotation to false if it is true', () => {
        service.onKeyUp(onOtherKeyDown);
        service.isAlterRotation = true;
        service.onKeyUp(onAltKeyDown);

        expect(service.isAlterRotation).toBeFalsy();
        expect(spyOnPreventDefault).toHaveBeenCalled();

        service.isAlterRotation = false;
        service.onKeyUp(onAltKeyDown);

        expect(service.isAlterRotation).toBeFalsy();
        expect(spyOnPreventDefault).toHaveBeenCalled();
    });
});
