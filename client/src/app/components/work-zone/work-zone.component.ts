import { Component, OnInit, ViewChild, HostListener, ElementRef, Renderer2 } from '@angular/core';

import { DrawingInfo } from '../../../classes/DrawingInfo';
import { DrawingModalWindowService } from '../../services/drawing-modal-window/drawing-modal-window.service';
import { PencilToolService } from '../../services/tracing-tools/pencil-tool/pencil-tool.service';
import { TracingToolService } from 'src/app/services/tracing-tools/tracing-tool.service';

@Component({
    selector: 'app-work-zone',
    templateUrl: './work-zone.component.html',
    styleUrls: ['./work-zone.component.scss'],
})
export class WorkZoneComponent implements OnInit {
    drawingModalWindowService: DrawingModalWindowService;
    drawingInfo: DrawingInfo = new DrawingInfo();
    displayNewDrawingModalWindow = false;

    @ViewChild('container', {static : true}) container: ElementRef<SVGElement>;
    private currentTool: TracingToolService;

    constructor(drawingModalWindowService: DrawingModalWindowService, private renderer: Renderer2) {
        this.drawingModalWindowService = drawingModalWindowService;
    }

    ngOnInit() {
        this.drawingModalWindowService.currentInfo.subscribe((drawingInfo) => {
            this.drawingInfo = drawingInfo;
        });
        this.drawingModalWindowService.currentDisplayNewDrawingModalWindow.subscribe((displayNewDrawingModalWindow) => {
            this.displayNewDrawingModalWindow = displayNewDrawingModalWindow;
        });

        this.currentTool = new PencilToolService(this.container, this.renderer);
    }

    changeStyle() {
        return {
            fill: '#' + this.drawingInfo.color.hex,
            'fill-opacity': this.drawingInfo.opacity,
            height: this.drawingInfo.height,
            width: this.drawingInfo.width,
        };
    }

    @HostListener('mousedown', ['$event']) onMouseDown(e: MouseEvent): void {
        this.currentTool.onMouseDown(e);
    }
    @HostListener('mousemove', ['$event']) onMouseMove(e: MouseEvent): void {
        this.currentTool.onMouseMove(e);
    }
    @HostListener('mouseup', ['$event']) onMouseUp(e: MouseEvent): void {
        this.currentTool.onMouseUp(e);
    }
    @HostListener('mouseleave', ['$event']) onMouseLeave(e: MouseEvent): void {
        this.currentTool.onMouseLeave(e);
    }
}
