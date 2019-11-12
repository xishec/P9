import { AfterViewInit, Component } from '@angular/core';

import { ShortcutManagerService } from 'src/app/services/shortcut-manager/shortcut-manager.service';
import { SelectionToolService } from 'src/app/services/tools/selection-tool/selection-tool.service';
import { ToolSelectorService } from 'src/app/services/tools/tool-selector/tool-selector.service';
import { CLIPBOARD_BUTTON_INFO, TOOL_NAME } from 'src/constants/tool-constants';

@Component({
    selector: 'app-selection-attributes',
    templateUrl: './selection-attributes.component.html',
    styleUrls: ['./selection-attributes.component.scss'],
})
export class SelectionAttributesComponent implements AfterViewInit {
    readonly CLIPBOARD_BUTTONS = CLIPBOARD_BUTTON_INFO.slice(2, 6);
    readonly SELECT_ALL_BUTTON = CLIPBOARD_BUTTON_INFO[0];
    readonly PASTE_BUTTON = CLIPBOARD_BUTTON_INFO[1];

    toolName = TOOL_NAME.Selection;

    selectionToolCallbacks: Map<TOOL_NAME, () => void> = new Map();

    selectionTool: SelectionToolService;
    isActiveSelection = false;
    isClippingsEmpty = true;

    constructor(private toolSelector: ToolSelectorService, private shortcutManagerService: ShortcutManagerService) {}

    ngAfterViewInit() {
        this.selectionTool = this.toolSelector.getSelectiontool();

        this.selectionTool.selection.isActiveSelection.subscribe((isActiveSelection: boolean) => {
            this.isActiveSelection = isActiveSelection;
        });

        this.selectionTool.clipBoard.isClippingsEmpty.subscribe((isClippingsEmpty: boolean) => {
            this.isClippingsEmpty = isClippingsEmpty;
        });

        this.selectionToolCallbacks.set(TOOL_NAME.SelectAll, () => {
            this.selectionTool.selectAll();
        });
        this.selectionToolCallbacks.set(TOOL_NAME.Duplicate, () => {
            this.selectionTool.clipBoard.duplicate();
        });
        this.selectionToolCallbacks.set(TOOL_NAME.Cut, () => {
            this.selectionTool.clipBoard.cut();
        });
        this.selectionToolCallbacks.set(TOOL_NAME.Copy, () => {
            this.selectionTool.clipBoard.copy();
        });
        this.selectionToolCallbacks.set(TOOL_NAME.Paste, () => {
            this.selectionTool.clipBoard.paste();
        });
        this.selectionToolCallbacks.set(TOOL_NAME.Delete, () => {
            this.selectionTool.clipBoard.delete();
        });
    }

    onButtonTrigger(tooltipName: TOOL_NAME): void {
        (this.selectionToolCallbacks.get(tooltipName) as () => void)();
    }

    onFocus(): void {
        this.shortcutManagerService.changeIsOnInput(true);
    }
    onFocusOut(): void {
        this.shortcutManagerService.changeIsOnInput(false);
    }
}
