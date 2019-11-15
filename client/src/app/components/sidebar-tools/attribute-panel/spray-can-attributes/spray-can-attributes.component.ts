import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSliderChange } from '@angular/material';
import { ShortcutManagerService } from 'src/app/services/shortcut-manager/shortcut-manager.service';
import { AttributesManagerService } from 'src/app/services/tools/attributes-manager/attributes-manager.service';
import { SprayCanToolService } from 'src/app/services/tools/spray-can-tool/spray-can-tool.service';
import { ToolSelectorService } from 'src/app/services/tools/tool-selector/tool-selector.service';
import { PREDICATE } from 'src/constants/constants';
import { THICKNESS, TOOL_NAME, SPRAY_DIAMETER } from 'src/constants/tool-constants';

@Component({
    selector: 'app-spray-can-attributes',
    templateUrl: './spray-can-attributes.component.html',
    styleUrls: ['./spray-can-attributes.component.scss'],
})
export class SprayCanAttributesComponent implements OnInit, AfterViewInit {
    toolName = TOOL_NAME.SprayCan;
    sprayCanAttributesForm: FormGroup;
    sprayCanToolService: SprayCanToolService;
    attributesManagerService: AttributesManagerService = new AttributesManagerService();
    readonly thickness = THICKNESS;
    readonly diameter = SPRAY_DIAMETER;

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
        this.sprayCanAttributesForm = this.formBuilder.group({
            thickness: [
                THICKNESS.Min,
                [Validators.required, Validators.min(THICKNESS.Min), Validators.max(THICKNESS.Max)],
            ],
            diameter: [
                SPRAY_DIAMETER.Default,
                [Validators.required, Validators.min(SPRAY_DIAMETER.Min), Validators.max(SPRAY_DIAMETER.Max)],
            ],
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
