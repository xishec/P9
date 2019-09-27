import { AfterViewInit, Component } from '@angular/core';

import { ColorApplicatorToolService } from 'src/app/services/tools/color-applicator-tool/color-applicator-tool.service';
import { ColorToolService } from 'src/app/services/tools/color-tool/color-tool.service';
import { ToolSelectorService } from 'src/app/services/tools/tool-selector/tool-selector.service';
import { ToolName } from 'src/constants/tool-constants';

@Component({
    selector: 'app-color-applicator-attributes',
    templateUrl: './color-applicator-attributes.component.html',
    styleUrls: ['./color-applicator-attributes.component.scss'],
})
export class ColorApplicatorAttributesComponent implements AfterViewInit {
    toolName = ToolName.ColorApplicator;
    colorApplicatorToolService: ColorApplicatorToolService;

    constructor(private toolSelectorService: ToolSelectorService, private colorToolService: ColorToolService) {}

    ngAfterViewInit(): void {
        this.colorApplicatorToolService = this.toolSelectorService.getColorApplicatorTool();
        this.colorApplicatorToolService.initializeColorToolService(this.colorToolService);
    }
}
