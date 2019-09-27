import { Component, OnInit } from '@angular/core';

import { FILES_BUTTON_INFO, ToolName, TOOLS_BUTTON_INFO } from '../../../constants/constants';
import { ToolSelectorService } from '../../services/tools/tool-selector/tool-selector.service';

@Component({
    selector: 'app-sidebar-tools',
    templateUrl: './sidebar-tools.component.html',
    styleUrls: ['./sidebar-tools.component.scss'],
})
export class SidebarToolsComponent implements OnInit {
    readonly TOOLS_BUTTON_INFO = TOOLS_BUTTON_INFO;
    readonly FILES_BUTTON_INFO = FILES_BUTTON_INFO;

    currentToolName = '';

    constructor(private toolSelectorService: ToolSelectorService) {}

    ngOnInit(): void {
        this.toolSelectorService.currentToolName.subscribe((currentToolName) => {
            this.currentToolName = currentToolName;
        });
        this.toolSelectorService.changeTool(ToolName.Selection);
    }

    onChangeTool(tooltipName: string): void {
        this.toolSelectorService.changeTool(tooltipName);
    }

    onSecondaryClick(): void {
        console.log('onSecondaryClick');
    }

    onPrimaryClick(): void {
        console.log('onPrimaryClick');
    }
}
