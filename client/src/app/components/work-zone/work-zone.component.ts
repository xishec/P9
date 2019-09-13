import { Component, ComponentFactory, ComponentFactoryResolver, OnInit, ViewChild, ViewContainerRef, HostListener } from '@angular/core';

import { DrawingInfo } from '../../../classes/DrawingInfo';
import { DrawingModalWindowService } from '../../services/drawing-modal-window/drawing-modal-window.service';
import { PencilToolService } from '../../services/tracing-tools/pencil-tool/pencil-tool.service';
import { StrokeComponent } from '../SVGComponents/stroke/stroke.component';

@Component({
    selector: 'app-work-zone',
    templateUrl: './work-zone.component.html',
    styleUrls: ['./work-zone.component.scss'],
})
export class WorkZoneComponent implements OnInit {
    drawingModalWindowService: DrawingModalWindowService;
    drawingInfo: DrawingInfo = new DrawingInfo();
    displayNewDrawingModalWindow = false;
    pencilToolService: PencilToolService;

    constructor(drawingModalWindowService: DrawingModalWindowService, pencilToolService: PencilToolService,
    private resolver: ComponentFactoryResolver) {
        this.drawingModalWindowService = drawingModalWindowService;
        this.pencilToolService = pencilToolService;
    }

    ngOnInit() {
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

    componentRef: ComponentRef;
    @ViewChild('container', { read: ViewContainerRef }) container;
    createComponent(): void {
        const factory: ComponentFactory<StrokeComponent> = this.resolver.resolveComponentFactory(StrokeComponent);
        this.componentRef = this.container.createComponent(factory);
    }
    moveRight(): void {
        this.componentRef.instance.right();
    }

    // @ViewChild('svgpad', {static : true}) svgRef: ElementRef<SVGElement>;
    // @HostListener('mousedown', ['$event']) onMouseDown(e: MouseEvent): void {
    //     this.pencilToolService.onMouseDown(e, this.svgRef);
    // }
    // @HostListener('mousemove', ['$event']) onMouseMove(e: MouseEvent): void {
    //     this.pencilToolService.onMouseMove(e, this.svgRef);
    // }
    // @HostListener('mouseup', ['$event']) onMouseUp(e: MouseEvent): void {
    //     this.pencilToolService.onMouseUp(e, this.svgRef);
    // }
    // @HostListener('mouseleave', ['$event']) onMouseLeave(e: MouseEvent): void {
    //     this.pencilToolService.onMouseLeave(e, this.svgRef);
    // }
}
