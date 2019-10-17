import { ElementRef, Injectable, Renderer2 } from '@angular/core';
import { MatDialog } from '@angular/material';
import { BehaviorSubject, Observable } from 'rxjs';

import { DrawingModalWindowComponent } from 'src/app/components/drawing-modal-window/drawing-modal-window.component';
import { ToolName } from 'src/constants/tool-constants';
import { DrawStackService } from '../../draw-stack/draw-stack.service';
import { AbstractToolService } from '../abstract-tools/abstract-tool.service';
import { BrushToolService } from '../brush-tool/brush-tool.service';
import { ColorApplicatorToolService } from '../color-applicator-tool/color-applicator-tool.service';
import { ColorToolService } from '../color-tool/color-tool.service';
import { DropperToolService } from '../dropper-tool/dropper-tool.service';
import { EllipsisToolService } from '../ellipsis-tool/ellipsis-tool.service';
import { LineToolService } from '../line-tool/line-tool.service';
import { PencilToolService } from '../pencil-tool/pencil-tool.service';
import { PolygonToolService } from '../polygon-tool/polygon-tool.service';
import { RectangleToolService } from '../rectangle-tool/rectangle-tool.service';
import { OpenFileModalWindowComponent } from 'src/app/components/open-file-modal-window/open-file-modal-window.component';
import { ModalManagerService } from '../../modal-manager/modal-manager.service';
import { StampToolService } from '../stamp-tool/stamp-tool.service';

@Injectable({
    providedIn: 'root',
})
export class ToolSelectorService {
    private toolName: BehaviorSubject<ToolName> = new BehaviorSubject(ToolName.Selection);
    private rectangleTool: RectangleToolService;
    private ellipsisTool: EllipsisToolService;
    private pencilTool: PencilToolService;
    private brushTool: BrushToolService;
    private stampTool: StampToolService;
    private dropperTool: DropperToolService;
    private colorApplicatorTool: ColorApplicatorToolService;
    private polygoneTool: PolygonToolService;
    lineToolService: LineToolService;

    currentToolName: Observable<ToolName> = this.toolName.asObservable();
    currentTool: AbstractToolService | undefined;
    modalIsDisplayed: boolean = false;

    constructor(
        private colorToolService: ColorToolService,
        private dialog: MatDialog,
        private modalManagerService: ModalManagerService
    ) {
        this.modalManagerService.currentModalIsDisplayed.subscribe((modalIsDisplayed) => {
            this.modalIsDisplayed = modalIsDisplayed;
        })
    }

    initTools(drawStack: DrawStackService, ref: ElementRef<SVGElement>, renderer: Renderer2): void {
        this.rectangleTool = new RectangleToolService(drawStack, ref, renderer);
        this.rectangleTool.initializeColorToolService(this.colorToolService);

        this.ellipsisTool = new EllipsisToolService(drawStack, ref, renderer);
        this.ellipsisTool.initializeColorToolService(this.colorToolService);

        this.pencilTool = new PencilToolService(ref, renderer, drawStack);
        this.pencilTool.initializeColorToolService(this.colorToolService);

        this.brushTool = new BrushToolService(ref, renderer, drawStack);
        this.brushTool.initializeColorToolService(this.colorToolService);

        this.stampTool = new StampToolService(drawStack, ref, renderer);

        this.dropperTool = new DropperToolService(drawStack, ref, renderer);
        this.dropperTool.initializeColorToolService(this.colorToolService);

        this.colorApplicatorTool = new ColorApplicatorToolService(drawStack, renderer);
        this.colorApplicatorTool.initializeColorToolService(this.colorToolService);

        this.polygoneTool = new PolygonToolService(drawStack, ref, renderer);
        this.polygoneTool.initializeColorToolService(this.colorToolService);

        this.lineToolService = new LineToolService(ref, renderer, drawStack);
        this.lineToolService.initializeColorToolService(this.colorToolService);
    }

