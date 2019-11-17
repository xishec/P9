import { ElementRef, Injectable, Renderer2 } from '@angular/core';

import { Coords2D } from 'src/classes/Coords2D';
import { FillStructure } from 'src/classes/FillStructure';
import { SVG_NS } from 'src/constants/constants';
import { FILL_STROKE_WIDTH, HTML_ATTRIBUTE, TOOL_NAME, TRACE_TYPE } from 'src/constants/tool-constants';
import { BFSHelper } from '../../../../classes/BFSHelper';
import { DrawStackService } from '../../draw-stack/draw-stack.service';
import { ModalManagerService } from '../../modal-manager/modal-manager.service';
import { AbstractToolService } from '../abstract-tools/abstract-tool.service';
import { AttributesManagerService } from '../attributes-manager/attributes-manager.service';
import { ColorToolService } from '../color-tool/color-tool.service';

@Injectable({
    providedIn: 'root',
})
export class FillToolService extends AbstractToolService {
    currentMouseCoords: Coords2D = new Coords2D(0, 0);
    pixelColor: string;
    canvas: HTMLCanvasElement;
    context2D: CanvasRenderingContext2D;
    SVGImg: HTMLImageElement;
    elementRef: ElementRef<SVGElement>;
    renderer: Renderer2;
    drawStack: DrawStackService;
    bfsHelper: BFSHelper;
    svgWrap: SVGGElement;
    traceType = TRACE_TYPE.Full;
    attributesManagerService: AttributesManagerService;
    userFillColor: string;
    userStrokeColor: string;
    userStrokeWidth: number;
    strokeWidth: number;
    strokeColor: string;
    fillColor: string;
    tolerance: number;
    strokePaths: string[];
    mouseDown: boolean;
    segmentsToDraw: Map<number, FillStructure[]>;

    constructor(private modalManagerService: ModalManagerService, private colorToolService: ColorToolService) {
        super();
        this.colorToolService.primaryColor.subscribe((fillColor: string) => {
            this.fillColor = fillColor;
            this.updateTraceType(this.traceType);
        });
        this.colorToolService.secondaryColor.subscribe((strokeColor: string) => {
            this.strokeColor = strokeColor;
            this.updateTraceType(this.traceType);
        });
    }

    initializeService(elementRef: ElementRef<SVGElement>, renderer: Renderer2, drawStack: DrawStackService) {
        this.elementRef = elementRef;
        this.renderer = renderer;
        this.drawStack = drawStack;

        this.canvas = this.renderer.createElement('canvas');
        this.SVGImg = this.renderer.createElement('img');
        this.context2D = this.canvas.getContext('2d') as CanvasRenderingContext2D;
    }

    initializeAttributesManagerService(attributesManagerService: AttributesManagerService): void {
        this.attributesManagerService = attributesManagerService;
        this.attributesManagerService.thickness.subscribe((thickness: number) => {
            this.strokeWidth = thickness;
            this.updateTraceType(this.traceType);
        });
        this.attributesManagerService.traceType.subscribe((traceType: TRACE_TYPE) => {
            this.updateTraceType(traceType);
        });
    }

    shouldNotFill(event: MouseEvent): boolean {
        return (
            !this.isMouseInRef(event, this.elementRef) ||
            this.modalManagerService.modalIsDisplayed.value ||
            !this.mouseDown
        );
    }

    onMouseDown(event: MouseEvent): void {
        if (this.isMouseInRef(event, this.elementRef)) {
            this.updateCanvas();
            this.mouseDown = true;
        }
    }
    onMouseUp(event: MouseEvent): void {
        if (this.shouldNotFill(event)) {
            return;
        }
        this.mouseDown = false;

        this.updateCanvas();
        this.updateMousePosition(event);

        console.time('bfs');
        this.bfsHelper = new BFSHelper(
            this.canvas.width,
            this.canvas.height,
            this.context2D,
            this.attributesManagerService,
        );
        this.bfsHelper.computeBFS(this.currentMouseCoords);
        console.timeEnd('bfs');

        this.divideLinesToSegments();
        console.time('fill');
        this.fill();
        console.timeEnd('fill');
    }

