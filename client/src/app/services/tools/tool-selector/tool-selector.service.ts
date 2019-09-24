import { Injectable, ElementRef, Renderer2 } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { DrawingModalWindowService } from '../../drawing-modal-window/drawing-modal-window.service';
import { RectangleToolService } from '../rectangle-tool/rectangle-tool.service';
import { PencilToolService } from '../pencil-tool/pencil-tool.service';
import { AbstractToolService } from '../abstract-tools/abstract-tool.service';
import { DrawStackService } from '../../draw-stack/draw-stack.service';
import { AttributesManagerService } from '../attributes-manager/attributes-manager.service';

@Injectable({
    providedIn: 'root',
})
export class ToolsService {
    private toolName: BehaviorSubject<string> = new BehaviorSubject('');
    private drawingModalWindowService: DrawingModalWindowService;

    currentToolName = this.toolName.asObservable();

    private rectangleTool: RectangleToolService;
    private pencilTool: PencilToolService;
    currentTool: AbstractToolService | undefined;

    constructor(drawingModalWindowService: DrawingModalWindowService) {
        this.drawingModalWindowService = drawingModalWindowService;
    }

    initTools(
        drawStack: DrawStackService,
        ref: ElementRef<SVGElement>,
        renderer: Renderer2,
        attributesManagerService: AttributesManagerService,
    ): void {
        this.rectangleTool = new RectangleToolService(drawStack, ref, renderer, attributesManagerService);
        this.pencilTool = new PencilToolService(ref, renderer, drawStack, attributesManagerService);
    }

    changeTool(tooltipName: string) {
        switch (tooltipName) {
            case 'Nouveau dessin':
                this.drawingModalWindowService.changeDisplayNewDrawingModalWindow(true);
                break;
            case 'Carré':
                this.currentTool = this.rectangleTool;
                break;
            case 'Crayon':
                this.currentTool = this.pencilTool;
                break;
            default:
                this.currentTool = undefined;
                break;
        }

        this.changeCurrentToolName(tooltipName);
    }

    changeCurrentToolName(toolName: string) {
        this.toolName.next(toolName);
    }
}
