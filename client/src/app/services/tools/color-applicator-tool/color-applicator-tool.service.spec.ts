import { Renderer2 } from '@angular/core';
import { getTestBed, TestBed } from '@angular/core/testing';
import { BehaviorSubject } from 'rxjs';

import { Mouse } from 'src/constants/constants';
import { ToolName } from 'src/constants/tool-constants';
import { createMockSVGCircle, createMouseEvent } from '../../../../classes/test-helpers';
import { ColorToolService } from '../color-tool/color-tool.service';
import { ColorApplicatorToolService } from './color-applicator-tool.service';

fdescribe('ColorApplicatorToolService', () => {
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
            ],
        });
        injector = getTestBed();
        service = injector.get(ColorApplicatorToolService);
        service[`currentStackTarget`].targetPosition = 0;
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
        service[`currentStackTarget`].toolName = ToolName.Brush;

        service.onMouseDown(mouseEventTmp);

        expect(spyOnSetAttribute).toHaveBeenCalledTimes(2);
    });

    it('onMouseDown should call setAttribute once when left button clicked if tool is Rectangle', () => {
        const mouseEventTmp = createMouseEvent(1, 1, Mouse.LeftButton);
        service[`currentStackTarget`].toolName = ToolName.Rectangle;

        service.onMouseDown(mouseEventTmp);

        expect(spyOnSetAttribute).toHaveBeenCalledTimes(1);
    });

    it('onMouseDown should not call setAttribute to stroke when right button clicked if tool is Brush', () => {
        const mouseEventTmp = createMouseEvent(1, 1, Mouse.RightButton);
        service[`currentStackTarget`].toolName = ToolName.Brush;

        service.onMouseDown(mouseEventTmp);

        expect(spyOnSetAttribute).not.toHaveBeenCalled();
    });

    it('onMouseDown should call setAttribute once when right button clicked if tool is Rectangle ', () => {
        const mouseEventTmp = createMouseEvent(1, 1, Mouse.RightButton);
        service[`currentStackTarget`].toolName = ToolName.Rectangle;

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
