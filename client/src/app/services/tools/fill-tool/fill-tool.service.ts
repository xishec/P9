import { ElementRef, Injectable, Renderer2 } from '@angular/core';

import { Coords2D } from 'src/classes/Coords2D';
import { DrawStackService } from '../../draw-stack/draw-stack.service';
import { AbstractToolService } from '../abstract-tools/abstract-tool.service';
import { BFSHelper } from '../../../../classes/BFSHelper';
import { HTML_ATTRIBUTE, TOOL_NAME } from 'src/constants/tool-constants';
import { SVG_NS } from 'src/constants/constants';
import { ModalManagerService } from '../../modal-manager/modal-manager.service';
import { FillStructure } from 'src/classes/FillStructure';

@Injectable({
    providedIn: 'root',
})
export class FillToolService extends AbstractToolService {
    svg: SVGElement;
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

    constructor(private modalManagerService: ModalManagerService) {
        super();
    }

    initializeService(elementRef: ElementRef<SVGElement>, renderer: Renderer2, drawStack: DrawStackService) {
        this.elementRef = elementRef;
        this.renderer = renderer;
        this.drawStack = drawStack;

        this.canvas = this.renderer.createElement('canvas');
        this.SVGImg = this.renderer.createElement('img');
        this.context2D = this.canvas.getContext('2d') as CanvasRenderingContext2D;
    }

    onMouseDown(event: MouseEvent): void {
        this.updateSVGCopy();
    }
    onMouseUp(event: MouseEvent): void {
        if (this.modalManagerService.modalIsDisplayed.value) {
            return;
        }
        this.updateSVGCopy();
        this.currentMouseCoords.x = event.clientX - this.elementRef.nativeElement.getBoundingClientRect().left;
        this.currentMouseCoords.y = event.clientY - this.elementRef.nativeElement.getBoundingClientRect().top;
        this.bfsHelper = new BFSHelper(this.canvas.width, this.canvas.height, this.context2D);
        this.bfsHelper.computeBFS(this.currentMouseCoords);
        this.coloration();
    }

    coloration() {
        let columns: Array<FillStructure> = [];

        // seperation
        this.bfsHelper.toFill.forEach((column, x) => {
            let fillStructure = new FillStructure();
            fillStructure.leftBottum = new Coords2D(x, column[0]);
            fillStructure.rightBottum = new Coords2D(x, column[0]);
            for (let y = 1; y < column.length; y++) {
                if (column[y] !== column[y - 1] + 1) {
                    fillStructure.leftTop = new Coords2D(x, column[y - 1]);
                    fillStructure.rightTop = new Coords2D(x, column[y - 1]);
                    columns.push(fillStructure);
                    fillStructure = new FillStructure();
                    fillStructure.leftBottum = new Coords2D(x, column[y]);
                    fillStructure.rightBottum = new Coords2D(x, column[y]);
                }
            }
            fillStructure.leftTop = new Coords2D(x, column[column.length - 1]);
            fillStructure.rightTop = new Coords2D(x, column[column.length - 1]);
            columns.push(fillStructure);
        });

        // console.log(columns[0], columns[columns.length - 1]);

        // optimisation
        columns.sort((a, b) => {
            return a.leftBottum.y < b.leftBottum.y ? -1 : 0;
        });
        for (let i = 1; i < columns.length; i++) {
            const thisfillStructure = columns[i];
            const lastfillStructure = columns[i - 1];
            if (
                thisfillStructure.leftBottum.y === lastfillStructure.leftBottum.y &&
                thisfillStructure.leftTop.y === lastfillStructure.leftTop.y &&
                Math.abs(thisfillStructure.leftTop.x - lastfillStructure.leftTop.x) === 1
            ) {
                if (lastfillStructure.leftTop.x < thisfillStructure.leftBottum.x) {
                    lastfillStructure.rightBottum = thisfillStructure.leftBottum;
                    lastfillStructure.rightTop = thisfillStructure.leftTop;
                } else {
                    lastfillStructure.leftBottum = thisfillStructure.rightBottum;
                    lastfillStructure.leftTop = thisfillStructure.rightTop;
                }

                columns.splice(i, 1);
                i--;
            }
        }

        // console.log(columns);

        // coloration
        this.createSVGWrapper();

        columns.forEach((fillStructure: FillStructure) => {
            const el: SVGGElement = this.renderer.createElement('g', SVG_NS);
            const drawPolygon: SVGPolygonElement = this.renderer.createElement('polygon', SVG_NS);
            this.renderer.setAttribute(drawPolygon, HTML_ATTRIBUTE.points, this.getPoints(fillStructure));
            this.renderer.setAttribute(el, HTML_ATTRIBUTE.title, TOOL_NAME.Polygon);
            this.renderer.setAttribute(el, HTML_ATTRIBUTE.stroke_width, '1');
            this.renderer.setAttribute(el, HTML_ATTRIBUTE.stroke_linejoin, 'round');
            this.renderer.setAttribute(el, HTML_ATTRIBUTE.stroke, '#' + '32a852');
            // this.userFillColor === 'none'
            //     ? this.renderer.setAttribute(el, HTML_ATTRIBUTE.fill, this.userFillColor)
            //     : this.renderer.setAttribute(el, HTML_ATTRIBUTE.fill, '#' + this.userFillColor);

            this.renderer.appendChild(el, drawPolygon);
            this.renderer.appendChild(this.svgWrap, el);
        });

        this.bfsHelper.stokes.forEach((element) => {
            this.renderer.appendChild(this.svgWrap, this.createSVGDot(element.x, element.y));
        });

        this.renderer.appendChild(this.elementRef.nativeElement, this.svgWrap);
    }

