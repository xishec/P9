import { AfterViewInit, Component, OnInit } from '@angular/core';
import { MatSliderChange } from '@angular/material';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ShortcutManagerService } from 'src/app/services/shortcut-manager/shortcut-manager.service';
import { ColorToolService } from 'src/app/services/tools/color-tool/color-tool.service';
import { GridSize, GridOpacity, ToolName } from 'src/constants/tool-constants';
import { AttributesManagerService } from '../../../../services/tools/attributes-manager/attributes-manager.service';
import { ToolSelectorService } from '../../../../services/tools/tool-selector/tool-selector.service';
import { GridToolService } from 'src/app/services/tools/grid-tool/grid-tool.service';

@Component({
    selector: 'app-grid-attributes',
    templateUrl: './grid-attributes.component.html',
    styleUrls: ['./grid-attributes.component.scss'],
})
export class GridAttributesComponent implements OnInit, AfterViewInit {
    toolName = ToolName.Grid;
    gridAttributesForm: FormGroup;
    gridToolService: GridToolService = new GridToolService();

    readonly gridSize = GridSize;
    readonly gridOpacity = GridOpacity;

    constructor(private formBuilder: FormBuilder, private shortcutManagerService: ShortcutManagerService) {
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

    ngAfterViewInit(): void {}

    initializeForm(): void {
        this.gridAttributesForm = this.formBuilder.group({
            state: ['false'],
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

    onStateChange() {
        const state = this.gridAttributesForm.value.state;
        this.gridToolService.changeState(state);
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
