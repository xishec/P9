import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { THICKNESS, TOOL_NAME, ANGLE_ORIENTATION } from 'src/constants/tool-constants';
import { ToolSelectorService } from 'src/app/services/tools/tool-selector/tool-selector.service';
import { AttributesManagerService } from 'src/app/services/tools/attributes-manager/attributes-manager.service';
import { ShortcutManagerService } from 'src/app/services/shortcut-manager/shortcut-manager.service';
import { QuillToolService } from 'src/app/services/tools/quill-tool/quill-tool.service';

@Component({
    selector: 'app-quill-attributes',
    templateUrl: './quill-attributes.component.html',
    styleUrls: ['./quill-attributes.component.scss'],
})
export class QuillAttributesComponent implements OnInit {
    toolName = TOOL_NAME.Quill;
    quillAttributesForm: FormGroup;
    quillToolService: QuillToolService;

    readonly THICKNESS = THICKNESS;
    readonly quillAngleOrientation = ANGLE_ORIENTATION;

    constructor(
        private formBuilder: FormBuilder,
        private attributesManagerService: AttributesManagerService,
        private toolSelectorService: ToolSelectorService,
        private shortcutManagerService: ShortcutManagerService,
    ) {
        this.formBuilder = formBuilder;
    }

    ngOnInit() {
        this.initializeForm();
        this.onAngleChange();
        this.quillToolService = this.toolSelectorService.getQuillTool();
        this.quillToolService.initializeAttributesManagerService(this.attributesManagerService);
    }
    initializeForm(): void {
      this.quillAttributesForm = this.formBuilder.group({
        thickness: [
            THICKNESS.Default,
            [Validators.required, Validators.min(THICKNESS.Min), Validators.max(THICKNESS.Max)],
        ],
        angle: [
          ANGLE_ORIENTATION.Default,
          [
              Validators.required,
              Validators.min(ANGLE_ORIENTATION.Min),
              Validators.max(ANGLE_ORIENTATION.Max),
          ],
      ],
    });
    }

    onThicknessChange(): void {
        const thickness: number = this.quillAttributesForm.value.thickness;
        if (this.quillAttributesForm.controls.thickness.valid) {
            this.attributesManagerService.thickness.next(thickness);
            console.log(thickness);
        }
    }

    onAngleChange(): void {
      const quillAngle: number = this.quillAttributesForm.value.angle;
      if (this.quillAttributesForm.controls.angle.valid) {
          this.attributesManagerService.angle.next(quillAngle);
      }
  }

    onFocus(): void {
        this.shortcutManagerService.changeIsOnInput(true);
    }
    onFocusOut(): void {
        this.shortcutManagerService.changeIsOnInput(false);
    }
}
