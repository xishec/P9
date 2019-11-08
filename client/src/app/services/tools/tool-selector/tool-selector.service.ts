import { ElementRef, Injectable, Renderer2 } from '@angular/core';
import { MatDialog } from '@angular/material';
import { BehaviorSubject, Observable } from 'rxjs';

import { DrawingModalWindowComponent } from 'src/app/components/modal-windows/drawing-modal-window/drawing-modal-window.component';
// tslint:disable-next-line: max-line-length
import { ExportFileModalWindowComponent } from 'src/app/components/modal-windows/export-file-modal-window/export-file-modal-window.component';
import { OpenFileModalWindowComponent } from 'src/app/components/modal-windows/open-file-modal-window/open-file-modal-window.component';
import { SaveFileModalWindowComponent } from 'src/app/components/modal-windows/save-file-modal-window/save-file-modal-window.component';
import { ToolName } from 'src/constants/tool-constants';
import { DrawStackService } from '../../draw-stack/draw-stack.service';
import { ModalManagerService } from '../../modal-manager/modal-manager.service';
import { AbstractToolService } from '../abstract-tools/abstract-tool.service';
import { BrushToolService } from '../brush-tool/brush-tool.service';
import { ColorApplicatorToolService } from '../color-applicator-tool/color-applicator-tool.service';
import { ColorToolService } from '../color-tool/color-tool.service';
import { DropperToolService } from '../dropper-tool/dropper-tool.service';
import { EllipsisToolService } from '../ellipsis-tool/ellipsis-tool.service';
import { EraserToolService } from '../eraser-tool/eraser-tool.service';
import { ExportToolService } from '../export-tool/export-tool.service';
import { LineToolService } from '../line-tool/line-tool.service';
import { PenToolService } from '../pen-tool/pen-tool.service';
import { PencilToolService } from '../pencil-tool/pencil-tool.service';
import { PolygonToolService } from '../polygon-tool/polygon-tool.service';
import { RectangleToolService } from '../rectangle-tool/rectangle-tool.service';
import { SelectionToolService } from '../selection-tool/selection-tool.service';
import { StampToolService } from '../stamp-tool/stamp-tool.service';
import { TextToolService } from '../text-tool/text-tool.service';

@Injectable({
    providedIn: 'root',
})
export class ToolSelectorService {
    private toolName: BehaviorSubject<ToolName> = new BehaviorSubject(ToolName.Selection);

    currentToolName: Observable<ToolName> = this.toolName.asObservable();
    currentTool: AbstractToolService | undefined;
    modalIsDisplayed = false;
    drawStack: DrawStackService;

    constructor(
        private colorToolService: ColorToolService,
        private dialog: MatDialog,
        private modalManagerService: ModalManagerService,
        private selectionTool: SelectionToolService,
        private rectangleTool: RectangleToolService,
        private ellipsisTool: EllipsisToolService,
        private pencilTool: PencilToolService,
        private penTool: PenToolService,
        private brushTool: BrushToolService,
        private stampTool: StampToolService,
        private dropperTool: DropperToolService,
        private colorApplicatorTool: ColorApplicatorToolService,
        private polygoneTool: PolygonToolService,
        private lineTool: LineToolService,
        private textTool: TextToolService,
        private exportTool: ExportToolService,
        private eraserTool: EraserToolService,
    ) {
        this.modalManagerService.currentModalIsDisplayed.subscribe((modalIsDisplayed) => {
            this.modalIsDisplayed = modalIsDisplayed;
        });
    }

    initTools(drawStack: DrawStackService, ref: ElementRef<SVGElement>, renderer: Renderer2): void {
        this.selectionTool.initializeService(ref, renderer, drawStack);

        this.rectangleTool.initializeService(ref, renderer, drawStack);
        this.rectangleTool.initializeColorToolService(this.colorToolService);

        this.ellipsisTool.initializeService(ref, renderer, drawStack);
        this.ellipsisTool.initializeColorToolService(this.colorToolService);

        this.pencilTool.initializeService(ref, renderer, drawStack);
        this.pencilTool.initializeColorToolService(this.colorToolService);

        this.penTool.initializeService(ref, renderer, drawStack);
        this.penTool.initializeColorToolService(this.colorToolService);

        this.brushTool.initializeService(ref, renderer, drawStack);
        this.brushTool.initializeColorToolService(this.colorToolService);

        this.stampTool.initializeService(ref, renderer, drawStack);

        this.dropperTool.initializeService(ref, renderer, drawStack);
        this.dropperTool.initializeColorToolService(this.colorToolService);

        this.colorApplicatorTool.initializeService(ref, renderer, drawStack);
        this.colorApplicatorTool.initializeColorToolService(this.colorToolService);

        this.polygoneTool.initializeService(ref, renderer, drawStack);
        this.polygoneTool.initializeColorToolService(this.colorToolService);

        this.lineTool.initializeService(ref, renderer, drawStack);
        this.lineTool.initializeColorToolService(this.colorToolService);

        this.textTool.initializeService(ref, renderer, drawStack);

        this.exportTool.initializeService(ref, renderer);

        this.eraserTool.initializeService(ref, renderer, drawStack);
    }

