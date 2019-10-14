import { AfterViewInit, Component, OnInit } from '@angular/core';
import { MatSliderChange } from '@angular/material';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ShortcutManagerService } from 'src/app/services/shortcut-manager/shortcut-manager.service';
import { GridSize, GridOpacity, ToolName } from 'src/constants/tool-constants';
import { GridToolService } from 'src/app/services/tools/grid-tool/grid-tool.service';

@Component({
    selector: 'app-grid-attributes',
    templateUrl: './grid-attributes.component.html',
    styleUrls: ['./grid-attributes.component.scss'],
})
export class GridAttributesComponent implements OnInit, AfterViewInit {
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

    eventIsValid<T>(event: MatSliderChange, range: T): Boolean {
        const value = event.value;
        //@ts-ignore
        if (value !== null) {
            return this.IsBetween(value, range);
        } else {
            return false;
        }
    }

    IsBetween<T>(value: number | boolean, range: T): Boolean {
        //@ts-ignore
        return value >= range.Min && value <= range.Max;
    }

    ngOnInit(): void {
        this.initializeForm();
        this.onSizeChange();
        this.gridToolService.currentState.subscribe((state) => {
            this.gridAttributesForm.controls.state.setValue(state);
        });
    }

    ngAfterViewInit(): void {}

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
        if (this.eventIsValid(event, this.gridSize)) {
            this.gridAttributesForm.controls.size.setValue(event.value);
            this.onSizeChange();
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

    onSizeChange() {
        const size = this.gridAttributesForm.value.size;
        if (this.IsBetween(size, GridSize)) {
            this.gridToolService.changeSize(size);
        }
    }

    onOpacityChange() {
        const opacity = this.gridAttributesForm.value.opacity;
        if (this.IsBetween(opacity, GridOpacity)) {
            this.gridToolService.changeOpacity(opacity);
        }
    }

    changeState(state: boolean) {
        this.gridAttributesForm.controls.state.setValue(state);
    }

    onFocus() {
        this.shortcutManagerService.changeIsOnInput(true);
    }
    onFocusOut() {
        this.shortcutManagerService.changeIsOnInput(false);
    }
}
