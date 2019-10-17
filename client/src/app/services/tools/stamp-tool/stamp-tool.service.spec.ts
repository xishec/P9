import { TestBed, getTestBed } from '@angular/core/testing';

import { StampToolService } from './stamp-tool.service';
import { MatDialog } from '@angular/material';
import { Renderer2, ElementRef } from '@angular/core';

fdescribe('StampToolService', () => {
    let injector: TestBed;
    let service: StampToolService;

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
                    },
                },
                {
                    provide: ElementRef,
                    useValue: {
                        nativeElement: {},
                    },
                },
            ],
        });

        injector = getTestBed();
        service = injector.get(StampToolService);
        onAltKeyDown = createKeyBoardEvent(Keys.Alt);
        onOtherKeyDown = createKeyBoardEvent(Keys.Shift);
        spyOnPreventDefault = spyOn(onAltKeyDown, 'preventDefault').and.returnValue();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
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
