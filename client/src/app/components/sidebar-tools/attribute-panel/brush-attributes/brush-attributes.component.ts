import { AfterViewInit, Component, OnInit } from '@angular/core';

import { AttributesManagerService } from 'src/app/services/tools/attributes-manager/attributes-manager.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MIN_THICKNESS, DEFAULT_THICKNESS } from 'src/app/services/constants';
import { ToolSelectorService } from 'src/app/services/tools/tool-selector/tool-selector.service';

@Component({
  selector: 'app-brush-attributes',
  templateUrl: './brush-attributes.component.html',
  styleUrls: ['./brush-attributes.component.scss'],
  providers: [AttributesManagerService],
})
export class BrushAttributesComponent implements OnInit, AfterViewInit {
  toolName = 'Pinceau';
  brushAttributesForm: FormGroup;
  brushToolService: BrushToolService;

  readonly MIN_THICKNESS = MIN_THICKNESS;
  readonly MAX_THICKNESS = MAX_THICKNESS;

  constructor(
    private formBuilder: FormBuilder,
    private attributesManagerService: AttributesManagerService,
    private toolSelectorService: ToolSelectorService,
  ) { 
    this.formBuilder = formBuilder;
  }

  ngOnInit(): void {
    this.initializeForm();
  }

  ngAfterViewInit(): void {
    thi.brushToolService = this.toolSelectorService.getBrushTool(); // hfbuyiefbay uigbfr
  }


  initializeForm(): void {
    this.brushAttributesForm = this.formBuilder.group({
      thickness : [
        DEFAULT_THICKNESS,
        [Validators.required, Validators.min(MIN_THICKNESS), Validators.max(this.MAX_THICKNESS),]
      ]
    })
  }
}
