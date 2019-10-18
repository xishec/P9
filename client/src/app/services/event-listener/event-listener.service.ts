import { Injectable, ElementRef } from '@angular/core';
import { AbstractToolService } from '../tools/abstract-tools/abstract-tool.service';
import { ToolSelectorService } from '../tools/tool-selector/tool-selector.service';
import { ToolName, ToolNameShortcuts } from 'src/constants/tool-constants';

@Injectable({
    providedIn: 'root',
})
export class EventListenerService {

    currentTool: AbstractToolService | undefined;
    toolName = '';
    empty = true;

    

    constructor(
        private workZoneSVGRef: ElementRef<SVGElement>,
        private toolSelectorService: ToolSelectorService,
        ) 
    {
        this.toolSelectorService.currentToolName.subscribe((toolName) => {
            this.toolName = toolName;
            this.currentTool = this.toolSelectorService.currentTool;
        });

    };

    addEventListeners(): void {
        
        window.addEventListener('mousemove', (event) => {
            if (this.verifyIfInWorkZone(event) && this.currentTool!== undefined && !this.empty) {
                this.currentTool.onMouseMove(event);
            }
        });

        window.addEventListener('keydown', (event) => {
            if(this.shouldAllowShortcuts()) {
                event.preventDefault();

                this.toolSelectorService.changeTool(ToolNameShortcuts.get(event.key)!);

                if (event.key === 'c') {
                    event.preventDefault();
                    this.toolSelectorService.changeTool(ToolName.Pencil);
                }
            }
        });
    }

    verifyIfInWorkZone(event: MouseEvent): boolean {
        return(
            event.clientX > (this.workZoneSVGRef.nativeElement.getBoundingClientRect().left + window.scrollX) &&
            event.clientY > (this.workZoneSVGRef.nativeElement.getBoundingClientRect().top + window.scrollY)
        )
    }

    shouldAllowShortcuts(): boolean {
        return true;
    }

    notifyEmpty(isEmpty: boolean): void {
        this.empty = isEmpty;
    }

    
}
