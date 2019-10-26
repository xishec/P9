import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSliderChange } from '@angular/material';

import { ShortcutManagerService } from 'src/app/services/shortcut-manager/shortcut-manager.service';
import { predicate } from 'src/constants/constants';
import { Thickness, ToolName } from 'src/constants/tool-constants';
import { AttributesManagerService } from '../../../../services/tools/attributes-manager/attributes-manager.service';
import { PenToolService } from '../../../../services/tools/pen-tool/pen-tool.service';
import { ToolSelectorService } from '../../../../services/tools/tool-selector/tool-selector.service';

@Component({
    selector: 'app-pen-attributes',
    templateUrl: './pen-attributes.component.html',
    styleUrls: ['./pen-attributes.component.scss'],
    providers: [AttributesManagerService],
})
export class PenAttributesComponent implements OnInit, AfterViewInit {
    toolName = ToolName.Pen;
    penAttributesForm: FormGroup;
    penToolService: PenToolService;

    readonly Thickness = Thickness;

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
        this.onMaxThicknessChange();
        this.onMinThicknessChange();
    }

    ngAfterViewInit(): void {
        this.penToolService = this.toolSelectorService.getPenTool();
        this.penToolService.initializeAttributesManagerService(this.attributesManagerService);
    }

    initializeForm(): void {
        this.penAttributesForm = this.formBuilder.group({
            maxThickness: [
                Thickness.Default,
                [Validators.required, Validators.min(Thickness.Min), Validators.max(Thickness.Max)],
            ],
            minThickness: [
                Thickness.Min,
                [Validators.required, Validators.min(Thickness.Min), Validators.max(Thickness.Max)],
            ],
        });
    }

    onMaxSliderChange(event: MatSliderChange): void {
        if (predicate.eventIsValid(event, Thickness)) {
            this.penAttributesForm.controls.maxThickness.setValue(event.value);
            this.onMaxThicknessChange();
        }
    }
    onMaxThicknessChange(): void {
        const maxThickness: number = this.penAttributesForm.value.maxThickness;
        if (this.penAttributesForm.controls.maxThickness.valid) {
            this.attributesManagerService.changeMaxThickness(maxThickness);
        }
        if (this.penAttributesForm.value.minThickness > this.penAttributesForm.value.maxThickness) {
            let max = this.penAttributesForm.value.maxThickness;
            this.penAttributesForm.controls.minThickness.setValue(max);
        }
    }

    onMinSliderChange(event: MatSliderChange): void {
        if (predicate.eventIsValid(event, Thickness)) {
            this.penAttributesForm.controls.minThickness.setValue(event.value);
            this.onMinThicknessChange();
        }
    }
    onMinThicknessChange(): void {
        const minThickness: number = this.penAttributesForm.value.minThickness;
        if (this.penAttributesForm.controls.minThickness.valid) {
            this.attributesManagerService.changeMinThickness(minThickness);
        }
    }

    onFocus(): void {
        this.shortcutManagerService.changeIsOnInput(true);
    }
    onFocusOut(): void {
        this.shortcutManagerService.changeIsOnInput(false);
    }
}
