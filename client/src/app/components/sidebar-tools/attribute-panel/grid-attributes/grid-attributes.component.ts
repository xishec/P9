import { AfterViewInit, Component, OnInit } from '@angular/core';
import { MatSliderChange } from '@angular/material';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ShortcutManagerService } from 'src/app/services/shortcut-manager/shortcut-manager.service';
import { ColorToolService } from 'src/app/services/tools/color-tool/color-tool.service';
import { GridSize, GridOpacity, ToolName } from 'src/constants/tool-constants';
import { AttributesManagerService } from '../../../../services/tools/attributes-manager/attributes-manager.service';
import { RectangleToolService } from '../../../../services/tools/rectangle-tool/rectangle-tool.service';
import { ToolSelectorService } from '../../../../services/tools/tool-selector/tool-selector.service';

@Component({
    selector: 'app-grid-attributes',
    templateUrl: './grid-attributes.component.html',
    styleUrls: ['./grid-attributes.component.scss'],
})
export class GridAttributesComponent implements OnInit, AfterViewInit {
    toolName = ToolName.Grid;
    gridAttributesForm: FormGroup;
    rectangleToolService: RectangleToolService;

    readonly gridSize = GridSize;
    readonly gridOpacity = GridOpacity;

    constructor(
        private formBuilder: FormBuilder,
        private attributesManagerService: AttributesManagerService,
        private toolSelectorService: ToolSelectorService,
        private colorToolService: ColorToolService,
        private shortcutManagerService: ShortcutManagerService
    ) {
        this.formBuilder = formBuilder;
    }

    eventIsValid<T>(event: MatSliderChange, range: T): Boolean {
        const value = event.value;
        if (value !== null) return value >= range.Min && value <= range.Max;
        else return false;
    }

    ngOnInit(): void {
        this.initializeForm();
        this.onSizeChange();
    }

    ngAfterViewInit(): void {
        this.rectangleToolService = this.toolSelectorService.getRectangleTool();
        this.rectangleToolService.initializeAttributesManagerService(this.attributesManagerService);
        this.rectangleToolService.initializeColorToolService(this.colorToolService);
    }

    initializeForm(): void {
        this.gridAttributesForm = this.formBuilder.group({
            state: [],
            size: [GridSize.Default, [Validators.required, Validators.min(GridSize.Min), Validators.max(GridSize.Max)]],
            opacity: [
                GridOpacity.Max,
                [Validators.required, Validators.min(GridOpacity.Min), Validators.max(GridOpacity.Max)],
            ],
        });
    }

    onSizeSliderChange(event: MatSliderChange) {
        if (this.eventIsValid(event, this.gridSize)) {
            this.gridAttributesForm.controls.size.setValue(event.value);
            this.onOpacityChange();
        }
    }

    onOpacitySliderChange(event: MatSliderChange) {
        if (this.eventIsValid(event, this.gridOpacity)) {
            this.gridAttributesForm.controls.opacity.setValue(event.value);
            this.onOpacityChange();
        }
    }

    onSizeChange() {}

    onOpacityChange() {}

    onFocus() {
        this.shortcutManagerService.changeIsOnInput(true);
    }
    onFocusOut() {
        this.shortcutManagerService.changeIsOnInput(false);
    }
}
