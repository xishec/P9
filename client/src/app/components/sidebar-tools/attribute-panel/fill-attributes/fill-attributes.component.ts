import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSliderChange } from '@angular/material';

import { ShortcutManagerService } from 'src/app/services/shortcut-manager/shortcut-manager.service';
import { PREDICATE } from 'src/constants/constants';
import { THICKNESS, TOLERANCE, TOOL_NAME, TRACE_TYPE } from 'src/constants/tool-constants';
import { AttributesManagerService } from '../../../../services/tools/attributes-manager/attributes-manager.service';
import { FillToolService } from '../../../../services/tools/fill-tool/fill-tool.service';
import { ToolSelectorService } from '../../../../services/tools/tool-selector/tool-selector.service';

@Component({
    selector: 'app-fill-attributes',
    templateUrl: './fill-attributes.component.html',
    styleUrls: ['./fill-attributes.component.scss'],
})
export class FillAttributesComponent implements OnInit, AfterViewInit {
    toolName = TOOL_NAME.Fill;
    fillAttributesForm: FormGroup;
    fillToolService: FillToolService;
    attributesManagerService: AttributesManagerService = new AttributesManagerService();

    readonly THICKNESS = THICKNESS;
    readonly TOLERANCE = TOLERANCE;

    constructor(
        private formBuilder: FormBuilder,
        private toolSelectorService: ToolSelectorService,
        private shortcutManagerService: ShortcutManagerService,
    ) {
        this.formBuilder = formBuilder;
    }

    ngOnInit(): void {
        this.initializeForm();
        this.onThicknessChange();
    }

    ngAfterViewInit(): void {
        this.fillToolService = this.toolSelectorService.getFillTool();
        this.fillToolService.initializeAttributesManagerService(this.attributesManagerService);
    }

    initializeForm(): void {
        this.fillAttributesForm = this.formBuilder.group({
            thickness: [
                THICKNESS.Default,
                [Validators.required, Validators.min(THICKNESS.Min), Validators.max(THICKNESS.Max)],
            ],
            tolerance: [
                TOLERANCE.Default,
                [Validators.required, Validators.min(TOLERANCE.Min), Validators.max(TOLERANCE.Max)],
            ],
            traceType: [TRACE_TYPE.Full],
        });
    }

    onThicknessSliderChange(event: MatSliderChange): void {
        if (PREDICATE.eventIsValid(event, THICKNESS)) {
            this.fillAttributesForm.controls.thickness.setValue(event.value);
            this.onThicknessChange();
        }
    }

    onToleranceSliderChange(event: MatSliderChange): void {
        if (PREDICATE.eventIsValid(event, TOLERANCE)) {
            this.fillAttributesForm.controls.tolerance.setValue(event.value);
            this.onToleranceChange();
        }
    }

    onThicknessChange(): void {
        const thickness: number = this.fillAttributesForm.value.thickness;
        if (this.fillAttributesForm.controls.thickness.valid) {
            this.attributesManagerService.thickness.next(thickness);
        }
    }

    onToleranceChange(): void {
        const tolerance: number = this.fillAttributesForm.value.tolerance;
        if (this.fillAttributesForm.controls.tolerance.valid) {
            this.attributesManagerService.tolerance.next(tolerance);
        }
    }

    onTraceTypeChange(): void {
        const tracetype: string = this.fillAttributesForm.value.traceType;
        this.attributesManagerService.traceType.next(tracetype);
    }

    onFocus(): void {
        this.shortcutManagerService.changeIsOnInput(true);
    }
    onFocusOut(): void {
        this.shortcutManagerService.changeIsOnInput(false);
    }
}
