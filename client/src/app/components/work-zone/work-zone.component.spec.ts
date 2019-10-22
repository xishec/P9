import { NO_ERRORS_SCHEMA, Renderer2 } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BehaviorSubject } from 'rxjs';

import { DrawingModalWindowService } from 'src/app/services/drawing-modal-window/drawing-modal-window.service';
import { AbstractToolService } from 'src/app/services/tools/abstract-tools/abstract-tool.service';
import { ColorToolService } from 'src/app/services/tools/color-tool/color-tool.service';
import { ToolSelectorService } from 'src/app/services/tools/tool-selector/tool-selector.service';
import { DrawingInfo } from 'src/classes/DrawingInfo';
// import { createKeyBoardEvent, createMouseEvent } from 'src/classes/test-helpers';
import { DEFAULT_WHITE } from 'src/constants/color-constants';
// import { Keys, Mouse } from 'src/constants/constants';
import { ToolName } from 'src/constants/tool-constants';
import { DrawStackService } from '../../services/draw-stack/draw-stack.service';
import { WorkZoneComponent } from './work-zone.component';
import { HttpClientModule } from '@angular/common/http';

// const MOCK_X = 10;
// const MOCK_Y = 10;
// const MOCK_LEFT_MOUSE_BUTTON_CLICK = createMouseEvent(MOCK_X, MOCK_Y, Mouse.LeftButton);
// const MOCK_KEYBOARD_SHIFT = createKeyBoardEvent(Keys.Shift);

