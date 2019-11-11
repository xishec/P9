import { ElementRef, Injectable, Renderer2 } from '@angular/core';
import { ControlShortcuts, ToolName, ToolNameShortcuts } from 'src/constants/tool-constants';
import { ClipboardService } from '../clipboard/clipboard.service';
import { ModalManagerService } from '../modal-manager/modal-manager.service';
import { ShortcutManagerService } from '../shortcut-manager/shortcut-manager.service';
import { AbstractToolService } from '../tools/abstract-tools/abstract-tool.service';
import { GridToolService } from '../tools/grid-tool/grid-tool.service';
import { LineToolService } from '../tools/line-tool/line-tool.service';
import { StampToolService } from '../tools/stamp-tool/stamp-tool.service';
import { ToolSelectorService } from '../tools/tool-selector/tool-selector.service';
import { UndoRedoerService } from '../undo-redoer/undo-redoer.service';
import { DrawingLoaderService } from '../server/drawing-loader/drawing-loader.service';

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

    isToolDefined(): boolean {
        return this.currentTool !== undefined && !this.drawingLoaderService.emptyDrawStack.value;
    }

    addEventListeners(): void {
        this.renderer.listen(this.workZoneSVGRef.nativeElement, 'mousemove', (event: MouseEvent) => {
            if (this.isToolDefined()) {
                this.currentTool!.onMouseMove(event);
            }
        });

        this.renderer.listen(this.workZoneSVGRef.nativeElement, 'mousedown', (event: MouseEvent) => {
            if (this.isToolDefined()) {
                this.currentTool!.onMouseDown(event);
            }
        });

        this.renderer.listen(window, 'mouseup', (event: MouseEvent) => {
            if (this.isToolDefined()) {
                this.currentTool!.onMouseUp(event);
            }
        });

        this.renderer.listen(this.workZoneSVGRef.nativeElement, 'mouseenter', (event: MouseEvent) => {
            if (this.isToolDefined()) {
                this.currentTool!.onMouseEnter(event);
            }
        });

        this.renderer.listen(this.workZoneSVGRef.nativeElement, 'mouseleave', (event: MouseEvent) => {
            if (this.isToolDefined()) {
                this.currentTool!.onMouseLeave(event);
            }
        });

        this.renderer.listen(this.workZoneSVGRef.nativeElement, 'wheel', (event: WheelEvent) => {
            if (this.currentTool instanceof StampToolService && !this.drawingLoaderService.emptyDrawStack.value) {
                this.currentTool.onWheel(event);
            }
        });

        this.renderer.listen(this.workZoneSVGRef.nativeElement, 'dblclick', (event: WheelEvent) => {
            if (this.currentTool instanceof LineToolService && !this.drawingLoaderService.emptyDrawStack.value) {
                this.currentTool.onDblClick(event);
            }
        });

        this.renderer.listen(window, 'keydown', (event: KeyboardEvent) => {

            // If control is pressed
            if (this.currentTool !== undefined && event.ctrlKey) {
                event.preventDefault();

                // Control tools : new drawing, save, export, open...
                if (ControlShortcuts.has(event.key)) {
                    this.toolSelectorService.changeTool(ControlShortcuts.get(event.key) as ToolName);
                }

                // Undo Redo
                if (event.key === 'z') {
                    this.currentTool.cleanUp();
                    this.undoRedoerService.undo();
                } else if (event.key === 'Z') {
                    this.currentTool.cleanUp();
                    this.undoRedoerService.redo();
                } else if (event.key === 'x') {
                    this.clipboardService.cut();
                } else if (event.key === 'v') {
                    this.toolSelectorService.changeTool(ToolName.Selection);
                    this.clipboardService.paste();
                } else if (event.key === 'c') {
                    this.clipboardService.copy();
                } else if (event.key === 'd') {
                    this.clipboardService.duplicate();
                } else if (event.key === 'a') {
                    this.toolSelectorService.changeTool(ToolName.Selection);
                    this.toolSelectorService.getSelectiontool().selectAll();
                }
            }

            // Call the onKeyDown of the current tool, if the current tool doesn't do anything
            if (this.currentTool !== undefined && !this.drawingLoaderService.emptyDrawStack.value) {
                this.currentTool.onKeyDown(event);
            }

            // If the key is a shortcut for a tool, change current tool
            if (this.shouldAllowShortcuts() && ToolNameShortcuts.has(event.key) && !event.ctrlKey) {
                // tslint:disable-next-line: no-non-null-assertion
                this.toolSelectorService.changeTool(ToolNameShortcuts.get(event.key) as ToolName);
            }

            if (event.key === 'g' && this.shouldAllowShortcuts()) {
                this.gridToolService.switchState();
            }

            if (event.key === '+' && this.shouldAllowShortcuts()) {
                this.gridToolService.incrementSize();
            }

            if (event.key === '-' && this.shouldAllowShortcuts()) {
                this.gridToolService.decrementSize();
            }

            if (event.key === 'Delete') {
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
}
