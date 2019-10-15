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
import { PencilToolService } from '../pencil-tool/pencil-tool.service';
import { RectangleToolService } from '../rectangle-tool/rectangle-tool.service';
import { OpenFileModalWindowComponent } from 'src/app/components/open-file-modal-window/open-file-modal-window.component';
import { ModalManagerService } from '../../modal-manager/modal-manager.service';

@Injectable({
    providedIn: 'root',
})
export class ToolSelectorService {
    private toolName: BehaviorSubject<ToolName> = new BehaviorSubject(ToolName.Selection);
    private rectangleTool: RectangleToolService;
    private pencilTool: PencilToolService;
    private brushTool: BrushToolService;
    private colorApplicatorTool: ColorApplicatorToolService;

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

        this.pencilTool = new PencilToolService(ref, renderer, drawStack);
        this.pencilTool.initializeColorToolService(this.colorToolService);

        this.brushTool = new BrushToolService(ref, renderer, drawStack);
        this.brushTool.initializeColorToolService(this.colorToolService);

        this.colorApplicatorTool = new ColorApplicatorToolService(drawStack, renderer);
        this.colorApplicatorTool.initializeColorToolService(this.colorToolService);
    }

    displayNewDrawingModal(): void {
        const newDrawingDialogRef = this.dialog.open(DrawingModalWindowComponent, {
            panelClass: 'myapp-max-width-dialog',
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

    getBrushTool(): BrushToolService {
        return this.brushTool;
    }

    getColorApplicatorTool(): ColorApplicatorToolService {
        return this.colorApplicatorTool;
    }

    changeTool(tooltipName: string): void {
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
            case ToolName.Pencil:
                this.currentTool = this.pencilTool;
                this.changeCurrentToolName(tooltipName);
                break;
            case ToolName.Brush:
                this.currentTool = this.brushTool;
                this.changeCurrentToolName(tooltipName);
                break;
            case ToolName.ColorApplicator:
                this.currentTool = this.colorApplicatorTool;
                this.changeCurrentToolName(tooltipName);
                break;
            case ToolName.Quill:
            case ToolName.Selection:
            case ToolName.Pen:
            case ToolName.SprayCan:
            case ToolName.Line:
            case ToolName.Polygon:
            case ToolName.Ellipsis:
            case ToolName.Fill:
            case ToolName.Dropper:
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
