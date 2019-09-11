import { Component, OnInit } from '@angular/core';

import { ToolsService } from '../../../services/tootls/tools.service';

@Component({
    selector: 'app-sidebar-tools',
    templateUrl: './sidebar-tools.component.html',
    styleUrls: ['./sidebar-tools.component.scss'],
})
export class SidebarToolsComponent {
    toolsService: ToolsService;

    toolIds: number[];
    currentToolId: number;

    constructor(toolsService: ToolsService) {
        this.toolsService = toolsService;
        this.toolIds = toolsService.getToolIds();
        this.currentToolId = toolsService.getCurrentToolId();
    }

    changeTool(toolId: number) {
        this.toolsService.changeTool(toolId);
    }
}