    updateMousePosition(event: MouseEvent): void {
        this.currentMouseCoords.x = event.clientX - this.elementRef.nativeElement.getBoundingClientRect().left;
        this.currentMouseCoords.y = event.clientY - this.elementRef.nativeElement.getBoundingClientRect().top;
    }

    fill(): void {
        this.createSVGWrapper();
        const bodyWrap: SVGGElement = this.fillBody();
        this.fillStroke(bodyWrap);
        this.renderer.appendChild(this.elementRef.nativeElement, this.svgWrap);
    }

    divideLinesToSegments(): void {
        this.segmentsToDraw = new Map([]);

        this.bfsHelper.bodyGrid.forEach((column, x) => {
            let fillStructure = new FillStructure();
            fillStructure.bottum = new Coords2D(x, column[0]);
            for (let y = 1; y < column.length; y++) {
                if (column[y] !== column[y - 1] + 1) {
                    fillStructure.top = new Coords2D(x, column[y - 1]);
                    this.addToMap(x, fillStructure, this.segmentsToDraw);
                    fillStructure = new FillStructure();
                    fillStructure.bottum = new Coords2D(x, column[y]);
                }
            }
            fillStructure.top = new Coords2D(x, column[column.length - 1]);
            this.addToMap(x, fillStructure, this.segmentsToDraw);
        });
    }

    addToMap(x: number, fillStructure: FillStructure, map: Map<number, FillStructure[]>): void {
        if (map.has(x)) {
            map.get(x)!.push(fillStructure);
        } else {
            map.set(x, [fillStructure]);
        }
    }

    updateCanvas(): void {
        const serializedSVG = new XMLSerializer().serializeToString(this.elementRef.nativeElement);
        const base64SVG = btoa(serializedSVG);
        this.renderer.setProperty(this.SVGImg, 'src', 'data:image/svg+xml;base64,' + base64SVG);
        this.renderer.setProperty(
            this.canvas,
            HTML_ATTRIBUTE.width,
            this.elementRef.nativeElement.getBoundingClientRect().width,
        );
        this.renderer.setProperty(
            this.canvas,
            HTML_ATTRIBUTE.height,
            this.elementRef.nativeElement.getBoundingClientRect().height,
        );
        this.context2D = this.canvas.getContext('2d') as CanvasRenderingContext2D;
        this.context2D.drawImage(this.SVGImg, 0, 0);
    }

    updateVerticalStrokePaths(x: number): void {
        const column: number[] = this.bfsHelper.strokeGrid.get(x)!.sort((a: number, b: number) => {
            return a < b ? -1 : 1;
        });

        let d = `M${x} ${column[0]}`;
        const lines = [];
        for (let y = 1; y < column.length; y++) {
            if (column[y] !== column[y - 1] + 1) {
                lines.push(d);
                d = `M${x} ${column[y]}`;
            } else {
                d += ` L${x} ${column[y]}`;
            }
        }
        lines.push(d);
        lines.forEach((element) => {
            if (element.includes('L')) {
                this.strokePaths.push(element);
            }
        });
    }

    appendBodyPaths(bodyWrap: SVGGElement, bodyPaths: string[]): void {
        bodyPaths.forEach((d) => {
            const path: SVGPathElement = this.renderer.createElement('path', SVG_NS);
            this.renderer.setAttribute(path, 'd', d);
            this.renderer.appendChild(bodyWrap, path);
        });
    }
    updateBodyPaths(bodyPaths: string[], fillStructure: FillStructure, i: number): void {
        bodyPaths[
            i
        ] += ` M${fillStructure.top.x} ${fillStructure.top.y} L${fillStructure.bottum.x} ${fillStructure.bottum.y}`;
    }

