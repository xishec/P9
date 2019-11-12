import { getTestBed, TestBed } from '@angular/core/testing';

import { ElementRef, Renderer2, Type } from '@angular/core';
import { MatDialog } from '@angular/material';
import { createKeyBoardEvent, createMouseEvent, MockRect } from 'src/classes/test-helpers.spec';
import { KEYS } from 'src/constants/constants';
import { DrawStackService } from '../../draw-stack/draw-stack.service';
import { StampToolService } from './stamp-tool.service';

describe('StampToolService', () => {
    const mockDrawRect: MockRect = new MockRect();

    let injector: TestBed;
    let service: StampToolService;
    let positiveMouseEvent: MouseEvent;
    let negativeMouseEvent: MouseEvent;
    let onAltKeyDown: KeyboardEvent;
    let onOtherKeyDown: KeyboardEvent;
    let rendererMock: Renderer2;
    let drawStackMock: DrawStackService;
    let elementRefMock: ElementRef<SVGElement>;

    let spyOnStampWidth: jasmine.Spy;
    let spyOnStampHeight: jasmine.Spy;
    let spyOnSetAttribute: jasmine.Spy;
    let spyOnAppendChild: jasmine.Spy;
    let spyOnRemoveChild: jasmine.Spy;
    let spyOnDrawStackPush: jasmine.Spy;
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

        rendererMock = injector.get<Renderer2>(Renderer2 as Type<Renderer2>);
        drawStackMock = injector.get<DrawStackService>(DrawStackService as Type<DrawStackService>);
        elementRefMock = injector.get<ElementRef>(ElementRef as Type<ElementRef>);
        service.initializeService(elementRefMock, rendererMock, drawStackMock);

        positiveMouseEvent = createMouseEvent(10, 10, 0);
        negativeMouseEvent = createMouseEvent(-10, -10, 0);

        onAltKeyDown = createKeyBoardEvent(KEYS.Alt);
        onOtherKeyDown = createKeyBoardEvent(KEYS.Shift);

        spyOnSetAttribute = spyOn(service.renderer, 'setAttribute').and.returnValue();
        spyOnAppendChild = spyOn(service.renderer, 'appendChild').and.returnValue();
        spyOnRemoveChild = spyOn(service.renderer, 'removeChild').and.returnValue();
        spyOnDrawStackPush = spyOn(service.drawStack, 'push').and.returnValue();
        spyOnPreventDefault = spyOn(onAltKeyDown, 'preventDefault').and.returnValue();

        spyOnStampWidth = spyOnProperty(service, 'stampWidth', 'get').and.callFake(() => {
            return mockDrawRect.width;
        });
        spyOnStampHeight = spyOnProperty(service, 'stampHeight', 'get').and.callFake(() => {
            return mockDrawRect.height;
        });

        jasmine.clock().install();
    });

    afterEach(() => {
        jasmine.clock().uninstall();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should define width and height of stamp', () => {
        expect(spyOnStampWidth).toBeDefined();
        expect(spyOnStampHeight).toBeDefined();
    });

    it('should return the stamp width with property stampWidth', () => {
        const WIDTH = 10;
        const mockImageElement = {
            width: {
                baseVal: {
                    value: WIDTH,
                },
            },
        };
        const newStampTool = new StampToolService();
        newStampTool.initializeService(elementRefMock, rendererMock, drawStackMock);
        newStampTool.stamp = mockImageElement as unknown as SVGImageElement;
        expect(newStampTool.stampWidth).toEqual(WIDTH);
    });

    it('should return the stamp height with property stampHeight', () => {
        const HEIGHT = 10;
        const mockImageElement = {
            height: {
                baseVal: {
                    value: HEIGHT,
                },
            },
        };
        const newStampTool = new StampToolService();
        newStampTool.initializeService(elementRefMock, rendererMock, drawStackMock);
        newStampTool.stamp = mockImageElement as unknown as SVGImageElement;
        expect(newStampTool.stampHeight).toEqual(HEIGHT);
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
        service.cleanUp();
        expect(spyOnRemoveChild).toHaveBeenCalledTimes(0);

        service.stampIsAppended = true;
        service.cleanUp();
        expect(spyOnRemoveChild).toHaveBeenCalledTimes(1);
    });

    it('should call setAttribute 3 times', () => {
        service.setStamp();

        expect(spyOnSetAttribute).toHaveBeenCalledTimes(3);
    });

    it('should call applyTransformation if isStampLinkValid is true', () => {
        service.isStampLinkValid = false;
        service.applyTransformation();
        expect(spyOnSetAttribute).toHaveBeenCalledTimes(0);

        service.isStampLinkValid = true;
        service.applyTransformation();
        expect(spyOnSetAttribute).toHaveBeenCalled();
    });

    it('should call applyTransformation once after a call to positionStamp', () => {
        const spyOnApplyTransformation: jasmine.Spy = spyOn(service, 'applyTransformation');

        service.positionStamp();

        expect(spyOnApplyTransformation).toHaveBeenCalled();
    });

    it('should call setAttribute and appendChild after a stamp is added', () => {
        service.addStamp();
        jasmine.clock().tick(1);

        expect(spyOnSetAttribute).toHaveBeenCalled();
        expect(spyOnAppendChild).toHaveBeenCalled();
        expect(spyOnDrawStackPush).toHaveBeenCalled();
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
        const spyOnPositionStamp: jasmine.Spy = spyOn(service, 'positionStamp').and.returnValue();

        const currentMouseCoordsX = service.currentMouseCoords.x;
        const currentMouseCoordsY = service.currentMouseCoords.y;
        service.onMouseMove(positiveMouseEvent);

        expect(service.currentMouseCoords.x).toBeGreaterThan(currentMouseCoordsX);
        expect(service.currentMouseCoords.y).toBeGreaterThan(currentMouseCoordsY);
        expect(spyOnPositionStamp).toHaveBeenCalled();
    });

    it('should call positionStamp and decrease the current position of the mouse if the position is negative', () => {
        const spyOnPositionStamp: jasmine.Spy = spyOn(service, 'positionStamp').and.returnValue();

        const currentMouseCoordsX = service.currentMouseCoords.x;
        const currentMouseCoordsY = service.currentMouseCoords.y;
        service.onMouseMove(negativeMouseEvent);

        expect(service.currentMouseCoords.x).toBeLessThan(currentMouseCoordsX);
        expect(service.currentMouseCoords.y).toBeLessThan(currentMouseCoordsY);
        expect(spyOnPositionStamp).toHaveBeenCalled();
    });

    it('should call cleanUpStamp if event is left click, stamp link is valid and the position is correct', () => {
        const spyOnCleanUpStamp: jasmine.Spy = spyOn(service, 'cleanUp').and.returnValue();
        spyOn(service, 'isMouseInRef').and.callFake(() => true);

        service.isStampLinkValid = false;
        service.onMouseDown(positiveMouseEvent);
        expect(spyOnCleanUpStamp).not.toHaveBeenCalled();

        service.isStampLinkValid = true;
        service.onMouseDown(positiveMouseEvent);
        jasmine.clock().tick(1);

        expect(spyOnCleanUpStamp).toHaveBeenCalled();
        expect(spyOnDrawStackPush).toHaveBeenCalled();
    });

    it('should call initStamp if event is left click, isStampLinkValid is true and the position is correct', () => {
        const spyOnInitStamp: jasmine.Spy = spyOn(service, 'initStamp').and.returnValue();

        service.isStampLinkValid = false;
        service.onMouseUp(positiveMouseEvent);
        expect(spyOnInitStamp).toHaveBeenCalledTimes(0);

        spyOn(service, 'isMouseInRef').and.callFake(() => true);
        service.isStampLinkValid = true;
        service.onMouseUp(positiveMouseEvent);
        expect(spyOnInitStamp).toHaveBeenCalled();
    });

    it('should call initStamp if isStampLinkValid is true and it should set isIn to true', () => {
        const spyOnInitStamp: jasmine.Spy = spyOn(service, 'initStamp').and.returnValue();
        spyOn(service, 'isMouseInRef').and.callFake(() => false);
        service.isStampLinkValid = false;

        service.onMouseEnter(positiveMouseEvent);
        expect(spyOnInitStamp).toHaveBeenCalledTimes(0);

        service.isStampLinkValid = true;
        service.onMouseEnter(positiveMouseEvent);
        expect(spyOnInitStamp).toHaveBeenCalledTimes(1);
    });

    it('should call cleanUpStamp if isStampLinkValid is true and it should set isIn to false', () => {
        const spyOnCleanUpStamp: jasmine.Spy = spyOn(service, 'cleanUp').and.returnValue();
        spyOn(service, 'isMouseInRef').and.callFake(() => true);
        service.isStampLinkValid = false;

        service.onMouseLeave(positiveMouseEvent);
        expect(spyOnCleanUpStamp).toHaveBeenCalledTimes(0);

        service.isStampLinkValid = true;
        service.onMouseLeave(positiveMouseEvent);
        expect(spyOnCleanUpStamp).toHaveBeenCalledTimes(1);
    });

    it('should call alterRotateStamp if isAlterRotation is true and rotateStamp if isAlterRotation is false', () => {
        const wheelEvent: WheelEvent = new WheelEvent('wheelEvent');
        const spyOnApplyTransformation: jasmine.Spy = spyOn(service, 'applyTransformation').and.returnValue();
        service.isStampLinkValid = true;

        service.isAlterRotation = true;
        const spyOnAlterRotateStamp: jasmine.Spy = spyOn(service, 'alterRotateStamp').and.returnValue();

        service.onWheel(wheelEvent);
        expect(spyOnAlterRotateStamp).toHaveBeenCalled();
        expect(spyOnApplyTransformation).toHaveBeenCalled();

        service.isAlterRotation = false;
        const spyOnRotateStamp: jasmine.Spy = spyOn(service, 'rotateStamp').and.returnValue();

        service.onWheel(wheelEvent);
        expect(spyOnRotateStamp).toHaveBeenCalled();
        expect(spyOnApplyTransformation).toHaveBeenCalled();
    });

    it('should not call any rotation methods if stamp link is invalid', () => {
        const wheelEvent: WheelEvent = new WheelEvent('wheelEvent');
        const spyOnApplyTransformation: jasmine.Spy = spyOn(service, 'applyTransformation').and.returnValue();
        service.isStampLinkValid = false;

        service.isAlterRotation = true;
        const spyOnAlterRotateStamp: jasmine.Spy = spyOn(service, 'alterRotateStamp').and.returnValue();

        service.onWheel(wheelEvent);
        expect(spyOnAlterRotateStamp).not.toHaveBeenCalled();
        expect(spyOnApplyTransformation).not.toHaveBeenCalled();

        service.isAlterRotation = false;
        const spyOnRotateStamp: jasmine.Spy = spyOn(service, 'rotateStamp').and.returnValue();

        service.onWheel(wheelEvent);
        expect(spyOnRotateStamp).not.toHaveBeenCalled();
        expect(spyOnApplyTransformation).not.toHaveBeenCalled();
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

    it('should return true when calling isAbleToStamp, is in workzone and stamp link is valid', () => {
        spyOn(service, 'isMouseInRef').and.callFake(() => {
            return true;
        });

        service.isStampLinkValid = true;

        expect(service.isAbleToStamp(createMouseEvent(0, 0, 0))).toBeTruthy();
    });

    it('should return false when calling isAbleToStamp, is not in workzone and stamp link is not valid', () => {
        spyOn(service, 'isMouseInRef').and.callFake(() => {
            return false;
        });

        service.isStampLinkValid = false;

        expect(service.isAbleToStamp(createMouseEvent(0, 0, 0))).toBeFalsy();
    });
});
