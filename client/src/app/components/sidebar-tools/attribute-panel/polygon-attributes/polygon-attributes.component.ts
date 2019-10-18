import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSliderChange } from '@angular/material';

import { ShortcutManagerService } from 'src/app/services/shortcut-manager/shortcut-manager.service';
import { AttributesManagerService } from 'src/app/services/tools/attributes-manager/attributes-manager.service';
import { ColorToolService } from 'src/app/services/tools/color-tool/color-tool.service';
import { PolygonToolService } from 'src/app/services/tools/polygon-tool/polygon-tool.service';
import { ToolSelectorService } from 'src/app/services/tools/tool-selector/tool-selector.service';
import { Thickness, ToolName, PolygonSides, PolygonFormType } from 'src/constants/tool-constants';
import { predicate } from 'src/constants/constants';

@Component({
    selector: 'app-polygon-attributes',
    templateUrl: './polygon-attributes.component.html',
    styleUrls: ['./polygon-attributes.component.scss'],
})
export class PolygonAttributesComponent implements OnInit {
    toolName = ToolName.Polygon;
    polygonAttributesForm: FormGroup;
    polygonTollService: PolygonToolService;
    attributesManagerService: AttributesManagerService = new AttributesManagerService();

    readonly thickness = Thickness;
    readonly polygonSides = PolygonSides;
    readonly polygonFormType = PolygonFormType;

    constructor(
        private formBuilder: FormBuilder,
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
            nbVertices: [
                PolygonSides.Default,
                [Validators.required, Validators.min(PolygonSides.Min), Validators.max(PolygonSides.Max)],
            ],
        });
    }

    onThicknessSliderChange(event: MatSliderChange): void {
        if (predicate.eventIsValid(event, Thickness)) {
            this.polygonAttributesForm.controls.thickness.setValue(event.value);
            this.onThicknessChange();
        }
    }

    onNbVerticesSliderChange(event: MatSliderChange): void {
        if (predicate.eventIsValid(event, PolygonSides)) {
            this.polygonAttributesForm.controls.nbVertices.setValue(event.value);
            this.onNbVerticesChange();
        }
    }

    onThicknessChange(): void {
        const thickness: number = this.polygonAttributesForm.value.thickness;
        if (this.polygonAttributesForm.controls.thickness.valid) {
            this.attributesManagerService.changeThickness(thickness);
        }
    }

    onTraceTypeChange(): void {
        const tracetype: string = this.polygonAttributesForm.value.traceType;
        this.attributesManagerService.changeTraceType(tracetype);
    }

    onNbVerticesChange(): void {
        const nbVertices = this.polygonAttributesForm.value.nbVertices;
        this.attributesManagerService.changeNbVertices(nbVertices);
    }

    onFocus(): void {
        this.shortcutManagerService.changeIsOnInput(true);
    }
    onFocusOut(): void {
        this.shortcutManagerService.changeIsOnInput(false);
    }
}
