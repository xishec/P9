import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSliderChange } from '@angular/material';

import { ShortcutManagerService } from 'src/app/services/shortcut-manager/shortcut-manager.service';
import { PREDICATE } from 'src/constants/constants';
import { THICKNESS, TOOL_NAME, TRACE_TYPE } from 'src/constants/tool-constants';
import { AttributesManagerService } from '../../../../services/tools/attributes-manager/attributes-manager.service';
import { RectangleToolService } from '../../../../services/tools/rectangle-tool/rectangle-tool.service';
import { ToolSelectorService } from '../../../../services/tools/tool-selector/tool-selector.service';

@Component({
    selector: 'app-rectangle-attributes',
    templateUrl: './rectangle-attributes.component.html',
    styleUrls: ['./rectangle-attributes.component.scss'],
})
export class RectangleAttributesComponent implements OnInit, AfterViewInit {
    toolName = TOOL_NAME.Rectangle;
    rectangleAttributesForm: FormGroup;
    rectangleToolService: RectangleToolService;
    attributesManagerService: AttributesManagerService = new AttributesManagerService();
    readonly thickness = THICKNESS;

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
        this.rectangleToolService = this.toolSelectorService.getRectangleTool();
        this.rectangleToolService.initializeAttributesManagerService(this.attributesManagerService);
    }

    initializeForm(): void {
        this.rectangleAttributesForm = this.formBuilder.group({
            thickness: [
                THICKNESS.Default,
                [Validators.required, Validators.min(THICKNESS.Min), Validators.max(THICKNESS.Max)],
            ],
            traceType: [TRACE_TYPE.Full],
        });
    }

    onSliderChange(event: MatSliderChange): void {
        if (PREDICATE.eventIsValid(event, THICKNESS)) {
            this.rectangleAttributesForm.controls.thickness.setValue(event.value);
            this.onThicknessChange();
        }
    }

    onThicknessChange(): void {
        const thickness: number = this.rectangleAttributesForm.value.thickness;
        if (this.rectangleAttributesForm.controls.thickness.valid) {
            this.attributesManagerService.thickness.next(thickness);
        }
    }

    onTraceTypeChange(): void {
        const tracetype: string = this.rectangleAttributesForm.value.traceType;
        this.attributesManagerService.traceType.next(tracetype);
    }

    onFocus(): void {
        this.shortcutManagerService.changeIsOnInput(true);
    }
    onFocusOut(): void {
        this.shortcutManagerService.changeIsOnInput(false);
    }
}
