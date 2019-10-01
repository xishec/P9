import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSliderChange } from '@angular/material';

import { ShortcutManagerService } from 'src/app/services/shortcut-manager/shortcut-manager.service';
import { Thickness, ToolName } from 'src/constants/tool-constants';
import { AttributesManagerService } from '../../../../services/tools/attributes-manager/attributes-manager.service';
import { PencilToolService } from '../../../../services/tools/pencil-tool/pencil-tool.service';
import { ToolSelectorService } from '../../../../services/tools/tool-selector/tool-selector.service';

@Component({
    selector: 'app-pencil-attributes',
    templateUrl: './pencil-attributes.component.html',
    styleUrls: ['./pencil-attributes.component.scss'],
    providers: [AttributesManagerService],
})
export class PencilAttributesComponent implements OnInit, AfterViewInit {
    toolName = ToolName.Pencil;
    pencilAttributesForm: FormGroup;
    pencilToolService: PencilToolService;

    readonly Thickness = Thickness;

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
        this.onThicknessChange();
    }

    ngAfterViewInit(): void {
        this.pencilToolService = this.toolSelectorService.getPencilTool();
        this.pencilToolService.initializeAttributesManagerService(this.attributesManagerService);
    }

    initializeForm(): void {
        this.pencilAttributesForm = this.formBuilder.group({
            thickness: [
                Thickness.Default,
                [Validators.required, Validators.min(Thickness.Min), Validators.max(Thickness.Max)],
            ],
        });
    }

    onSliderChange(event: MatSliderChange): void {
        if (event.value !== null && event.value <= Thickness.Max && event.value >= Thickness.Min) {
            this.pencilAttributesForm.controls.thickness.setValue(event.value);
            this.onThicknessChange();
        }
    }
    onThicknessChange(): void {
        const thickness: number = this.pencilAttributesForm.value.thickness;
        if (this.pencilAttributesForm.valid) {
            this.attributesManagerService.changeThickness(thickness);
        }
    }

    onFocus() {
        this.shortcutManagerService.changeIsOnInput(true);
    }
    onFocusOut() {
        this.shortcutManagerService.changeIsOnInput(false);
    }
}
