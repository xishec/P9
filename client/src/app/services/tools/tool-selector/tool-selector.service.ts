import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { DrawingModalWindowService } from '../../drawing-modal-window/drawing-modal-window.service';

@Injectable({
    providedIn: 'root',
})
export class ToolsService {
    private toolName: BehaviorSubject<string> = new BehaviorSubject('');
    private drawingModalWindowService: DrawingModalWindowService;

    currentToolName = this.toolName.asObservable();

    constructor(drawingModalWindowService: DrawingModalWindowService) {
        this.drawingModalWindowService = drawingModalWindowService;
    }

    changeTool(tooltipName: string) {
        this.changeActiveColor(tooltipName);
        switch (tooltipName) {
            case 'Nouveau dessin':
                this.drawingModalWindowService.changeDisplayNewDrawingModalWindow(true);
                break;
        }
    }

    changeActiveColor(toolName: string) {
        this.toolName.next(toolName);
    }
}
