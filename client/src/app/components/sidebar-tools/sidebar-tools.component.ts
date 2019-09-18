import { Component } from '@angular/core';

import { ToolsService } from '../../services/tools/tools.service';
import { TOOLS_BUTTON_INFO, FILES_BUTTON_INFO } from '../../services/constants';

@Component({
    selector: 'app-sidebar-tools',
    templateUrl: './sidebar-tools.component.html',
    styleUrls: ['./sidebar-tools.component.scss'],
})
export class SidebarToolsComponent {
    toolIds: number[] = [];
    currentToolId = 0;

    readonly TOOLS_BUTTON_INFO = TOOLS_BUTTON_INFO;
    readonly FILES_BUTTON_INFO = FILES_BUTTON_INFO;

    constructor(public toolsService: ToolsService) {
        this.toolsService = toolsService;
        this.toolIds = toolsService.getToolIds();
        this.currentToolId = toolsService.getCurrentToolId();
    }

    onChangeTool(toolId: number) {
        this.toolsService.changeTool(toolId);
    }

    onChangeFileTool(fileId: number){
        this.toolsService.changeFileTool(fileId);
    }
}