    displayNewDrawingModal(): void {
        const newDrawingDialogRef = this.dialog.open(DrawingModalWindowComponent, {
            panelClass: 'myapp-max-width-dialog',
            autoFocus: false,
        });
        this.modalManagerService.setModalIsDisplayed(true);
        newDrawingDialogRef.afterClosed().subscribe(() => {
            this.modalManagerService.setModalIsDisplayed(false);
        });
    }

    displayOpenFileModal(): void {
        const openFileDialogRef = this.dialog.open(OpenFileModalWindowComponent, {
            panelClass: 'myapp-min-width-dialog',
            disableClose: true,
            autoFocus: false,
        });
        this.modalManagerService.setModalIsDisplayed(true);
        openFileDialogRef.afterClosed().subscribe(() => {
            this.modalManagerService.setModalIsDisplayed(false);
        });
    }

    displaySaveFileModal(): void {
        const saveFileDialogRef = this.dialog.open(SaveFileModalWindowComponent, {
            panelClass: 'myapp-min-width-dialog',
            disableClose: true,
            autoFocus: false,
        });
        this.modalManagerService.setModalIsDisplayed(true);
        saveFileDialogRef.afterClosed().subscribe(() => {
            this.modalManagerService.setModalIsDisplayed(false);
        });
    }

    displayExportFileModal(): void {
        const exportFileDialogRef = this.dialog.open(ExportFileModalWindowComponent, {
            panelClass: 'myapp-min-width-dialog',
            disableClose: true,
            autoFocus: false,
        });
        this.modalManagerService.setModalIsDisplayed(true);
        exportFileDialogRef.afterClosed().subscribe(() => {
            this.modalManagerService.setModalIsDisplayed(false);
        });
    }

    getSelectiontool(): SelectionToolService {
        return this.selectionTool;
    }

    getPencilTool(): PencilToolService {
        return this.pencilTool;
    }

    getPenTool(): PenToolService {
        return this.penTool;
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

    getStampTool(): StampToolService {
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
        return this.lineTool;
    }

    getTextTool(): TextToolService {
        return this.textTool;
    }
    
    getEraserTool(): EraserToolService {
        return this.eraserTool;
    }

    changeTool(tooltipName: ToolName): void {
        if (this.currentTool) {
            this.currentTool.cleanUp();
        }

        switch (tooltipName) {
            case ToolName.NewDrawing:
                if (!this.modalIsDisplayed) {
                    this.displayNewDrawingModal();
                }
                break;
            case ToolName.Selection:
                this.currentTool = this.selectionTool;
                this.changeCurrentToolName(tooltipName);
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
                this.currentTool = this.lineTool;
                this.changeCurrentToolName(tooltipName);
                break;
            case ToolName.Dropper:
                this.currentTool = this.dropperTool;
                this.changeCurrentToolName(tooltipName);
                break;
            case ToolName.ArtGallery:
                if (!this.modalIsDisplayed) {
                    this.displayOpenFileModal();
                }
                break;
            case ToolName.Save:
                if (!this.modalIsDisplayed) {
                    this.displaySaveFileModal();
                }
                break;
            case ToolName.Pen:
                this.currentTool = this.penTool;
                this.changeCurrentToolName(tooltipName);
                break;
            case ToolName.Text:
                this.currentTool = this.textTool;
                this.changeCurrentToolName(tooltipName);
                break;
            case ToolName.Export:
                if (!this.modalIsDisplayed) {
                    this.displayExportFileModal();
                }
                break;
            case ToolName.Eraser:
                this.currentTool = this.eraserTool;
                this.changeCurrentToolName(tooltipName);
                break;

            case ToolName.Quill:
            case ToolName.SprayCan:
            case ToolName.Fill:
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
