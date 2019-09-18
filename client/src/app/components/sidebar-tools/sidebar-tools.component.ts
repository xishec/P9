import { Component } from '@angular/core';

import { FILES_BUTTON_INFO, TOOLS_BUTTON_INFO } from '../../services/constants';
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

    readonly TOOLS_BUTTON_INFO = TOOLS_BUTTON_INFO;
    readonly FILES_BUTTON_INFO = FILES_BUTTON_INFO;

    constructor(toolsService: ToolsService) {
        this.toolsService = toolsService;
        this.toolIds = toolsService.getToolIds();
        this.currentToolId = toolsService.getCurrentToolId();
    }

    onChangeTool(toolId: number) {
        this.toolsService.changeTool(toolId);
    }
}
