import { ElementRef, Injectable, Renderer2 } from '@angular/core';

import { Coords2D } from 'src/classes/Coords2D';
import { DrawStackService } from '../../draw-stack/draw-stack.service';
import { AbstractToolService } from '../abstract-tools/abstract-tool.service';
import { BFSHelper } from '../../../../classes/BFSHelper';
import { HTML_ATTRIBUTE, TOOL_NAME } from 'src/constants/tool-constants';
import { SVG_NS } from 'src/constants/constants';
import { ModalManagerService } from '../../modal-manager/modal-manager.service';

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
        console.log(this.bfsHelper.toFill);
        console.log(this.bfsHelper.stokes);
        this.createSVGWrapper();
        let hi = '';
        this.bfsHelper.stokes.forEach((pixel: Coords2D) => {
            this.renderer.appendChild(this.svgWrap, this.createSVGDot(pixel.x, pixel.y));
            hi += `${pixel.x},${pixel.y} `;
        });
        console.log(hi);
        this.renderer.appendChild(this.elementRef.nativeElement, this.svgWrap);
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
        this.renderer.setAttribute(circle, 'r', '1');
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
