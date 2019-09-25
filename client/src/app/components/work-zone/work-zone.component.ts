import { Component, ElementRef, HostListener, OnInit, Renderer2, ViewChild } from '@angular/core';

import { AbstractToolService } from 'src/app/services/tools/abstract-tools/abstract-tool.service';
import { ToolSelectorService } from 'src/app/services/tools/tool-selector/tool-selector.service';
import { DrawingInfo } from '../../../classes/DrawingInfo';
import { DrawStackService } from '../../services/draw-stack/draw-stack.service';
import { DrawingModalWindowService } from '../../services/drawing-modal-window/drawing-modal-window.service';

@Component({
    selector: 'app-work-zone',
    templateUrl: './work-zone.component.html',
    styleUrls: ['./work-zone.component.scss'],
})
export class WorkZoneComponent implements OnInit {
    drawingInfo: DrawingInfo = new DrawingInfo();
    displayNewDrawingModalWindow = false;

    currentTool: AbstractToolService | undefined;
    @ViewChild('svgpad', { static: true }) ref: ElementRef<SVGElement>;

    constructor(
        private drawingModalWindowService: DrawingModalWindowService,
        private renderer: Renderer2,
        private drawStackService: DrawStackService,
        private toolSelector: ToolSelectorService,
    ) {}

    ngOnInit(): void {
        this.toolSelector.initTools(this.drawStackService, this.ref, this.renderer);
        this.currentTool = this.toolSelector.currentTool;

        this.drawingModalWindowService.currentInfo.subscribe((drawingInfo) => {
            this.drawingInfo = drawingInfo;

            for (const el of this.drawStackService.reset()) {
                this.renderer.removeChild(this.ref.nativeElement, el);
            }
        });

        this.drawingModalWindowService.currentDisplayNewDrawingModalWindow.subscribe((displayNewDrawingModalWindow) => {
            this.displayNewDrawingModalWindow = displayNewDrawingModalWindow;
        });

        this.toolSelector.currentToolName.subscribe(() => {
            this.currentTool = this.toolSelector.currentTool;
        });
    }

    changeStyle(): ReturnStyle {
        return {
            fill: '#' + this.drawingInfo.color.hex,
            'fill-opacity': this.drawingInfo.opacity,
            height: this.drawingInfo.height,
            width: this.drawingInfo.width,
        };
    }

    // LISTENERS //
    @HostListener('mousemove', ['$event']) onMouseMove(event: MouseEvent): void {
        if (this.currentTool !== undefined) {
            this.currentTool.onMouseMove(event);
        }
    }

    @HostListener('mousedown', ['$event']) onMouseDown(event: MouseEvent): void {
        if (this.currentTool !== undefined) {
            this.currentTool.onMouseDown(event);
        }
    }

    @HostListener('window:mouseup', ['$event']) onMouseUp(event: MouseEvent): void {
        if (this.currentTool !== undefined) {
            this.currentTool.onMouseUp(event);
        }
    }

    @HostListener('mouseenter', ['$event']) onMouseEnter(event: MouseEvent): void {
        if (this.currentTool !== undefined) {
            this.currentTool.onMouseEnter(event);
        }
    }

    @HostListener('mouseleave', ['$event']) onMouseLeave(event: MouseEvent): void {
        if (this.currentTool !== undefined) {
            this.currentTool.onMouseLeave(event);
        }
    }

    @HostListener('window:keydown', ['$event']) onKeyDown(event: KeyboardEvent): void {
        if (this.currentTool !== undefined) {
            this.currentTool.onKeyDown(event);
        }
    }

    @HostListener('window:keyup', ['$event']) onKeyUp(event: KeyboardEvent): void {
        if (this.currentTool !== undefined) {
            this.currentTool.onKeyUp(event);
        }
    }
    // LISTENERS //
}

interface ReturnStyle {
    fill: string;
    'fill-opacity': number;
    height: number;
    width: number;
}
