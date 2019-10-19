import { Injectable, ElementRef } from '@angular/core';
import { AbstractToolService } from '../tools/abstract-tools/abstract-tool.service';
import { ToolSelectorService } from '../tools/tool-selector/tool-selector.service';
import { StampToolService } from '../tools/stamp-tool/stamp-tool.service';
import { LineToolService } from '../tools/line-tool/line-tool.service';
import { ToolNameShortcuts, ToolNameControlShortcuts } from 'src/constants/tool-constants';
import { GridToolService } from '../tools/grid-tool/grid-tool.service';
import { ShortcutManagerService } from '../shortcut-manager/shortcut-manager.service';

@Injectable({
    providedIn: 'root',
})
export class EventListenerService {

    currentTool: AbstractToolService | undefined;
    toolName = '';
    isWorkZoneEmpty = true;
    isOnInput = false;

    constructor(
        private workZoneSVGRef: ElementRef<SVGElement>,
        private toolSelectorService: ToolSelectorService,
        private gridToolService: GridToolService,
        private shortCutManagerService: ShortcutManagerService,
        ) 
    {
        this.toolSelectorService.currentToolName.subscribe((toolName) => {
            this.toolName = toolName;
            this.currentTool = this.toolSelectorService.currentTool;
        });

        this.shortCutManagerService.currentIsOnInput.subscribe((isOnInput: boolean) => {
            this.isOnInput = isOnInput;
        })
    };

    addEventListeners(): void {
        
        this.workZoneSVGRef.nativeElement.addEventListener('mousemove', (event: MouseEvent) => {
            if (this.currentTool!== undefined && !this.isWorkZoneEmpty) {
                this.currentTool.onMouseMove(event);
            }
        });

        this.workZoneSVGRef.nativeElement.addEventListener('mousedown', (event: MouseEvent) => {
            if (this.currentTool!== undefined && !this.isWorkZoneEmpty) {
                this.currentTool.onMouseDown(event);
            }
        });

        this.workZoneSVGRef.nativeElement.addEventListener('mouseup', (event: MouseEvent) => {
            if (this.currentTool!== undefined && !this.isWorkZoneEmpty) {
                this.currentTool.onMouseUp(event);
            }
        });

        this.workZoneSVGRef.nativeElement.addEventListener('mouseenter', (event: MouseEvent) => {
            if (this.currentTool!== undefined && !this.isWorkZoneEmpty) {
                this.currentTool.onMouseEnter(event);
            }
        });

        this.workZoneSVGRef.nativeElement.addEventListener('mouseleave', (event: MouseEvent) => {
            if (this.currentTool!== undefined && !this.isWorkZoneEmpty) {
                this.currentTool.onMouseLeave(event);
            }
        });

        this.workZoneSVGRef.nativeElement.addEventListener('wheel', (event: WheelEvent) => {
            if (this.currentTool instanceof StampToolService && !this.isWorkZoneEmpty) {
                this.currentTool.onWheel(event);
            }
        });

        this.workZoneSVGRef.nativeElement.addEventListener('dblclick', (event: WheelEvent) => {
            if (this.currentTool instanceof LineToolService && !this.isWorkZoneEmpty) {
                this.currentTool.onDblClick(event);
            }
        });

        window.addEventListener('keydown', (event: KeyboardEvent) => {
            event.preventDefault();

            // Call the onKeyDown of the current tool, if the current tool doesnt do anything 
            if (this.currentTool != undefined && !this.isWorkZoneEmpty) {
                this.currentTool.onKeyDown(event);
            }

            // If the key is a shortcut for a tool, change current tool
            if (this.shouldAllowShortcuts() && ToolNameShortcuts.has(event.key)) {
                this.toolSelectorService.changeTool(ToolNameShortcuts.get(event.key)!);
            }

            // If control is pressed, change for ControlTools
            if (event.ctrlKey && ToolNameControlShortcuts.has(event.key)) {
                this.toolSelectorService.changeTool(ToolNameControlShortcuts.get(event.key)!);
            }

            if(event.key === 'g' && this.shouldAllowShortcuts()) {
                this.gridToolService.switchState(); 
            }

            if(event.key === '+' && this.shouldAllowShortcuts()) {
                this.gridToolService.incrementSize();
            }

            if(event.key === '-' && this.shouldAllowShortcuts()) {
                this.gridToolService.decrementSize();
            }


        });


        window.addEventListener('keyup', (event: KeyboardEvent) => {
            if(this.currentTool != undefined && !this.isWorkZoneEmpty) {
                this.currentTool.onKeyUp(event);
            }
        })
    }

    shouldAllowShortcuts(): boolean {
        return (!this.isOnInput);
    }
}
