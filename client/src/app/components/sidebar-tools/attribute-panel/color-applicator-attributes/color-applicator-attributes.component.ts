import { AfterViewInit, Component } from '@angular/core';

import { ColorApplicatorToolService } from 'src/app/services/tools/color-applicator-tool/color-applicator-tool.service';
import { ToolSelectorService } from 'src/app/services/tools/tool-selector/tool-selector.service';
import { TOOL_NAME } from 'src/constants/tool-constants';

@Component({
    selector: 'app-color-applicator-attributes',
    templateUrl: './color-applicator-attributes.component.html',
    styleUrls: ['./color-applicator-attributes.component.scss'],
})
export class ColorApplicatorAttributesComponent implements AfterViewInit {
    toolName = TOOL_NAME.ColorApplicator;
    colorApplicatorToolService: ColorApplicatorToolService;

    constructor(private toolSelectorService: ToolSelectorService) {}

    ngAfterViewInit(): void {
        this.colorApplicatorToolService = this.toolSelectorService.getColorApplicatorTool();
    }
}