    displayNewDrawingModal(): void {
        const newDrawingDialogRef = this.dialog.open(DrawingModalWindowComponent, {
            panelClass: 'myapp-max-width-dialog',
            disableClose: true,
        });
        this.modalManagerService.setModalIsDisplayed(true);
        newDrawingDialogRef.afterClosed().subscribe(() => {
            this.modalManagerService.setModalIsDisplayed(false);
        });
    }

    displayOpenFileModal(): void {
        const openFileDialogRef = this.dialog.open(OpenFileModalWindowComponent, {
            panelClass: 'myapp-min-width-dialog',
        });
        this.modalManagerService.setModalIsDisplayed(true);
        openFileDialogRef.afterClosed().subscribe(() => {
            this.modalManagerService.setModalIsDisplayed(false);
        });
    }

    getPencilTool(): PencilToolService {
        return this.pencilTool;
    }

    getRectangleTool(): RectangleToolService {
        return this.rectangleTool;
    }

    getEllipsisTool(): EllipsisToolService {
        return this.ellipsisTool;
    }

    getBrushTool(): BrushToolService {
        return this.brushTool;
    }

    getStampToolService(): StampToolService {
        return this.stampTool;
    }

    getDropperTool(): DropperToolService {
        return this.dropperTool;
    }

    getColorApplicatorTool(): ColorApplicatorToolService {
        return this.colorApplicatorTool;
    }

    getPolygonTool(): PolygonToolService {
        return this.polygoneTool;
    }

    getLineTool(): LineToolService {
        return this.lineToolService;
    }

    changeTool(tooltipName: string): void {
        if (this.currentTool instanceof StampToolService) {
            this.currentTool.cleanUpStamp();
        }
        switch (tooltipName) {
            case ToolName.NewDrawing:
                if (!this.modalIsDisplayed) {
                    this.displayNewDrawingModal();
                }
                break;
            case ToolName.Rectangle:
                this.currentTool = this.rectangleTool;
                this.changeCurrentToolName(tooltipName);
                break;
            case ToolName.Ellipsis:
                this.currentTool = this.ellipsisTool;
                this.changeCurrentToolName(tooltipName);
                break;
            case ToolName.Pencil:
                this.currentTool = this.pencilTool;
                this.changeCurrentToolName(tooltipName);
                break;
            case ToolName.Brush:
                this.currentTool = this.brushTool;
                this.changeCurrentToolName(tooltipName);
                break;
            case ToolName.Stamp:
                this.currentTool = this.stampTool;
                this.changeCurrentToolName(tooltipName);
                break;
            case ToolName.ColorApplicator:
                this.currentTool = this.colorApplicatorTool;
                this.changeCurrentToolName(tooltipName);
                break;
            case ToolName.Polygon:
                this.currentTool = this.polygoneTool;                
                this.changeCurrentToolName(tooltipName);
                break;
            case ToolName.Grid:
                this.changeCurrentToolName(tooltipName);
                break;
            case ToolName.Line:
                this.currentTool = this.lineToolService;
                this.changeCurrentToolName(tooltipName);
                break;
            case ToolName.Dropper:
                this.currentTool = this.dropperTool;
                this.changeCurrentToolName(tooltipName);
                break;
            case ToolName.Quill:
            case ToolName.Selection:
            case ToolName.Pen:
            case ToolName.SprayCan:
            case ToolName.Line:
            case ToolName.Ellipsis:
            case ToolName.Polygon:
            case ToolName.Fill:
            case ToolName.Eraser:
            case ToolName.Text:
            case ToolName.Save:
            case ToolName.ArtGallery:
                if (!this.modalIsDisplayed) {
                    this.displayOpenFileModal();
                }
                break;
            case ToolName.Export:
                this.currentTool = undefined;
                this.changeCurrentToolName(tooltipName);
                break;
            default:
                this.currentTool = undefined;
                this.changeCurrentToolName(ToolName.Selection);
                break;
        }
    }

    changeCurrentToolName(toolName: ToolName): void {
        this.toolName.next(toolName);
    }
}
