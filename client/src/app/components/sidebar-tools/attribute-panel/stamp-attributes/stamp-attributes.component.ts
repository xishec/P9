import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSliderChange } from '@angular/material';

import { ShortcutManagerService } from 'src/app/services/shortcut-manager/shortcut-manager.service';
import { StampToolService } from 'src/app/services/tools/stamp-tool/stamp-tool.service';
import { ToolSelectorService } from 'src/app/services/tools/tool-selector/tool-selector.service';
import { PREDICATE } from 'src/constants/constants';
import {
    ROTATION_ANGLE,
    STAMP_NAMES,
    STAMP_SCALING,
    STAMP_TYPES,
    STAMPS_MAP,
    TOOL_NAME,
} from 'src/constants/tool-constants';
import { AttributesManagerService } from '../../../../services/tools/attributes-manager/attributes-manager.service';

@Component({
    selector: 'app-stamp-attributes',
    templateUrl: './stamp-attributes.component.html',
    styleUrls: ['./stamp-attributes.component.scss'],
})
export class StampAttributesComponent implements OnInit {
    toolName = TOOL_NAME.Stamp;
    selected: string;

    stampAttributesForm: FormGroup;
    stampToolService: StampToolService;
    readonly STAMP_SCALING = STAMP_SCALING;
    readonly STAMP_ANGLE_ORIENTATION = ROTATION_ANGLE;
    readonly STAMP_TYPES = STAMP_TYPES;
    readonly STAMP_NAMES = STAMP_NAMES;

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
        this.stampToolService = this.toolSelectorService.getStampTool();
        this.stampToolService.initializeAttributesManagerService(this.attributesManagerService);
    }

    initializeForm(): void {
        this.stampAttributesForm = this.formBuilder.group({
            scaling: [
                STAMP_SCALING.Default,
                [Validators.required, Validators.min(STAMP_SCALING.Min), Validators.max(STAMP_SCALING.Max)],
            ],
            angle: [
                ROTATION_ANGLE.Default,
                [
                    Validators.required,
                    Validators.min(ROTATION_ANGLE.Min),
                    Validators.max(ROTATION_ANGLE.Max),
                ],
            ],
            stampType: [0],
        });
    }

    onSliderChange(event: MatSliderChange): void {
        if (PREDICATE.eventIsValid(event, STAMP_SCALING)) {
            this.stampAttributesForm.controls.scaling.setValue(event.value);
            this.onScalingChange();
        }
    }

    onScalingChange(): void {
        const stampScaling: number = this.stampAttributesForm.value.scaling;
        if (this.stampAttributesForm.controls.scaling.valid) {
            this.attributesManagerService.scaling.next(stampScaling);
        }
    }

    onStampTypeChange(): void {
        const stampType: number = this.stampAttributesForm.value.stampType;
        this.attributesManagerService.stampType.next(STAMPS_MAP.get(stampType) as string);
    }

    onAngleChange(): void {
        const stampAngle: number = this.stampAttributesForm.value.angle;
        if (this.stampAttributesForm.controls.angle.valid) {
            this.attributesManagerService.angle.next(stampAngle);
        }
    }

    onFocus(): void {
        this.shortcutManagerService.changeIsOnInput(true);
    }

    onFocusOut(): void {
        this.shortcutManagerService.changeIsOnInput(false);
    }
}
