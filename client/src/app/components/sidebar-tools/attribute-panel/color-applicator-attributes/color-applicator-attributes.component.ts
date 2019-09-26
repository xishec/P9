import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ToolName } from 'src/app/services/constants';
import { ToolSelectorService } from 'src/app/services/tools/tool-selector/tool-selector.service';
import { ColorToolService } from 'src/app/services/tools/color-tool/color-tool.service';
import { ColorApplicatorToolService } from 'src/app/services/tools/color-applicator-tool/color-applicator-tool.service';

@Component({
  selector: 'app-color-applicator-attributes',
  templateUrl: './color-applicator-attributes.component.html',
  styleUrls: ['./color-applicator-attributes.component.scss']
})
export class ColorApplicatorAttributesComponent implements OnInit, AfterViewInit {
    toolName = ToolName.ColorApplicator;
    colorApplicatorToolService: ColorApplicatorToolService;

  constructor(
    private toolSelectorService: ToolSelectorService,
    private colorToolService: ColorToolService,
    ) { }

  ngOnInit() {
  }

  ngAfterViewInit(): void {
    this.colorApplicatorToolService = this.toolSelectorService.getColorApplicatorTool();
    this.colorApplicatorToolService.initializeColorToolService(this.colorToolService);
}

}
