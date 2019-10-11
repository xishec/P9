import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSliderChange } from '@angular/material';

import { ShortcutManagerService } from 'src/app/services/shortcut-manager/shortcut-manager.service';
import { AttributesManagerService } from 'src/app/services/tools/attributes-manager/attributes-manager.service';
import { ColorToolService } from 'src/app/services/tools/color-tool/color-tool.service';
import { PolygonToolService } from 'src/app/services/tools/polygon-tool/polygon-tool.service';
import { ToolSelectorService } from 'src/app/services/tools/tool-selector/tool-selector.service';
import { Thickness, ToolName, PolygonSides, PolygonFormeType } from 'src/constants/tool-constants';

@Component({
    selector: 'app-polygon-attributes',
    templateUrl: './polygon-attributes.component.html',
    styleUrls: ['./polygon-attributes.component.scss'],
})
export class PolygonAttributesComponent implements OnInit {
    toolName = ToolName.Polygon;
    polygonAttributesForm: FormGroup;
    polygonTollService: PolygonToolService;

    readonly thickness = Thickness;
    readonly polygonSides = PolygonSides;

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
        this.polygonAttributesForm = this.formBuilder.group({
            thickness: [
                Thickness.Default,
                [Validators.required, Validators.min(Thickness.Min), Validators.max(Thickness.Max)],
            ],
            traceType: ['Contour'],
            sideNumber: [
                PolygonSides.Default,
                [Validators.required, Validators.min(PolygonSides.Min), Validators.max(PolygonSides.Max)],
            ],
        });
    }

    onThicknessSliderChange(event: MatSliderChange): void {
        if (event.value !== null && event.value <= Thickness.Max && event.value >= Thickness.Min) {
            this.polygonAttributesForm.controls.thickness.setValue(event.value);
            this.onThicknessChange();
        }
    }

    onSideNumberSliderChange(event: MatSliderChange) {
        //TODO: Change Thickness for the sidenumber enum && predicat for min/max
        if (event.value !== null && event.value <= PolygonSides.Max && event.value >= PolygonSides.Min) {
            this.polygonAttributesForm.controls.sideNumber.setValue(event.value);
            this.onSideNumberChange();
        }
    }

    onThicknessChange(): void {
        const thickness: number = this.polygonAttributesForm.value.thickness;
        if (thickness >= Thickness.Min && thickness <= Thickness.Max) {
            this.attributesManagerService.changeThickness(thickness);
        }
    }

    onTraceTypeChange(): void {
        const tracetype: string = this.polygonAttributesForm.value.traceType;
        this.attributesManagerService.changeTraceType(tracetype);
    }

    onSideNumberChange(): void {
        const sideNumber = this.polygonAttributesForm.value.sideNumber;
        this.attributesManagerService.changeSideNumber(sideNumber);
    }

    onFocus() {
        this.shortcutManagerService.changeIsOnInput(true);
    }
    onFocusOut() {
        this.shortcutManagerService.changeIsOnInput(false);
    }
}
