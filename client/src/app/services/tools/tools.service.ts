import { Injectable, ElementRef, Renderer2 } from '@angular/core';

import { DrawingModalWindowService } from '../drawing-modal-window/drawing-modal-window.service';
import { AbstractShapeToolService } from './abstract-tools/abstract-shape-tool/abstract-shape-tool.service';
import { DrawStackService } from '../draw-stack/draw-stack.service';
import { RectangleToolService } from './rectangle-tool/rectangle-tool.service';
import { PointerToolService } from './pointer-tool/pointer-tool.service';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class ToolsService {
    private toolIds: number[] = [1, 2, 3, 4, 5, 6, 7, 8];
    private currentToolId = -999;
    private currentFileToolId = -999;
    private drawingModalWindowService: DrawingModalWindowService;

    toolid: BehaviorSubject<number> = new BehaviorSubject(0);
    currTool = this.toolid.asObservable();

    constructor(drawingModalWindowService: DrawingModalWindowService) {
        this.drawingModalWindowService = drawingModalWindowService;
    }

    getToolIds(): number[] {
        return this.toolIds;
    }
    getCurrentToolId(): number {
        return this.currentToolId;
    }

    getCurrentFileToolId(): number{
        return this.currentFileToolId;
    }

    changeTool(toolId: number) {
        this.currentToolId = toolId;
        this.toolid.next(toolId);
    }

    getCurrentTool(drawStack: DrawStackService, ref: ElementRef<SVGElement>, renderer: Renderer2): AbstractShapeToolService{
        switch (this.getCurrentToolId()){
            case 7:
                return new RectangleToolService(drawStack, ref, renderer);
            default:
                return new PointerToolService(renderer);
        }
    }

    changeFileTool(fileId: number): void{
        this.currentFileToolId = fileId;
        if (this.currentFileToolId === 0) {
            this.drawingModalWindowService.changeIfShowWindow(true);
        }
    }
}
