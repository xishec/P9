import { AfterViewInit, Component, OnInit } from '@angular/core';

import { FILES_BUTTON_INFO, ToolName, TOOLS_BUTTON_INFO } from 'src/constants/tool-constants';
import { ToolSelectorService } from '../../services/tools/tool-selector/tool-selector.service';

@Component({
    selector: 'app-sidebar-tools',
    templateUrl: './sidebar-tools.component.html',
    styleUrls: ['./sidebar-tools.component.scss'],
})
export class SidebarToolsComponent implements OnInit, AfterViewInit {
    readonly TOOLS_BUTTON_INFO = TOOLS_BUTTON_INFO;
    readonly FILES_BUTTON_INFO = FILES_BUTTON_INFO;

    currentToolName: ToolName;

    constructor(private toolSelectorService: ToolSelectorService) {}

    ngOnInit(): void {
        this.toolSelectorService.currentToolName.subscribe((currentToolName) => {
            this.currentToolName = currentToolName;
        });
    }

    ngAfterViewInit(): void {
        this.toolSelectorService.changeTool(ToolName.Selection);
    }

    onChangeTool(tooltipName: ToolName): void {
        this.toolSelectorService.changeTool(tooltipName);
    }
}
