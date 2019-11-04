import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSliderChange } from '@angular/material';

import { ShortcutManagerService } from 'src/app/services/shortcut-manager/shortcut-manager.service';
import { AttributesManagerService } from 'src/app/services/tools/attributes-manager/attributes-manager.service';
import { EraserToolService } from 'src/app/services/tools/eraser-tool/eraser-tool.service';
import { ToolSelectorService } from 'src/app/services/tools/tool-selector/tool-selector.service';
import { predicate } from 'src/constants/constants';
import { EraserSize, ToolName } from 'src/constants/tool-constants';

@Component({
    selector: 'app-eraser-attributes',
    templateUrl: './eraser-attributes.component.html',
    styleUrls: ['./eraser-attributes.component.scss'],
})
export class EraserAttributesComponent implements OnInit {
    toolName = ToolName.Eraser;

    eraserAttributesForm: FormGroup;
    eraserToolService: EraserToolService;
    readonly eraserSize = EraserSize;

    constructor(
        private formBuilder: FormBuilder,
        private attributesManagerService: AttributesManagerService,
        private toolSelectorService: ToolSelectorService,
        private shortcutManagerService: ShortcutManagerService,
    ) {
        this.formBuilder = formBuilder;
    }

    ngOnInit(): void {
        this.initializeForm();
        this.eraserToolService = this.toolSelectorService.getEraserTool();
        this.eraserToolService.initializeAttributesManagerService(this.attributesManagerService);
    }

    initializeForm(): void {
        this.eraserAttributesForm = this.formBuilder.group({
            eraserSize: [
                EraserSize.Default,
                [Validators.required, Validators.min(EraserSize.Min), Validators.max(EraserSize.Max)],
            ],
        });
    }

    onSliderChange(event: MatSliderChange): void {
        if (predicate.eventIsValid(event, EraserSize)) {
            this.eraserAttributesForm.controls.eraserSize.setValue(event.value);
            this.onSizeChange();
        }
    }

    onSizeChange(): void {
        const eraserSize: number = this.eraserAttributesForm.value.eraserSize;
        if (this.eraserAttributesForm.controls.eraserSize.valid) {
            this.attributesManagerService.changeEraserSize(eraserSize);
        }
    }

    onFocus(): void {
        this.shortcutManagerService.changeIsOnInput(true);
    }

    onFocusOut(): void {
        this.shortcutManagerService.changeIsOnInput(false);
    }
}
