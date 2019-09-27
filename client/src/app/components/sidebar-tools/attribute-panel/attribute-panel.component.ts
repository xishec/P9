import { Component, OnInit } from '@angular/core';

import { ToolName } from '../../../services/constants';
import { ToolSelectorService } from '../../../services/tools/tool-selector/tool-selector.service';
import { ColorToolService } from '../../../services/tools/color-tool/color-tool.service';

@Component({
    selector: 'app-attribute-panel',
    templateUrl: './attribute-panel.component.html',
    styleUrls: ['./attribute-panel.component.scss'],
})
export class AttributePanelComponent implements OnInit {
    readonly ToolName = ToolName;

    currentToolName: ToolName;
    showColorPalette = false;

    constructor(private toolSelectorService: ToolSelectorService, private colorToolService: ColorToolService) {}

    ngOnInit(): void {
        this.toolSelectorService.currentToolName.subscribe((toolName) => {
            this.currentToolName = toolName;
        });
        this.colorToolService.currentShowColorPalette.subscribe((showColorPalette: boolean) => {
            this.showColorPalette = showColorPalette;
        });
    }
}
