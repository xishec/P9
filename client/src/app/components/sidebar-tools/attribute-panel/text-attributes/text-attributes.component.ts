import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { ToolName, FONTS, FontSize } from 'src/constants/tool-constants';
import { TextToolService } from 'src/app/services/tools/text-tool/text-tool.service';
import { AttributesManagerService } from 'src/app/services/tools/attributes-manager/attributes-manager.service';
import { ToolSelectorService } from 'src/app/services/tools/tool-selector/tool-selector.service';
import { ShortcutManagerService } from 'src/app/services/shortcut-manager/shortcut-manager.service';

@Component({
    selector: 'app-text-attributes',
    templateUrl: './text-attributes.component.html',
    styleUrls: ['./text-attributes.component.scss'],
})
export class TextAttributesComponent implements OnInit, AfterViewInit {
    toolName = ToolName.Text;
    isBold = false;
    isItalic = false;
    textAttributesForm: FormGroup;
    textToolService: TextToolService;
    attributesManagerService: AttributesManagerService = new AttributesManagerService();

    readonly FONTS = FONTS;
    readonly fontSize = FontSize;

    constructor(
        private formBuilder: FormBuilder,
        private toolSelectorService: ToolSelectorService,
        private shortcutManagerService: ShortcutManagerService
    ) {
        this.formBuilder = formBuilder;
    }

    ngOnInit() {
        this.initializeForm();
    }

    ngAfterViewInit() {
        this.textToolService = this.toolSelectorService.getTextTool();
    }

    initializeForm(): void {
        this.textAttributesForm = this.formBuilder.group({
            font: ['Times New Roman, serif'],
            fontSize: [
                FontSize.Default,
                [Validators.required, Validators.min(FontSize.Min), Validators.max(FontSize.Max)],
            ],
            align: ['left'],
        });
    }

    onFontChange(): void {
        const align = this.textAttributesForm.controls.font.value;
        this.attributesManagerService.changeFont(align);
    }

    onFontSizeChange(): void {
        const fontSize = this.textAttributesForm.controls.fontSize.value;
        if (this.textAttributesForm.controls.fontSize.valid) {
            this.attributesManagerService.changeFontSize(fontSize);
        }
    }

    onAlignChange(): void {
        const align = this.textAttributesForm.controls.align.value;
        this.attributesManagerService.changeFontAlign(align);
    }

    onBoldChange(): void {
        this.isBold = !this.isBold;
        this.attributesManagerService.changeBoldState(this.isBold);
    }

    onItalicChange(): void {
        this.isItalic = !this.isItalic;
        this.attributesManagerService.changeItalicState(this.isItalic);
    }

    onFocus(): void {
        this.shortcutManagerService.changeIsOnInput(true);
    }
    onFocusOut(): void {
        this.shortcutManagerService.changeIsOnInput(false);
    }

    getCurrentFont(): string {
        return this.textAttributesForm.controls.font.value;
    }
}
