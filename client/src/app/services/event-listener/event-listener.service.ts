import { ElementRef, Injectable, Renderer2 } from '@angular/core';
import { ToolNameControlShortcuts, ToolNameShortcuts } from 'src/constants/tool-constants';
import { ModalManagerService } from '../modal-manager/modal-manager.service';
import { ShortcutManagerService } from '../shortcut-manager/shortcut-manager.service';
import { AbstractToolService } from '../tools/abstract-tools/abstract-tool.service';
import { GridToolService } from '../tools/grid-tool/grid-tool.service';
import { LineToolService } from '../tools/line-tool/line-tool.service';
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
    isWorkZoneEmpty = true;
    isModalOpen = false;

    constructor(
        private workZoneSVGRef: ElementRef<SVGElement>,
        private toolSelectorService: ToolSelectorService,
        private gridToolService: GridToolService,
        private shortCutManagerService: ShortcutManagerService,
        private modalManagerService: ModalManagerService,
        private renderer: Renderer2,
        private undoRedoer: UndoRedoerService,
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
            if (this.currentTool !== undefined && !this.isWorkZoneEmpty) {
                this.currentTool.onMouseMove(event);
            }
        });

        this.renderer.listen(this.workZoneSVGRef.nativeElement, 'mousedown', (event: MouseEvent) => {
            if (this.currentTool !== undefined && !this.isWorkZoneEmpty) {
                this.currentTool.onMouseDown(event);
            }
        });

        this.renderer.listen(window, 'mouseup', (event: MouseEvent) => {
            if (this.currentTool !== undefined && !this.isWorkZoneEmpty) {
                this.currentTool.onMouseUp(event);
            }
        });

        this.renderer.listen(this.workZoneSVGRef.nativeElement, 'mouseenter', (event: MouseEvent) => {
            if (this.currentTool !== undefined && !this.isWorkZoneEmpty) {
                this.currentTool.onMouseEnter(event);
            }
        });

        this.renderer.listen(this.workZoneSVGRef.nativeElement, 'mouseleave', (event: MouseEvent) => {
            if (this.currentTool !== undefined && !this.isWorkZoneEmpty) {
                this.currentTool.onMouseLeave(event);
            }
        });

        this.renderer.listen(this.workZoneSVGRef.nativeElement, 'wheel', (event: WheelEvent) => {
            if (this.currentTool instanceof StampToolService && !this.isWorkZoneEmpty) {
                this.currentTool.onWheel(event);
            }
        });

        this.renderer.listen(this.workZoneSVGRef.nativeElement, 'dblclick', (event: WheelEvent) => {
            if (this.currentTool instanceof LineToolService && !this.isWorkZoneEmpty) {
                this.currentTool.onDblClick(event);
            }
        });

        this.renderer.listen(window, 'keydown', (event: KeyboardEvent) => {

            if (event.key === 'ArrowLeft') {
                this.undoRedoer.undo();
            }
            if (event.key === 'ArrowRight') {
                this.undoRedoer.redo();
            }

            // If control is pressed, change for ControlTools
            if (event.ctrlKey && ToolNameControlShortcuts.has(event.key)) {
                event.preventDefault();
                // tslint:disable-next-line: no-non-null-assertion
                this.toolSelectorService.changeTool(ToolNameControlShortcuts.get(event.key)!);
            }

            // Call the onKeyDown of the current tool, if the current tool doesnt do anything
            if (this.currentTool !== undefined && !this.isWorkZoneEmpty) {
                this.currentTool.onKeyDown(event);
            }

            // If the key is a shortcut for a tool, change current tool
            if (this.shouldAllowShortcuts() && ToolNameShortcuts.has(event.key)) {
                // tslint:disable-next-line: no-non-null-assertion
                this.toolSelectorService.changeTool(ToolNameShortcuts.get(event.key)!);
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

        });

        this.renderer.listen(window, 'keyup', (event: KeyboardEvent) => {
            if (this.currentTool !== undefined) {
                this.currentTool.onKeyUp(event);
            }
        });
    }

    shouldAllowShortcuts(): boolean {
        return (!this.isOnInput && !this.isModalOpen);
    }
}
