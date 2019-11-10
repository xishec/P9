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
import { UndoRedoerService } from '../../undo-redoer/undo-redoer.service';
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

@Injectable({
    providedIn: 'root',
})
export class ToolSelectorService {
    private toolName: BehaviorSubject<ToolName> = new BehaviorSubject(ToolName.Selection);

    currentToolName: Observable<ToolName> = this.toolName.asObservable();
    currentTool: AbstractToolService | undefined;
    modalIsDisplayed = false;
    drawStack: DrawStackService;
    TOOLS_MAP: Map<ToolName, AbstractToolService>;
    WORKZONE_TOOLS_MAP: Map<ToolName, () => void>;

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
        private polygonTool: PolygonToolService,
        private lineTool: LineToolService,
        private exportTool: ExportToolService,
        private eraserTool: EraserToolService,
        private undoRedoerService: UndoRedoerService,
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

        this.polygonTool.initializeService(ref, renderer, drawStack);
        this.polygonTool.initializeColorToolService(this.colorToolService);

        this.lineTool.initializeService(ref, renderer, drawStack);
        this.lineTool.initializeColorToolService(this.colorToolService);

        this.exportTool.initializeService(ref, renderer);

        this.eraserTool.initializeService(ref, renderer, drawStack);

        this.TOOLS_MAP = new Map([
            [ToolName.Selection, this.selectionTool as AbstractToolService],
            [ToolName.Rectangle, this.rectangleTool as AbstractToolService],
            [ToolName.Ellipsis, this.ellipsisTool as AbstractToolService],
            [ToolName.Pencil, this.pencilTool as AbstractToolService],
            [ToolName.Brush, this.brushTool as AbstractToolService],
            [ToolName.Stamp, this.stampTool as AbstractToolService],
            [ToolName.ColorApplicator, this.colorApplicatorTool as AbstractToolService],
            [ToolName.Polygon, this.polygonTool as AbstractToolService],
            [ToolName.Line, this.lineTool as AbstractToolService],
            [ToolName.Dropper, this.dropperTool as AbstractToolService],
            [ToolName.Pen, this.penTool as AbstractToolService],
            [ToolName.Eraser, this.eraserTool as AbstractToolService],
            [ToolName.Quill, this.selectionTool as AbstractToolService],
            [ToolName.SprayCan, this.selectionTool as AbstractToolService],
            [ToolName.Fill, this.selectionTool as AbstractToolService],
            [ToolName.Text, this.selectionTool as AbstractToolService],
        ]);

        this.WORKZONE_TOOLS_MAP = new Map([
            [
                ToolName.NewDrawing,
                () => {
                    if (!this.modalIsDisplayed) {
                        this.displayNewDrawingModal();
                    }
                },
            ],
            [
                ToolName.ArtGallery,
                () => {
                    if (!this.modalIsDisplayed) {
                        this.displayOpenFileModal();
                    }
                },
            ],
            [
                ToolName.Save,
                () => {
                    if (!this.modalIsDisplayed) {
                        this.displaySaveFileModal();
                    }
                },
            ],
            [
                ToolName.Export,
                () => {
                    if (!this.modalIsDisplayed) {
                        this.displayExportFileModal();
                    }
                },
            ],
        ]);
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
        return this.polygonTool;
    }

    getLineTool(): LineToolService {
        return this.lineTool;
    }

    getEraserTool(): EraserToolService {
        return this.eraserTool;
    }

    changeTool(tooltipName: ToolName): void {
        if (this.currentTool) {
            this.currentTool.cleanUp();
        }

        if (tooltipName === ToolName.Grid) {
            this.changeCurrentToolName(tooltipName);
            return;
        }

        const tool: AbstractToolService | undefined = this.TOOLS_MAP.get(tooltipName);
        if (tool !== undefined) {
            this.currentTool = tool;
            this.changeCurrentToolName(tooltipName);
            return;
        }

        const workzoneTool: (() => void) | undefined = this.WORKZONE_TOOLS_MAP.get(tooltipName);
        if (workzoneTool !== undefined) {
            workzoneTool();
            return;
        }
        if (this.currentTool instanceof SelectionToolService) { this.selectionTool.isTheCurrentTool = true; }
    }

    changeCurrentToolName(toolName: ToolName): void {
        this.toolName.next(toolName);
    }
}
