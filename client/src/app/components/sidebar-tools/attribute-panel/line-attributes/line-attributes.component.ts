import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { MatSliderChange } from '@angular/material';
import { ShortcutManagerService } from 'src/app/services/shortcut-manager/shortcut-manager.service';
import { AttributesManagerService } from 'src/app/services/tools/attributes-manager/attributes-manager.service';
import { LineToolService } from 'src/app/services/tools/line-tool/line-tool.service';
import { ToolSelectorService } from 'src/app/services/tools/tool-selector/tool-selector.service';
import { PREDICATE } from 'src/constants/constants';
import { LINE_JOINT_TYPE, LINE_STROKE_TYPE, THICKNESS, TOOL_NAME } from 'src/constants/tool-constants';

@Component({
    selector: 'app-line-attributes',
    templateUrl: './line-attributes.component.html',
    styleUrls: ['./line-attributes.component.scss'],
    providers: [AttributesManagerService],
})
export class LineAttributesComponent implements OnInit, AfterViewInit {
    toolName = TOOL_NAME.Line;
    lineAttributesForm: FormGroup;
    lineToolService: LineToolService;

    lineStrokeType: LINE_STROKE_TYPE;
    LineStrokeTypeChoices = [LINE_STROKE_TYPE.Continuous, LINE_STROKE_TYPE.Dotted_line, LINE_STROKE_TYPE.Dotted_circle];

    circleJointSelected = false;

    readonly THICKNESS = THICKNESS;

    constructor(
        public formBuilder: FormBuilder,
        public attributeManagerService: AttributesManagerService,
        public toolSelectorService: ToolSelectorService,
        public shortcutManagerService: ShortcutManagerService,
    ) {
        this.formBuilder = formBuilder;
    }

    ngOnInit(): void {
        this.initializeForm();
        this.onThicknessChange();
    }

    ngAfterViewInit(): void {
        this.lineToolService = this.toolSelectorService.getLineTool();
        this.lineToolService.initializeAttributesManagerService(this.attributeManagerService);
    }

    initializeForm(): void {
        this.lineAttributesForm = this.formBuilder.group({
            thickness: [
                THICKNESS.Default,
                [Validators.required, Validators.min(THICKNESS.Min), Validators.max(THICKNESS.Max)],
            ],
            lineStrokeType: [LINE_STROKE_TYPE.Continuous],
            lineJointType: [LINE_JOINT_TYPE.Curvy],
            circleJointDiameter: [THICKNESS.Default, [Validators.min(THICKNESS.Min), Validators.max(THICKNESS.Max)]],
        });
    }

    onLineStrokeTypeChange(lineStrokeType: LINE_STROKE_TYPE): void {
        this.attributeManagerService.lineStrokeType.next(lineStrokeType);
    }

    onLineJointTypeChange(lineJointType: LINE_JOINT_TYPE): void {
        this.circleJointSelected = lineJointType === LINE_JOINT_TYPE.Circle;
        this.attributeManagerService.lineJointType.next(lineJointType);
    }

    onCircleJointSliderChange(event: MatSliderChange): void {
        if (PREDICATE.eventIsValid(event, THICKNESS)) {
            this.lineAttributesForm.controls.circleJointDiameter.setValue(event.value);
            this.onCircleJointDiameterChange();
        }
    }

    onCircleJointDiameterChange(): void {
        const jointThickness = this.lineAttributesForm.value.circleJointDiameter;
        if (this.lineAttributesForm.valid) {
            this.attributeManagerService.circleJointDiameter.next(jointThickness);
        }
    }

    onSliderChange(event: MatSliderChange): void {
        if (PREDICATE.eventIsValid(event, THICKNESS)) {
            this.lineAttributesForm.controls.thickness.setValue(event.value);
            this.onThicknessChange();
        }
    }

    onThicknessChange(): void {
        const thickness: number = this.lineAttributesForm.value.thickness;
        if (this.lineAttributesForm.controls.thickness.valid) {
            this.attributeManagerService.thickness.next(thickness);
        }
    }

    onFocus() {
        this.shortcutManagerService.changeIsOnInput(true);
    }

    onFocusOut() {
        this.shortcutManagerService.changeIsOnInput(false);
    }
}
