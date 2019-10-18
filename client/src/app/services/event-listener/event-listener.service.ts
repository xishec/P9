import { Injectable, ElementRef } from '@angular/core';
import { AbstractToolService } from '../tools/abstract-tools/abstract-tool.service';
import { ToolSelectorService } from '../tools/tool-selector/tool-selector.service';
import { StampToolService } from '../tools/stamp-tool/stamp-tool.service';
import { LineToolService } from '../tools/line-tool/line-tool.service';
//import { ToolNameShortcuts } from 'src/constants/tool-constants';


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
        
        this.workZoneSVGRef.nativeElement.addEventListener('mousemove', (event: MouseEvent) => {
            if (this.currentTool!== undefined && !this.empty) {
                this.currentTool.onMouseMove(event);
            }
        });

        this.workZoneSVGRef.nativeElement.addEventListener('mousedown', (event: MouseEvent) => {
            if (this.currentTool!== undefined && !this.empty) {
                this.currentTool.onMouseDown(event);
            }
        });

        this.workZoneSVGRef.nativeElement.addEventListener('mouseup', (event: MouseEvent) => {
            if (this.currentTool!== undefined && !this.empty) {
                this.currentTool.onMouseUp(event);
            }
        });

        this.workZoneSVGRef.nativeElement.addEventListener('mouseenter', (event: MouseEvent) => {
            if (this.currentTool!== undefined && !this.empty) {
                this.currentTool.onMouseEnter(event);
            }
        });

        this.workZoneSVGRef.nativeElement.addEventListener('mouseleave', (event: MouseEvent) => {
            if (this.currentTool!== undefined && !this.empty) {
                this.currentTool.onMouseLeave(event);
            }
        });

        this.workZoneSVGRef.nativeElement.addEventListener('wheel', (event: WheelEvent) => {
            if (this.currentTool instanceof StampToolService && !this.empty) {
                this.currentTool.onWheel(event);
            }
        });

        this.workZoneSVGRef.nativeElement.addEventListener('dblclick', (event: WheelEvent) => {
            if (this.currentTool instanceof LineToolService && !this.empty) {
                this.currentTool.onDblClick(event);
            }
        });

        window.addEventListener('keydown', (event: KeyboardEvent) => {
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

    shouldAllowShortcuts(): boolean {
        return true;
    }

    notifyEmpty(isEmpty: boolean): void {
        this.empty = isEmpty;
    }

    
}
