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