    appendStrokePaths(topStrokePaths: string[], bottumStrokePaths: string[]): void {
        this.strokePaths.push(...topStrokePaths);
        this.strokePaths.push(...bottumStrokePaths);
    }
    updateStrokePaths(
        fillStructure: FillStructure,
        x: number,
        i: number,
        topStrokePaths: string[],
        bottumStrokePaths: string[],
    ): void {
        const lastTop = this.segmentsToDraw.get(x - 1)![i].top;
        const lastBottum = this.segmentsToDraw.get(x - 1)![i].bottum;
        if (fillStructure.top.distanceTo(lastTop) > 5) {
            topStrokePaths[i] += ` M${fillStructure.top.x} ${fillStructure.top.y}`;
        } else {
            topStrokePaths[i] += ` L${fillStructure.top.x} ${fillStructure.top.y}`;
        }
        if (fillStructure.bottum.distanceTo(lastBottum) > 5) {
            bottumStrokePaths[i] += ` M${fillStructure.bottum.x} ${fillStructure.bottum.y}`;
        } else {
            bottumStrokePaths[i] += ` L${fillStructure.bottum.x} ${fillStructure.bottum.y}`;
        }
    }

    resetBodyAndStrokePaths(
        fillStructures: FillStructure[],
        bodyPaths: string[],
        topStrokePaths: string[],
        bottumStrokePaths: string[],
    ) {
        bodyPaths.length = 0;
        topStrokePaths.length = 0;
        bottumStrokePaths.length = 0;
        fillStructures.forEach((fillStructure: FillStructure) => {
            bodyPaths.push(
                `M${fillStructure.bottum.x} ${fillStructure.bottum.y} L${fillStructure.top.x} ${fillStructure.top.y}`,
            );

            topStrokePaths.push(`M${fillStructure.top.x} ${fillStructure.top.y}`);
            bottumStrokePaths.push(`M${fillStructure.bottum.x} ${fillStructure.bottum.y}`);
        });
    }

    fillBody(): SVGGElement {
        const bodyWrap: SVGGElement = this.renderer.createElement('g', SVG_NS);

        this.strokePaths = [];
        const bodyPaths: string[] = [];
        const topStrokePaths: string[] = [];
        const bottumStrokePaths: string[] = [];
        let lastFillStructuresLength = -1;
        for (let x = this.bfsHelper.mostLeft - 1; x <= this.bfsHelper.mostRight + 1; x++) {
            this.updateVerticalStrokePaths(x);

            if (this.segmentsToDraw.get(x) === undefined) {
                continue;
            }
            const fillStructures: FillStructure[] = this.segmentsToDraw.get(x)!;

            // if current column has a different structure than the last column
            if (fillStructures.length !== lastFillStructuresLength) {
                this.appendBodyPaths(bodyWrap, bodyPaths);
                this.appendStrokePaths(topStrokePaths, bottumStrokePaths);
                this.resetBodyAndStrokePaths(fillStructures, bodyPaths, topStrokePaths, bottumStrokePaths);
            } else {
                fillStructures.forEach((fillStructure: FillStructure, i: number) => {
                    this.updateBodyPaths(bodyPaths, fillStructure, i);
                    this.updateStrokePaths(fillStructure, x, i, topStrokePaths, bottumStrokePaths);
                });
            }
            lastFillStructuresLength = fillStructures.length;
        }
        this.strokePaths.push(...topStrokePaths);
        this.strokePaths.push(...bottumStrokePaths);

        this.appendBody(bodyPaths, bodyWrap);
        this.renderer.appendChild(this.svgWrap, bodyWrap);
        return bodyWrap.cloneNode(true) as SVGGElement;
    }

    appendBody(bodyPaths: string[], bodyWrap: SVGGElement) {
        bodyPaths.forEach((d) => {
            const path: SVGPathElement = this.renderer.createElement('path', SVG_NS);
            this.renderer.setAttribute(path, 'd', d);
            this.renderer.appendChild(bodyWrap, path);
        });
        this.renderer.setAttribute(bodyWrap, HTML_ATTRIBUTE.title, TOOL_NAME.Polygon);
        this.renderer.setAttribute(bodyWrap, HTML_ATTRIBUTE.stroke_width, FILL_STROKE_WIDTH);
        this.renderer.setAttribute(bodyWrap, HTML_ATTRIBUTE.stroke_linejoin, 'round');
        this.renderer.setAttribute(bodyWrap, 'stroke-linecap', 'round');
        this.renderer.setAttribute(bodyWrap, HTML_ATTRIBUTE.stroke, this.userFillColor);
        this.renderer.setAttribute(bodyWrap, HTML_ATTRIBUTE.fill, this.userFillColor);
    }

