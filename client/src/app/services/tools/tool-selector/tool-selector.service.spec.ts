import { getTestBed, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material';
import { BehaviorSubject } from 'rxjs';

import { ElementRef, Renderer2, Type } from '@angular/core';
import { provideAutoMock } from 'src/classes/test.helper.msTeams.spec';
import { ToolName } from 'src/constants/tool-constants';
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
        service.changeTool(ToolName.NewDrawing);

        expect(spyOnDisplayNewDrawingModal).toHaveBeenCalled();
    });

    it('when changeTool with pencil changeCurrentToolName should be call with pencil', () => {
        spyOnChangeCurrentToolName = spyOn(service, 'changeCurrentToolName').and.returnValue();
        service.changeTool(ToolName.Pencil);

        expect(spyOnChangeCurrentToolName).toHaveBeenCalledWith(ToolName.Pencil);
    });

    it('when changeTool with retangle changeCurrentToolName should be call with rectangle', () => {
        spyOnChangeCurrentToolName = spyOn(service, 'changeCurrentToolName').and.returnValue();
        service.changeTool(ToolName.Rectangle);

        expect(spyOnChangeCurrentToolName).toHaveBeenCalledWith(ToolName.Rectangle);
    });

    it('when changeTool with brush changeCurrentToolName should be call with brush', () => {
        spyOnChangeCurrentToolName = spyOn(service, 'changeCurrentToolName').and.returnValue();
        service.changeTool(ToolName.Brush);

        expect(spyOnChangeCurrentToolName).toHaveBeenCalledWith(ToolName.Brush);
    });

    it('when changeTool with colorApplicator changeCurrentToolName should be call with colorApplicator', () => {
        spyOnChangeCurrentToolName = spyOn(service, 'changeCurrentToolName').and.returnValue();
        service.changeTool(ToolName.ColorApplicator);

        expect(spyOnChangeCurrentToolName).toHaveBeenCalledWith(ToolName.ColorApplicator);
    });

    it('when changeTool with tool not implemented yet changeCurrentToolName should be call with his name', () => {
        spyOnChangeCurrentToolName = spyOn(service, 'changeCurrentToolName').and.returnValue();
        service.changeTool(ToolName.Polygon);

        expect(spyOnChangeCurrentToolName).toHaveBeenCalledWith(ToolName.Polygon);
    });

    it('when changeTool with non implemented tool changeCurrentToolName should be call with Selection', () => {
        spyOnChangeCurrentToolName = spyOn(service, 'changeCurrentToolName').and.returnValue();
        service.changeTool(ToolName.Quill);

        expect(spyOnChangeCurrentToolName).toHaveBeenCalledWith(ToolName.Selection);
    });

    it('when changeCurrentToolName with pencil then toolName is pencil', () => {
        const expectedResult: BehaviorSubject<ToolName> = new BehaviorSubject(ToolName.Pencil);
        service.changeCurrentToolName(ToolName.Pencil);
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
        expect(service.getPolygonTool()).toEqual(service[`polygoneTool`]);
    });

    it('should return line tool', () => {
        expect(service.getLineTool()).toEqual(service[`lineTool`]);
    });

    // switch case tests
    it('should change to selection tool', () => {
        service.changeTool(ToolName.Selection);
        expect(service.currentTool).toEqual(service[`selectionTool`]);
    });

    it('should change to pencil tool', () => {
        service.changeTool(ToolName.Pencil);
        expect(service.currentTool).toEqual(service[`pencilTool`]);
    });

    it('should change to pen tool', () => {
        service.changeTool(ToolName.Pen);
        expect(service.currentTool).toEqual(service[`penTool`]);
    });

    it('should change to rectangle tool', () => {
        service.changeTool(ToolName.Rectangle);
        expect(service.currentTool).toEqual(service[`rectangleTool`]);
    });

    it('should change to ellipsis tool', () => {
        service.changeTool(ToolName.Ellipsis);
        expect(service.currentTool).toEqual(service[`ellipsisTool`]);
    });

    it('should change to brush tool', () => {
        service.changeTool(ToolName.Brush);
        expect(service.currentTool).toEqual(service[`brushTool`]);
    });

    it('should change to stamp tool', () => {
        service.changeTool(ToolName.Stamp);
        expect(service.currentTool).toEqual(service[`stampTool`]);
    });

    it('should change to dropper tool', () => {
        service.changeTool(ToolName.Dropper);
        expect(service.currentTool).toEqual(service[`dropperTool`]);
    });

    it('should change to color applicator tool', () => {
        service.changeTool(ToolName.ColorApplicator);
        expect(service.currentTool).toEqual(service[`colorApplicatorTool`]);
    });

    it('should change to polygon tool', () => {
        service.changeTool(ToolName.Polygon);
        expect(service.currentTool).toEqual(service[`polygoneTool`]);
    });

    it('should change to line tool', () => {
        service.changeTool(ToolName.Line);
        expect(service.currentTool).toEqual(service[`lineTool`]);
    });

    it('should change to grid tool', () => {
        const spy = spyOn(service, 'changeCurrentToolName');
        service.changeTool(ToolName.Grid);
        expect(spy).toHaveBeenCalledWith(ToolName.Grid);
    });

    it('should call displaySaveFileModal on change to Save tool if modalIsDisplayed', () => {
        const spy = spyOn(service, 'displaySaveFileModal');
        service.modalIsDisplayed = false;
        service.changeTool(ToolName.Save);
        expect(spy).toHaveBeenCalled();
    });

    it('should not call displaySaveFileModal on change to Save tool if not modalIsDisplayed', () => {
        const spy = spyOn(service, 'displaySaveFileModal');
        service.modalIsDisplayed = true;
        service.changeTool(ToolName.Save);
        expect(spy).not.toHaveBeenCalled();
    });

    it('should call displayOpenFileModal on c tool if modalIsDisplayed', () => {
        const spy = spyOn(service, 'displayOpenFileModal');
        service.modalIsDisplayed = false;
        service.changeTool(ToolName.ArtGallery);
        expect(spy).toHaveBeenCalled();
    });

    it('should not call displayOpenFileModal on change to ArtGallery tool if not modalIsDisplayed', () => {
        const spy = spyOn(service, 'displayOpenFileModal');
        service.modalIsDisplayed = true;
        service.changeTool(ToolName.ArtGallery);
        expect(spy).not.toHaveBeenCalled();
    });

    it('should call cleanUp on changeTool', () => {
        service.currentTool = service.getBrushTool();
        service.currentTool.cleanUp = () => null;
        const spy = spyOn(service.currentTool, 'cleanUp');
        service.changeTool(ToolName.Pencil);
        expect(spy).toHaveBeenCalled();
    });

    it('should initialize every tool on initTools', () => {
        const spy = spyOn(service[`selectionTool`], 'initializeService');

        service[`dropperTool`].initializeService = () => null;
        service[`colorApplicatorTool`].initializeService = () => null;

        const rendererMock = injector.get<Renderer2>(Renderer2 as Type<Renderer2>);
        const drawStackMock = injector.get<DrawStackService>(DrawStackService as Type<DrawStackService>);
        const elementRefMock = injector.get<ElementRef>(ElementRef as Type<ElementRef>);
        service.initTools(drawStackMock, elementRefMock, rendererMock);

        expect(spy).toHaveBeenCalled();
    });
});
