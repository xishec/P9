import { Injectable, ElementRef } from '@angular/core';
import { AbstractToolService } from '../tools/abstract-tools/abstract-tool.service';
import { ToolSelectorService } from '../tools/tool-selector/tool-selector.service';
import { ToolName } from 'src/constants/tool-constants';

@Injectable({
    providedIn: 'root',
})
export class EventListenerService {

    currentTool: AbstractToolService | undefined;
    toolName = '';
    empty = true;

    dic : Map<string , string> = new Map([
        ['c', ToolName.Pencil],
        ['w', ToolName.Brush],
        ['p', ToolName.Quill],
        ['y', ToolName.Pen],
        ['a', ToolName.SprayCan],
        ['1', ToolName.Rectangle],
        ['2', ToolName.Ellipsis],
        ['3', ToolName.Polygon],
        ['l', ToolName.Line],
        ['t', ToolName.Text],
        ['r', ToolName.ColorApplicator],
        ['b', ToolName.Fill],
        ['e', ToolName.Eraser],
        ['i', ToolName.Dropper],
        ['s', ToolName.Selection],
    ])

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

                this.toolSelectorService.changeTool(this.dic.get(event.key)!);

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
