import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSliderChange } from '@angular/material';

import { DEFAULT_THICKNESS, MAX_THICKNESS, MIN_THICKNESS } from '../../../../services/constants';
import { AttributesManagerService } from '../../../../services/tools/attributes-manager/attributes-manager.service';
import { PencilToolService } from '../../../../services/tools/pencil-tool/pencil-tool.service';
import { ToolsService } from '../../../../services/tools/tool-selector/tool-selector.service';

@Component({
    selector: 'app-pencil-attributes',
    templateUrl: './pencil-attributes.component.html',
    styleUrls: ['./pencil-attributes.component.scss'],
    providers: [AttributesManagerService],
})
export class PencilAttributesComponent implements OnInit, AfterViewInit {
    toolName = 'Crayon';
    myForm: FormGroup;
    pencilToolService: PencilToolService;

    readonly MIN_THICKNESS: number = MIN_THICKNESS;
    readonly MAX_THICKNESS: number = MAX_THICKNESS;

    constructor(
        private formBuilder: FormBuilder,
        private attributesManagerService: AttributesManagerService,
        private toolsService: ToolsService,
    ) {
        this.formBuilder = formBuilder;
    }

    ngOnInit(): void {
        this.initializeForm();
        this.onThicknessChange();
    }

    ngAfterViewInit(): void {
        this.pencilToolService = this.toolsService.getPencilTool();
        this.pencilToolService.initializeAttributesManagerService(this.attributesManagerService);
    }

    initializeForm(): void {
        this.myForm = this.formBuilder.group({
            thickness: [
                DEFAULT_THICKNESS,
                [Validators.required, Validators.min(MIN_THICKNESS), Validators.max(MAX_THICKNESS)],
            ],
        });
    }

    onSliderChange(event: MatSliderChange): void {
        this.myForm.controls.thickness.setValue(event.value);
        this.onThicknessChange();
    }
    onThicknessChange(): void {
        const thickness = this.myForm.value.thickness;
        if (thickness >= MIN_THICKNESS && thickness <= MAX_THICKNESS) {
            this.attributesManagerService.changeThickness(thickness);
        }
    }
}
