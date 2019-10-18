import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSliderChange } from '@angular/material';
import { ShortcutManagerService } from 'src/app/services/shortcut-manager/shortcut-manager.service';
import { GridToolService } from 'src/app/services/tools/grid-tool/grid-tool.service';
import { GridOpacity, GridSize, ToolName } from 'src/constants/tool-constants';
import { predicate } from 'src/constants/constants';

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

    onSizeSliderChange(event: MatSliderChange): void {
        if (predicate.eventIsValid(event, this.gridSize)) {
            this.gridAttributesForm.controls.size.setValue(event.value);
            this.onSizeChange();
        }
    }

    onOpacitySliderChange(event: MatSliderChange): void {
        if (predicate.eventIsValid(event, this.gridOpacity)) {
            this.gridAttributesForm.controls.opacity.setValue(event.value);
            this.onOpacityChange();
        }
    }

    onStateChange(): void {
        const state = this.gridAttributesForm.value.state;
        this.gridToolService.changeState(state);
    }

    onSizeChange(): void {
        const size = this.gridAttributesForm.value.size;
        if (this.gridAttributesForm.controls.size.valid) {
            this.gridToolService.changeSize(size);
        }
    }

    onOpacityChange(): void {
        const opacity = this.gridAttributesForm.value.opacity;
        if (this.gridAttributesForm.controls.opacity.valid) {
            this.gridToolService.changeOpacity(opacity);
        }
    }

    onFocus(): void {
        this.shortcutManagerService.changeIsOnInput(true);
    }
    onFocusOut(): void {
        this.shortcutManagerService.changeIsOnInput(false);
    }

    isWorkzoneEmpty(): boolean {
        return this.gridToolService.workzoneIsEmpty;
    }
}
