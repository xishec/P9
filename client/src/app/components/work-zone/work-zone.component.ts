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
import { ModalManagerService } from 'src/app/services/modal-manager/modal-manager.service';
import { FileManagerService } from '../../services/server/file-manager/file-manager.service';
import { Drawing } from '../../../../../common/communication/Drawing';
import { Message } from '../../../../../common/communication/message';
import { DrawingLoaderService } from 'src/app/services/server/drawing-loader/drawing-loader.service';

@Component({
    selector: 'app-work-zone',
    templateUrl: './work-zone.component.html',
    styleUrls: ['./work-zone.component.scss'],
})
export class WorkZoneComponent implements OnInit {
    drawingInfo: DrawingInfo = new DrawingInfo(0, 0, DEFAULT_WHITE);
    modalIsDisplayed = false;
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

    constructor(
        private fileManagerService: FileManagerService,
        private drawingModalWindowService: DrawingModalWindowService,
        private renderer: Renderer2,
        private toolSelector: ToolSelectorService,
        private colorToolService: ColorToolService,
        private gridToolService: GridToolService,
        private modalManagerService: ModalManagerService,
        private drawingLoaderService: DrawingLoaderService,
    ) {}

    ngOnInit(): void {
        this.drawStack = new DrawStackService(this.renderer);
        this.toolSelector.initTools(this.drawStack, this.refSVG, this.renderer);
        this.currentTool = this.toolSelector.currentTool;

        this.drawingLoaderService.currentRefSVG.subscribe((selectedDrawing) => {
            if (selectedDrawing.svg === '') return;

            this.drawingInfo = selectedDrawing.drawingInfo;
            this.drawingModalWindowService.changeDrawingInfo(
                this.drawingInfo.width,
                this.drawingInfo.height,
                this.drawingInfo.color,
            );

            this.empty = false;
            this.renderer.setProperty(this.refSVG.nativeElement, 'innerHTML', selectedDrawing.svg);

            let idStack = Object.values(selectedDrawing.idStack);
            idStack.forEach((id) => {
                let el: SVGGElement = this.refSVG.nativeElement.children.namedItem(id) as SVGGElement;
                this.drawStack.push(el);
            });
        });

        this.drawingModalWindowService.drawingInfo.subscribe((drawingInfo: DrawingInfo) => {
            this.empty = false;
            this.drawingInfo = drawingInfo;

            this.setRectangleBackgroundStyle();

            for (const el of this.drawStack.reset()) {
                this.renderer.removeChild(this.refSVG.nativeElement, el);
            }
        });

        this.modalManagerService.currentModalIsDisplayed.subscribe((modalIsDisplayed: boolean) => {
            this.modalIsDisplayed = modalIsDisplayed;
        });

        this.toolSelector.currentToolName.subscribe((toolName) => {
            this.toolName = toolName;
            this.currentTool = this.toolSelector.currentTool;
        });

        this.colorToolService.backgroundColor.subscribe((backgroundColor: string) => {
            this.drawingInfo.color = backgroundColor;
            this.setRectangleBackgroundStyle();
        });

        this.gridToolService.currentState.subscribe((state: boolean) => {
            this.gridIsActive = state;
        });

        this.gridToolService.currentSize.subscribe((size: number) => {
            this.gridSize = size;
        });
        this.gridToolService.currentOpacity.subscribe((opacity: number) => {
            this.gridOpacity = opacity;
        });

        this.drawingInfo.height = window.innerHeight;
        this.drawingInfo.width = window.innerWidth - SIDEBAR_WIDTH;
        this.drawingInfo.color = DEFAULT_TRANSPARENT;
        this.empty = true;
        this.setRectangleBackgroundStyle();
    }

    onClickRectangle() {
        if (this.empty) {
            alert('Veuillez créer un nouveau dessin!');
        }
    }

    // myString will be linked with server
    save() {
        this.fileManagerService.postDrawing(
            this.name,
            ['test'],
            this.refSVG.nativeElement.innerHTML,
            this.drawStack.idStack,
            this.drawingInfo,
        );
    }
    load() {
        this.fileManagerService.getAllDrawing().subscribe((ans: any) => {
            ans = ans as Message[];
            ans.forEach((el: Message) => {
                let drawing: Drawing = JSON.parse(el.body);
                console.log(drawing);
            });

            // this.renderer.setProperty(this.refSVG.nativeElement, 'innerHTML', drawing.svg);

            // let idStack = Object.values(drawing.idStack);
            // idStack.forEach((id) => {
            //     let el: SVGGElement = this.refSVG.nativeElement.children.namedItem(id) as SVGGElement;
            //     this.drawStack.push(el);
            // });
        });
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

    backgroundColor(): string {
        if (this.empty) {
            this.drawingInfo.color = DEFAULT_TRANSPARENT;
        }
        return this.drawingInfo.color;
    }

    setRectangleBackgroundStyle() {
        if (this.drawingInfo.width > 0 || this.drawingInfo.height > 0) {
            this.renderer.setAttribute(this.refSVG.nativeElement.children[0], 'height', this.drawingInfo.height + 'px');
            this.renderer.setAttribute(this.refSVG.nativeElement.children[0], 'width', this.drawingInfo.width + 'px');

            this.renderer.setAttribute(
                this.refSVG.nativeElement.children[0],
                'style',
                'fill: #' + this.backgroundColor() + ';',
            );
        }
    }
}
