import { AfterViewInit, Component, OnInit } from '@angular/core';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSliderChange } from '@angular/material';
import { DEFAULT_THICKNESS, MAX_THICKNESS, MIN_THICKNESS } from 'src/app/services/constants';
import { AttributesManagerService } from 'src/app/services/tools/attributes-manager/attributes-manager.service';
import { BrushToolService } from 'src/app/services/tools/brush-tool/brush-tool.service';
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
    styles = [1, 2, 3, 4, 5];

    readonly MIN_THICKNESS = MIN_THICKNESS;
    readonly MAX_THICKNESS = MAX_THICKNESS;

    constructor(
        private formBuilder: FormBuilder,
        private attributesManagerService: AttributesManagerService,
        private toolSelectorService: ToolSelectorService
    ) {
        this.formBuilder = formBuilder;
    }

    ngOnInit(): void {
        this.initializeForm();
        this.onThicknessChange();
    }

    ngAfterViewInit(): void {
        this.brushToolService = this.toolSelectorService.getBrushTool();
        this.brushToolService.initializeAttributesManagerService(this.attributesManagerService);
    }

    initializeForm(): void {
        this.brushAttributesForm = this.formBuilder.group({
            thickness: [
                DEFAULT_THICKNESS,
                [Validators.required, Validators.min(MIN_THICKNESS), Validators.max(this.MAX_THICKNESS)],
            ],
            style: [
              1,
            ],
        });
    }

    onSliderChange(event: MatSliderChange): void {
        this.brushAttributesForm.controls.thickness.setValue(event.value);
        this.onThicknessChange();
    }

    onThicknessChange(): void {
        console.log('called');
        const thickness = this.brushAttributesForm.value.thickness;
        if (thickness >= MIN_THICKNESS && thickness <= MAX_THICKNESS) {
            this.attributesManagerService.changeThickness(thickness);
        }
    }

    change(style: any): void {
        this.attributesManagerService.changeStyle(style);
    }
}
