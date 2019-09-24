import { Component, OnInit, HostListener, ViewChild, ElementRef, Renderer2 } from '@angular/core';

import { DrawingInfo } from '../../../classes/DrawingInfo';
import { DrawingModalWindowService } from '../../services/drawing-modal-window/drawing-modal-window.service';
import { DrawStackService } from '../../services/draw-stack/draw-stack.service';
import { AttributesManagerService } from '../../services/tools/attributes-manager/attributes-manager.service';
import { ToolsService } from 'src/app/services/tools/tool-selector/tool-selector.service';
import { AbstractToolService } from 'src/app/services/tools/abstract-tools/abstract-tool.service';

@Component({
    selector: 'app-work-zone',
    templateUrl: './work-zone.component.html',
    styleUrls: ['./work-zone.component.scss'],
})
export class WorkZoneComponent implements OnInit {
    drawingModalWindowService: DrawingModalWindowService;
    drawingInfo: DrawingInfo = new DrawingInfo();
    displayNewDrawingModalWindow = false;

    currentTool: AbstractToolService;
    @ViewChild('svgpad', { static: true }) ref: ElementRef<SVGElement>;

    constructor(
        drawingModalWindowService: DrawingModalWindowService,
        private renderer: Renderer2,
        private drawStackService: DrawStackService,
        private attributesManagerService: AttributesManagerService,
        private toolSelector: ToolsService,
    ) {
        this.drawingModalWindowService = drawingModalWindowService;
    }

    ngOnInit() {
        console.log("wtf");
        this.toolSelector.initTools(this.drawStackService, this.ref, this.renderer, this.attributesManagerService);
        this.currentTool = this.toolSelector.currentTool;

        this.drawingModalWindowService.currentInfo.subscribe((drawingInfo) => {
            this.drawingInfo = drawingInfo;

            for(const el of this.drawStackService.reset()){
                this.renderer.removeChild(this.ref.nativeElement, el);
            }
        });

        this.drawingModalWindowService.currentDisplayNewDrawingModalWindow.subscribe((displayNewDrawingModalWindow) => {
            this.displayNewDrawingModalWindow = displayNewDrawingModalWindow;
        });

        this.toolSelector.currentToolName.subscribe(() => {
            console.log("Getting");
            this.currentTool = this.toolSelector.currentTool;
        });
    }

    changeStyle() {
        return {
            fill: '#' + this.drawingInfo.color.hex,
            'fill-opacity': this.drawingInfo.opacity,
            height: this.drawingInfo.height,
            width: this.drawingInfo.width,
        };
    }

    // LISTENERS //
    @HostListener('mousemove', ['$event']) onMouseMove(event: MouseEvent): void {
        this.currentTool.onMouseMove(event);
    }

    @HostListener('mousedown', ['$event']) onMouseDown(event: MouseEvent): void {
        this.currentTool.onMouseDown(event);
    }

    @HostListener('window:mouseup', ['$event']) onMouseUp(event: MouseEvent): void {
        this.currentTool.onMouseUp(event);
    }

    @HostListener('mouseenter', ['$event']) onMouseEnter(event: MouseEvent): void {
        this.currentTool.onMouseEnter(event);
    }

    @HostListener('mouseleave', ['$event']) onMouseLeave(event: MouseEvent): void {
        this.currentTool.onMouseLeave(event);
    }

    @HostListener('window:keydown', ['$event']) onKeyDown(event: KeyboardEvent): void {
        this.currentTool.onKeyDown(event);
    }

    @HostListener('window:keyup', ['$event']) onKeyUp(event: KeyboardEvent): void {
        this.currentTool.onKeyUp(event);
    }
    // LISTENERS //
}
