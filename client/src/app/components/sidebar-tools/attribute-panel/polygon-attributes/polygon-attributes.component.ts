import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSliderChange } from '@angular/material';

import { ShortcutManagerService } from 'src/app/services/shortcut-manager/shortcut-manager.service';
import { AttributesManagerService } from 'src/app/services/tools/attributes-manager/attributes-manager.service';
import { PolygonToolService } from 'src/app/services/tools/polygon-tool/polygon-tool.service';
import { ToolSelectorService } from 'src/app/services/tools/tool-selector/tool-selector.service';
import { PREDICATE } from 'src/constants/constants';
import { POLYGON_SIDES, POLYGONE_FORM_TYPE, THICKNESS, TOOL_NAME } from 'src/constants/tool-constants';

@Component({
    selector: 'app-polygon-attributes',
    templateUrl: './polygon-attributes.component.html',
    styleUrls: ['./polygon-attributes.component.scss'],
})
export class PolygonAttributesComponent implements OnInit, AfterViewInit {
    toolName = TOOL_NAME.Polygon;
    polygonAttributesForm: FormGroup;
    polygonToolService: PolygonToolService;
    attributesManagerService: AttributesManagerService = new AttributesManagerService();

    readonly thickness = THICKNESS;
    readonly polygonSides = POLYGON_SIDES;
    readonly polygonFormType = POLYGONE_FORM_TYPE;

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
        this.polygonToolService = this.toolSelectorService.getPolygonTool();
        this.polygonToolService.initializeAttributesManagerService(this.attributesManagerService);
    }

    initializeForm(): void {
        this.polygonAttributesForm = this.formBuilder.group({
            thickness: [
                THICKNESS.Default,
                [Validators.required, Validators.min(THICKNESS.Min), Validators.max(THICKNESS.Max)],
            ],
            traceType: ['Contour'],
            nbVertices: [
                POLYGON_SIDES.Default,
                [Validators.required, Validators.min(POLYGON_SIDES.Min), Validators.max(POLYGON_SIDES.Max)],
            ],
        });
    }

    onThicknessSliderChange(event: MatSliderChange): void {
        if (PREDICATE.eventIsValid(event, THICKNESS)) {
            this.polygonAttributesForm.controls.thickness.setValue(event.value);
            this.onThicknessChange();
        }
    }

    onNbVerticesSliderChange(event: MatSliderChange): void {
        if (PREDICATE.eventIsValid(event, POLYGON_SIDES)) {
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
