import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSliderChange } from '@angular/material';

import { ShortcutManagerService } from 'src/app/services/shortcut-manager/shortcut-manager.service';
import { AttributesManagerService } from 'src/app/services/tools/attributes-manager/attributes-manager.service';
import { BrushToolService } from 'src/app/services/tools/brush-tool/brush-tool.service';
import { ToolSelectorService } from 'src/app/services/tools/tool-selector/tool-selector.service';
import { predicate } from 'src/constants/constants';
import { BRUSH_STYLE, BRUSH_STYLES, Thickness, ToolName } from 'src/constants/tool-constants';

@Component({
    selector: 'app-brush-attributes',
    templateUrl: './brush-attributes.component.html',
    styleUrls: ['./brush-attributes.component.scss'],
    providers: [AttributesManagerService],
})
export class BrushAttributesComponent implements OnInit, AfterViewInit {
    toolName = ToolName.Brush;
    brushAttributesForm: FormGroup;
    brushToolService: BrushToolService;
    styles = BRUSH_STYLES;
    selected: string;

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
        this.onThicknessChange();
    }

    ngAfterViewInit(): void {
        this.brushToolService = this.toolSelectorService.getBrushTool();
        this.brushToolService.initializeAttributesManagerService(this.attributesManagerService);
    }

    initializeForm(): void {
        this.brushAttributesForm = this.formBuilder.group({
            thickness: [
                Thickness.Default,
                [Validators.required, Validators.min(Thickness.Min), Validators.max(Thickness.Max)],
            ],
            style: [1],
        });
    }

    onSliderChange(event: MatSliderChange): void {
        if (predicate.eventIsValid(event, Thickness)) {
            this.brushAttributesForm.controls.thickness.setValue(event.value);
            this.onThicknessChange();
        }
    }

    onThicknessChange(): void {
        const thickness = this.brushAttributesForm.value.thickness;
        if (this.brushAttributesForm.controls.thickness.valid) {
            this.attributesManagerService.changeThickness(thickness);
        }
    }

    change(style: BRUSH_STYLE): void {
        this.attributesManagerService.changeStyle(style);
    }

    onFocus(): void {
        this.shortcutManagerService.changeIsOnInput(true);
    }
    onFocusOut(): void {
        this.shortcutManagerService.changeIsOnInput(false);
    }
}
