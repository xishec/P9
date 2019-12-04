import { ElementRef, Renderer2, Type } from '@angular/core';
import { getTestBed, TestBed } from '@angular/core/testing';

import { DrawStackService } from 'src/app/services/draw-stack/draw-stack.service';
import { KEYS, MOUSE } from 'src/constants/constants';
import { createKeyBoardEvent, createMouseEvent } from '../../../../../classes/test-helpers.spec';
import { AttributesManagerService } from '../../attributes-manager/attributes-manager.service';
import { ColorToolService } from '../../color-tool/color-tool.service';
import { TracingToolService } from './tracing-tool.service';

const MOCK_X = 10;
const MOCK_Y = 10;
const MOCK_THICKNESS = 1;
const MOCK_COLOR = '#000000';
const MOCK_LEFT_MOUSE_BUTTON_CLICK = createMouseEvent(MOCK_X, MOCK_Y, MOUSE.LeftButton);
const MOCK_KEYBOARD_SHIFT = createKeyBoardEvent(KEYS.Shift);

describe('TracingToolService', () => {
    let injector: TestBed;
    let service: TracingToolService;
    let rendererMock: Renderer2;

    let spyOnSetAttribute: jasmine.Spy;
    let spyOnAppendChild: jasmine.Spy;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                TracingToolService,
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
                        getDrawStackLength: () => 0,
                    },
                },
                {
                    provide: AttributesManagerService,
                    useValue: {
                        currentThickness: () => MOCK_THICKNESS,
                    },
                },
                {
                    provide: ColorToolService,
                    useValue: {
                        primaryColor: () => MOCK_COLOR,
                    },
                },
            ],
        });

        injector = getTestBed();
        service = injector.get(TracingToolService);

        spyOn<any>(service, 'getXPos').and.returnValue(MOCK_X);
        spyOn<any>(service, 'getYPos').and.returnValue(MOCK_Y);

        rendererMock = injector.get<Renderer2>(Renderer2 as Type<Renderer2>);
        const drawStackMock = injector.get<DrawStackService>(DrawStackService as Type<DrawStackService>);
        const elementRefMock = injector.get<ElementRef>(ElementRef as Type<ElementRef>);
        service.initializeService(elementRefMock, rendererMock, drawStackMock);

        spyOnSetAttribute = spyOn(rendererMock, 'setAttribute').and.returnValue();
        spyOnAppendChild = spyOn(rendererMock, 'appendChild').and.returnValue();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('when onMouseDown isDrawing should be true', () => {
        spyOn<any>(service, 'createSVGWrapper');
        spyOn<any>(service, 'createSVGCircle').and.returnValue((null as unknown) as SVGCircleElement);
        spyOn<any>(service, 'createSVGPath');

        service.onMouseDown(MOCK_LEFT_MOUSE_BUTTON_CLICK);

        expect(service.getIsDrawing()).toBeTruthy();
    });

    it('when onMouseDown currentPath contain M and mouse position', () => {
        spyOn<any>(service, 'createSVGWrapper');
        spyOn<any>(service, 'createSVGCircle').and.returnValue((null as unknown) as SVGCircleElement);
        spyOn<any>(service, 'createSVGPath');

        service.onMouseDown(MOCK_LEFT_MOUSE_BUTTON_CLICK);

        expect(service.getCurrentPath()).toContain(`M${MOCK_X} ${MOCK_Y}`);
    });

    it('when onMouseMove if notDrawing should not update currentPath', () => {
        spyOn(service, 'getIsDrawing').and.returnValue(false);

        service.onMouseMove(MOCK_LEFT_MOUSE_BUTTON_CLICK);

        expect(service.getCurrentPath()).toBe('');
    });

    it('when onMouseMove if isDrawing currentPath contain L and mouse position', () => {
        spyOn(service, 'getIsDrawing').and.returnValue(true);
        spyOn<any>(service, 'updateSVGPath');
        spyOn<any>(service, 'updatePreviewCircle');

        service.onMouseMove(MOCK_LEFT_MOUSE_BUTTON_CLICK);

        expect(service.getCurrentPath()).toContain(`L${MOCK_X} ${MOCK_Y}`);
    });

    it('when onMouseUp if isDrawing then currentPath is empty', () => {
        spyOn(service, 'getIsDrawing').and.returnValue(true);

        service.onMouseUp(MOCK_LEFT_MOUSE_BUTTON_CLICK);

        expect(service.getCurrentPath()).toBe('');
    });

    it('when onMouseLeave then onMouseUp is called', () => {
        const spyMouseUp = spyOn(service, 'onMouseUp').and.returnValue();

        service.onMouseLeave(MOCK_LEFT_MOUSE_BUTTON_CLICK);

        expect(spyMouseUp).toHaveBeenCalled();
    });

    it('when createSVGWrapper is called renderer.setAttribute is called before appendChild', () => {
        service[`createSVGWrapper`]();

        expect(spyOnSetAttribute).toHaveBeenCalledBefore(spyOnAppendChild);
    });

    it('when updatePreviewCircle then renderer.setAttribute is called twice', () => {
        service[`updatePreviewCircle`](MOCK_X, MOCK_Y);

        expect(spyOnSetAttribute).toHaveBeenCalledTimes(2);
    });

    it('when updateSVGPath then renderer.setAttribute is called', () => {
        service[`updateSVGPath`]();

        expect(spyOnSetAttribute).toHaveBeenCalled();
    });

    it('when createSVGCircle setAttribute is called 5 times', () => {
        service[`createSVGCircle`](MOCK_X, MOCK_Y);

        expect(spyOnSetAttribute).toHaveBeenCalledTimes(5);
    });

    it('when createSVGPath then setAttribute is called 4 times and before appendChild', () => {
        service[`createSVGPath`]();

        expect(spyOnSetAttribute).toHaveBeenCalledTimes(4);
        expect(spyOnSetAttribute).toHaveBeenCalledBefore(spyOnAppendChild);
    });

    it('not implemented methods (onMouseEnter, onKeyDown, onKeyUp) should return undefined', () => {
        expect(service.onMouseLeave(MOCK_LEFT_MOUSE_BUTTON_CLICK)).toBeUndefined();
        expect(service.onKeyDown(MOCK_KEYBOARD_SHIFT)).toBeUndefined();
        expect(service.onKeyUp(MOCK_KEYBOARD_SHIFT)).toBeUndefined();
    });

    it('cleanUp should call removeChild if isDrawing', () => {
        service[`isDrawing`] = true;
        const spy = spyOn(rendererMock, 'removeChild');

        service.cleanUp();

        expect(spy).toHaveBeenCalled();
    });
});
