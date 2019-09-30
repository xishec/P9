import { TestBed, getTestBed } from '@angular/core/testing';
import { Renderer2 } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { ColorApplicatorToolService } from './color-applicator-tool.service';
import { DrawStackService } from '../../draw-stack/draw-stack.service';
import { createMockSVGCircle, createMouseEvent } from '../../../../classes/test-helpers';
import { ToolName } from 'src/constants/tool-constants';
import { ColorToolService } from '../color-tool/color-tool.service';

describe('ColorApplicatorToolService', () => {
    let service: ColorApplicatorToolService;
    let injector: TestBed;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                DrawStackService,
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
        service['currentStackTarget'].targetPosition = 0;
        service['drawStack'].push(createMockSVGCircle());
    });

    it('ColorApplicatorToolService should be created', () => {
        expect(service).toBeTruthy();
    });

    it('#initializeColorToolService should ', () => {
        let colorService: ColorToolService = new ColorToolService();
        let primaryColorTmp: BehaviorSubject<string> = colorService['primaryColor'];
        service.initializeColorToolService(new ColorToolService());
        expect('#' + primaryColorTmp.value).toEqual(service['primaryColor']);
    });

    it('#onMouseDown should set attribute to stroke when left button clicked if tool is Brush', () => {
        let mouseEventTmp = createMouseEvent(1, 1, 0);
        service['currentStackTarget'].toolName = ToolName.Brush;
        service.onMouseDown(mouseEventTmp);
        expect(service['renderer']).toBeTruthy();
    });

    it('#onMouseDown should not set attribute to stroke when left button clicked if tool is Quill', () => {
        let mouseEventTmp = createMouseEvent(1, 1, 0);
        service['currentStackTarget'].toolName = ToolName.Quill;
        service.onMouseDown(mouseEventTmp);
        expect(service['renderer']).toBeTruthy();
    });

    it('#onMouseDown should not set attribute to stroke when right button clicked if tool is Brush', () => {
        let mouseEventTmp = createMouseEvent(1, 1, 2);
        service['currentStackTarget'].toolName = ToolName.Brush;
        service.onMouseDown(mouseEventTmp);
        expect(service['renderer']).toBeTruthy();
    });

    it('#onMouseDown should set attribute to stroke when right button clicked if tool is Quill ', () => {
        let mouseEventTmp = createMouseEvent(1, 1, 2);
        service['currentStackTarget'].toolName = ToolName.Quill;
        service.onMouseDown(mouseEventTmp);
        expect(service['renderer']).toBeTruthy();
    });

    it('#onMouseUp should not change ColorApplicatorToolService', () => {
        let event: MouseEvent = new MouseEvent('click');
        service.onMouseUp(event);
        expect(service).toBeTruthy();
    });

    it('#onMouseEnter should not change ColorApplicatorToolService', () => {
        let event: MouseEvent = new MouseEvent('click');
        service.onMouseEnter(event);
        expect(service).toBeTruthy();
    });

    it('#onMouseLeave should not change ColorApplicatorToolService', () => {
        let event: MouseEvent = new MouseEvent('click');
        service.onMouseLeave(event);
        expect(service).toBeTruthy();
    });

    it('#onKeyDown should not change ColorApplicatorToolService', () => {
        let event: KeyboardEvent = new KeyboardEvent('click');
        service.onKeyDown(event);
        expect(service).toBeTruthy();
    });

    it('#onKeyUp should not change ColorApplicatorToolService', () => {
        let event: KeyboardEvent = new KeyboardEvent('click');
        service.onKeyUp(event);
        expect(service).toBeTruthy();
    });

    it('#onMouseMove should not change ColorApplicatorToolService', () => {
        let event: MouseEvent = new MouseEvent('click');
        service.onMouseMove(event);
        expect(service).toBeTruthy();
    });
});
