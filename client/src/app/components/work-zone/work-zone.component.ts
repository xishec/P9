import { Component, OnInit, HostListener, ViewChild, ElementRef } from '@angular/core';

import { DrawingInfo } from '../../../classes/DrawingInfo';
import { DrawingModalWindowService } from '../../services/drawing-modal-window/drawing-modal-window.service';
import { PencilComponent } from '../pencil/pencil.component';

@Component({
    selector: 'app-work-zone',
    templateUrl: './work-zone.component.html',
    styleUrls: ['./work-zone.component.scss'],
})
export class WorkZoneComponent implements OnInit {
    drawingModalWindowService: DrawingModalWindowService;
    drawingInfo: DrawingInfo = new DrawingInfo();
    displayNewDrawingModalWindow = false;

    constructor(drawingModalWindowService: DrawingModalWindowService) {
        this.drawingModalWindowService = drawingModalWindowService;
    }

    ngOnInit() {
        this.drawingModalWindowService.currentInfo.subscribe((drawingInfo) => {
            this.drawingInfo = drawingInfo;
        });
        this.drawingModalWindowService.currentDisplayNewDrawingModalWindow.subscribe((displayNewDrawingModalWindow) => {
            this.displayNewDrawingModalWindow = displayNewDrawingModalWindow;
        });

        this.currentTool = new PencilComponent(this.svgRef);
    }

    changeStyle() {
        return {
            fill: '#' + this.drawingInfo.color.hex,
            'fill-opacity': this.drawingInfo.opacity,
            height: this.drawingInfo.height,
            width: this.drawingInfo.width,
        };
    }

    private currentTool: PencilComponent;
    @ViewChild('svgpad', {static : true}) svgRef: ElementRef<SVGElement>;
    
    @HostListener('mousedown', ['$event']) onMouseDown(e: MouseEvent): void {
        this.currentTool.onMouseDown(e);
    }
    @HostListener('mousemove', ['$event']) onMouseMove(e: MouseEvent): void {
        this.currentTool.onMouseMove(e);
    }
    @HostListener('mouseup', ['$event']) onMouseUp(e: MouseEvent): void {
        this.currentTool.onMouseUp(e);
    }
}
