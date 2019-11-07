import { Component, AfterViewInit } from '@angular/core';

import { ToolName, CLIPBOARD_BUTTON_INFO } from 'src/constants/tool-constants';
import { ToolSelectorService } from 'src/app/services/tools/tool-selector/tool-selector.service';
import { ShortcutManagerService } from 'src/app/services/shortcut-manager/shortcut-manager.service';
import { SelectionToolService } from 'src/app/services/tools/selection-tool/selection-tool.service';

@Component({
    selector: 'app-selection-attributes',
    templateUrl: './selection-attributes.component.html',
    styleUrls: ['./selection-attributes.component.scss'],
})
export class SelectionAttributesComponent implements AfterViewInit {
    readonly CLIPBOARD_BUTTONS = CLIPBOARD_BUTTON_INFO;

    toolName = ToolName.Selection;

    selectionToolCallbacks: Map<string, Function> = new Map<string, Function>();

    selectionTool: SelectionToolService;

    constructor(private toolSelector: ToolSelectorService, private shortcutManagerService: ShortcutManagerService){

    }

    ngAfterViewInit(){
        this.selectionTool = this.toolSelector.getSelectiontool();

        this.selectionToolCallbacks.set(this.CLIPBOARD_BUTTONS[0].tooltipName, ()=>{this.selectionTool.selectAll();});
        this.selectionToolCallbacks.set(this.CLIPBOARD_BUTTONS[1].tooltipName, ()=>{this.selectionTool.clipBoard.duplicate();});
        this.selectionToolCallbacks.set(this.CLIPBOARD_BUTTONS[2].tooltipName, ()=>{this.selectionTool.clipBoard.cut()});
        this.selectionToolCallbacks.set(this.CLIPBOARD_BUTTONS[3].tooltipName, ()=>{this.selectionTool.clipBoard.copy();});
        this.selectionToolCallbacks.set(this.CLIPBOARD_BUTTONS[4].tooltipName, ()=>{this.selectionTool.clipBoard.paste();});
        this.selectionToolCallbacks.set(this.CLIPBOARD_BUTTONS[5].tooltipName, ()=>{this.selectionTool.clipBoard.delete();});
    }

    onButtonTrigger(tooltipName: string): void {
        console.log(this.selectionTool.clipBoard.duplicationBuffer);
        (this.selectionToolCallbacks.get(tooltipName) as Function)();
    }

    onFocus(): void {
        this.shortcutManagerService.changeIsOnInput(true);
    }
    onFocusOut(): void {
        this.shortcutManagerService.changeIsOnInput(false);
    }
}
