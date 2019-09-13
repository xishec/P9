import { Injectable } from '@angular/core';

import { DrawingModalWindow } from '../drawing-modal-window/drawing-modal-window.service';

@Injectable({
    providedIn: 'root',
})
export class ToolsService {
    constructor(drawingModalWindow: DrawingModalWindow) {
        this.drawingModalWindow = drawingModalWindow;
    }

    private toolIds: number[] = [1, 2, 3, 4, 5, 6, 7, 8];
    private currentToolId: number = -999;
    private drawingModalWindow: DrawingModalWindow;

    getToolIds() {
        return this.toolIds;
    }
    getCurrentToolId() {
        return this.currentToolId;
    }

    changeTool(toolId: number) {
        this.currentToolId = toolId;
        if (toolId === 1) {
            this.drawingModalWindow.changeIfShowWindow(true);
        }
    }
}
