import { ElementRef, Renderer2 } from '@angular/core';
import { TestBed, getTestBed } from '@angular/core/testing';

import { EllipsisToolService } from './ellipsis-tool.service';
import { createMouseEvent, createKeyBoardEvent } from 'src/classes/test-helpers';
import { Keys } from 'src/constants/constants';

fdescribe('EllipsisToolService', () => {
    const NONE: string = 'none';
    const NOTNONE: string = 'not none';

    let injector: TestBed;
    let service: EllipsisToolService;
    let leftMouseEvent: MouseEvent;
    let rightMouseEvent: MouseEvent;
    let onShiftKeyDown: KeyboardEvent;
    let onOtherKeyDown: KeyboardEvent;

    let spyOnPreviewRectangleWidth: jasmine.Spy;
    let spyOnPreviewRectangleHeight: jasmine.Spy;
    let spyOnPreviewRectangleX: jasmine.Spy;
    let spyOnPreviewRectangleY: jasmine.Spy;
    let spyOnSetAttribute: jasmine.Spy;
    let spyOnDrawEllipseCenterX: jasmine.Spy;
    let spyOnDrawEllipseCenterY: jasmine.Spy;
    let spyOnDrawEllipseRadiusX: jasmine.Spy;
    let spyOnDrawEllipseRadiusY: jasmine.Spy;
    let spyOnDrawStackPush: jasmine.Spy;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                EllipsisToolService,
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
        service = injector.get(EllipsisToolService);

        leftMouseEvent = createMouseEvent(10, 10, 0);
        rightMouseEvent = createMouseEvent(10, 10, 2);

        onShiftKeyDown = createKeyBoardEvent(Keys.Shift);
        onOtherKeyDown = createKeyBoardEvent(Keys.Alt);

        spyOnSetAttribute = spyOn(service.renderer, 'setAttribute').and.returnValue();
        spyOnDrawStackPush = spyOn(service.drawStack, 'push').and.returnValue();

        spyOnPreviewRectangleWidth = spyOnProperty(service, 'previewRectangleWidth', 'get').and.callFake(() => {
            return 20;
        });
        spyOnPreviewRectangleHeight = spyOnProperty(service, 'previewRectangleHeight', 'get').and.callFake(() => {
            return 10;
        });
        spyOnPreviewRectangleX = spyOnProperty(service, 'previewRectangleX', 'get').and.callFake(() => {
            return 15;
        });
        spyOnPreviewRectangleY = spyOnProperty(service, 'previewRectangleY', 'get').and.callFake(() => {
            return 15;
        });
        spyOnDrawEllipseCenterX = spyOnProperty(service, 'drawEllipseCenterX', 'get').and.callFake(() => {
            return 30;
        });
        spyOnDrawEllipseCenterY = spyOnProperty(service, 'drawEllipseCenterY', 'get').and.callFake(() => {
            return 30;
        });
        spyOnDrawEllipseRadiusX = spyOnProperty(service, 'drawEllipseRadiusX', 'get').and.callFake(() => {
            return 30;
        });
        spyOnDrawEllipseRadiusY = spyOnProperty(service, 'drawEllipseRadiusY', 'get').and.callFake(() => {
            return 30;
        });
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should define all get attributes of ellipsis', () => {
        expect(spyOnPreviewRectangleWidth).toBeDefined();
        expect(spyOnPreviewRectangleHeight).toBeDefined();
        expect(spyOnPreviewRectangleX).toBeDefined();
        expect(spyOnPreviewRectangleY).toBeDefined();
        expect(spyOnDrawEllipseCenterX).toBeDefined();
        expect(spyOnDrawEllipseCenterY).toBeDefined();
        expect(spyOnDrawEllipseRadiusX).toBeDefined();
        expect(spyOnDrawEllipseRadiusY).toBeDefined();
    });

    it('should return true if userStrokeWidth is positive', () => {
        service.userStrokeWidth = 2;

        expect(service.isValideEllipse()).toEqual(true);
    });

    it('should return false if radiusX and radiusY of elipse are equal to zero', () => {
        spyOnPreviewRectangleWidth.and.returnValue(0);
        spyOnPreviewRectangleHeight.and.returnValue(0);

        expect(service.isValideEllipse()).toEqual(false);
    });


import { EllipsisToolService } from './ellipsis-tool.service';
import { ElementRef, Renderer2 } from '@angular/core';
import { MatDialog } from '@angular/material';

fdescribe('EllipsisToolService', () => {
    let injector: TestBed;
    let service: EllipsisToolService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                EllipsisToolService,
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
        service = injector.get(EllipsisToolService);

    it('should set isPreviewing to false after cleanUp', () => {
        service.isPreviewing = true;

        service.cleanUp();

        expect(service.isPreviewing).toBeFalsy();
    });
});
