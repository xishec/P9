import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSliderChange } from '@angular/material';

import { ShortcutManagerService } from 'src/app/services/shortcut-manager/shortcut-manager.service';
import { AttributesManagerService } from 'src/app/services/tools/attributes-manager/attributes-manager.service';
import { PolygonToolService } from 'src/app/services/tools/polygon-tool/polygon-tool.service';
import { ToolSelectorService } from 'src/app/services/tools/tool-selector/tool-selector.service';
import { predicate } from 'src/constants/constants';
import { PolygonFormType, PolygonSides, Thickness, ToolName } from 'src/constants/tool-constants';

@Component({
    selector: 'app-polygon-attributes',
    templateUrl: './polygon-attributes.component.html',
    styleUrls: ['./polygon-attributes.component.scss'],
})
export class PolygonAttributesComponent implements OnInit, AfterViewInit {
    toolName = ToolName.Polygon;
    polygonAttributesForm: FormGroup;
    polygonToolService: PolygonToolService;
    attributesManagerService: AttributesManagerService = new AttributesManagerService();

    readonly thickness = Thickness;
    readonly polygonSides = PolygonSides;
    readonly polygonFormType = PolygonFormType;

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
