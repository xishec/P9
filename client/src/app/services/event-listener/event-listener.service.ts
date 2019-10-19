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

    onMouseMove(event: MouseEvent) {
        if (this.currentTool !== undefined && !this.isWorkZoneEmpty) {
            this.currentTool!.onMouseMove(event);
        }
    }

    onMouseDown(event: MouseEvent) {
        console.log(this.currentTool);
        console.log(this.isWorkZoneEmpty);
        if (this.currentTool !== undefined && !this.isWorkZoneEmpty) {
            this.currentTool!.onMouseDown(event);
        }
    }

    onMouseUp(event: MouseEvent) {
        if (this.currentTool !== undefined && !this.isWorkZoneEmpty) {
            this.currentTool!.onMouseUp(event);
        }
    }

    onMouseEnter(event: MouseEvent) {
        if (this.currentTool !== undefined && !this.isWorkZoneEmpty) {
            this.currentTool!.onMouseEnter(event);
        }
    }

    onMouseLeave(event: MouseEvent) {
        if (this.currentTool !== undefined && !this.isWorkZoneEmpty) {
            this.currentTool!.onMouseLeave(event);
        }
    }

    onMouseWheel(event: WheelEvent) {
        if (this.currentTool instanceof StampToolService && !this.isWorkZoneEmpty) {
            this.currentTool.onWheel(event);
        }
    }

    onDblClick(event: MouseEvent) {
        if (this.currentTool instanceof LineToolService && !this.isWorkZoneEmpty) {
            this.currentTool.onDblClick(event);
        }
    }

    onKeyDown(event: KeyboardEvent) {
        // event.preventDefault();

        // Call the onKeyDown of the current tool, if the current tool doesnt do anything 
        if (this.currentTool != undefined && !this.isWorkZoneEmpty) {
            this.currentTool.onKeyDown(event);
        }

        // If the key is a shortcut for a tool, change current tool
        if (!this.isOnInput && ToolNameShortcuts.has(event.key)) {
            this.toolSelectorService.changeTool(ToolNameShortcuts.get(event.key)!);
        }

        // If control is pressed, change for ControlTools
        if (event.ctrlKey && ToolNameControlShortcuts.has(event.key)) {
            this.toolSelectorService.changeTool(ToolNameControlShortcuts.get(event.key)!);
        }

        if(event.key === 'g' && !this.isOnInput) {
            this.gridToolService.switchState(); 
        }

        if(event.key === '+' && !this.isOnInput) {
            this.gridToolService.incrementSize();
        }

        if(event.key === '-' && !this.isOnInput) {
            this.gridToolService.decrementSize();
        }
    }

    onKeyUp(event: KeyboardEvent) {
        if(this.currentTool != undefined && !this.isWorkZoneEmpty) {
            this.currentTool.onKeyUp(event);
        }
    }

    

    addEventListeners(): void {
        
        this.workZoneSVGRef.nativeElement.addEventListener('mousemove', this.onMouseMove);

        this.workZoneSVGRef.nativeElement.addEventListener('mousedown', this.onMouseDown);

        this.workZoneSVGRef.nativeElement.addEventListener('mouseup', this.onMouseUp);

        this.workZoneSVGRef.nativeElement.addEventListener('mouseenter', this.onMouseEnter);

        this.workZoneSVGRef.nativeElement.addEventListener('mouseleave', this.onMouseLeave);

        this.workZoneSVGRef.nativeElement.addEventListener('wheel', this.onMouseWheel);

        this.workZoneSVGRef.nativeElement.addEventListener('dblclick', this.onDblClick);

        window.addEventListener('keydown', this.onKeyDown);

        window.addEventListener('keyup', this.onKeyUp)
    }

}
