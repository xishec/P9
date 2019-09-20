import { Component, HostListener, OnInit, Renderer2, ViewChild, ElementRef } from '@angular/core';

import { BrushToolService } from 'src/app/services/tools/brush-tool/brush-tool.service';
import { DrawingInfo } from '../../../classes/DrawingInfo';
import { DrawingModalWindowService } from '../../services/drawing-modal-window/drawing-modal-window.service';
import { DrawStackService } from 'src/app/services/draw-stack/draw-stack.service';

@Component({
    selector: 'app-work-zone',
    templateUrl: './work-zone.component.html',
    styleUrls: ['./work-zone.component.scss'],
})
export class WorkZoneComponent implements OnInit {
    drawingModalWindowService: DrawingModalWindowService;
    drawingInfo: DrawingInfo = new DrawingInfo();
    displayNewDrawingModalWindow = false;

    @ViewChild('svgpad', {static: true}) ref: ElementRef<SVGElement>;
    private currentTool: BrushToolService;

    constructor(drawingModalWindowService: DrawingModalWindowService, private renderer: Renderer2, private drawStack: DrawStackService) {
        this.drawingModalWindowService = drawingModalWindowService;
    }

    ngOnInit() {
        //
        this.currentTool = new BrushToolService(this.ref, this.renderer, this.drawStack);
        //
        this.drawingModalWindowService.currentInfo.subscribe((drawingInfo) => {
            this.drawingInfo = drawingInfo;
        });
        this.drawingModalWindowService.currentDisplayNewDrawingModalWindow.subscribe((displayNewDrawingModalWindow) => {
            this.displayNewDrawingModalWindow = displayNewDrawingModalWindow;
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
    @HostListener('mousemove', ['$event']) onMouseMove(event: MouseEvent): void{
        this.currentTool.onMouseMove(event);
    }

    @HostListener('mousedown', ['$event']) onMouseDown(event: MouseEvent): void{
        this.currentTool.onMouseDown(event);
    }

    @HostListener('window:mouseup', ['$event']) onMouseUp(event: MouseEvent): void{
        this.currentTool.onMouseUp(event);
    }
    
    @HostListener('mouseleave', ['$event']) onMouseLeave(event: MouseEvent): void{
        this.currentTool.onMouseLeave(event);
    }
    // LISTENERS //
}