    fillStroke(bodyWrap: SVGGElement) {
        const id: string = Date.now().toString();
        this.appendMask(bodyWrap, id);
        this.appendStroke(id);
    }

    appendMask(bodyWrap: SVGGElement, id: string): void {
        const mask: SVGMaskElement = this.renderer.createElement('mask', SVG_NS);
        this.renderer.setAttribute(bodyWrap, HTML_ATTRIBUTE.stroke, 'white');
        this.renderer.setAttribute(bodyWrap, HTML_ATTRIBUTE.fill, 'white');
        this.renderer.setAttribute(mask, 'id', id);
        this.renderer.appendChild(mask, bodyWrap);
        this.renderer.appendChild(this.svgWrap, mask);
    }

    appendStroke(id: string): void {
        const strokeWrap: SVGGElement = this.renderer.createElement('g', SVG_NS);
        this.strokePaths.forEach((d) => {
            const path: SVGPathElement = this.renderer.createElement('path', SVG_NS);
            this.renderer.setAttribute(path, 'd', d);
            this.renderer.appendChild(strokeWrap, path);
        });

        this.renderer.setAttribute(strokeWrap, 'mask', `url(#${id})`);
        this.renderer.setAttribute(strokeWrap, HTML_ATTRIBUTE.title, TOOL_NAME.Polygon);
        this.renderer.setAttribute(strokeWrap, HTML_ATTRIBUTE.stroke_width, (this.userStrokeWidth * 2).toString());
        this.renderer.setAttribute(strokeWrap, HTML_ATTRIBUTE.stroke_linejoin, 'round');
        this.renderer.setAttribute(strokeWrap, 'stroke-linecap', 'round');
        this.renderer.setAttribute(strokeWrap, HTML_ATTRIBUTE.stroke, this.userStrokeColor);
        this.renderer.setAttribute(strokeWrap, HTML_ATTRIBUTE.fill, 'none');
        this.renderer.appendChild(this.svgWrap, strokeWrap);
    }

    createSVGWrapper(): void {
        const wrap: SVGGElement = this.renderer.createElement('g', SVG_NS);
        this.renderer.setAttribute(wrap, HTML_ATTRIBUTE.title, TOOL_NAME.Fill);
        this.svgWrap = wrap;
    }

    updateTraceType(traceType: TRACE_TYPE) {
        this.traceType = traceType;
        switch (traceType) {
            case TRACE_TYPE.Outline: {
                this.userFillColor = 'none';
                this.userStrokeColor = '#' + this.strokeColor;
                this.userStrokeWidth = this.strokeWidth;
                break;
            }
            case TRACE_TYPE.Full: {
                this.userFillColor = '#' + this.fillColor;
                this.userStrokeColor = 'none';
                this.userStrokeWidth = 0;
                break;
            }
            case TRACE_TYPE.Both: {
                this.userFillColor = '#' + this.fillColor;
                this.userStrokeColor = '#' + this.strokeColor;
                this.userStrokeWidth = this.strokeWidth;
                break;
            }
        }
    }

    // tslint:disable-next-line: no-empty
    onMouseMove(event: MouseEvent): void {}
    // tslint:disable-next-line: no-empty
    onMouseEnter(event: MouseEvent): void {}
    // tslint:disable-next-line: no-empty
    onMouseLeave(event: MouseEvent): void {}
    // tslint:disable-next-line: no-empty
    onKeyDown(event: KeyboardEvent): void {}
    // tslint:disable-next-line: no-empty
    onKeyUp(event: KeyboardEvent): void {}
    // tslint:disable-next-line: no-empty
    cleanUp(): void {}
}
