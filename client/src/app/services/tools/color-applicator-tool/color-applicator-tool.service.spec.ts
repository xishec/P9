import { Renderer2 } from '@angular/core';
import { getTestBed, TestBed } from '@angular/core/testing';
import { BehaviorSubject } from 'rxjs';

import { Mouse } from 'src/constants/constants';
import { ToolName } from 'src/constants/tool-constants';
import { createMockSVGCircle, createMouseEvent } from '../../../../classes/test-helpers.spec';
import { DrawStackService } from '../../draw-stack/draw-stack.service';
import { ColorToolService } from '../color-tool/color-tool.service';
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
                        currentStackTarget : {
                            subscribe : () => null,
                        },
                        getElementByPosition : () => {
                            const mockSVGGelement = {};
                            return mockSVGGelement as SVGGElement;
                        },
                    },
                },
            ],
        });
        injector = getTestBed();
        service = injector.get(ColorApplicatorToolService);
        service[`drawStack`].push(createMockSVGCircle());

        mockRenderer = injector.get(Renderer2);
        spyOnSetAttribute = spyOn(mockRenderer, 'setAttribute');
    });

    it('ColorApplicatorToolService should be created', () => {
        expect(service).toBeTruthy();
    });

    it('initializeColorToolService should be primaryColor from colorService', () => {
        const colorService: ColorToolService = new ColorToolService();
        const primaryColorTmp: BehaviorSubject<string> = colorService[`primaryColor`];
        service.initializeColorToolService(new ColorToolService());
        expect(service[`primaryColor`]).toEqual('#' + primaryColorTmp.value);
    });

    it('onMouseDown should call setAttribute twice when left button clicked if tool is Brush', () => {
        const mouseEventTmp = createMouseEvent(1, 1, Mouse.LeftButton);
        service.isOnTarget = true;
        const mockStackTargetInfo  = {
            targetPosition: 0,
            toolName: ToolName.Brush,
        };
        service.currentStackTarget = mockStackTargetInfo;

        service.onMouseDown(mouseEventTmp);

        expect(spyOnSetAttribute).toHaveBeenCalledTimes(2);
    });

    it('onMouseDown should call setAttribute once when left button clicked if tool is Rectangle', () => {
        const mouseEventTmp = createMouseEvent(1, 1, Mouse.LeftButton);
        service.isOnTarget = true;
        const mockStackTargetInfo  = {
            targetPosition: 0,
            toolName: ToolName.Rectangle,
        };
        service.currentStackTarget = mockStackTargetInfo;

        service.onMouseDown(mouseEventTmp);

        expect(spyOnSetAttribute).toHaveBeenCalledTimes(1);
    });

    it('onMouseDown should not call setAttribute to stroke when right button clicked if tool is Brush', () => {
        const mouseEventTmp = createMouseEvent(1, 1, Mouse.RightButton);
        const mockStackTargetInfo  = {
            targetPosition: 0,
            toolName: ToolName.Brush,
        };
        service.currentStackTarget = mockStackTargetInfo;

        service.onMouseDown(mouseEventTmp);

        expect(spyOnSetAttribute).not.toHaveBeenCalled();
    });

    it('onMouseDown should call setAttribute once when right button clicked if tool is Rectangle ', () => {
        const mouseEventTmp = createMouseEvent(1, 1, Mouse.RightButton);
        service.isOnTarget = true;
        const mockStackTargetInfo  = {
            targetPosition: 0,
            toolName: ToolName.Rectangle,
        };
        service.currentStackTarget = mockStackTargetInfo;

        service.onMouseDown(mouseEventTmp);

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
