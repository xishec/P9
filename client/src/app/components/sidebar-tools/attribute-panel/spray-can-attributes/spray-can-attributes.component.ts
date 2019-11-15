import { Component, OnInit } from '@angular/core';
import { TOOL_NAME, THICKNESS } from 'src/constants/tool-constants';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SprayCanToolService } from 'src/app/services/tools/spray-can-tool/spray-can-tool.service';
import { AttributesManagerService } from 'src/app/services/tools/attributes-manager/attributes-manager.service';
import { ToolSelectorService } from 'src/app/services/tools/tool-selector/tool-selector.service';
import { ShortcutManagerService } from 'src/app/services/shortcut-manager/shortcut-manager.service';
import { MatSliderChange } from '@angular/material';
import { PREDICATE } from 'src/constants/constants';

@Component({
    selector: 'app-spray-can-attributes',
    templateUrl: './spray-can-attributes.component.html',
    styleUrls: ['./spray-can-attributes.component.scss'],
})
export class SprayCanAttributesComponent implements OnInit {
    toolName = TOOL_NAME.SprayCan;
    ellipsisAttributesForm: FormGroup;
    sprayCanToolService: SprayCanToolService;
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
        this.sprayCanToolService = this.toolSelectorService.getSprayCanTool();
        this.sprayCanToolService.initializeAttributesManagerService(this.attributesManagerService);
    }

    initializeForm(): void {
        this.ellipsisAttributesForm = this.formBuilder.group({
            thickness: [
                THICKNESS.Default,
                [Validators.required, Validators.min(THICKNESS.Min), Validators.max(THICKNESS.Max)],
            ],
            traceType: ['Contour'],
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

    onFocus(): void {
        this.shortcutManagerService.changeIsOnInput(true);
    }
    onFocusOut(): void {
        this.shortcutManagerService.changeIsOnInput(false);
    }
}
