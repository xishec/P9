import { ElementRef, Renderer2 } from '@angular/core';
import { getTestBed, TestBed } from '@angular/core/testing';

import { createKeyBoardEvent, createMouseEvent } from 'src/classes/test-helpers.spec';
import { Keys } from 'src/constants/constants';
import { EllipsisToolService } from './ellipsis-tool.service';

describe('EllipsisToolService', () => {
    const NONE = 'none';
    const NOTNONE = 'not none';

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

    it('should set userFillColor to none if Outline is selected', () => {
        service.userFillColor = NOTNONE;

        service.updateTraceType('Contour');

        expect(service.userFillColor).toEqual(NONE);
    });

    it('should set userFillColor the fillColor if Outline is Full', () => {
        service.userFillColor = NOTNONE;
        const fillColor = service.fillColor;

        service.updateTraceType('Plein');

        expect(service.userFillColor).toEqual(fillColor);
    });

    it('should set userFillColor the fillColor if Outline is Both', () => {
        service.userFillColor = NOTNONE;
        const fillColor = service.fillColor;

        service.updateTraceType('Plein avec contour');

        expect(service.userFillColor).toEqual(fillColor);
    });

    it('should call renderer.setAttribute after a call to copyRectanglePreview', () => {
        service.copyRectanglePreview();

        expect(spyOnSetAttribute).toHaveBeenCalled();
    });

    it('should call renderer.setAttribute after a call to updatePreviewCircle when deltaX/Y is positive', () => {
        service.currentMouseX = 10;
        service.initialMouseX = 5;
        service.currentMouseY = 10;
        service.initialMouseY = 5;

        service.updatePreviewCircle();

        expect(spyOnSetAttribute).toHaveBeenCalled();
    });

    it('should call renderer.setAttribute after a call to updatePreviewCircle when deltaX/Y is negative', () => {
        service.currentMouseX = 5;
        service.initialMouseX = 10;
        service.currentMouseY = 5;
        service.initialMouseY = 10;

        service.updatePreviewCircle();

        expect(spyOnSetAttribute).toHaveBeenCalled();
    });

    it('should call setAttribute and fill to userFillColor without "#" if userFillColor is none', () => {
        const spyOnIsValideEllipse: jasmine.Spy = spyOn(service, 'isValideEllipse').and.returnValue(true);
        service.userFillColor = NONE;

        service.renderDrawEllipsis();

        expect(spyOnIsValideEllipse).toHaveBeenCalled();
        expect(spyOnSetAttribute).toHaveBeenCalled();
    });

    it('should call setAttribute and fill to userFillColor with "#" if userFillColor is different than none', () => {
        const spyOnIsValideEllipse: jasmine.Spy = spyOn(service, 'isValideEllipse').and.returnValue(true);
        service.userFillColor = NOTNONE;

        service.renderDrawEllipsis();

        expect(spyOnIsValideEllipse).toHaveBeenCalled();
        expect(spyOnSetAttribute).toHaveBeenCalled();
    });

    it('should call setAttribute and fill to none if ellipse in not valide', () => {
        const spyOnIsValideEllipse: jasmine.Spy = spyOn(service, 'isValideEllipse').and.returnValue(false);

        service.renderDrawEllipsis();

        expect(spyOnIsValideEllipse).toHaveBeenCalled();
        expect(spyOnSetAttribute).toHaveBeenCalled();
    });

    it('should call copyRectanglePreview if isCirclePreview is false', () => {
        const spyOnCopyRectanglePreview: jasmine.Spy = spyOn(service, 'copyRectanglePreview').and.returnValue();
        service.isCirclePreview = false;

        service.updateDrawing();

        expect(spyOnCopyRectanglePreview).toHaveBeenCalled();
    });

    it('should call updatePreviewCircle if isCirclePreview is true', () => {
        const spyOnUpdatePreviewCircle: jasmine.Spy = spyOn(service, 'updatePreviewCircle').and.returnValue();
        service.isCirclePreview = true;

        service.updateDrawing();

        expect(spyOnUpdatePreviewCircle).toHaveBeenCalled();
    });

    it('should call updateDrawing if isPreviewing is true', () => {
        const spyOnUpdateDrawing: jasmine.Spy = spyOn(service, 'updateDrawing').and.returnValue();
        service.isPreviewing = true;

        service.onMouseMove(leftMouseEvent);

        expect(spyOnUpdateDrawing).toHaveBeenCalled();
    });

    it('should not call updateDrawing if isPreviewing is false', () => {
        const spyOnUpdateDrawing: jasmine.Spy = spyOn(service, 'updateDrawing').and.returnValue();
        service.isPreviewing = false;

        service.onMouseMove(leftMouseEvent);

        expect(spyOnUpdateDrawing).toHaveBeenCalledTimes(0);
    });

    it('should call updateDrawing if the left button of the mouse is clicked', () => {
        const spyOnUpdateDrawing: jasmine.Spy = spyOn(service, 'updateDrawing').and.returnValue();

        service.onMouseDown(leftMouseEvent);

        expect(spyOnUpdateDrawing).toHaveBeenCalled();
    });

    it('should not call updateDrawing if the left button of the mouse is not clicked', () => {
        const spyOnUpdateDrawing: jasmine.Spy = spyOn(service, 'updateDrawing').and.returnValue();

        service.onMouseDown(rightMouseEvent);

        expect(spyOnUpdateDrawing).toHaveBeenCalledTimes(0);
    });

    it('should not call isValideEllipse if the left button of the mouse is not clicked', () => {
        const spyOnIsValideEllipse: jasmine.Spy = spyOn(service, 'isValideEllipse').and.returnValue(false);

        service.onMouseUp(rightMouseEvent);

        expect(spyOnIsValideEllipse).toHaveBeenCalledTimes(0);
    });

    it('should not call createSVG if the left button of the mouse is clicked and the ellipse is not valide', () => {
        const spyOnIsValideEllipse: jasmine.Spy = spyOn(service, 'isValideEllipse').and.returnValue(false);
        const spyOnCreateSVG: jasmine.Spy = spyOn(service, 'createSVG').and.returnValue();

        service.onMouseUp(leftMouseEvent);

        expect(spyOnIsValideEllipse).toHaveBeenCalled();
        expect(spyOnCreateSVG).toHaveBeenCalledTimes(0);
    });

    it('should call createSVG if the left button of the mouse is clicked and the ellipse is valide', () => {
        const spyOnIsValideEllipse: jasmine.Spy = spyOn(service, 'isValideEllipse').and.returnValue(true);
        const spyOnCreateSVG: jasmine.Spy = spyOn(service, 'createSVG').and.returnValue();

        service.onMouseUp(leftMouseEvent);

        expect(spyOnIsValideEllipse).toHaveBeenCalled();
        expect(spyOnCreateSVG).toHaveBeenCalled();
    });

    it('should set isIn to true after onMouseEnter', () => {
        service.isIn = false;

        service.onMouseEnter(leftMouseEvent);

        expect(service.isIn).toBeTruthy();
    });

    it('should set isIn to false after onMouseLeave', () => {
        service.isIn = true;

        service.onMouseLeave(leftMouseEvent);

        expect(service.isIn).toBeFalsy();
    });

    it('should set isCirclePreview to true if key shift is pressed and if isCirclePreview is false', () => {
        service.isCirclePreview = false;
        service.onKeyDown(onShiftKeyDown);
        expect(service.isCirclePreview).toBeTruthy();

        service.isCirclePreview = true;
        service.onKeyDown(onShiftKeyDown);
        expect(service.isCirclePreview).toBeTruthy();
    });

    it('should not set isCirclePreview to true if key is not shift', () => {
        service.isCirclePreview = false;

        service.onKeyDown(onOtherKeyDown);

        expect(service.isCirclePreview).toBeFalsy();
    });

    it('should set isCirclePreview to false if key shift is pressed and if isCirclePreview is true', () => {
        service.isCirclePreview = true;
        service.onKeyUp(onShiftKeyDown);
        expect(service.isCirclePreview).toBeFalsy();

        service.isCirclePreview = false;
        service.onKeyUp(onShiftKeyDown);
        expect(service.isCirclePreview).toBeFalsy();
    });

    it('should not set isCirclePreview to false if key is not shift', () => {
        service.isCirclePreview = true;

        service.onKeyUp(onOtherKeyDown);

        expect(service.isCirclePreview).toBeTruthy();
    });

    it('should call setAttribute and set fill without an "#" if userFillColor is "none"', () => {
        service.userFillColor = NONE;

        service.createSVG();

        expect(spyOnSetAttribute).toHaveBeenCalled();
        expect(spyOnDrawStackPush).toHaveBeenCalled();
    });

    it('should call setAttribute and set fill with an "#" if userFillColor is not "none"', () => {
        service.userFillColor = NOTNONE;

        service.createSVG();

        expect(spyOnSetAttribute).toHaveBeenCalled();
        expect(spyOnDrawStackPush).toHaveBeenCalled();
    });

    it('should set isPreviewing to false after cleanUp', () => {
        service.isPreviewing = true;

        service.cleanUp();

        expect(service.isPreviewing).toBeFalsy();
    });
});
