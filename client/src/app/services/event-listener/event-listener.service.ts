import { Injectable, ElementRef } from '@angular/core';
import { AbstractToolService } from '../tools/abstract-tools/abstract-tool.service';
import { ToolSelectorService } from '../tools/tool-selector/tool-selector.service';
import { ToolNameShortcuts } from 'src/constants/tool-constants';

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
        
        window.addEventListener('mousemove', (event: MouseEvent) => {
            if (this.verifyIfInWorkZone(event) && this.currentTool!== undefined && !this.empty) {
                this.currentTool.onMouseMove(event);
            }
        });

        window.addEventListener('mousedown', (event: MouseEvent) => {
            if (this.verifyIfInWorkZone(event) && this.currentTool!== undefined && !this.empty) {
                this.currentTool.onMouseDown(event);
            }
        });

        window.addEventListener('mouseup', (event: MouseEvent) => {
            if (this.currentTool!== undefined && !this.empty) {
                this.currentTool.onMouseUp(event);
            }
        });

        window.addEventListener('mouseenter', (event: MouseEvent) => {
            if (this.verifyIfInWorkZone(event) && this.currentTool!== undefined && !this.empty) {
                this.currentTool.onMouseEnter(event);
            }
        });

        window.addEventListener('mouseleave', (event: MouseEvent) => {
            if (this.verifyIfInWorkZone(event) && this.currentTool!== undefined && !this.empty) {
                this.currentTool.onMouseLeave(event);
            }
        });

        window.addEventListener('keydown', (event: KeyboardEvent) => {
            
            const toolName = ToolNameShortcuts.get(event.key);

            if(this.shouldAllowShortcuts() && toolName !== undefined) {
                event.preventDefault();
                console.log(event.key);

                this.toolSelectorService.changeTool(toolName);
            }
            if (this.currentTool != undefined && !this.empty) {
                this.currentTool.onKeyDown(event);
            }
        });

        window.addEventListener('keyup', (event: KeyboardEvent) => {
            if(this.currentTool != undefined && !this.empty) {
                this.currentTool.onKeyUp(event);
            }
        })
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
