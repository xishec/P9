import { ElementRef, Injectable, Renderer2 } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

import { DrawStackService } from '../../draw-stack/draw-stack.service';
import { DrawingModalWindowService } from '../../drawing-modal-window/drawing-modal-window.service';
import { AbstractToolService } from '../abstract-tools/abstract-tool.service';
import { PencilToolService } from '../pencil-tool/pencil-tool.service';
import { RectangleToolService } from '../rectangle-tool/rectangle-tool.service';

@Injectable({
    providedIn: 'root',
})
export class ToolsService {
    private toolName: BehaviorSubject<string> = new BehaviorSubject('');
    private drawingModalWindowService: DrawingModalWindowService;

    currentToolName: Observable<string> = this.toolName.asObservable();

    private rectangleTool: RectangleToolService;
    private pencilTool: PencilToolService;
    currentTool: AbstractToolService | undefined;

    constructor(drawingModalWindowService: DrawingModalWindowService) {
        this.drawingModalWindowService = drawingModalWindowService;
    }

    initTools(drawStack: DrawStackService, ref: ElementRef<SVGElement>, renderer: Renderer2): void {
        this.rectangleTool = new RectangleToolService(drawStack, ref, renderer);
        this.pencilTool = new PencilToolService(ref, renderer, drawStack);
    }

    getPencilTool(): PencilToolService {
        return this.pencilTool;
    }

    getRectangleTool(): RectangleToolService {
        return this.rectangleTool;
    }

    changeTool(tooltipName: string): void {
        switch (tooltipName) {
            case 'Nouveau dessin':
                this.drawingModalWindowService.changeDisplayNewDrawingModalWindow(true);
                break;
            case 'Carré':
                this.currentTool = this.rectangleTool;
                this.changeCurrentToolName(tooltipName);
                break;
            case 'Crayon':
                this.currentTool = this.pencilTool;
                this.changeCurrentToolName(tooltipName);
                break;
            default:
                this.currentTool = undefined;
                break;
        }
    }

    changeCurrentToolName(toolName: string): void {
        this.toolName.next(toolName);
    }
}
