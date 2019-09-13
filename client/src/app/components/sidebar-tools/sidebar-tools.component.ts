import { Component } from '@angular/core';

import { ToolsService } from '../../services/tools/tools.service';

@Component({
    selector: 'app-sidebar-tools',
    templateUrl: './sidebar-tools.component.html',
    styleUrls: ['./sidebar-tools.component.scss'],
})
export class SidebarToolsComponent {
    toolsService: ToolsService;

    toolIds: number[] = [];
    currentToolId = 0;

    constructor(toolsService: ToolsService) {
        this.toolsService = toolsService;
        this.toolIds = toolsService.getToolIds();
        this.currentToolId = toolsService.getCurrentToolId();
    }

    onChangeTool(toolId: number) {
        this.toolsService.changeTool(toolId);
    }
}
