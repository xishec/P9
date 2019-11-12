import { Component, OnInit } from '@angular/core';

import { TOOL_NAME } from 'src/constants/tool-constants';
import { ColorToolService } from '../../../services/tools/color-tool/color-tool.service';
import { ToolSelectorService } from '../../../services/tools/tool-selector/tool-selector.service';

@Component({
    selector: 'app-attribute-panel',
    templateUrl: './attribute-panel.component.html',
    styleUrls: ['./attribute-panel.component.scss'],
})
export class AttributePanelComponent implements OnInit {
    readonly TOOL_NAME = TOOL_NAME;

    currentToolName: TOOL_NAME;
    showColorPalette = false;

    constructor(private toolSelectorService: ToolSelectorService, private colorToolService: ColorToolService) {}

    ngOnInit(): void {
        this.toolSelectorService.currentToolName.subscribe((toolName) => {
            this.currentToolName = toolName;
        });
        this.colorToolService.showColorPalette.subscribe((showColorPalette: boolean) => {
            this.showColorPalette = showColorPalette;
        });
    }
}
