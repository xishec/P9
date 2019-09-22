import { Injectable } from '@angular/core';

import { DrawingModalWindowService } from '../drawing-modal-window/drawing-modal-window.service';

@Injectable({
    providedIn: 'root',
})
export class ToolsService {
    private toolIds: number[] = [1, 2, 3, 4, 5, 6, 7, 8];
    private currentToolId = -999;
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

    changeTool(toolId: number) {
        this.currentToolId = toolId;
        if (toolId === 1) {
            this.drawingModalWindowService.changeDisplayNewDrawingModalWindow(true);
        }
    }
}
