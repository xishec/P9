import { Component, ElementRef, HostListener, OnInit, Renderer2, ViewChild } from '@angular/core';

import { RectangleTool } from 'src/app/classes/RectangleTool/rectangle-tool';
import { DrawingInfo } from '../../../classes/DrawingInfo';
import { DrawingModalWindowService } from '../../services/drawing-modal-window/drawing-modal-window.service';

@Component({
    selector: 'app-work-zone',
    templateUrl: './work-zone.component.html',
    styleUrls: ['./work-zone.component.scss'],
})
export class WorkZoneComponent implements OnInit {
    drawingModalWindowService: DrawingModalWindowService;
    drawingInfo: DrawingInfo = new DrawingInfo();
    displayNewDrawingModalWindow = false;

    // NOT CLEAN //
    @ViewChild('svgpad', {static: true}) ref: ElementRef<SVGElement>;
    // @ViewChild(DrawableDirective, {static: true}) drawDir: DrawableDirective;
    private currentTool: RectangleTool;
    // NOT CLEAN //

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

        // NOT CLEAN //
        this.currentTool = new RectangleTool(this.ref, this.renderer);
        // NOT CLEAN //
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

    @HostListener('mouseup', ['$event']) onMouseUp(event: MouseEvent): void{
        this.currentTool.onMouseUp(event);
    }

    @HostListener('mouseenter', ['$event']) onMouseEnter(event: MouseEvent): void{
        this.currentTool.onMouseEnter(event);
    }

    @HostListener('mouseleave', ['$event']) onMouseLeave(event: MouseEvent): void{
        this.currentTool.onMouseLeave(event);
    }

    @HostListener('keydown', ['$event']) onKeyDown(event: KeyboardEvent): void{
        this.currentTool.onKeyDown(event);
    }

    @HostListener('keyup', ['$event']) onKeyUp(event: KeyboardEvent): void{
        this.currentTool.onKeyUp(event);
    }
    // LISTENERS //
}
