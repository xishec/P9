import { Injectable } from '@angular/core';

import { DrawingModalWindowService } from '../drawing-modal-window/drawing-modal-window.service';

@Injectable({
    providedIn: 'root',
})
export class ToolsService {
    private toolIds: number[] = [1, 2, 3, 4, 5, 6, 7, 8];
    private currentToolId = -999;
    private currentFileToolId = -999;
    private drawingModalWindowService: DrawingModalWindowService;

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
    }

    changeFileTool(fileId: number): void{
        this.currentFileToolId = fileId;
        if (this.currentFileToolId === 0) {
            this.drawingModalWindowService.changeIfShowWindow(true);
        }
    }
}
