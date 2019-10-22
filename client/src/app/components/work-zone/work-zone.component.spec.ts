import { NO_ERRORS_SCHEMA, Renderer2 } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BehaviorSubject } from 'rxjs';

import { HttpClientModule } from '@angular/common/http';
import { DrawingModalWindowService } from 'src/app/services/drawing-modal-window/drawing-modal-window.service';
import { AbstractToolService } from 'src/app/services/tools/abstract-tools/abstract-tool.service';
import { ColorToolService } from 'src/app/services/tools/color-tool/color-tool.service';
import { ToolSelectorService } from 'src/app/services/tools/tool-selector/tool-selector.service';
import { DrawingInfo } from 'src/classes/DrawingInfo';
import { DEFAULT_WHITE } from 'src/constants/color-constants';
import { ToolName } from 'src/constants/tool-constants';
import { DrawStackService } from '../../services/draw-stack/draw-stack.service';
import { WorkZoneComponent } from './work-zone.component';

describe('WorkZoneComponent', () => {
    let component: WorkZoneComponent;
    let fixture: ComponentFixture<WorkZoneComponent>;

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
});
