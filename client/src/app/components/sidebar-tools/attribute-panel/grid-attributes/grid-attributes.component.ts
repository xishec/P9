import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSliderChange } from '@angular/material';
import { ShortcutManagerService } from 'src/app/services/shortcut-manager/shortcut-manager.service';
import { GridToolService } from 'src/app/services/tools/grid-tool/grid-tool.service';
import { GridOpacity, GridSize, ToolName } from 'src/constants/tool-constants';

@Component({
    selector: 'app-grid-attributes',
    templateUrl: './grid-attributes.component.html',
    styleUrls: ['./grid-attributes.component.scss'],
})
export class GridAttributesComponent implements OnInit {
    toolName = ToolName.Grid;
    gridAttributesForm: FormGroup;

    readonly gridSize = GridSize;
    readonly gridOpacity = GridOpacity;

    constructor(
        private formBuilder: FormBuilder,
        private shortcutManagerService: ShortcutManagerService,
        private gridToolService: GridToolService
    ) {
        this.formBuilder = formBuilder;
    }

    ngOnInit(): void {
        this.initializeForm();
        this.onSizeChange();
        this.gridToolService.currentState.subscribe((state: boolean) => {
            this.gridAttributesForm.controls.state.setValue(state);
        });
        this.gridToolService.currentSize.subscribe((size: number) => {
            this.gridAttributesForm.controls.size.setValue(size);
        });
    }

    initializeForm(): void {
        this.gridAttributesForm = this.formBuilder.group({
            state: [false],
            size: [GridSize.Default, [Validators.required, Validators.min(GridSize.Min), Validators.max(GridSize.Max)]],
            opacity: [
                GridOpacity.Max,
                [Validators.required, Validators.min(GridOpacity.Min), Validators.max(GridOpacity.Max)],
            ],
        });
    }

    onSizeSliderChange(event: MatSliderChange) {
        if (this.gridToolService.eventIsValid(event, this.gridSize)) {
            this.gridAttributesForm.controls.size.setValue(event.value);
            this.onSizeChange();
        }
    }

    onOpacitySliderChange(event: MatSliderChange) {
        if (this.gridToolService.eventIsValid(event, this.gridOpacity)) {
            this.gridAttributesForm.controls.opacity.setValue(event.value);
            this.onOpacityChange();
        }
    }

    onStateChange() {
        const state = this.gridAttributesForm.value.state;
        this.gridToolService.changeState(state);
    }

    onSizeChange() {
        const size = this.gridAttributesForm.value.size;
        if (this.gridToolService.IsBetween(size, GridSize)) {
            this.gridToolService.changeSize(size);
        }
    }

    onOpacityChange() {
        const opacity = this.gridAttributesForm.value.opacity;
        if (this.gridToolService.IsBetween(opacity, GridOpacity)) {
            this.gridToolService.changeOpacity(opacity);
        }
    }

    onFocus() {
        this.shortcutManagerService.changeIsOnInput(true);
    }
    onFocusOut() {
        this.shortcutManagerService.changeIsOnInput(false);
    }

    isWorkzoneEmpty() {
        return this.gridToolService.workzoneIsEmpty;
    }
}
