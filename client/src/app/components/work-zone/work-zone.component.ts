import { Component, ElementRef, HostListener, OnInit, Renderer2, ViewChild } from '@angular/core';

import { AbstractToolService } from 'src/app/services/tools/abstract-tools/abstract-tool.service';
import { ColorToolService } from 'src/app/services/tools/color-tool/color-tool.service';
import { ToolSelectorService } from 'src/app/services/tools/tool-selector/tool-selector.service';
import { ToolName } from 'src/constants/tool-constants';
import { DrawingInfo } from '../../../classes/DrawingInfo';
import { DrawStackService } from '../../services/draw-stack/draw-stack.service';
import { DrawingModalWindowService } from '../../services/drawing-modal-window/drawing-modal-window.service';
import { SIDEBAR_WIDTH } from 'src/constants/constants';
import { DEFAULT_WHITE, DEFAULT_TRANSPARENT } from 'src/constants/color-constants';

@Component({
    selector: 'app-work-zone',
    templateUrl: './work-zone.component.html',
    styleUrls: ['./work-zone.component.scss'],
})
export class WorkZoneComponent implements OnInit {
    drawingInfo: DrawingInfo = new DrawingInfo(0, 0, DEFAULT_WHITE);
    displayNewDrawingModalWindow = false;
    toolName: ToolName = ToolName.Selection;

    currentTool: AbstractToolService | undefined;
    empty = true;

    @ViewChild('svgpad', { static: true }) refSVG: ElementRef<SVGElement>;

    constructor(
        private drawingModalWindowService: DrawingModalWindowService,
        private renderer: Renderer2,
        private drawStackService: DrawStackService,
        private toolSelector: ToolSelectorService,
        private colorToolService: ColorToolService,
    ) {}

    ngOnInit(): void {
        this.toolSelector.initTools(this.drawStackService, this.refSVG, this.renderer);
        this.currentTool = this.toolSelector.currentTool;

        this.drawingModalWindowService.drawingInfo.subscribe((drawingInfo) => {
            this.empty = false;
            this.drawingInfo = drawingInfo;

            for (const el of this.drawStackService.reset()) {
                this.renderer.removeChild(this.refSVG.nativeElement, el);
            }
        });

        this.drawingModalWindowService.currentDisplayNewDrawingModalWindow.subscribe((displayNewDrawingModalWindow) => {
            this.displayNewDrawingModalWindow = displayNewDrawingModalWindow;
        });

        this.toolSelector.currentToolName.subscribe((toolName) => {
            this.toolName = toolName;
            this.currentTool = this.toolSelector.currentTool;
        });

        this.colorToolService.backgroundColor.subscribe((backgroundColor: string) => {
            this.drawingInfo.color = backgroundColor;
        });

        this.drawingInfo.height = window.innerHeight;
        this.drawingInfo.width = window.innerWidth - SIDEBAR_WIDTH;
        this.drawingInfo.color = DEFAULT_TRANSPARENT;
        this.empty = true;
    }

    onClickRectangle() {
        if (this.empty) {
            alert('Veuillez créer un nouveau dessin!');
        }
    }

    changeStyle(): ReturnStyle {
        return {
            fill: '#' + this.drawingInfo.color,
        };
    }

    // LISTENERS //
    @HostListener('mousemove', ['$event']) onMouseMove(event: MouseEvent): void {
        if (this.currentTool !== undefined && this.empty === false) {
            this.currentTool.onMouseMove(event);
        }
    }

    @HostListener('mousedown', ['$event']) onMouseDown(event: MouseEvent): void {
        if (this.currentTool !== undefined && this.empty === false) {
            this.currentTool.onMouseDown(event);
        }
    }

    @HostListener('window:mouseup', ['$event']) onMouseUp(event: MouseEvent): void {
        if (this.currentTool !== undefined && this.empty === false) {
            this.currentTool.onMouseUp(event);
        }
    }

    @HostListener('mouseenter', ['$event']) onMouseEnter(event: MouseEvent): void {
        if (this.currentTool !== undefined && this.empty === false) {
            this.currentTool.onMouseEnter(event);
        }
    }

    @HostListener('mouseleave', ['$event']) onMouseLeave(event: MouseEvent): void {
        if (this.currentTool !== undefined && this.empty === false) {
            this.currentTool.onMouseLeave(event);
        }
    }

    @HostListener('window:keydown', ['$event']) onKeyDown(event: KeyboardEvent): void {
        if (this.currentTool !== undefined && this.empty === false) {
            this.currentTool.onKeyDown(event);
        }
    }

    @HostListener('window:keyup', ['$event']) onKeyUp(event: KeyboardEvent): void {
        if (this.currentTool !== undefined && this.empty === false) {
            this.currentTool.onKeyUp(event);
        }
    }
    // LISTENERS //

    getCursorStyle() {
        if (this.empty) {
            return { cursor: 'not-allowed' };
        }
        switch (this.toolName) {
            case ToolName.Brush:
            case ToolName.Pencil:
            case ToolName.Rectangle:
                return { cursor: 'crosshair' };
            default:
                return { cursor: 'default' };
        }
    }
}

interface ReturnStyle {
    fill: string;
}