describe('WorkZoneComponent', () => {
    let component: WorkZoneComponent;
    let fixture: ComponentFixture<WorkZoneComponent>;
    // let injector: TestBed;
    // let abstractToolService: AbstractToolService;

    // let spyOnMouseDown: jasmine.Spy;
    // let spyOnMouseUp: jasmine.Spy;
    // let spyOnMouseMove: jasmine.Spy;
    // let spyOnKeyUp: jasmine.Spy;
    // let spyOnKeyDown: jasmine.Spy;
    // let spyOnMouseEnter: jasmine.Spy;
    // let spyOnMouseLeave: jasmine.Spy;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [WorkZoneComponent],
            imports : [HttpClientModule],
            providers: [
                {
                    provide: AbstractToolService,
                    useValue: {
                        onMouseMove: () => null,
                        onMouseDown: () => null,
                        onMouseUp: () => null,
                        onKeyDown: () => null,
                        onKeyUp: () => null,
                        onMouseEnter: () => null,
                        onMouseLeave: () => null,
                    },
                },
                {
                    provide: DrawingModalWindowService,
                    useValue: {
                        drawingInfo: new BehaviorSubject<DrawingInfo>(new DrawingInfo(0, 0, DEFAULT_WHITE)),
                        currentDisplayNewDrawingModalWindow: new BehaviorSubject<boolean>(false).asObservable(),
                    },
                },
                {
                    provide: Renderer2,
                },
                {
                    provide: DrawStackService,
                    useValue: {
                        reset: () => [],
                    },
                },
                {
                    provide: ToolSelectorService,
                    useValue: {
                        currentToolName: new BehaviorSubject<DrawingInfo>(new DrawingInfo(0, 0, DEFAULT_WHITE)),
                        initTools: () => null,
                    },
                },
                {
                    provide: ColorToolService,
                    useValue: {
                        backgroundColor: new BehaviorSubject<string>(DEFAULT_WHITE),
                    },
                },
            ],
            schemas: [NO_ERRORS_SCHEMA],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(WorkZoneComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();

        // injector = getTestBed();
        // abstractToolService = injector.get<AbstractToolService>(AbstractToolService as Type<AbstractToolService>);

        // spyOnMouseDown = spyOn(abstractToolService, 'onMouseDown').and.returnValue();
        // spyOnMouseUp = spyOn(abstractToolService, 'onMouseUp').and.returnValue();
        // spyOnKeyDown = spyOn(abstractToolService, 'onKeyDown').and.returnValue();
        // spyOnKeyUp = spyOn(abstractToolService, 'onKeyUp').and.returnValue();
        // spyOnMouseMove = spyOn(abstractToolService, 'onMouseMove').and.returnValue();
        // spyOnMouseEnter = spyOn(abstractToolService, 'onMouseEnter').and.returnValue();
        // spyOnMouseLeave = spyOn(abstractToolService, 'onMouseLeave').and.returnValue();
    });

    it('should be created', () => {
        expect(component).toBeTruthy();
    });

    it('should call window.alert with Veuillez créer un nouveau dessin!', () => {
        spyOn(window, 'alert');
        component.empty = true;
        component.onClickRectangle();
        expect(window.alert).toHaveBeenCalledWith('Veuillez créer un nouveau dessin!');
    });

    it('should not call window.alert with Veuillez créer un nouveau dessin!', () => {
        spyOn(window, 'alert');
        component.empty = false;
        component.onClickRectangle();
        expect(window.alert).not.toHaveBeenCalledWith('Veuillez créer un nouveau dessin!');
    });

    it('should return cursor style not-allowed when isEmpty', () => {
        component.empty = true;
        expect(component.getCursorStyle().cursor).toEqual('not-allowed');
    });

    it('should return cursor style crosshair when toolName is Brush', () => {
        component.empty = false;
        component.toolName = ToolName.Brush;
        expect(component.getCursorStyle().cursor).toEqual('crosshair');
    });

    it('should return cursor style crosshair when toolName is Pencil', () => {
        component.empty = false;
        component.toolName = ToolName.Pencil;
        expect(component.getCursorStyle().cursor).toEqual('crosshair');
    });

    it('should return cursor style crosshair when toolName is Rectangle', () => {
        component.empty = false;
        component.toolName = ToolName.Rectangle;
        expect(component.getCursorStyle().cursor).toEqual('crosshair');
    });

    it('should return cursor style default by default', () => {
        component.empty = false;
        component.toolName = ToolName.NewDrawing;
        expect(component.getCursorStyle().cursor).toEqual('default');
    });

    // it('should call onMouseDown when currentTool is not undefined and workzone is not empty', () => {
    //     component.currentTool = abstractToolService;
    //     component.empty = false;
    //     component.onMouseDown(MOCK_LEFT_MOUSE_BUTTON_CLICK);
    //     expect(spyOnMouseDown).toHaveBeenCalled();
    // });

    // it('should not call onMouseDown when currentTool is undefined or workzone is empty', () => {
    //     component.currentTool = abstractToolService;
    //     component.empty = true;
    //     component.onMouseDown(MOCK_LEFT_MOUSE_BUTTON_CLICK);
    //     expect(spyOnMouseDown).not.toHaveBeenCalled();
    // });

    // it('should call onMouseUp when currentTool is not undefined and workzone is not empty', () => {
    //     component.currentTool = abstractToolService;
    //     component.empty = false;
    //     component.onMouseUp(MOCK_LEFT_MOUSE_BUTTON_CLICK);
    //     expect(spyOnMouseUp).toHaveBeenCalled();
    // });

    // it('should not call onMouseUp when currentTool is undefined or workzone is empty', () => {
    //     component.currentTool = abstractToolService;
    //     component.empty = true;
    //     component.onMouseUp(MOCK_LEFT_MOUSE_BUTTON_CLICK);
    //     expect(spyOnMouseUp).not.toHaveBeenCalled();
    // });

    // it('should call onMouseEnter when currentTool is not undefined and workzone is not empty', () => {
    //     component.currentTool = abstractToolService;
    //     component.empty = false;
    //     component.onMouseEnter(MOCK_LEFT_MOUSE_BUTTON_CLICK);
    //     expect(spyOnMouseEnter).toHaveBeenCalled();
    // });

    // it('should not call onMouseEnter when currentTool is undefined or workzone is empty', () => {
    //     component.currentTool = abstractToolService;
    //     component.empty = true;
    //     component.onMouseEnter(MOCK_LEFT_MOUSE_BUTTON_CLICK);
    //     expect(spyOnMouseEnter).not.toHaveBeenCalled();
    // });

    // it('should call onMouseLeave when currentTool is not undefined and workzone is not empty', () => {
    //     component.currentTool = abstractToolService;
    //     component.empty = false;
    //     component.onMouseLeave(MOCK_LEFT_MOUSE_BUTTON_CLICK);
    //     expect(spyOnMouseLeave).toHaveBeenCalled();
    // });

    // it('should not call onMouseLeave when currentTool is undefined or workzone is empty', () => {
    //     component.currentTool = abstractToolService;
    //     component.empty = true;
    //     component.onMouseLeave(MOCK_LEFT_MOUSE_BUTTON_CLICK);
    //     expect(spyOnMouseLeave).not.toHaveBeenCalled();
    // });

    // it('should call onMouseMove when currentTool is not undefined and workzone is not empty', () => {
    //     component.currentTool = abstractToolService;
    //     component.empty = false;
    //     component.onMouseMove(MOCK_LEFT_MOUSE_BUTTON_CLICK);
    //     expect(spyOnMouseMove).toHaveBeenCalled();
    // });

    // it('should not call onMouseMove when currentTool is undefined or workzone is empty', () => {
    //     component.currentTool = abstractToolService;
    //     component.empty = true;
    //     component.onMouseMove(MOCK_LEFT_MOUSE_BUTTON_CLICK);
    //     expect(spyOnMouseMove).not.toHaveBeenCalled();
    // });

    // it('should call onKeyUp when currentTool is not undefined and workzone is not empty', () => {
    //     component.currentTool = abstractToolService;
    //     component.empty = false;
    //     component.onKeyUp(MOCK_KEYBOARD_SHIFT);
    //     expect(spyOnKeyUp).toHaveBeenCalled();
    // });

    // it('should not call onKeyUp when currentTool is undefined or workzone is empty', () => {
    //     component.currentTool = abstractToolService;
    //     component.empty = true;
    //     component.onKeyUp(MOCK_KEYBOARD_SHIFT);
    //     expect(spyOnKeyUp).not.toHaveBeenCalled();
    // });

    // it('should call onKeyDown when currentTool is not undefined and workzone is not empty', () => {
    //     component.currentTool = abstractToolService;
    //     component.empty = false;
    //     component.onKeyDown(MOCK_KEYBOARD_SHIFT);
    //     expect(spyOnKeyDown).toHaveBeenCalled();
    // });

    // it('should not call onKeyDown when currentTool is undefined or workzone is empty', () => {
    //     component.currentTool = abstractToolService;
    //     component.empty = true;
    //     component.onKeyDown(MOCK_KEYBOARD_SHIFT);
    //     expect(spyOnKeyDown).not.toHaveBeenCalled();
    // });
});
