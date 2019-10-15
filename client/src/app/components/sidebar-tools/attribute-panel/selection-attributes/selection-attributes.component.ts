import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

import { ToolName } from 'src/constants/tool-constants';
import { SelectionToolService } from 'src/app/services/tools/selection-tool/selection-tool.service';
import { ToolSelectorService } from 'src/app/services/tools/tool-selector/tool-selector.service';

@Component({
    selector: 'app-selection-attributes',
    templateUrl: './selection-attributes.component.html',
    styleUrls: ['./selection-attributes.component.scss'],
})
export class SelectionAttributesComponent implements OnInit {
    toolName = ToolName.Selection;

    selectionAttributesForm: FormGroup;
    selectionToolService: SelectionToolService;

    constructor(private formBuilder: FormBuilder, private toolSelectorService: ToolSelectorService) {
        this.formBuilder = formBuilder;
    }

    ngOnInit(): void {
        this.initializeForm();
        this.selectionToolService = this.toolSelectorService.getSelectiontool();
        this.selectionToolService.initControlPoints();
        this.selectionToolService.initSelectionBox();
    }

    initializeForm(): void {
        this.selectionAttributesForm = this.formBuilder.group({
            //something to put here in the future?
        });
    }
}
