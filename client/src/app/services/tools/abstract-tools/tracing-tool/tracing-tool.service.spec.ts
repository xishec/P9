import { ElementRef, Renderer2, Type } from '@angular/core';
import { getTestBed, TestBed } from '@angular/core/testing';

import { DrawStackService } from 'src/app/services/draw-stack/draw-stack.service';
import { Keys, Mouse } from 'src/constants/constants';
import { AttributesManagerService } from '../../attributes-manager/attributes-manager.service';
import { ColorToolService } from '../../color-tool/color-tool.service';
import {  createKeyBoardEvent, createMockSVGCircle, createMouseEvent } from '../test-helpers'; // , createMouseEvent,
import { TracingToolService } from './tracing-tool.service';

const MOCK_X = 10;
const MOCK_Y = 10;
const MOCK_THICKNESS = 1;
const MOCK_COLOR = '#000000';
const MOCK_LEFT_MOUSE_BUTTON_CLICK = createMouseEvent(MOCK_X, MOCK_Y, Mouse.LeftButton);
const MOCK_KEYBOARD_SHIFT = createKeyBoardEvent(Keys.Shift);

describe('TracingToolService', () => {
    let injector: TestBed;
    let service: TracingToolService;
    let rendererMock: Renderer2;

    let spyOnSetAttribute: jasmine.Spy;
    let spyOnAppendChild: jasmine.Spy;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [TracingToolService,
            {
                provide: Renderer2,
                useValue: {
                    createElement: () => null,
                    setAttribute: () => null,
                    appendChild: () => null,
                },
            }, {
                provide: ElementRef,
                useValue: {
                    nativeElement : {},
                },
            }, {
                provide: DrawStackService,
                useValue: {
                    push: () => null,
                    getDrawStackLength: () => 0,
                },
            }, {
                provide: AttributesManagerService,
                useValue: {
                    currentThickness: () => MOCK_THICKNESS,
                },
            }, {
                provide: ColorToolService,
                useValue: {
                    currentPrimaryColor: () => MOCK_COLOR,
                },
            }],
        });

        injector = getTestBed();
        service = injector.get(TracingToolService);

        spyOn(service, 'getXPos').and.returnValue(MOCK_X);
        spyOn(service, 'getYPos').and.returnValue(MOCK_Y);

        rendererMock = injector.get<Renderer2>(Renderer2 as Type<Renderer2>);

        spyOnSetAttribute = spyOn(rendererMock, 'setAttribute').and.returnValue();
        spyOnAppendChild = spyOn(rendererMock, 'appendChild').and.returnValue();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('when onMouseDown isDrawing should be true', () => {
        // Arrange
        spyOn(service, 'createSVGWrapper').and.returnValue();
        spyOn(service, 'createSVGCircle').and.returnValue(null as unknown as SVGCircleElement);
        spyOn(service, 'createSVGPath').and.returnValue();
        // Act
        service.onMouseDown(MOCK_LEFT_MOUSE_BUTTON_CLICK);
        // Assert
        expect(service.getIsDrawing()).toBeTruthy();
    });

    it('when onMouseDown currentPath contain M and mouse position', () => {
        // Arrange
        spyOn(service, 'createSVGWrapper').and.returnValue();
        spyOn(service, 'createSVGCircle').and.returnValue(null as unknown as SVGCircleElement);
        spyOn(service, 'createSVGPath').and.returnValue();
        // Act
        service.onMouseDown(MOCK_LEFT_MOUSE_BUTTON_CLICK);
        // Assert
        expect(service.getCurrentPath()).toContain(`M${MOCK_X} ${MOCK_Y}`);
    });

    it('when onMouseMove if notDrawing should not update currentPath', () => {
        // Arrange
        spyOn(service, 'getIsDrawing').and.returnValue(false);
        // Act
        service.onMouseMove(MOCK_LEFT_MOUSE_BUTTON_CLICK);
        // Assert
        expect(service.getCurrentPath()).toBe('');
    });

    it('when onMouseMove if isDrawing currentPath contain L and mouse position', () => {
        // Arrange
        spyOn(service, 'getIsDrawing').and.returnValue(true);
        spyOn(service, 'updateSVGPath').and.returnValue();
        spyOn(service, 'updatePreviewCircle').and.returnValue();
        // Act
        service.onMouseMove(MOCK_LEFT_MOUSE_BUTTON_CLICK);
        // Assert
        expect(service.getCurrentPath()).toContain(`L${MOCK_X} ${MOCK_Y}`);
    });

    it('when onMouseUp if isDrawing then currentPath is empty', () => {
        // Arrange
        spyOn(service, 'getIsDrawing').and.returnValue(true);
        // Act
        service.onMouseUp(MOCK_LEFT_MOUSE_BUTTON_CLICK);
        // Assert
        expect(service.getCurrentPath()).toBe('');
    });

    it('when onMouseLeave then onMouseUp is called', () => {
        // Arrange
        const spyMouseUp = spyOn(service, 'onMouseUp').and.returnValue();
        // Act
        service.onMouseLeave(MOCK_LEFT_MOUSE_BUTTON_CLICK);
        // Assert
        expect(spyMouseUp).toHaveBeenCalled ();
    });

    it('when createSVGWrapper is called renderer.setAttribute is called before appendChild', () => {
        // Arrange
        // Act
        service.createSVGWrapper();
        // Assert
        expect(spyOnSetAttribute).toHaveBeenCalledBefore(spyOnAppendChild);
    });

    it('when createSVGCircle then renderer.createElement is called before setAttribute and before appendChild', () => {
        // Arrange
        const mockCircle = createMockSVGCircle();
        const spyOnCreateElement = spyOn(rendererMock, 'createElement').and.returnValue(mockCircle);
        // Act
        service.createSVGCircle(MOCK_X, MOCK_Y);
        // Assert
        expect(spyOnCreateElement).toHaveBeenCalledBefore(spyOnSetAttribute);
        expect(spyOnSetAttribute).toHaveBeenCalledBefore(spyOnAppendChild);
    });

    it('when updatePreviewCirlce then renderer.setAttribute is called twice', () => {
        // Arrange
        // Act
        service.updatePreviewCircle(MOCK_X, MOCK_Y);
        // Assert
        expect(spyOnSetAttribute).toHaveBeenCalledTimes(2);
    });

    it('when updateSVGPath then renderer.setAttribute is called', () => {
        // Arrange
        // Act
        service.updateSVGPath();
        // Assert
        expect(spyOnSetAttribute).toHaveBeenCalled();
    });

    it('when createSVGCircle setAttribute is called three times and before appendChild', () => {
        // Arrange
        // Act
        service.createSVGCircle(MOCK_X, MOCK_Y);
        // Assert
        expect(spyOnSetAttribute).toHaveBeenCalledTimes(3);
        expect(spyOnSetAttribute).toHaveBeenCalledBefore(spyOnAppendChild);
    });

    it('when createSVGPath then setAttribute is called three times and before appendChild', () => {
        // Arrange
        // Act
        service.createSVGPath();
        // Assert
        expect(spyOnSetAttribute).toHaveBeenCalledTimes(3);
        expect(spyOnSetAttribute).toHaveBeenCalledBefore(spyOnAppendChild);
    });

    it('not implemented methods (onMouseEnter, onKeyDown, onKeyUp) should return undefined', () => {
        // Arrange
        // Act
        // Assert
        expect(service.onMouseLeave(MOCK_LEFT_MOUSE_BUTTON_CLICK)).toBeUndefined();
        expect(service.onKeyDown(MOCK_KEYBOARD_SHIFT)).toBeUndefined();
        expect(service.onKeyUp(MOCK_KEYBOARD_SHIFT)).toBeUndefined();
    });
});
