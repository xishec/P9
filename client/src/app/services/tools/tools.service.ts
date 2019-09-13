import { Injectable } from '@angular/core';

import { DrawingModalWindowService } from '../drawing-modal-window/drawing-modal-window.service';

@Injectable({
    providedIn: 'root',
})
export class ToolsService {
    constructor(drawingModalWindowService: DrawingModalWindowService) {
        this.drawingModalWindowService = drawingModalWindowService;
    }

    private toolIds: number[] = [1, 2, 3, 4, 5, 6, 7, 8];
    private currentToolId: number = -999;
    private drawingModalWindowService: DrawingModalWindowService;

    getToolIds(): Array<number> {
        return this.toolIds;
    }
    getCurrentToolId(): number {
        return this.currentToolId;
    }

    changeTool(toolId: number) {
        this.currentToolId = toolId;
        if (toolId === 1) {
            this.drawingModalWindowService.changeIfShowWindow(true);
        }
    }
}
