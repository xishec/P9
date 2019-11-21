import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSliderChange } from '@angular/material';
import { DrawingLoaderService } from 'src/app/services/server/drawing-loader/drawing-loader.service';
import { ShortcutManagerService } from 'src/app/services/shortcut-manager/shortcut-manager.service';
import { GridToolService } from 'src/app/services/tools/grid-tool/grid-tool.service';
import { PREDICATE } from 'src/constants/constants';
import { GRID_OPACITY, GRID_SIZE, TOOL_NAME } from 'src/constants/tool-constants';

@Component({
    selector: 'app-grid-attributes',
    templateUrl: './grid-attributes.component.html',
    styleUrls: ['./grid-attributes.component.scss'],
})
export class GridAttributesComponent implements OnInit {
    toolName = TOOL_NAME.Grid;
    gridAttributesForm: FormGroup;

    readonly gridSize = GRID_SIZE;
    readonly gridOpacity = GRID_OPACITY;

    constructor(
        private formBuilder: FormBuilder,
        private shortcutManagerService: ShortcutManagerService,
        private gridToolService: GridToolService,
        private drawingLoaderService: DrawingLoaderService,
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
        this.drawingLoaderService.untouchedWorkZone.subscribe(() => {
            this.enableSlider();
        });
    }

    initializeForm(): void {
        this.gridAttributesForm = this.formBuilder.group({
            state: [{ value: false, disabled: true }],
            size: [
                GRID_SIZE.Default,
                [Validators.required, Validators.min(GRID_SIZE.Min), Validators.max(GRID_SIZE.Max)],
            ],
            opacity: [
                GRID_OPACITY.Max,
                [Validators.required, Validators.min(GRID_OPACITY.Min), Validators.max(GRID_OPACITY.Max)],
            ],
        });
    }

    onSizeSliderChange(event: MatSliderChange): void {
        if (PREDICATE.eventIsValid(event, this.gridSize)) {
            this.gridAttributesForm.controls.size.setValue(event.value);
            this.onSizeChange();
        }
    }

    onOpacitySliderChange(event: MatSliderChange): void {
        if (PREDICATE.eventIsValid(event, this.gridOpacity)) {
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

    enableSlider(): void {
        if (!this.drawingLoaderService.untouchedWorkZone.value) {
            this.gridAttributesForm.controls.state.enable();
        }
    }
}
