import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';

import { AbstractToolService } from 'src/app/services/tools/abstract-tools/abstract-tool.service';
import { ColorToolService } from 'src/app/services/tools/color-tool/color-tool.service';
import { GridToolService } from 'src/app/services/tools/grid-tool/grid-tool.service';
import { ToolSelectorService } from 'src/app/services/tools/tool-selector/tool-selector.service';
import { DEFAULT_TRANSPARENT, DEFAULT_WHITE } from 'src/constants/color-constants';
import { SIDEBAR_WIDTH } from 'src/constants/constants';
import { GridOpacity, GridSize, ToolName } from 'src/constants/tool-constants';
import { DrawingInfo } from '../../../classes/DrawingInfo';
import { DrawStackService } from '../../services/draw-stack/draw-stack.service';
import { DrawingModalWindowService } from '../../services/drawing-modal-window/drawing-modal-window.service';
import { FileManagerService } from '../../services/server/file-manager/file-manager.service';
import { Drawing } from '../../../../../common/communication/Drawing';
import { EventListenerService } from 'src/app/services/event-listener/event-listener.service';
import { ShortcutManagerService } from 'src/app/services/shortcut-manager/shortcut-manager.service';

@Component({
    selector: 'app-work-zone',
    templateUrl: './work-zone.component.html',
    styleUrls: ['./work-zone.component.scss'],
})
export class WorkZoneComponent implements OnInit {
    drawingInfo: DrawingInfo = new DrawingInfo(0, 0, DEFAULT_WHITE);

    gridIsActive = false;
    gridSize = GridSize.Default;
    gridOpacity = GridOpacity.Max;

    displayNewDrawingModalWindow = false;
    toolName: ToolName = ToolName.Selection;

    currentTool: AbstractToolService | undefined;
    empty = true;
    name = 'test';

    drawStack: DrawStackService;

    @ViewChild('svgpad', { static: true }) refSVG: ElementRef<SVGElement>;

    private eventListenerService: EventListenerService;

    constructor(
        private fileManagerService: FileManagerService,
        private drawingModalWindowService: DrawingModalWindowService,
        private renderer: Renderer2,
        private toolSelector: ToolSelectorService,
        private colorToolService: ColorToolService,
        private gridToolService: GridToolService,
        private shortCutManagerService: ShortcutManagerService,
    ) {}

    ngOnInit(): void {
        this.drawStack = new DrawStackService(this.renderer);
        this.toolSelector.initTools(this.drawStack, this.refSVG, this.renderer);
        this.currentTool = this.toolSelector.currentTool;

        this.eventListenerService = new EventListenerService(this.refSVG, this.toolSelector, this.gridToolService, this.shortCutManagerService);
        this.eventListenerService.addEventListeners();

        this.drawingModalWindowService.drawingInfo.subscribe((drawingInfo) => {
            this.empty = false;
            this.eventListenerService.isWorkZoneEmpty = false;
            this.drawingInfo = drawingInfo;

            for (const el of this.drawStack.reset()) {
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

        this.eventListenerService.isWorkZoneEmpty = true;

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

    // myString will be linked with server
    save() {
        this.fileManagerService.postDrawing(this.name, this.refSVG.nativeElement.innerHTML, this.drawStack.idStack);
    }
    load() {
        this.fileManagerService.getDrawing(this.name).subscribe((ans: any) => {
            let drawing: Drawing = JSON.parse(ans.body);

            this.renderer.setProperty(this.refSVG.nativeElement, 'innerHTML', drawing.svg);

            let idStack = Object.values(drawing.idStack);
            idStack.forEach((id) => {
                let el: SVGGElement = this.refSVG.nativeElement.children.namedItem(id) as SVGGElement;
                this.drawStack.push(el);
            });
        });
    }

    changeStyle(): ReturnStyle {
        if (this.empty) {
            this.drawingInfo.color = DEFAULT_TRANSPARENT;
        }
        return {
            fill: '#' + this.drawingInfo.color,
        };
    }

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
