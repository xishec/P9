import { ElementRef, Injectable, Renderer2 } from '@angular/core';

import { Coords2D } from 'src/classes/Coords2D';
import { SVG_NS } from 'src/constants/constants';
import { HTML_ATTRIBUTE, TOOL_NAME, TRACE_TYPE } from 'src/constants/tool-constants';
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
    private attributesManagerService: AttributesManagerService;
    private canvas: HTMLCanvasElement;
    private context2D: CanvasRenderingContext2D;
    private SVGImg: HTMLImageElement;

    private elementRef: ElementRef<SVGElement>;
    private renderer: Renderer2;
    private drawStack: DrawStackService;

    private bfsHelper: BFSHelper;
    private currentMouseCoords: Coords2D = new Coords2D(0, 0);
    private svgWrap: SVGGElement;

    private traceType = TRACE_TYPE.Full;
    private strokeWidth: number;
    private strokeColor: string;
    private fillColor: string;
    private mouseDown: boolean;

    constructor(private modalManagerService: ModalManagerService, private colorToolService: ColorToolService) {
        super();
        this.colorToolService.primaryColor.subscribe((fillColor: string) => {
            this.fillColor = '#' + fillColor;
        });
        this.colorToolService.secondaryColor.subscribe((strokeColor: string) => {
            this.strokeColor = '#' + strokeColor;
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
        });
        this.attributesManagerService.traceType.subscribe((traceType: TRACE_TYPE) => {
            this.traceType = traceType;
        });
    }

    private shouldNotFill(event: MouseEvent): boolean {
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
        this.updateCanvas();
        this.updateMousePosition(event);

        this.createBFSHelper();
        this.bfsHelper.computeBFS(this.currentMouseCoords);

        this.fill();

        this.drawStack.push(this.svgWrap);
        this.mouseDown = false;
    }

    private createBFSHelper(): void {
        this.bfsHelper = new BFSHelper(
            this.canvas.width,
            this.canvas.height,
            this.context2D,
            this.attributesManagerService,
        );
    }

    private updateMousePosition(event: MouseEvent): void {
        this.currentMouseCoords.x = event.clientX - this.elementRef.nativeElement.getBoundingClientRect().left;
        this.currentMouseCoords.y = event.clientY - this.elementRef.nativeElement.getBoundingClientRect().top;
    }

    private fill(): void {
        this.createSVGWrapper();
        const d: string = this.createFillPath();

        switch (this.traceType) {
            case TRACE_TYPE.Outline: {
                const bodyWrap: SVGGElement = this.fillBody(d);
                this.renderer.setAttribute(bodyWrap, HTML_ATTRIBUTE.Fill, 'none');
                this.renderer.setAttribute(bodyWrap, HTML_ATTRIBUTE.Stroke, 'none');
                this.renderer.setAttribute(bodyWrap, HTML_ATTRIBUTE.Title, '');
                this.fillStroke(d, bodyWrap);
                break;
            }
            case TRACE_TYPE.Full: {
                this.fillBody(d);
                break;
            }
            case TRACE_TYPE.Both: {
                const bodyWrap: SVGGElement = this.fillBody(d);
                this.fillStroke(d, bodyWrap);
                break;
            }
        }

        this.renderer.appendChild(this.elementRef.nativeElement, this.svgWrap);
    }

    private fillBody(d: string): SVGGElement {
        const bodyWrap: SVGGElement = this.renderer.createElement('g', SVG_NS);
        this.renderer.setAttribute(bodyWrap, HTML_ATTRIBUTE.Fill, this.fillColor);
        this.renderer.setAttribute(bodyWrap, HTML_ATTRIBUTE.Stroke, this.fillColor);
        this.renderer.setAttribute(bodyWrap, HTML_ATTRIBUTE.StrokeWidth, '1');
        this.renderer.setAttribute(bodyWrap, HTML_ATTRIBUTE.Title, 'body');

        const path: SVGPathElement = this.renderer.createElement('path', SVG_NS);
        this.renderer.setAttribute(path, 'd', d);
        this.renderer.setAttribute(path, 'fill-rule', 'evenodd');
        this.renderer.setAttribute(path, HTML_ATTRIBUTE.StrokeLinejoin, 'round');
        this.renderer.setAttribute(path, HTML_ATTRIBUTE.StrokeLinecap, 'round');

        this.renderer.appendChild(bodyWrap, path);
        this.renderer.appendChild(this.svgWrap, bodyWrap);
        return bodyWrap;
    }
    private fillStroke(d: string, bodyWrap: SVGGElement): void {
        const id: string = Date.now().toString();
        this.appendMask(d, bodyWrap.cloneNode(true) as SVGGElement, id);

        const strokeWrap: SVGGElement = this.renderer.createElement('g', SVG_NS);
        this.renderer.setAttribute(strokeWrap, 'mask', `url(#${id})`);
        this.renderer.setAttribute(strokeWrap, HTML_ATTRIBUTE.Title, 'stroke');
        this.renderer.setAttribute(strokeWrap, HTML_ATTRIBUTE.Fill, 'none');
        this.renderer.setAttribute(strokeWrap, HTML_ATTRIBUTE.Stroke, this.strokeColor);
        this.renderer.setAttribute(strokeWrap, HTML_ATTRIBUTE.StrokeWidth, (this.strokeWidth * 2).toString());

        const path: SVGPathElement = this.renderer.createElement('path', SVG_NS);
        this.renderer.setAttribute(path, 'd', d);
        this.renderer.setAttribute(path, 'fill-rule', 'evenodd');
        this.renderer.setAttribute(path, HTML_ATTRIBUTE.StrokeLinejoin, 'round');
        this.renderer.setAttribute(path, HTML_ATTRIBUTE.StrokeLinecap, 'round');

        this.renderer.appendChild(strokeWrap, path);
        this.renderer.appendChild(this.svgWrap, strokeWrap);
    }
    private appendMask(d: string, bodyWrap: SVGGElement, id: string): void {
        const mask: SVGMaskElement = this.renderer.createElement('mask', SVG_NS);
        this.renderer.setAttribute(bodyWrap, HTML_ATTRIBUTE.Stroke, 'white');
        this.renderer.setAttribute(bodyWrap, HTML_ATTRIBUTE.Fill, 'white');
        this.renderer.setAttribute(mask, 'id', id);
        this.renderer.appendChild(mask, bodyWrap);
        this.renderer.appendChild(this.svgWrap, mask);
    }

    private createFillPath(): string {
        let d = '';
        this.bfsHelper.pathsToFill.forEach((el) => {
            el.forEach((pixel: Coords2D, i: number) => {
                d += i === 0 ? ` M${pixel.x + 0.5} ${pixel.y + 0.5}` : ` L${pixel.x + 0.5} ${pixel.y + 0.5}`;
            });
            d += ' z';
        });
        return d;
    }

    private updateCanvas(): void {
        const serializedSVG = new XMLSerializer().serializeToString(this.elementRef.nativeElement);
        this.renderer.setProperty(this.SVGImg, 'src', 'data:image/svg+xml,' + encodeURIComponent(serializedSVG));
        this.renderer.setProperty(
            this.canvas,
            HTML_ATTRIBUTE.Width,
            this.elementRef.nativeElement.getBoundingClientRect().width,
        );
        this.renderer.setProperty(
            this.canvas,
            HTML_ATTRIBUTE.Height,
            this.elementRef.nativeElement.getBoundingClientRect().height,
        );
        this.context2D = this.canvas.getContext('2d') as CanvasRenderingContext2D;
        this.context2D.drawImage(this.SVGImg, 0, 0);
    }

    private createSVGWrapper(): void {
        const wrap: SVGGElement = this.renderer.createElement('g', SVG_NS);
        this.renderer.setAttribute(wrap, HTML_ATTRIBUTE.Title, TOOL_NAME.Fill);
        this.svgWrap = wrap;
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
