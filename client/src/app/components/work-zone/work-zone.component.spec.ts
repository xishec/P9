import { HttpClientModule } from '@angular/common/http';
import { NO_ERRORS_SCHEMA, Renderer2 } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BehaviorSubject } from 'rxjs';

import { MatSnackBar } from '@angular/material';
import { ClipboardService } from 'src/app/services/clipboard/clipboard.service';
import { DrawingModalWindowService } from 'src/app/services/drawing-modal-window/drawing-modal-window.service';
import { ModalManagerService } from 'src/app/services/modal-manager/modal-manager.service';
import { DrawingLoaderService } from 'src/app/services/server/drawing-loader/drawing-loader.service';
import { DrawingSaverService } from 'src/app/services/server/drawing-saver/drawing-saver.service';
import { ShortcutManagerService } from 'src/app/services/shortcut-manager/shortcut-manager.service';
import { AbstractToolService } from 'src/app/services/tools/abstract-tools/abstract-tool.service';
import { ColorToolService } from 'src/app/services/tools/color-tool/color-tool.service';
import { GridToolService } from 'src/app/services/tools/grid-tool/grid-tool.service';
import { MagnetismToolService } from 'src/app/services/tools/magnetism-tool/magnetism-tool.service';
import { ToolSelectorService } from 'src/app/services/tools/tool-selector/tool-selector.service';
import { UndoRedoerService } from 'src/app/services/undo-redoer/undo-redoer.service';
import { DEFAULT_WHITE } from 'src/constants/color-constants';
import { CURSOR_STYLES, TOOL_NAME } from 'src/constants/tool-constants';
import { DrawingInfo } from '../../../../../common/communication/DrawingInfo';
import { DrawStackService } from '../../services/draw-stack/draw-stack.service';
import { WorkZoneComponent } from './work-zone.component';

describe('WorkZoneComponent', () => {
    let component: WorkZoneComponent;
    let fixture: ComponentFixture<WorkZoneComponent>;

    let drawingLoaderService: DrawingLoaderService;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [WorkZoneComponent],
            imports: [HttpClientModule],
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
                    provide: MatSnackBar,
                    useValue: {
                        open: () => null,
                    },
                },
                {
                    provide: DrawingModalWindowService,
                    useValue: {
                        drawingInfo: new BehaviorSubject<DrawingInfo>({
                            name: '',
                            createdAt: 0,
                            lastModified: 0,
                            labels: [],
                            idStack: [],
                            width: 0,
                            height: 0,
                            color: '',
                        } as DrawingInfo),
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
                        currentToolName: TOOL_NAME.Brush,
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
                    useValue: {},
                },
                {
                    provide: ShortcutManagerService,
                    useValue: {},
                },
                {
                    provide: ModalManagerService,
                    useValue: {},
                },
                {
                    provide: DrawingLoaderService,
                    useValue: {
                        emptyDrawStack: new BehaviorSubject<boolean>(true),
                        untouchedWorkZone: new BehaviorSubject<boolean>(true),
                    },
                },
                {
                    provide: DrawingSaverService,
                    useValue: {},
                },
                {
                    provide: UndoRedoerService,
                    useValue: {
                        initializeService: () => null,
                    },
                },
                {
                    provide: ClipboardService,
                    useValue: {},
                },
                {
                    provide: MagnetismToolService,
                    useValue: {},
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

    it('should call alert with Veuillez créer un nouveau dessin!', () => {
        const spy = spyOn(component[`snackBar`], 'open');
        drawingLoaderService.untouchedWorkZone.next(true);

        component.onClickRectangle();
        expect(spy).toHaveBeenCalled();
    });

    it('should not call alert with Veuillez créer un nouveau dessin!', () => {
        const spy = spyOn(component[`snackBar`], 'open');
        drawingLoaderService.untouchedWorkZone.next(false);

        component.onClickRectangle();
        expect(spy).not.toHaveBeenCalled();
    });

    it('should return cursor style not-allowed when isEmpty', () => {
        drawingLoaderService.emptyDrawStack.next(true);
        drawingLoaderService.untouchedWorkZone.next(true);
        expect(component.getCursorStyle().cursor).toEqual('not-allowed');
    });

    it('should return cursor style crosshair when toolName is Brush', () => {
        drawingLoaderService.emptyDrawStack.next(false);
        drawingLoaderService.untouchedWorkZone.next(false);
        component.toolName = TOOL_NAME.Brush;

        expect(component.getCursorStyle().cursor).toEqual(CURSOR_STYLES.Crosshair);
    });

    it('should return cursor style crosshair when toolName is Pencil', () => {
        drawingLoaderService.emptyDrawStack.next(false);
        drawingLoaderService.untouchedWorkZone.next(false);
        component.toolName = TOOL_NAME.Pencil;

        expect(component.getCursorStyle().cursor).toEqual(CURSOR_STYLES.Crosshair);
    });

    it('should return cursor style crosshair when toolName is Rectangle', () => {
        drawingLoaderService.emptyDrawStack.next(false);
        drawingLoaderService.untouchedWorkZone.next(false);
        component.toolName = TOOL_NAME.Rectangle;

        expect(component.getCursorStyle().cursor).toEqual(CURSOR_STYLES.Crosshair);
    });

    it('should return cursor style default by default', () => {
        drawingLoaderService.emptyDrawStack.next(false);
        drawingLoaderService.untouchedWorkZone.next(false);
        component.toolName = TOOL_NAME.NewDrawing;

        expect(component.getCursorStyle().cursor).toEqual(CURSOR_STYLES.Default);
    });
});
