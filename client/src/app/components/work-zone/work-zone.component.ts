import { Component, OnInit } from '@angular/core';
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

    // @ViewChild('svgpad', {static: true}) ref: ElementRef<SVGElement>;
    // private currentTool: AbstractShapeToolService;

    constructor(drawingModalWindowService: DrawingModalWindowService) {
        this.drawingModalWindowService = drawingModalWindowService;
    }

    ngOnInit() {
        this.drawingModalWindowService.currentInfo.subscribe((drawingInfo) => {
            this.drawingInfo = drawingInfo;
            // for(let el of this.drawStack.reset()) {
            //     this.renderer.removeChild(this.ref, el);
            // }
        });
        this.drawingModalWindowService.currentDisplayNewDrawingModalWindow.subscribe((displayNewDrawingModalWindow) => {
            this.displayNewDrawingModalWindow = displayNewDrawingModalWindow;
        });

        // this.toolsService.currTool.subscribe(()=>{
        //     this.currentTool = this.toolsService.getCurrentTool(/*this.drawStack,*/ this.ref, this.renderer);});

        // this.currentTool = this.toolsService.getCurrentTool(/*this.drawStack,*/ this.ref, this.renderer);
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
    // @HostListener('mousemove', ['$event']) onMouseMove(event: MouseEvent): void{
    //     this.currentTool.onMouseMove(event);
    // }

    // @HostListener('mousedown', ['$event']) onMouseDown(event: MouseEvent): void{
    //     this.currentTool.onMouseDown(event);
    // }

    // @HostListener('window:mouseup', ['$event']) onMouseUp(event: MouseEvent): void{
    //     this.currentTool.onMouseUp(event);
    // }

    // @HostListener('mouseenter', ['$event']) onMouseEnter(event: MouseEvent): void{
    //     this.currentTool.onMouseEnter(event);
    // }

    // @HostListener('mouseleave', ['$event']) onMouseLeave(event: MouseEvent): void{
    //     this.currentTool.onMouseLeave(event);
    // }

    // @HostListener('window:keydown', ['$event']) onKeyDown(event: KeyboardEvent): void{
    //     this.currentTool.onKeyDown(event);
    // }

    // @HostListener('window:keyup', ['$event']) onKeyUp(event: KeyboardEvent): void{
    //     this.currentTool.onKeyUp(event);
    // }
    // LISTENERS //
}
