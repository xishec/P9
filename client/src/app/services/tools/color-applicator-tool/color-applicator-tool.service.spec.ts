import { ElementRef, Renderer2, Type } from '@angular/core';
import { getTestBed, TestBed } from '@angular/core/testing';

import { provideAutoMock } from 'src/classes/test.helper.msTeams.spec';
import { MOUSE } from 'src/constants/constants';
import { TOOL_NAME } from 'src/constants/tool-constants';
import { createMockSVGCircle, createMouseEvent } from '../../../../classes/test-helpers.spec';
import { DrawStackService } from '../../draw-stack/draw-stack.service';
import { UndoRedoerService } from '../../undo-redoer/undo-redoer.service';
import { ColorApplicatorToolService } from './color-applicator-tool.service';

describe('ColorApplicatorToolService', () => {
    let service: ColorApplicatorToolService;
    let injector: TestBed;
    let mockRenderer: Renderer2;

    let spyOnSetAttribute: jasmine.Spy;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                {
                    provide: Renderer2,
                    useValue: {
                        createElement: () => null,
                        setAttribute: () => true,
                        appendChild: () => null,
                    },
                },
                {
                    provide: DrawStackService,
                    useValue: {
                        push: () => null,
                        currentStackTarget: {
                            subscribe: () => null,
                        },
                        getElementByPosition: () => {
                            const mockSVGGElement = {
                                getAttribute: () => null,
                            };
                            return (mockSVGGElement as unknown) as SVGGElement;
                        },
                    },
                },
                {
                    provide: UndoRedoerService,
                    useValue: {
                        saveCurrentState: () => null,
                    },
                },
                provideAutoMock(ElementRef),
            ],
        });
        injector = getTestBed();
        service = injector.get(ColorApplicatorToolService);

        mockRenderer = injector.get(Renderer2);
        const drawStackMock = injector.get<DrawStackService>(DrawStackService as Type<DrawStackService>);
        const elementRefMock = injector.get<ElementRef>(ElementRef as Type<ElementRef>);
        service.initializeService(elementRefMock, mockRenderer, drawStackMock);

        service[`drawStack`].push(createMockSVGCircle());
        spyOnSetAttribute = spyOn(mockRenderer, 'setAttribute');
    });

    it('ColorApplicatorToolService should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should return true if tool is rectangle, polygon or ellipsis when calling isShape', () => {
        const mockStackTargetInfo = {
            targetPosition: 0,
            toolName: TOOL_NAME.Rectangle,
            isValid: () => true,
        };
        service.currentStackTarget = mockStackTargetInfo;

        const res = service.isShape();
        expect(res).toBeTruthy();
    });

    it('should return false if tool is not rectangle, polygon or ellipsis when calling isShape', () => {
        const mockStackTargetInfo = {
            targetPosition: 0,
            toolName: TOOL_NAME.Brush,
            isValid: () => true,
        };
        service.currentStackTarget = mockStackTargetInfo;

        const res = service.isShape();
        expect(res).toBeFalsy();
    });

    it('should return true if tool is text when calling isText', () => {
        const mockStackTargetInfo = {
            targetPosition: 0,
            toolName: TOOL_NAME.Text,
            isValid: () => true,
        };
        service.currentStackTarget = mockStackTargetInfo;

        const res = service.isText();
        expect(res).toBeTruthy();
    });

    it('should return false if tool is not text when calling isText', () => {
        const mockStackTargetInfo = {
            targetPosition: 0,
            toolName: TOOL_NAME.Rectangle,
            isValid: () => true,
        };
        service.currentStackTarget = mockStackTargetInfo;

        const res = service.isText();
        expect(res).toBeFalsy();
    });

    it('should return true if tool is fill when calling isBucketFill', () => {
        const mockStackTargetInfo = {
            targetPosition: 0,
            toolName: TOOL_NAME.Fill,
            isValid: () => true,
        };
        service.currentStackTarget = mockStackTargetInfo;

        const res = service.isBucketFill();
        expect(res).toBeTruthy();
    });

    it('should return false if tool is not fill when calling isBucketFill', () => {
        const mockStackTargetInfo = {
            targetPosition: 0,
            toolName: TOOL_NAME.Rectangle,
            isValid: () => true,
        };
        service.currentStackTarget = mockStackTargetInfo;

        const res = service.isBucketFill();
        expect(res).toBeFalsy();
    });

    it('should change the stroke color of text stackTarget when calling changeStrokeColorOnText', () => {
        const mockStackTargetInfo = {
            targetPosition: 0,
            toolName: TOOL_NAME.Text,
            isValid: () => true,
        };
        service.currentStackTarget = mockStackTargetInfo;
        service.changeStrokeColorOnText();
        expect(spyOnSetAttribute).toHaveBeenCalledTimes(1);
    });

    it('should change the fill color of text stackTarget when calling changeFillColorOnText', () => {
        const mockStackTargetInfo = {
            targetPosition: 0,
            toolName: TOOL_NAME.Text,
            isValid: () => true,
        };
        service.currentStackTarget = mockStackTargetInfo;
        service.changeFillColorOnText();
        expect(spyOnSetAttribute).toHaveBeenCalledTimes(1);
    });

    it('should change the stroke and fill color of trace stackTarget when calling changeColorOnTrace', () => {
        const mockStackTargetInfo = {
            targetPosition: 0,
            toolName: TOOL_NAME.Brush,
            isValid: () => true,
        };
        service.currentStackTarget = mockStackTargetInfo;
        service.changeColorOnTrace();
        expect(spyOnSetAttribute).toHaveBeenCalledTimes(3);
    });

    it('should only change the stroke color of shape stackTarget when calling changeStrokeColorOnShape', () => {
        const mockStackTargetInfo = {
            targetPosition: 0,
            toolName: TOOL_NAME.Rectangle,
            isValid: () => true,
        };
        service.currentStackTarget = mockStackTargetInfo;
        service.changeStrokeColorOnShape();
        expect(spyOnSetAttribute).toHaveBeenCalledTimes(1);
    });

    it('should only change the fill color of shape stackTarget when calling changeFillColorOnShape', () => {
        const mockStackTargetInfo = {
            targetPosition: 0,
            toolName: TOOL_NAME.Rectangle,
            isValid: () => true,
        };
        service.currentStackTarget = mockStackTargetInfo;
        service.changeFillColorOnShape();
        expect(spyOnSetAttribute).toHaveBeenCalledTimes(1);
    });

    it('onMouseDown should call setAttribute three times when left button clicked if tool is Brush', () => {
        const mouseEventMock = createMouseEvent(1, 1, MOUSE.LeftButton);
        service.isOnTarget = true;
        const mockStackTargetInfo = {
            targetPosition: 0,
            toolName: TOOL_NAME.Brush,
            isValid: () => true,
        };
        service.currentStackTarget = mockStackTargetInfo;

        service.onMouseDown(mouseEventMock);

        expect(spyOnSetAttribute).toHaveBeenCalledTimes(3);
    });

    it('onMouseDown should call setAttribute once when left button clicked if tool is Rectangle', () => {
        const mouseEventMock = createMouseEvent(1, 1, MOUSE.LeftButton);
        service.isOnTarget = true;
        const mockStackTargetInfo = {
            targetPosition: 0,
            toolName: TOOL_NAME.Rectangle,
            isValid: () => true,
        };
        service.currentStackTarget = mockStackTargetInfo;

        service.onMouseDown(mouseEventMock);

        expect(spyOnSetAttribute).toHaveBeenCalledTimes(1);
    });

    it('onMouseDown should not call setAttribute to stroke when right button clicked if tool is Brush', () => {
        const mouseEventMock = createMouseEvent(1, 1, MOUSE.RightButton);
        const mockStackTargetInfo = {
            targetPosition: 0,
            toolName: TOOL_NAME.Brush,
            isValid: () => true,
        };
        service.currentStackTarget = mockStackTargetInfo;

        service.onMouseDown(mouseEventMock);

        expect(spyOnSetAttribute).not.toHaveBeenCalled();
    });

    it('onMouseDown should call setAttribute once when right button clicked if tool is Rectangle ', () => {
        const mouseEventMock = createMouseEvent(1, 1, MOUSE.RightButton);
        service.isOnTarget = true;
        const mockStackTargetInfo = {
            targetPosition: 0,
            toolName: TOOL_NAME.Rectangle,
            isValid: () => true,
        };
        service.currentStackTarget = mockStackTargetInfo;

        service.onMouseDown(mouseEventMock);

        expect(spyOnSetAttribute).toHaveBeenCalledTimes(1);
    });

    it('onMouseDown should call setAttribute once when left button clicked if target is Text ', () => {
        const mouseEventMock = createMouseEvent(1, 1, MOUSE.LeftButton);
        service.isOnTarget = true;
        const mockStackTargetInfo = {
            targetPosition: 0,
            toolName: TOOL_NAME.Text,
            isValid: () => true,
        };
        service.currentStackTarget = mockStackTargetInfo;

        service.onMouseDown(mouseEventMock);

        expect(spyOnSetAttribute).toHaveBeenCalledTimes(1);
    });

    it('onMouseDown should call setAttribute once when right button clicked if target is Text ', () => {
        const mouseEventMock = createMouseEvent(1, 1, MOUSE.RightButton);
        service.isOnTarget = true;
        const mockStackTargetInfo = {
            targetPosition: 0,
            toolName: TOOL_NAME.Text,
            isValid: () => true,
        };
        service.currentStackTarget = mockStackTargetInfo;

        service.onMouseDown(mouseEventMock);

        expect(spyOnSetAttribute).toHaveBeenCalledTimes(1);
    });

    it('onMouseUp should do nothing', () => {
        const event: MouseEvent = new MouseEvent('click');
        expect(service.onMouseUp(event)).toEqual(undefined);
    });

    it('onMouseEnter should do nothing', () => {
        const event: MouseEvent = new MouseEvent('click');
        expect(service.onMouseEnter(event)).toEqual(undefined);
    });

    it('onMouseLeave should do nothing', () => {
        const event: MouseEvent = new MouseEvent('click');
        expect(service.onMouseLeave(event)).toEqual(undefined);
    });

    it('onKeyDown should do nothing', () => {
        const event: KeyboardEvent = new KeyboardEvent('click');
        expect(service.onKeyDown(event)).toEqual(undefined);
    });

    it('onKeyUp should do nothing', () => {
        const event: KeyboardEvent = new KeyboardEvent('click');
        expect(service.onKeyUp(event)).toEqual(undefined);
    });

    it('onMouseMove should do nothing', () => {
        const event: MouseEvent = new MouseEvent('click');
        expect(service.onMouseMove(event)).toEqual(undefined);
    });
});
