import { Component } from '@angular/core';

import { FILES_BUTTON_INFO, TOOLS_BUTTON_INFO } from '../../services/constants';
import { ToolsService } from '../../services/tools/tool-selector/tool-selector.service';

@Component({
    selector: 'app-sidebar-tools',
    templateUrl: './sidebar-tools.component.html',
    styleUrls: ['./sidebar-tools.component.scss'],
})
export class SidebarToolsComponent {
    toolsService: ToolsService;

    readonly TOOLS_BUTTON_INFO = TOOLS_BUTTON_INFO;
    readonly FILES_BUTTON_INFO = FILES_BUTTON_INFO;

    constructor(toolsService: ToolsService) {
        this.toolsService = toolsService;
    }

    ngOnInit(): void {
        this.toolsService.changeTool('Sélection');
    }

    onChangeTool(tooltipName: string) {
        console.log(tooltipName);
        this.toolsService.changeTool(tooltipName);
    }
}
