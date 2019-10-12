import { ElementRef, Injectable, Renderer2 } from '@angular/core';
import { MatDialog } from '@angular/material';
import { BehaviorSubject, Observable } from 'rxjs';

import { DrawingModalWindowComponent } from 'src/app/components/drawing-modal-window/drawing-modal-window.component';
import { ToolName } from 'src/constants/tool-constants';
import { DrawStackService } from '../../draw-stack/draw-stack.service';
import { DrawingModalWindowService } from '../../drawing-modal-window/drawing-modal-window.service';
import { AbstractToolService } from '../abstract-tools/abstract-tool.service';
import { BrushToolService } from '../brush-tool/brush-tool.service';
import { ColorApplicatorToolService } from '../color-applicator-tool/color-applicator-tool.service';
import { ColorToolService } from '../color-tool/color-tool.service';
import { PencilToolService } from '../pencil-tool/pencil-tool.service';
import { RectangleToolService } from '../rectangle-tool/rectangle-tool.service';
import { StampToolService } from '../stamp-tool/stamp-tool.service';

@Injectable({
    providedIn: 'root',
})
export class ToolSelectorService {
    private toolName: BehaviorSubject<ToolName> = new BehaviorSubject(ToolName.Selection);
    private rectangleTool: RectangleToolService;
    private pencilTool: PencilToolService;
    private brushTool: BrushToolService;
    private stampTool: StampToolService;
    private colorApplicatorTool: ColorApplicatorToolService;

    currentToolName: Observable<ToolName> = this.toolName.asObservable();
    currentTool: AbstractToolService | undefined;

    constructor(
        private colorToolService: ColorToolService,
        private dialog: MatDialog,
        private drawingModalWindowService: DrawingModalWindowService,
    ) {}

    initTools(drawStack: DrawStackService, ref: ElementRef<SVGElement>, renderer: Renderer2): void {
        this.rectangleTool = new RectangleToolService(drawStack, ref, renderer);
        this.rectangleTool.initializeColorToolService(this.colorToolService);

        this.pencilTool = new PencilToolService(ref, renderer, drawStack);
        this.pencilTool.initializeColorToolService(this.colorToolService);

        this.brushTool = new BrushToolService(ref, renderer, drawStack);
        this.brushTool.initializeColorToolService(this.colorToolService);

        this.stampTool = new StampToolService(drawStack, ref, renderer);

        this.colorApplicatorTool = new ColorApplicatorToolService(drawStack, renderer);
        this.colorApplicatorTool.initializeColorToolService(this.colorToolService);
    }

    displayNewDrawingModal(): void {
        const dialogRef = this.dialog.open(DrawingModalWindowComponent, {
            panelClass: 'myapp-max-width-dialog',
            disableClose: true,
        });
        this.drawingModalWindowService.changeDisplayNewDrawingModalWindow(true);
        dialogRef.afterClosed().subscribe(() => {
            this.drawingModalWindowService.changeDisplayNewDrawingModalWindow(false);
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

    getStampToolService(): StampToolService {
        return this.stampTool;
    }

    getColorApplicatorTool(): ColorApplicatorToolService {
        return this.colorApplicatorTool;
    }

    changeTool(tooltipName: string): void {
        if (this.currentTool instanceof StampToolService) {
            this.currentTool.cleanUpStamp();
        }
        switch (tooltipName) {
            case ToolName.NewDrawing:
                this.displayNewDrawingModal();
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
            case ToolName.Stamp:
                this.currentTool = this.stampTool;
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
