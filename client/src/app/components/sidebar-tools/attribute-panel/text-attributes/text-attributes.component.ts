import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { ShortcutManagerService } from 'src/app/services/shortcut-manager/shortcut-manager.service';
import { AttributesManagerService } from 'src/app/services/tools/attributes-manager/attributes-manager.service';
import { TextToolService } from 'src/app/services/tools/text-tool/text-tool.service';
import { ToolSelectorService } from 'src/app/services/tools/tool-selector/tool-selector.service';
import { FONTS, FontSize, ToolName } from 'src/constants/tool-constants';

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

    readonly FONTS = FONTS;
    readonly fontSize = FontSize;

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
                FontSize.Default,
                [Validators.required, Validators.min(FontSize.Min), Validators.max(FontSize.Max)],
            ],
            align: ['start'],
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
        if (!this.attributesManagerService.isWriting) {
            this.shortcutManagerService.changeIsOnInput(false);
        }
    }

    getCurrentFont(): string {
        return this.textAttributesForm.controls.font.value;
    }
}
