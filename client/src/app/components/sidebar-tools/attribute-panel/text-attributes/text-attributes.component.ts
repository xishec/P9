import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ToolName, FONTS, FontSize } from 'src/constants/tool-constants';
import { FormGroup, FormBuilder } from '@angular/forms';
import { TextToolService } from 'src/app/services/tools/text-tool/text-tool.service';
import { AttributesManagerService } from 'src/app/services/tools/attributes-manager/attributes-manager.service';
import { ToolSelectorService } from 'src/app/services/tools/tool-selector/tool-selector.service';
//import { ColorToolService } from 'src/app/services/tools/color-tool/color-tool.service';
import { ShortcutManagerService } from 'src/app/services/shortcut-manager/shortcut-manager.service';

@Component({
    selector: 'app-text-attributes',
    templateUrl: './text-attributes.component.html',
    styleUrls: ['./text-attributes.component.scss'],
})
export class TextAttributesComponent implements OnInit, AfterViewInit {
    toolName = ToolName.Text;
    textAttributesForm: FormGroup;
    textToolService: TextToolService;
    attributesManagerService: AttributesManagerService = new AttributesManagerService();

    readonly FONTS = FONTS;
    readonly fontSize = FontSize;

    constructor(
        private formBuilder: FormBuilder,
        private toolSelectorService: ToolSelectorService,
        //private colorToolService: ColorToolService, //Do we keep it
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
            fontSize: [FontSize.Default],
            align: ['left'],
        });
    }

    onFontChange() {
        console.log(this.textAttributesForm.controls.font.value);
    }

    onFontSizeChange() {
        console.log(this.textAttributesForm.controls.fontSize.value);
    }

    onAlignChange() {
        console.log(this.textAttributesForm.controls.align.value);
    }

    onBoldChange() {}

    onItalicChange() {}

    getCurrentFont(): string {
        return this.textAttributesForm.controls.font.value;
    }

    onFocus(): void {
        this.shortcutManagerService.changeIsOnInput(true);
    }
    onFocusOut(): void {
        this.shortcutManagerService.changeIsOnInput(false);
    }
}
