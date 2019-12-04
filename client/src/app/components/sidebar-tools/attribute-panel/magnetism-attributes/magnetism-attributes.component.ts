import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

import { DrawingLoaderService } from 'src/app/services/server/drawing-loader/drawing-loader.service';
import { ShortcutManagerService } from 'src/app/services/shortcut-manager/shortcut-manager.service';
import { MagnetismToolService } from 'src/app/services/tools/magnetism-tool/magnetism-tool.service';
import {
    BOTTOM_CONTROL_POINTS,
    CENTER_CONTROL_POINTS,
    CONTROL_POINTS,
    TOOL_NAME,
    TOP_CONTROL_POINTS,
} from 'src/constants/tool-constants';

@Component({
    selector: 'app-magnetism-attributes',
    templateUrl: './magnetism-attributes.component.html',
    styleUrls: ['./magnetism-attributes.component.scss'],
})
export class MagnetismAttributesComponent implements OnInit {
    toolName = TOOL_NAME.Magnetism;
    private magnetismAttributesForm: FormGroup;

    readonly CONTROL_POINTS = CONTROL_POINTS;
    readonly TOP_CONTROL_POINTS = TOP_CONTROL_POINTS;
    readonly CENTER_CONTROL_POINTS = CENTER_CONTROL_POINTS;
    readonly BOTTOM_CONTROL_POINTS = BOTTOM_CONTROL_POINTS;

    constructor(
        private formBuilder: FormBuilder,
        private shortcutManagerService: ShortcutManagerService,
        public magnetismService: MagnetismToolService,
        private drawingLoaderService: DrawingLoaderService,
    ) {
        this.formBuilder = formBuilder;
    }

    ngOnInit(): void {
        this.initializeForm();
        this.magnetismService.isMagnetic.subscribe((state: boolean) => {
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
        this.magnetismService.changeState(state);
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

    setMagnetismPoint(value: CONTROL_POINTS) {
        this.magnetismService.currentPoint = value;
    }
}
