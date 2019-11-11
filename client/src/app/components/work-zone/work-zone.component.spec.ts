import { NO_ERRORS_SCHEMA, Renderer2 } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BehaviorSubject } from 'rxjs';

import { HttpClientModule } from '@angular/common/http';
import { ClipboardService } from 'src/app/services/clipboard/clipboard.service';
import { DrawingModalWindowService } from 'src/app/services/drawing-modal-window/drawing-modal-window.service';
import { ModalManagerService } from 'src/app/services/modal-manager/modal-manager.service';
import { DrawingLoaderService } from 'src/app/services/server/drawing-loader/drawing-loader.service';
import { DrawingSaverService } from 'src/app/services/server/drawing-saver/drawing-saver.service';
import { ShortcutManagerService } from 'src/app/services/shortcut-manager/shortcut-manager.service';
import { AbstractToolService } from 'src/app/services/tools/abstract-tools/abstract-tool.service';
import { ColorToolService } from 'src/app/services/tools/color-tool/color-tool.service';
import { GridToolService } from 'src/app/services/tools/grid-tool/grid-tool.service';
import { ToolSelectorService } from 'src/app/services/tools/tool-selector/tool-selector.service';
import { UndoRedoerService } from 'src/app/services/undo-redoer/undo-redoer.service';
import { DrawingInfo } from 'src/classes/DrawingInfo';
import { DEFAULT_WHITE } from 'src/constants/color-constants';
import { ToolName } from 'src/constants/tool-constants';
import { DrawStackService } from '../../services/draw-stack/draw-stack.service';
import { WorkZoneComponent } from './work-zone.component';

describe('WorkZoneComponent', () => {
    let component: WorkZoneComponent;
    let fixture: ComponentFixture<WorkZoneComponent>;

    let drawingLoaderService: DrawingLoaderService;
    // let colorToolService: ColorToolService;
    // let gridToolService: GridToolService;
    // let undoRedoerService: UndoRedoerService;

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
                {
                    provide: GridToolService,
                    useValue: {
                    },
                },
                {
                    provide: ShortcutManagerService,
                    useValue: {
                    },
                },
                {
                    provide: ModalManagerService,
                    useValue: {
                    },
                },
                {
                    provide: DrawingLoaderService,
                    useValue: {
                        emptyDrawStack: new BehaviorSubject<boolean>(true),
                    },
                },
                {
                    provide: DrawingSaverService,
                    useValue: {
                    },
                },
                {
                    provide: UndoRedoerService,
                    useValue: {
                        initializeService: () => null,
                    },
                },
                {
                    provide: ClipboardService,
                    useValue: {
                    },
                },

            ],
            schemas: [NO_ERRORS_SCHEMA],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(WorkZoneComponent);
        component = fixture.componentInstance;

        drawingLoaderService = fixture.debugElement.injector.get(DrawingLoaderService);
    });

    it('should be created', () => {
        expect(component).toBeTruthy();
    });

    it('should call window.alert with Veuillez créer un nouveau dessin!', () => {
        spyOn(window, 'alert');
        drawingLoaderService.emptyDrawStack.next(true);

        component.onClickRectangle();
        expect(window.alert).toHaveBeenCalledWith('Veuillez créer un nouveau dessin!');
    });

    it('should not call window.alert with Veuillez créer un nouveau dessin!', () => {
        spyOn(window, 'alert');
        drawingLoaderService.emptyDrawStack.next(false);

        component.onClickRectangle();
        expect(window.alert).not.toHaveBeenCalledWith('Veuillez créer un nouveau dessin!');
    });

    it('should return cursor style not-allowed when isEmpty', () => {
        drawingLoaderService.emptyDrawStack.next(true);
        expect(component.getCursorStyle().cursor).toEqual('not-allowed');
    });

    it('should return cursor style crosshair when toolName is Brush', () => {
        drawingLoaderService.emptyDrawStack.next(false);
        component.toolName = ToolName.Brush;
        expect(component.getCursorStyle().cursor).toEqual('crosshair');
    });

    it('should return cursor style crosshair when toolName is Pencil', () => {
        drawingLoaderService.emptyDrawStack.next(false);
        component.toolName = ToolName.Pencil;
        expect(component.getCursorStyle().cursor).toEqual('crosshair');
    });

    it('should return cursor style crosshair when toolName is Rectangle', () => {
        drawingLoaderService.emptyDrawStack.next(false);
        component.toolName = ToolName.Rectangle;
        expect(component.getCursorStyle().cursor).toEqual('crosshair');
    });

    it('should return cursor style default by default', () => {
        drawingLoaderService.emptyDrawStack.next(false);
        component.toolName = ToolName.NewDrawing;
        expect(component.getCursorStyle().cursor).toEqual('default');
    });
});
