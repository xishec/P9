import { ElementRef, Injectable, Renderer2 } from '@angular/core';

import { Coords2D } from 'src/classes/Coords2D';
import { DrawStackService } from '../../draw-stack/draw-stack.service';
import { AbstractToolService } from '../abstract-tools/abstract-tool.service';
import { BFSHelper } from '../../../../classes/BFSHelper';
import {
    HTML_ATTRIBUTE,
    TOOL_NAME,
    TRACE_TYPE,
    FILL_PIXEL_SHIFT,
    FILL_STROKE_WIDTH,
} from 'src/constants/tool-constants';
import { SVG_NS } from 'src/constants/constants';
import { ModalManagerService } from '../../modal-manager/modal-manager.service';
import { FillStructure } from 'src/classes/FillStructure';
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
    dsStrokes: Array<string>;

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

    onMouseDown(event: MouseEvent): void {
        this.updateCanvas();
    }
    onMouseUp(event: MouseEvent): void {
        if (this.modalManagerService.modalIsDisplayed.value) {
            return;
        }
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
        this.bfsHelper.bodyGrid.forEach((el) => {
            el.sort((a: number, b: number) => {
                return a < b ? -1 : 1;
            });
        });
        console.timeEnd('bfs');

        // this.expandPixels();
        let segmentsToDraw: Map<number, Array<FillStructure>> = this.divideLinesToSegments();
        // this.groupSegmentsToRectangle(segmentsToDraw);
        console.time('fill');
        this.fill(segmentsToDraw);
        console.timeEnd('fill');
    }

    expandPixels(): void {
        this.bfsHelper.bodyGrid.forEach((column: number[], key: number) => {
            let top: number = column[column.length - 1] + 1;
            let buttom: number = column[0] - 1;

            if (top <= this.canvas.height) {
                column.push(top);
            }
            if (buttom >= 0) {
                column.unshift(buttom);
            }
        });
    }

    updateMousePosition(event: MouseEvent): void {
        this.currentMouseCoords.x = event.clientX - this.elementRef.nativeElement.getBoundingClientRect().left;
        this.currentMouseCoords.y = event.clientY - this.elementRef.nativeElement.getBoundingClientRect().top;
    }

    fill(segmentsToDraw: Map<number, Array<FillStructure>>) {
        this.createSVGWrapper();
        let bodyWrap: SVGGElement = this.fillBody(segmentsToDraw);
        this.fillStroke(bodyWrap);
        this.renderer.appendChild(this.elementRef.nativeElement, this.svgWrap);
    }

    // groupSegmentsToRectangle(segmentsToDraw: Array<FillStructure>) {
    //     segmentsToDraw.sort((a, b) => {
    //         return a.leftBottum.y < b.leftBottum.y ? -1 : 0;
    //     });
    //     for (let i = 1; i < segmentsToDraw.length; i++) {
    //         const thisFillStructure: FillStructure = segmentsToDraw[i];
    //         const lastFillStructure: FillStructure = segmentsToDraw[i - 1];
    //         if (this.canBeGroupedToRectangle(thisFillStructure, lastFillStructure)) {
    //             if (lastFillStructure.leftTop.x < thisFillStructure.leftBottum.x) {
    //                 lastFillStructure.rightBottum = thisFillStructure.leftBottum;
    //                 lastFillStructure.rightTop = thisFillStructure.leftTop;
    //             } else {
    //                 lastFillStructure.leftBottum = thisFillStructure.rightBottum;
    //                 lastFillStructure.leftTop = thisFillStructure.rightTop;
    //             }
    //             segmentsToDraw.splice(i, 1);
    //             i--;
    //         }
    //     }
    // }

    // canBeGroupedToRectangle(thisFillStructure: FillStructure, lastFillStructure: FillStructure): boolean {
    //     return (
    //         thisFillStructure.leftBottum.y === lastFillStructure.leftBottum.y &&
    //         thisFillStructure.leftTop.y === lastFillStructure.leftTop.y &&
    //         Math.abs(thisFillStructure.leftTop.x - lastFillStructure.leftTop.x) === 1
    //     );
    // }

    divideLinesToSegments() {
        let segmentsToDraw: Map<number, Array<FillStructure>> = new Map([]);

        this.bfsHelper.bodyGrid.forEach((column, x) => {
            let fillStructure = new FillStructure();
            fillStructure.bottum = new Coords2D(x, column[0]);
            for (let y = 1; y < column.length; y++) {
                if (column[y] !== column[y - 1] + 1) {
                    fillStructure.top = new Coords2D(x, column[y - 1]);
                    this.addToMap(x, fillStructure, segmentsToDraw);
                    fillStructure = new FillStructure();
                    fillStructure.bottum = new Coords2D(x, column[y]);
                }
            }
            fillStructure.top = new Coords2D(x, column[column.length - 1]);
            this.addToMap(x, fillStructure, segmentsToDraw);
        });

        return segmentsToDraw;
    }

    addToMap(x: number, fillStructure: FillStructure, map: Map<number, Array<FillStructure>>): void {
        if (map.has(x)) {
            map.get(x)!.push(fillStructure);
        } else {
            map.set(x, [fillStructure]);
        }
    }

    // getPointsPosition(fillStructure: FillStructure): string {
    //     return `${fillStructure.leftBottum.x + FILL_PIXEL_SHIFT},${fillStructure.leftBottum.y +
    //         FILL_PIXEL_SHIFT} ${fillStructure.leftTop.x + FILL_PIXEL_SHIFT},${fillStructure.leftTop.y +
    //         FILL_PIXEL_SHIFT} ${fillStructure.rightTop.x + FILL_PIXEL_SHIFT},${fillStructure.rightTop.y +
    //         FILL_PIXEL_SHIFT} ${fillStructure.rightBottum.x + FILL_PIXEL_SHIFT},${fillStructure.rightBottum.y +
    //         FILL_PIXEL_SHIFT}`;
    // }

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

    fillBody(segmentsToDraw: Map<number, Array<FillStructure>>): SVGGElement {
        const bodyWrap: SVGGElement = this.renderer.createElement('g', SVG_NS);

        // console.log(segmentsToDraw);
        let ds: Array<string> = [];
        this.dsStrokes = [];
        let dsStrokeTop: Array<string> = [];
        let dsStrokeBottum: Array<string> = [];
        let lastFillStructuresLength = -1;
        for (let x = this.bfsHelper.mostLeft; x <= this.bfsHelper.mostRight; x++) {
            const fillStructures: Array<FillStructure> = segmentsToDraw.get(x)!;

            // console.log(fillStructures.length, lastFillStructuresLength);
            if (fillStructures.length !== lastFillStructuresLength) {
                ds.forEach((d) => {
                    let path: SVGPathElement = this.renderer.createElement('path', SVG_NS);
                    this.renderer.setAttribute(path, 'd', d);
                    this.renderer.appendChild(bodyWrap, path);
                });
                ds = [];
                this.dsStrokes.push(...dsStrokeTop);
                this.dsStrokes.push(...dsStrokeBottum);
                dsStrokeTop = [];
                dsStrokeBottum = [];

                fillStructures.forEach((fillStructure: FillStructure) => {
                    // console.log(fillStructure);
                    ds.push(
                        `M${fillStructure.bottum.x} ${fillStructure.bottum.y} L${fillStructure.top.x} ${fillStructure.top.y}`,
                    );
                    dsStrokeTop.push(`M${fillStructure.top.x} ${fillStructure.top.y}`);
                    dsStrokeBottum.push(`M${fillStructure.bottum.x} ${fillStructure.bottum.y}`);
                });
            } else {
                fillStructures.forEach((fillStructure: FillStructure, i: number) => {
                    ds[
                        i
                    ] += ` L${fillStructure.bottum.x} ${fillStructure.bottum.y} L${fillStructure.top.x} ${fillStructure.top.y}`;

                    let lastTop = segmentsToDraw.get(x - 1)![i].top;
                    let lastBottum = segmentsToDraw.get(x - 1)![i].bottum;
                    if (fillStructure.top.distanceTo(lastTop) > 5) {
                        dsStrokeTop[i] += ` M${fillStructure.top.x} ${fillStructure.top.y}`;
                    } else {
                        dsStrokeTop[i] += ` L${fillStructure.top.x} ${fillStructure.top.y}`;
                    }
                    if (fillStructure.bottum.distanceTo(lastBottum) > 5) {
                        dsStrokeBottum[i] += ` M${fillStructure.bottum.x} ${fillStructure.bottum.y}`;
                    } else {
                        dsStrokeBottum[i] += ` L${fillStructure.bottum.x} ${fillStructure.bottum.y}`;
                    }
                });
            }
            lastFillStructuresLength = fillStructures.length;
        }

        this.dsStrokes.push(...dsStrokeTop);
        this.dsStrokes.push(...dsStrokeBottum);

        ds.forEach((d) => {
            let path: SVGPathElement = this.renderer.createElement('path', SVG_NS);
            this.renderer.setAttribute(path, 'd', d);
            this.renderer.appendChild(bodyWrap, path);
        });

        this.renderer.setAttribute(bodyWrap, HTML_ATTRIBUTE.title, TOOL_NAME.Polygon);
        this.renderer.setAttribute(bodyWrap, HTML_ATTRIBUTE.stroke_width, FILL_STROKE_WIDTH);
        this.renderer.setAttribute(bodyWrap, HTML_ATTRIBUTE.stroke_linejoin, 'round');
        this.renderer.setAttribute(bodyWrap, 'stroke-linecap', 'round');
        this.renderer.setAttribute(bodyWrap, HTML_ATTRIBUTE.stroke, this.userFillColor);
        this.renderer.setAttribute(bodyWrap, HTML_ATTRIBUTE.fill, this.userFillColor);
        this.renderer.appendChild(this.svgWrap, bodyWrap);

        return bodyWrap.cloneNode(true) as SVGGElement;
    }

    fillStroke(bodyWrap: SVGGElement) {
        const strokeWrap: SVGGElement = this.renderer.createElement('g', SVG_NS);

        const mask: SVGMaskElement = this.renderer.createElement('mask', SVG_NS);
        let id: string = Date.now().toString();
        this.renderer.setAttribute(bodyWrap, HTML_ATTRIBUTE.stroke, 'white');
        this.renderer.setAttribute(bodyWrap, HTML_ATTRIBUTE.fill, 'white');
        this.renderer.setAttribute(mask, 'id', id);
        this.renderer.appendChild(mask, bodyWrap);
        this.renderer.appendChild(this.svgWrap, mask);

        this.dsStrokes.forEach((d) => {
            let path: SVGPathElement = this.renderer.createElement('path', SVG_NS);
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

    createSVGDot(x: number, y: number): SVGCircleElement {
        const circle: SVGCircleElement = this.renderer.createElement('circle', SVG_NS);
        this.renderer.setAttribute(circle, HTML_ATTRIBUTE.stroke, 'none');
        this.renderer.setAttribute(circle, HTML_ATTRIBUTE.cx, (x + FILL_PIXEL_SHIFT).toString());
        this.renderer.setAttribute(circle, HTML_ATTRIBUTE.cy, (y + FILL_PIXEL_SHIFT).toString());
        this.renderer.setAttribute(circle, HTML_ATTRIBUTE.fill, this.userStrokeColor);
        this.renderer.setAttribute(circle, 'r', this.userStrokeWidth.toString());
        return circle;
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
