import { Component, OnInit } from '@angular/core';

import { ToolName } from 'src/constants/tool-constants';
import { ToolSelectorService } from '../../../services/tools/tool-selector/tool-selector.service';

@Component({
    selector: 'app-attribute-panel',
    templateUrl: './attribute-panel.component.html',
    styleUrls: ['./attribute-panel.component.scss'],
})
export class AttributePanelComponent implements OnInit {
    readonly ToolName = ToolName;
    currentToolName: ToolName;

    constructor(private toolSelectorService: ToolSelectorService) {}

    ngOnInit(): void {
        this.toolSelectorService.currentToolName.subscribe((toolName) => {
            this.currentToolName = toolName;
        });
    }
}
