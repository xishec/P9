import { ElementRef, Injectable, Renderer2 } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

import { DrawStackService } from '../../draw-stack/draw-stack.service';
import { DrawingModalWindowService } from '../../drawing-modal-window/drawing-modal-window.service';
import { AbstractToolService } from '../abstract-tools/abstract-tool.service';
import { BrushToolService } from '../brush-tool/brush-tool.service';
import { PencilToolService } from '../pencil-tool/pencil-tool.service';
import { RectangleToolService } from '../rectangle-tool/rectangle-tool.service';
import { ToolName } from '../../constants';

@Injectable({
    providedIn: 'root',
})
export class ToolSelectorService {
    private toolName: BehaviorSubject<ToolName> = new BehaviorSubject(ToolName.Selection);

    currentToolName: Observable<ToolName> = this.toolName.asObservable();

    private rectangleTool: RectangleToolService;
    private pencilTool: PencilToolService;
    private brushTool: BrushToolService;
    currentTool: AbstractToolService | undefined;

    constructor(private drawingModalWindowService: DrawingModalWindowService) {}

    initTools(drawStack: DrawStackService, ref: ElementRef<SVGElement>, renderer: Renderer2): void {
        this.rectangleTool = new RectangleToolService(drawStack, ref, renderer);
        this.pencilTool = new PencilToolService(ref, renderer, drawStack);
        this.brushTool = new BrushToolService(ref, renderer, drawStack);
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

    changeTool(tooltipName: string): void {
        switch (tooltipName) {
            case ToolName.NewDrawing:
                this.drawingModalWindowService.changeDisplayNewDrawingModalWindow(true);
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
