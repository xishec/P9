import { Component, ElementRef, HostListener, OnInit, Renderer2, ViewChild } from '@angular/core';

import { AbstractToolService } from 'src/app/services/tools/abstract-tools/abstract-tool.service';
import { ColorToolService } from 'src/app/services/tools/color-tool/color-tool.service';
import { GridToolService } from 'src/app/services/tools/grid-tool/grid-tool.service';
import { LineToolService } from 'src/app/services/tools/line-tool/line-tool.service';
import { StampToolService } from 'src/app/services/tools/stamp-tool/stamp-tool.service';
import { ToolSelectorService } from 'src/app/services/tools/tool-selector/tool-selector.service';
import { DEFAULT_TRANSPARENT, DEFAULT_WHITE } from 'src/constants/color-constants';
import { SIDEBAR_WIDTH } from 'src/constants/constants';
import { GridOpacity, GridSize, ToolName } from 'src/constants/tool-constants';
import { DrawingInfo } from '../../../classes/DrawingInfo';
import { DrawStackService } from '../../services/draw-stack/draw-stack.service';
import { DrawingModalWindowService } from '../../services/drawing-modal-window/drawing-modal-window.service';

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

    gridIsActive = false;
    gridSize = GridSize.Default;
    gridOpacity = GridOpacity.Max;

    @ViewChild('svgpad', { static: true }) refSVG: ElementRef<SVGElement>;

    constructor(
        private drawingModalWindowService: DrawingModalWindowService,
        private renderer: Renderer2,
        private drawStackService: DrawStackService,
        private toolSelector: ToolSelectorService,
        private colorToolService: ColorToolService,
        private gridToolService: GridToolService,
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

        this.gridToolService.currentState.subscribe((state: boolean) => {
            this.gridIsActive = state;
        });

        this.gridToolService.currentSize.subscribe((size: number) => {
            this.gridSize = size;
        });
        this.gridToolService.currentOpacity.subscribe((opacity: number) => {
            this.gridOpacity = opacity;
        });
    }

    onClickRectangle() {
        if (this.empty) {
            alert('Veuillez créer un nouveau dessin!');
        }
    }

    changeStyle(): ReturnStyle {
        if (this.empty) {
            this.drawingInfo.color = DEFAULT_TRANSPARENT;
        }
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

    @HostListener('wheel', ['$event']) onWheel(event: WheelEvent): void {
        if (this.currentTool !== undefined && this.empty === false && this.currentTool instanceof StampToolService) {
            this.currentTool.onWheel(event);
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

    // ONLY USED ON LINE SERVICE
    @HostListener('dblclick', ['$event']) onDblClick(event: MouseEvent): void {
        if (this.currentTool instanceof LineToolService) {
            (this.currentTool as LineToolService).onDblClick(event);
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
            case ToolName.Ellipsis:
                return { cursor: 'crosshair' };
            default:
                return { cursor: 'default' };
        }
    }
}

interface ReturnStyle {
    fill: string;
}
