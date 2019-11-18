import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSliderChange } from '@angular/material';
import { DrawingLoaderService } from 'src/app/services/server/drawing-loader/drawing-loader.service';
import { ShortcutManagerService } from 'src/app/services/shortcut-manager/shortcut-manager.service';
import { GridToolService } from 'src/app/services/tools/grid-tool/grid-tool.service';
import { PREDICATE } from 'src/constants/constants';
import { GRID_OPACITY, GRID_SIZE, TOOL_NAME } from 'src/constants/tool-constants';
import { MagnetismToolService } from 'src/app/services/tools/magnetism-tool/magnetism-tool.service';

@Component({
    selector: 'app-magnetism-attributes',
    templateUrl: './magnetism-attributes.component.html',
    styleUrls: ['./magnetism-attributes.component.scss'],
})
export class MagnetismAttributesComponent implements OnInit {
    toolName = TOOL_NAME.Magnetism;
    magnetismAttributesForm: FormGroup;

    readonly gridSize = GRID_SIZE;
    readonly gridOpacity = GRID_OPACITY;

    constructor(
        private formBuilder: FormBuilder,
        private shortcutManagerService: ShortcutManagerService,
        private gridToolService: GridToolService,
        private magnetismService: MagnetismToolService,
        private drawingLoaderService: DrawingLoaderService,
    ) {
        this.formBuilder = formBuilder;
    }

    ngOnInit(): void {
        this.initializeForm();
        this.onSizeChange();
        this.gridToolService.currentState.subscribe((state: boolean) => {
            this.magnetismAttributesForm.controls.state.setValue(state);
        });
        this.drawingLoaderService.untouchedWorkZone.subscribe(() => {
            this.enableSlider();
        });
    }

    initializeForm(): void {
        this.magnetismAttributesForm = this.formBuilder.group({
            state: [{ value: false, disabled: true }],
        });
    }

    onStateChange(): void {
        const state = this.magnetismAttributesForm.value.state;
        // TODO : Change value for magnetism
        this.gridToolService.changeState(state);
    }

    onSizeChange(): void {
        const size = this.magnetismAttributesForm.value.size;
        if (this.magnetismAttributesForm.controls.size.valid) {
            this.gridToolService.changeSize(size);
        }
    }

    onOpacityChange(): void {
        const opacity = this.magnetismAttributesForm.value.opacity;
        if (this.magnetismAttributesForm.controls.opacity.valid) {
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
            this.magnetismAttributesForm.controls.state.enable();
        }
    }
}
