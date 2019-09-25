import { Component, OnInit } from '@angular/core';

import { ToolSelectorService } from '../../../services/tools/tool-selector/tool-selector.service';
import { ToolName } from '../../../services/constants';

@Component({
    selector: 'app-attribute-panel',
    templateUrl: './attribute-panel.component.html',
    styleUrls: ['./attribute-panel.component.scss'],
})
export class AttributePanelComponent implements OnInit {
    ToolName = ToolName;
    toolName = '';

    constructor(private toolSelectorService: ToolSelectorService) {}

    ngOnInit(): void {
        this.toolSelectorService.currentToolName.subscribe((toolName) => {
            this.toolName = toolName;
        });
    }
}
