import { ElementRef, Injectable, Renderer2 } from '@angular/core';
import { MatDialog } from '@angular/material';
import { BehaviorSubject, Observable } from 'rxjs';

import { DrawingModalWindowComponent } from 'src/app/components/modal-windows/drawing-modal-window/drawing-modal-window.component';
// tslint:disable-next-line: max-line-length
import { ExportFileModalWindowComponent } from 'src/app/components/modal-windows/export-file-modal-window/export-file-modal-window.component';
import { OpenFileModalWindowComponent } from 'src/app/components/modal-windows/open-file-modal-window/open-file-modal-window.component';
import { SaveFileModalWindowComponent } from 'src/app/components/modal-windows/save-file-modal-window/save-file-modal-window.component';
import { TOOL_NAME } from 'src/constants/tool-constants';
import { DrawStackService } from '../../draw-stack/draw-stack.service';
import { ModalManagerService } from '../../modal-manager/modal-manager.service';
import { UndoRedoerService } from '../../undo-redoer/undo-redoer.service';
import { AbstractToolService } from '../abstract-tools/abstract-tool.service';
import { BrushToolService } from '../brush-tool/brush-tool.service';
import { ColorApplicatorToolService } from '../color-applicator-tool/color-applicator-tool.service';
import { DropperToolService } from '../dropper-tool/dropper-tool.service';
import { FillToolService } from '../fill-tool/fill-tool.service';
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
    private toolName: BehaviorSubject<TOOL_NAME> = new BehaviorSubject(TOOL_NAME.Selection);

    currentToolName: Observable<TOOL_NAME> = this.toolName.asObservable();
    currentTool: AbstractToolService | undefined;
    modalIsDisplayed = false;
    drawStack: DrawStackService;
    TOOLS_MAP: Map<TOOL_NAME, AbstractToolService>;
    WORKZONE_TOOLS_MAP: Map<TOOL_NAME, () => void>;

    constructor(
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
        private fillTool: FillToolService,
        private colorApplicatorTool: ColorApplicatorToolService,
        private polygonTool: PolygonToolService,
        private lineTool: LineToolService,
        private textTool: TextToolService,
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

        this.ellipsisTool.initializeService(ref, renderer, drawStack);

        this.pencilTool.initializeService(ref, renderer, drawStack);

        this.penTool.initializeService(ref, renderer, drawStack);

        this.brushTool.initializeService(ref, renderer, drawStack);

        this.stampTool.initializeService(ref, renderer, drawStack);

        this.dropperTool.initializeService(ref, renderer, drawStack);

        this.fillTool.initializeService(ref, renderer, drawStack);

        this.colorApplicatorTool.initializeService(ref, renderer, drawStack);

        this.polygonTool.initializeService(ref, renderer, drawStack);

        this.lineTool.initializeService(ref, renderer, drawStack);

        this.textTool.initializeService(ref, renderer, drawStack);

        this.exportTool.initializeService(ref, renderer);

        this.eraserTool.initializeService(ref, renderer, drawStack);

        this.TOOLS_MAP = new Map([
            [TOOL_NAME.Selection, this.selectionTool as AbstractToolService],
            [TOOL_NAME.Rectangle, this.rectangleTool as AbstractToolService],
            [TOOL_NAME.Ellipsis, this.ellipsisTool as AbstractToolService],
            [TOOL_NAME.Pencil, this.pencilTool as AbstractToolService],
            [TOOL_NAME.Brush, this.brushTool as AbstractToolService],
            [TOOL_NAME.Stamp, this.stampTool as AbstractToolService],
            [TOOL_NAME.ColorApplicator, this.colorApplicatorTool as AbstractToolService],
            [TOOL_NAME.Polygon, this.polygonTool as AbstractToolService],
            [TOOL_NAME.Line, this.lineTool as AbstractToolService],
            [TOOL_NAME.Dropper, this.dropperTool as AbstractToolService],
            [TOOL_NAME.Pen, this.penTool as AbstractToolService],
            [TOOL_NAME.Eraser, this.eraserTool as AbstractToolService],
            [TOOL_NAME.Quill, this.selectionTool as AbstractToolService],
            [TOOL_NAME.SprayCan, this.selectionTool as AbstractToolService],
            [TOOL_NAME.Fill, this.fillTool as AbstractToolService],
            [TOOL_NAME.Text, this.textTool as AbstractToolService],
        ]);

        this.WORKZONE_TOOLS_MAP = new Map([
            [
                TOOL_NAME.NewDrawing,
                () => {
                    if (!this.modalIsDisplayed) {
                        this.displayNewDrawingModal();
                    }
                },
            ],
            [
                TOOL_NAME.ArtGallery,
                () => {
                    if (!this.modalIsDisplayed) {
                        this.displayOpenFileModal();
                    }
                },
            ],
            [
                TOOL_NAME.Save,
                () => {
                    if (!this.modalIsDisplayed) {
                        this.displaySaveFileModal();
                    }
                },
            ],
            [
                TOOL_NAME.Export,
                () => {
                    if (!this.modalIsDisplayed) {
                        this.displayExportFileModal();
                    }
                },
            ],
            [
                TOOL_NAME.Undo,
                () => {
                    if (!this.modalIsDisplayed) {
                        this.undoRedoerService.undo();
                    }
                },
            ],
            [
                TOOL_NAME.Redo,
                () => {
                    if (!this.modalIsDisplayed) {
                        this.undoRedoerService.redo();
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

    getFillTool(): FillToolService {
        return this.fillTool;
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

    getTextTool(): TextToolService {
        return this.textTool;
    }

    getEraserTool(): EraserToolService {
        return this.eraserTool;
    }

    changeTool(tooltipName: TOOL_NAME): void {
        if (this.currentTool) {
            this.currentTool.cleanUp();
            if (this.currentTool instanceof SelectionToolService) {
                this.selectionTool.isTheCurrentTool = false;
            }
        }

        if (tooltipName === TOOL_NAME.Grid) {
            this.changeCurrentToolName(tooltipName);
            return;
        }

        const tool: AbstractToolService | undefined = this.TOOLS_MAP.get(tooltipName);
        if (tool !== undefined) {
            this.currentTool = tool;
            this.changeCurrentToolName(tooltipName);
            if (this.currentTool instanceof SelectionToolService) {
                this.selectionTool.isTheCurrentTool = true;
            }
            return;
        }

        const workzoneTool: (() => void) | undefined = this.WORKZONE_TOOLS_MAP.get(tooltipName);
        if (workzoneTool !== undefined) {
            workzoneTool();
            return;
        }
    }

    changeCurrentToolName(toolName: TOOL_NAME): void {
        this.toolName.next(toolName);
    }
}
