import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { ShortcutManagerService } from 'src/app/services/shortcut-manager/shortcut-manager.service';
import { AttributesManagerService } from 'src/app/services/tools/attributes-manager/attributes-manager.service';
import { TextToolService } from 'src/app/services/tools/text-tool/text-tool.service';
import { ToolSelectorService } from 'src/app/services/tools/tool-selector/tool-selector.service';
import { FONT_ALIGN, FONT_SIZE, FONTS, TOOL_NAME } from 'src/constants/tool-constants';

@Component({
    selector: 'app-text-attributes',
    templateUrl: './text-attributes.component.html',
    styleUrls: ['./text-attributes.component.scss'],
})
export class TextAttributesComponent implements OnInit, AfterViewInit {
    toolName = TOOL_NAME.Text;
    isBold = false;
    isItalic = false;
    textAttributesForm: FormGroup;
    textToolService: TextToolService;

    readonly FONTS = FONTS;
    readonly fontSize = FONT_SIZE;

    constructor(
        private formBuilder: FormBuilder,
        private toolSelectorService: ToolSelectorService,
        private shortcutManagerService: ShortcutManagerService,
        private attributesManagerService: AttributesManagerService,
    ) {
        this.formBuilder = formBuilder;
    }

    ngOnInit() {
        this.initializeForm();
    }

    ngAfterViewInit() {
        this.textToolService = this.toolSelectorService.getTextTool();
        this.textToolService.initializeAttributesManagerService(this.attributesManagerService);
    }

    initializeForm(): void {
        this.textAttributesForm = this.formBuilder.group({
            font: ['Times New Roman, serif'],
            fontSize: [
                FONT_SIZE.Default,
                [Validators.required, Validators.min(FONT_SIZE.Min), Validators.max(FONT_SIZE.Max)],
            ],
            align: [FONT_ALIGN.Start],
        });
    }

    onFontChange(): void {
        const align = this.textAttributesForm.controls.font.value;
        this.attributesManagerService.font.next(align);
    }

    onFontSizeChange(): void {
        const fontSize = this.textAttributesForm.controls.fontSize.value;
        if (this.textAttributesForm.controls.fontSize.valid) {
            this.attributesManagerService.fontSize.next(fontSize);
        }
    }

    onAlignChange(): void {
        const align = this.textAttributesForm.controls.align.value;
        this.attributesManagerService.fontAlign.next(align);
    }

    onBoldChange(): void {
        this.isBold = !this.isBold;
        this.attributesManagerService.boldState.next(this.isBold);
    }

    onItalicChange(): void {
        this.isItalic = !this.isItalic;
        this.attributesManagerService.italicState.next(this.isItalic);
    }

    onFocus(): void {
        this.shortcutManagerService.changeIsOnInput(true);
    }
    onFocusOut(): void {
        if (!this.attributesManagerService.isWritingState.value) {
            this.shortcutManagerService.changeIsOnInput(false);
        }
    }

    getCurrentFont(): string {
        return this.textAttributesForm.controls.font.value;
    }
}