    getPoints(fillStructure: FillStructure): string {
        return `${fillStructure.leftBottum.x},${fillStructure.leftBottum.y} ${fillStructure.leftTop.x},${fillStructure.leftTop.y} ${fillStructure.rightTop.x},${fillStructure.rightTop.y} ${fillStructure.rightBottum.x},${fillStructure.rightBottum.y}`;
    }

    updateSVGCopy(): void {
        const serializedSVG = new XMLSerializer().serializeToString(this.elementRef.nativeElement);
        const base64SVG = btoa(serializedSVG);
        this.renderer.setProperty(this.SVGImg, 'src', 'data:image/svg+xml;base64,' + base64SVG);
        this.renderer.setProperty(this.canvas, 'width', this.elementRef.nativeElement.getBoundingClientRect().width);
        this.renderer.setProperty(this.canvas, 'height', this.elementRef.nativeElement.getBoundingClientRect().height);
        this.context2D = this.canvas.getContext('2d') as CanvasRenderingContext2D;
        this.context2D.drawImage(this.SVGImg, 0, 0);
    }

    createSVGWrapper(): void {
        const wrap: SVGGElement = this.renderer.createElement('g', SVG_NS);
        this.renderer.setAttribute(wrap, HTML_ATTRIBUTE.stroke, '#' + '32a852');
        this.renderer.setAttribute(wrap, HTML_ATTRIBUTE.opacity, '1');
        this.renderer.setAttribute(wrap, HTML_ATTRIBUTE.fill, '#' + '32a852');
        this.renderer.setAttribute(wrap, HTML_ATTRIBUTE.title, TOOL_NAME.Pen);
        this.svgWrap = wrap;
    }

    createSVGDot(x: number, y: number): SVGCircleElement {
        const circle: SVGCircleElement = this.renderer.createElement('circle', SVG_NS);
        this.renderer.setAttribute(circle, HTML_ATTRIBUTE.stroke, 'none');
        this.renderer.setAttribute(circle, HTML_ATTRIBUTE.cx, x.toString());
        this.renderer.setAttribute(circle, HTML_ATTRIBUTE.cy, y.toString());
        this.renderer.setAttribute(circle, 'r', '2');
        return circle;
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
