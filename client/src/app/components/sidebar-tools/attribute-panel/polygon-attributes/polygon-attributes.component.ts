import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSliderChange } from '@angular/material';

import { AttributesManagerService } from 'src/app/services/tools/attributes-manager/attributes-manager.service';
import { ToolSelectorService } from 'src/app/services/tools/tool-selector/tool-selector.service';
import { ColorToolService } from 'src/app/services/tools/color-tool/color-tool.service';
import { ShortcutManagerService } from 'src/app/services/shortcut-manager/shortcut-manager.service';
import { Thickness, ToolName } from 'src/constants/tool-constants';
import { PolygonToolService } from 'src/app/services/tools/polygon-tool/polygon-tool.service';

@Component({
    selector: 'app-polygon-attributes',
    templateUrl: './polygon-attributes.component.html',
    styleUrls: ['./polygon-attributes.component.scss'],
})
export class PolygonAttributesComponent implements OnInit {
    toolName = ToolName.Polygon;
    rectangleAttributesForm: FormGroup;
    polygonTollService: PolygonToolService;
    readonly thickness = Thickness;

    constructor(
        private formBuilder: FormBuilder,
        private attributesManagerService: AttributesManagerService,
        private toolSelectorService: ToolSelectorService,
        private colorToolService: ColorToolService,
        private shortcutManagerService: ShortcutManagerService
    ) {
        this.formBuilder = formBuilder;
    }

    ngOnInit(): void {
        this.initializeForm();
        this.onThicknessChange();
    }

    ngAfterViewInit(): void {
        this.polygonTollService = this.toolSelectorService.getPolygonTool();
        this.polygonTollService.initializeAttributesManagerService(this.attributesManagerService);
        this.polygonTollService.initializeColorToolService(this.colorToolService);
    }

    initializeForm(): void {
        this.rectangleAttributesForm = this.formBuilder.group({
            thickness: [
                Thickness.Default,
                [Validators.required, Validators.min(Thickness.Min), Validators.max(Thickness.Max)],
            ],
            traceType: ['Contour'],
            sideNumber: ['3'],
        });
    }

    onThicknessSliderChange(event: MatSliderChange): void {
        if (event.value !== null && event.value <= Thickness.Max && event.value >= Thickness.Min) {
            this.rectangleAttributesForm.controls.thickness.setValue(event.value);
            this.onThicknessChange();
        }
    }

    onSideNumberSliderChange(event: MatSliderChange) {}

    onThicknessChange(): void {
        const thickness: number = this.rectangleAttributesForm.value.thickness;
        if (thickness >= Thickness.Min && thickness <= Thickness.Max) {
            this.attributesManagerService.changeThickness(thickness);
        }
    }

    onTraceTypeChange(): void {
        const tracetype: string = this.rectangleAttributesForm.value.traceType;
        this.attributesManagerService.changeTraceType(tracetype);
    }

    onSideNumberChange(): void {
        this.attributesManagerService;
    }

    onFocus() {
        this.shortcutManagerService.changeIsOnInput(true);
    }
    onFocusOut() {
        this.shortcutManagerService.changeIsOnInput(false);
    }
}
