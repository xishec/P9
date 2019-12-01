import { getTestBed, TestBed } from '@angular/core/testing';
import { MatDialog, MatSnackBar } from '@angular/material';
import { BehaviorSubject } from 'rxjs';

import { ElementRef, Renderer2, Type } from '@angular/core';
import { provideAutoMock } from 'src/classes/test.helper.msTeams.spec';
import { TOOL_NAME } from 'src/constants/tool-constants';
import { DrawStackService } from '../../draw-stack/draw-stack.service';
import { ToolSelectorService } from './tool-selector.service';

describe('ToolSelectorService', () => {
    let injector: TestBed;
    let service: ToolSelectorService;

    let spyOnChangeCurrentToolName: jasmine.Spy;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                ToolSelectorService,
                {
                    provide: MatDialog,
                    useValue: {},
                },
                {
                    provide: Renderer2,
                    useValue: {
                        setAttribute: () => null,
                        createElement: () => null,
                        appendChild: () => null,
                        removeChild: () => null,
                    },
                },
                {
                    provide: MatSnackBar,
                    useValue: {},
                },
                provideAutoMock(ElementRef),
                provideAutoMock(DrawStackService),
            ],
        });

        injector = getTestBed();
        service = injector.get(ToolSelectorService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('when changeTool with newDrawing tool then displayNewDrawingModal is called', () => {
        const spyOnDisplayNewDrawingModal = spyOn(service, 'displayNewDrawingModal').and.returnValue();
        service.TOOLS_MAP = new Map();
        service.WORKZONE_TOOLS_MAP = new Map([
            [
                TOOL_NAME.NewDrawing,
                () => {
                    if (!service.modalIsDisplayed) {
                        service.displayNewDrawingModal();
                    }
                },
            ],
        ]);
        service.changeTool(TOOL_NAME.NewDrawing);

        expect(spyOnDisplayNewDrawingModal).toHaveBeenCalled();
    });

    it('when changeTool with pencil changeCurrentToolName should be call with pencil', () => {
        spyOnChangeCurrentToolName = spyOn(service, 'changeCurrentToolName').and.returnValue();
        service.TOOLS_MAP = new Map([[TOOL_NAME.Pencil, service[`pencilTool`]]]);
        service.changeTool(TOOL_NAME.Pencil);

        expect(spyOnChangeCurrentToolName).toHaveBeenCalledWith(TOOL_NAME.Pencil);
    });

    it('when changeTool with retangle changeCurrentToolName should be call with rectangle', () => {
        spyOnChangeCurrentToolName = spyOn(service, 'changeCurrentToolName').and.returnValue();
        service.TOOLS_MAP = new Map([[TOOL_NAME.Rectangle, service[`rectangleTool`]]]);
        service.changeTool(TOOL_NAME.Rectangle);

        expect(spyOnChangeCurrentToolName).toHaveBeenCalledWith(TOOL_NAME.Rectangle);
    });

    it('when changeTool with brush changeCurrentToolName should be call with brush', () => {
        spyOnChangeCurrentToolName = spyOn(service, 'changeCurrentToolName').and.returnValue();
        service.TOOLS_MAP = new Map([[TOOL_NAME.Brush, service[`brushTool`]]]);
        service.changeTool(TOOL_NAME.Brush);

        expect(spyOnChangeCurrentToolName).toHaveBeenCalledWith(TOOL_NAME.Brush);
    });

    it('when changeTool with colorApplicator changeCurrentToolName should be call with colorApplicator', () => {
        spyOnChangeCurrentToolName = spyOn(service, 'changeCurrentToolName').and.returnValue();
        service.TOOLS_MAP = new Map([[TOOL_NAME.ColorApplicator, service[`colorApplicatorTool`]]]);
        service.changeTool(TOOL_NAME.ColorApplicator);

        expect(spyOnChangeCurrentToolName).toHaveBeenCalledWith(TOOL_NAME.ColorApplicator);
    });

    it('when changeTool with tool not implemented yet changeCurrentToolName should be call with his name', () => {
        spyOnChangeCurrentToolName = spyOn(service, 'changeCurrentToolName').and.returnValue();
        service.TOOLS_MAP = new Map([[TOOL_NAME.Polygon, service[`polygonTool`]]]);
        service.changeTool(TOOL_NAME.Polygon);

        expect(spyOnChangeCurrentToolName).toHaveBeenCalledWith(TOOL_NAME.Polygon);
    });

    it('when changeCurrentToolName with pencil then toolName is pencil', () => {
        const expectedResult: BehaviorSubject<TOOL_NAME> = new BehaviorSubject(TOOL_NAME.Pencil);
        service.changeCurrentToolName(TOOL_NAME.Pencil);
        expect(service[`toolName`]).toEqual(expectedResult);
    });

    it('should return selection tool', () => {
        expect(service.getSelectiontool()).toEqual(service[`selectionTool`]);
    });

    it('should return pencil tool', () => {
        expect(service.getPencilTool()).toEqual(service[`pencilTool`]);
    });

    it('should return pen tool', () => {
        expect(service.getPenTool()).toEqual(service[`penTool`]);
    });

    it('should return rectangle tool', () => {
        expect(service.getRectangleTool()).toEqual(service[`rectangleTool`]);
    });

    it('should return ellipsis tool', () => {
        expect(service.getEllipsisTool()).toEqual(service[`ellipsisTool`]);
    });

    it('should return brush tool', () => {
        expect(service.getBrushTool()).toEqual(service[`brushTool`]);
    });

    it('should return stamp tool', () => {
        expect(service.getStampTool()).toEqual(service[`stampTool`]);
    });

    it('should return dropper tool', () => {
        expect(service.getDropperTool()).toEqual(service[`dropperTool`]);
    });

    it('should return color applicator tool', () => {
        expect(service.getColorApplicatorTool()).toEqual(service[`colorApplicatorTool`]);
    });

    it('should return polygon tool', () => {
        expect(service.getPolygonTool()).toEqual(service[`polygonTool`]);
    });

    it('should return line tool', () => {
        expect(service.getLineTool()).toEqual(service[`lineTool`]);
    });

    it('should return erase tool', () => {
        expect(service.getEraserTool()).toEqual(service[`eraserTool`]);
    });

    // switch case tests
    it('should change to selection tool', () => {
        service.TOOLS_MAP = new Map([[TOOL_NAME.Selection, service[`selectionTool`]]]);
        service.changeTool(TOOL_NAME.Selection);
        expect(service.currentTool).toEqual(service[`selectionTool`]);
    });

    it('should change to pencil tool', () => {
        service.TOOLS_MAP = new Map([[TOOL_NAME.Pencil, service[`pencilTool`]]]);
        service.changeTool(TOOL_NAME.Pencil);
        expect(service.currentTool).toEqual(service[`pencilTool`]);
    });

    it('should change to pen tool', () => {
        service.TOOLS_MAP = new Map([[TOOL_NAME.Pen, service[`penTool`]]]);
        service.changeTool(TOOL_NAME.Pen);
        expect(service.currentTool).toEqual(service[`penTool`]);
    });

    it('should change to rectangle tool', () => {
        service.TOOLS_MAP = new Map([[TOOL_NAME.Rectangle, service[`rectangleTool`]]]);
        service.changeTool(TOOL_NAME.Rectangle);
        expect(service.currentTool).toEqual(service[`rectangleTool`]);
    });

    it('should change to ellipsis tool', () => {
        service.TOOLS_MAP = new Map([[TOOL_NAME.Ellipsis, service[`ellipsisTool`]]]);
        service.changeTool(TOOL_NAME.Ellipsis);
        expect(service.currentTool).toEqual(service[`ellipsisTool`]);
    });

    it('should change to brush tool', () => {
        service.TOOLS_MAP = new Map([[TOOL_NAME.Brush, service[`brushTool`]]]);
        service.changeTool(TOOL_NAME.Brush);
        expect(service.currentTool).toEqual(service[`brushTool`]);
    });

    it('should change to stamp tool', () => {
        service.TOOLS_MAP = new Map([[TOOL_NAME.Stamp, service[`stampTool`]]]);
        service.changeTool(TOOL_NAME.Stamp);
        expect(service.currentTool).toEqual(service[`stampTool`]);
    });

    it('should change to dropper tool', () => {
        service.TOOLS_MAP = new Map([[TOOL_NAME.Dropper, service[`dropperTool`]]]);
        service.changeTool(TOOL_NAME.Dropper);
        expect(service.currentTool).toEqual(service[`dropperTool`]);
    });

    it('should change to color applicator tool', () => {
        service.TOOLS_MAP = new Map([[TOOL_NAME.ColorApplicator, service[`colorApplicatorTool`]]]);
        service.changeTool(TOOL_NAME.ColorApplicator);
        expect(service.currentTool).toEqual(service[`colorApplicatorTool`]);
    });

    it('should change to polygon tool', () => {
        service.TOOLS_MAP = new Map([[TOOL_NAME.Polygon, service[`polygonTool`]]]);
        service.changeTool(TOOL_NAME.Polygon);
        expect(service.currentTool).toEqual(service[`polygonTool`]);
    });

    it('should change to line tool', () => {
        service.TOOLS_MAP = new Map([[TOOL_NAME.Line, service[`lineTool`]]]);
        service.changeTool(TOOL_NAME.Line);
        expect(service.currentTool).toEqual(service[`lineTool`]);
    });

    it('should change to grid tool', () => {
        const spy = spyOn(service, 'changeCurrentToolName');
        service.changeTool(TOOL_NAME.Grid);
        expect(spy).toHaveBeenCalledWith(TOOL_NAME.Grid);
    });

    it('should not change to export tool if modal Is not Displayed', () => {
        const spy = spyOn(service, 'displayExportFileModal');
        service.TOOLS_MAP = new Map();
        service.WORKZONE_TOOLS_MAP = new Map([
            [
                TOOL_NAME.Export,
                () => {
                    if (!service.modalIsDisplayed) {
                        service.displayExportFileModal();
                    }
                },
            ],
        ]);
        service.modalIsDisplayed = false;
        service.changeTool(TOOL_NAME.Export);
        expect(spy).toHaveBeenCalled();
    });

    it('should not change to export tool if modal Is Displayed', () => {
        const spy = spyOn(service, 'displayExportFileModal');
        service.TOOLS_MAP = new Map();
        service.WORKZONE_TOOLS_MAP = new Map([
            [
                TOOL_NAME.Export,
                () => {
                    if (!service.modalIsDisplayed) {
                        service.displayExportFileModal();
                    }
                },
            ],
        ]);
        service.modalIsDisplayed = true;
        service.changeTool(TOOL_NAME.Export);
        expect(spy).not.toHaveBeenCalled();
    });

    it('should change to eraser tool', () => {
        service.TOOLS_MAP = new Map([[TOOL_NAME.Eraser, service[`eraserTool`]]]);
        service.changeTool(TOOL_NAME.Eraser);
        expect(service.currentTool).toEqual(service[`eraserTool`]);
    });

    it('should call displaySaveFileModal on change to Save tool if modal Is not Displayed', () => {
        const spy = spyOn(service, 'displaySaveFileModal');
        service.TOOLS_MAP = new Map();
        service.WORKZONE_TOOLS_MAP = new Map([
            [
                TOOL_NAME.Save,
                () => {
                    if (!service.modalIsDisplayed) {
                        service.displaySaveFileModal();
                    }
                },
            ],
        ]);
        service.modalIsDisplayed = false;
        service.changeTool(TOOL_NAME.Save);
        expect(spy).toHaveBeenCalled();
    });
    it('should not call displaySaveFileModal on change to Save tool if modal Is Displayed', () => {
        const spy = spyOn(service, 'displaySaveFileModal');
        service.TOOLS_MAP = new Map();
        service.WORKZONE_TOOLS_MAP = new Map([
            [
                TOOL_NAME.Save,
                () => {
                    if (!service.modalIsDisplayed) {
                        service.displaySaveFileModal();
                    }
                },
            ],
        ]);
        service.modalIsDisplayed = true;
        service.changeTool(TOOL_NAME.Save);
        expect(spy).not.toHaveBeenCalled();
    });

    it('should not call displaySaveFileModal on change to Save tool if not modalIsDisplayed', () => {
        const spy = spyOn(service, 'displaySaveFileModal');
        service.TOOLS_MAP = new Map();
        service.WORKZONE_TOOLS_MAP = new Map([
            [
                TOOL_NAME.Save,
                () => {
                    if (!service.modalIsDisplayed) {
                        service.displaySaveFileModal();
                    }
                },
            ],
        ]);
        service.modalIsDisplayed = true;
        service.changeTool(TOOL_NAME.Save);
        expect(spy).not.toHaveBeenCalled();
    });

    it('should call displayOpenFileModal on change tool if modalIsDisplayed', () => {
        const spy = spyOn(service, 'displayOpenFileModal');
        service.TOOLS_MAP = new Map();
        service.WORKZONE_TOOLS_MAP = new Map([
            [
                TOOL_NAME.ArtGallery,
                () => {
                    if (!service.modalIsDisplayed) {
                        service.displayOpenFileModal();
                    }
                },
            ],
        ]);
        service.modalIsDisplayed = false;
        service.changeTool(TOOL_NAME.ArtGallery);
        expect(spy).toHaveBeenCalled();
    });

    it('should not call displayOpenFileModal on change to ArtGallery tool if not modalIsDisplayed', () => {
        const spy = spyOn(service, 'displayOpenFileModal');
        service.TOOLS_MAP = new Map();
        service.WORKZONE_TOOLS_MAP = new Map([
            [
                TOOL_NAME.ArtGallery,
                () => {
                    if (!service.modalIsDisplayed) {
                        service.displayOpenFileModal();
                    }
                },
            ],
        ]);
        service.modalIsDisplayed = true;
        service.changeTool(TOOL_NAME.ArtGallery);
        expect(spy).not.toHaveBeenCalled();
    });

    it('should call cleanUp on changeTool', () => {
        service.TOOLS_MAP = new Map([[TOOL_NAME.Pencil, service[`pencilTool`]]]);
        service.currentTool = service.getBrushTool();
        service.currentTool.cleanUp = () => null;
        const spy = spyOn(service.currentTool, 'cleanUp');
        service.changeTool(TOOL_NAME.Pencil);
        expect(spy).toHaveBeenCalled();
    });
    it('should not call cleanUp on changeTool is not current Tool', () => {
        service.TOOLS_MAP = new Map([[TOOL_NAME.Pencil, service[`pencilTool`]]]);
        service.currentTool = service.getBrushTool();
        service.currentTool.cleanUp = () => null;
        const spy = spyOn(service.currentTool, 'cleanUp');
        service.currentTool = undefined;
        service.changeTool(TOOL_NAME.Pencil);
        expect(spy).not.toHaveBeenCalled();
    });

    it('should initialize every tool on initTools', () => {
        const spy = spyOn(service[`selectionTool`], 'initializeService');

        service[`dropperTool`].initializeService = () => null;
        service[`colorApplicatorTool`].initializeService = () => null;
        service[`eraserTool`].initializeService = () => null;
        service[`fillTool`].initializeService = () => null;

        const rendererMock = injector.get<Renderer2>(Renderer2 as Type<Renderer2>);
        const drawStackMock = injector.get<DrawStackService>(DrawStackService as Type<DrawStackService>);
        const elementRefMock = injector.get<ElementRef>(ElementRef as Type<ElementRef>);
        service.initTools(drawStackMock, elementRefMock, rendererMock);

        expect(spy).toHaveBeenCalled();
    });
});
