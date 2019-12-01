import { ElementRef, Injectable, Renderer2 } from '@angular/core';
import { KEYS } from 'src/constants/constants';
import { CONTROL_SHORTCUTS, TOOL_NAME, TOOL_NAME_SHORTCUTS } from 'src/constants/tool-constants';
import { ClipboardService } from '../clipboard/clipboard.service';
import { ModalManagerService } from '../modal-manager/modal-manager.service';
import { DrawingLoaderService } from '../server/drawing-loader/drawing-loader.service';
import { ShortcutManagerService } from '../shortcut-manager/shortcut-manager.service';
import { AbstractToolService } from '../tools/abstract-tools/abstract-tool.service';
import { GridToolService } from '../tools/grid-tool/grid-tool.service';
import { LineToolService } from '../tools/line-tool/line-tool.service';
import { MagnetismToolService } from '../tools/magnetism-tool/magnetism-tool.service';
import { QuillToolService } from '../tools/quill-tool/quill-tool.service';
import { SelectionToolService } from '../tools/selection-tool/selection-tool.service';
import { StampToolService } from '../tools/stamp-tool/stamp-tool.service';
import { ToolSelectorService } from '../tools/tool-selector/tool-selector.service';
import { UndoRedoerService } from '../undo-redoer/undo-redoer.service';

@Injectable({
    providedIn: 'root',
})
export class EventListenerService {
    currentTool: AbstractToolService | undefined;
    toolName = '';
    isOnInput = false;
    isModalOpen = false;

    constructor(
        private workZoneSVGRef: ElementRef<SVGElement>,
        private toolSelectorService: ToolSelectorService,
        private gridToolService: GridToolService,
        private shortCutManagerService: ShortcutManagerService,
        private modalManagerService: ModalManagerService,
        private renderer: Renderer2,
        private drawingLoaderService: DrawingLoaderService,
        private undoRedoerService: UndoRedoerService,
        private clipboardService: ClipboardService,
        private magnetismToolService: MagnetismToolService,
    ) {
        this.toolSelectorService.currentToolName.subscribe((toolName) => {
            this.toolName = toolName;
            this.currentTool = this.toolSelectorService.currentTool;
        });

        this.shortCutManagerService.currentIsOnInput.subscribe((isOnInput: boolean) => {
            this.isOnInput = isOnInput;
        });

        this.modalManagerService.currentModalIsDisplayed.subscribe((isModalOpen: boolean) => {
            this.isModalOpen = isModalOpen;
        });
    }

    addEventListeners(): void {
        this.renderer.listen(this.workZoneSVGRef.nativeElement, 'mousemove', (event: MouseEvent) => {
            if (this.currentTool !== undefined && this.shouldAllowEvent()) {
                this.currentTool.onMouseMove(event);
            }
        });

        this.renderer.listen(this.workZoneSVGRef.nativeElement, 'mousedown', (event: MouseEvent) => {
            if (this.currentTool !== undefined && this.shouldAllowEvent()) {
                this.currentTool.onMouseDown(event);
            }
        });

        this.renderer.listen(window, 'mouseup', (event: MouseEvent) => {
            if (this.currentTool !== undefined && this.shouldAllowEvent()) {
                this.currentTool.onMouseUp(event);
            }
        });

        this.renderer.listen(this.workZoneSVGRef.nativeElement, 'mouseenter', (event: MouseEvent) => {
            if (this.currentTool !== undefined && this.shouldAllowEvent()) {
                this.currentTool.onMouseEnter(event);
            }
        });

        this.renderer.listen(this.workZoneSVGRef.nativeElement, 'mouseleave', (event: MouseEvent) => {
            if (this.currentTool !== undefined && this.shouldAllowEvent()) {
                this.currentTool.onMouseLeave(event);
            }
        });

        this.renderer.listen(this.workZoneSVGRef.nativeElement, 'wheel', (event: WheelEvent) => {
            if (
                (this.currentTool instanceof StampToolService ||
                    this.currentTool instanceof SelectionToolService ||
                    this.currentTool instanceof QuillToolService) &&
                this.shouldAllowEvent()
            ) {
                this.currentTool.onWheel(event);
            }
        });

        this.renderer.listen(this.workZoneSVGRef.nativeElement, 'dblclick', (event: WheelEvent) => {
            if (this.currentTool instanceof LineToolService && this.shouldAllowEvent()) {
                this.currentTool.onDblClick(event);
            }
        });

        this.renderer.listen(window, 'keydown', (event: KeyboardEvent) => {
            // If control is pressed
            if (this.currentTool !== undefined && event.ctrlKey) {
                event.preventDefault();

                // Control tools : new drawing, save, export, open...
                if (CONTROL_SHORTCUTS.has(event.key)) {
                    this.toolSelectorService.changeTool(CONTROL_SHORTCUTS.get(event.key) as TOOL_NAME);
                }

                // Undo Redo
                if (event.key === KEYS.z) {
                    this.currentTool.cleanUp();
                    this.undoRedoerService.undo();
                } else if (event.key === KEYS.Z) {
                    this.currentTool.cleanUp();
                    this.undoRedoerService.redo();
                } else if (event.key === KEYS.x) {
                    this.clipboardService.cut();
                } else if (event.key === KEYS.v) {
                    this.toolSelectorService.changeTool(TOOL_NAME.Selection);
                    this.clipboardService.paste();
                } else if (event.key === KEYS.c) {
                    this.clipboardService.copy();
                } else if (event.key === KEYS.d) {
                    this.clipboardService.duplicate();
                } else if (event.key === KEYS.a) {
                    this.toolSelectorService.changeTool(TOOL_NAME.Selection);
                    this.toolSelectorService.getSelectiontool().selectAll();
                }
            }

            // Call the onKeyDown of the current tool, if the current tool doesn't do anything
            if (this.currentTool !== undefined && this.shouldAllowEvent()) {
                this.currentTool.onKeyDown(event);
            }

            // If the key is a shortcut for a tool, change current tool
            if (this.shouldAllowShortcuts() && TOOL_NAME_SHORTCUTS.has(event.key) && !event.ctrlKey) {
                // tslint:disable-next-line: no-non-null-assertion
                this.toolSelectorService.changeTool(TOOL_NAME_SHORTCUTS.get(event.key) as TOOL_NAME);
            }

            if (event.key === KEYS.g && this.shouldAllowShortcuts()) {
                this.gridToolService.switchState();
            }

            if (event.key === KEYS.plus && this.shouldAllowShortcuts()) {
                this.gridToolService.incrementSize();
            }

            if (event.key === KEYS.minus && this.shouldAllowShortcuts()) {
                this.gridToolService.decrementSize();
            }

            if (event.key === KEYS.m && this.shouldAllowShortcuts()) {
                this.magnetismToolService.switchState();
            }

            if (event.key === KEYS.delete) {
                this.clipboardService.delete();
            }
        });

        this.renderer.listen(window, 'keyup', (event: KeyboardEvent) => {
            if (this.currentTool !== undefined) {
                this.currentTool.onKeyUp(event);
            }
        });
    }

    shouldAllowShortcuts(): boolean {
        return !this.isOnInput && !this.isModalOpen;
    }

    shouldAllowEvent(): boolean {
        return !this.drawingLoaderService.emptyDrawStack.value || !this.drawingLoaderService.untouchedWorkZone.value;
    }
}
