import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSliderChange } from '@angular/material';

import { ShortcutManagerService } from 'src/app/services/shortcut-manager/shortcut-manager.service';
import { StampToolService } from 'src/app/services/tools/stamp-tool/stamp-tool.service';
import { ToolSelectorService } from 'src/app/services/tools/tool-selector/tool-selector.service';
import {
    STAMP_NAMES,
    STAMP_TYPES,
    StampAngleOrientation,
    STAMPS_MAP,
    StampScaling,
    ToolName,
} from 'src/constants/tool-constants';
import { AttributesManagerService } from '../../../../services/tools/attributes-manager/attributes-manager.service';

@Component({
    selector: 'app-stamp-attributes',
    templateUrl: './stamp-attributes.component.html',
    styleUrls: ['./stamp-attributes.component.scss'],
})
export class StampAttributesComponent implements OnInit {
    toolName = ToolName.Stamp;

    stampAttributesForm: FormGroup;
    stampToolService: StampToolService;
    readonly stampScaling = StampScaling;
    readonly stampAngleOrientation = StampAngleOrientation;
    readonly stampTypes = STAMP_TYPES;
    readonly stampNames = STAMP_NAMES;

    constructor(
        private formBuilder: FormBuilder,
        private attributesManagerService: AttributesManagerService,
        private toolSelectorService: ToolSelectorService,
        private shortcutManagerService: ShortcutManagerService,
    ) {
        this.formBuilder = formBuilder;
    }

    ngOnInit(): void {
        this.initializeForm();
        this.onScalingChange();
        this.stampToolService = this.toolSelectorService.getStampToolService();
        this.stampToolService.initializeAttributesManagerService(this.attributesManagerService);
    }

    initializeForm(): void {
        this.stampAttributesForm = this.formBuilder.group({
            scaling: [
                StampScaling.Default,
                [Validators.required, Validators.min(StampScaling.Min), Validators.max(StampScaling.Max)],
            ],
            angle: [
                StampAngleOrientation.Default,
                [
                    Validators.required,
                    Validators.min(StampAngleOrientation.Min),
                    Validators.max(StampAngleOrientation.Max),
                ],
            ],
            stampType: [0],
        });
    }

    onSliderChange(event: MatSliderChange): void {
        if (event.value !== null && event.value <= StampScaling.Max && event.value >= StampScaling.Min) {
            this.stampAttributesForm.controls.scaling.setValue(event.value);
            this.onScalingChange();
        }
    }

    onScalingChange(): void {
        const stampScaling: number = this.stampAttributesForm.value.scaling;
        if (stampScaling >= StampScaling.Min && stampScaling <= StampScaling.Max) {
            this.attributesManagerService.changeScaling(stampScaling);
        }
    }

    onStampTypeChange(): void {
        const stampType: number = this.stampAttributesForm.value.stampType;
        this.attributesManagerService.changeStampType(STAMPS_MAP.get(stampType) as string);
    }

    onAngleChange(): void {
        const stampAngle: number = this.stampAttributesForm.value.angle;
        if (stampAngle >= StampAngleOrientation.Min && stampAngle <= StampAngleOrientation.Max) {
            this.attributesManagerService.changeAngle(stampAngle);
        }
    }

    onFocus() {
        this.shortcutManagerService.changeIsOnInput(true);
    }

    onFocusOut() {
        this.shortcutManagerService.changeIsOnInput(false);
    }
}