import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSliderChange } from '@angular/material';

import { ShortcutManagerService } from 'src/app/services/shortcut-manager/shortcut-manager.service';
import { AttributesManagerService } from 'src/app/services/tools/attributes-manager/attributes-manager.service';
import { EllipsisToolService } from 'src/app/services/tools/ellipsis-tool/ellipsis-tool.service';
import { ToolSelectorService } from 'src/app/services/tools/tool-selector/tool-selector.service';
import { PREDICATE } from 'src/constants/constants';
import { THICKNESS, TOOL_NAME, TRACE_TYPE } from 'src/constants/tool-constants';

@Component({
    selector: 'app-ellipsis-attributes',
    templateUrl: './ellipsis-attributes.component.html',
    styleUrls: ['./ellipsis-attributes.component.scss'],
})
export class EllipsisAttributesComponent implements OnInit, AfterViewInit {
    toolName = TOOL_NAME.Ellipsis;
    ellipsisAttributesForm: FormGroup;
    ellipsisToolService: EllipsisToolService;
    attributesManagerService: AttributesManagerService = new AttributesManagerService();
    readonly thickness = THICKNESS;

    constructor(
        private formBuilder: FormBuilder,
        private toolSelectorService: ToolSelectorService,
        private shortcutManagerService: ShortcutManagerService,
    ) {
        this.formBuilder = formBuilder;
    }

    ngOnInit() {
        this.initializeForm();
        this.onThicknessChange();
    }

    ngAfterViewInit(): void {
        this.ellipsisToolService = this.toolSelectorService.getEllipsisTool();
        this.ellipsisToolService.initializeAttributesManagerService(this.attributesManagerService);
    }

    initializeForm(): void {
        this.ellipsisAttributesForm = this.formBuilder.group({
            thickness: [
                THICKNESS.Default,
                [Validators.required, Validators.min(THICKNESS.Min), Validators.max(THICKNESS.Max)],
            ],
            traceType: [TRACE_TYPE.Full],
        });
    }

    onSliderChange(event: MatSliderChange): void {
        if (PREDICATE.eventIsValid(event, THICKNESS)) {
            this.ellipsisAttributesForm.controls.thickness.setValue(event.value);
            this.onThicknessChange();
        }
    }

    onThicknessChange(): void {
        const thickness: number = this.ellipsisAttributesForm.value.thickness;
        if (this.ellipsisAttributesForm.controls.thickness.valid) {
            this.attributesManagerService.thickness.next(thickness);
        }
    }

    onTraceTypeChange(): void {
        const tracetype: string = this.ellipsisAttributesForm.value.traceType;
        this.attributesManagerService.traceType.next(tracetype);
    }

    onFocus(): void {
        this.shortcutManagerService.changeIsOnInput(true);
    }
    onFocusOut(): void {
        this.shortcutManagerService.changeIsOnInput(false);
    }
}
