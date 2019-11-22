import { ElementRef, Injectable, Renderer2 } from '@angular/core';

import { Coords2D } from 'src/classes/Coords2D';
import { FillStructure } from 'src/classes/FillStructure';
import { SVG_NS } from 'src/constants/constants';
import {
    FILL_STROKE_WIDTH,
    HTML_ATTRIBUTE,
    MAX_NORMAL_LENGTH,
    TOOL_NAME,
    TRACE_TYPE,
} from 'src/constants/tool-constants';
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
    attributesManagerService: AttributesManagerService;
    canvas: HTMLCanvasElement;
    context2D: CanvasRenderingContext2D;
    SVGImg: HTMLImageElement;

    elementRef: ElementRef<SVGElement>;
    renderer: Renderer2;
    drawStack: DrawStackService;

    bfsHelper: BFSHelper;
    currentMouseCoords: Coords2D = new Coords2D(0, 0);
    segmentsToDraw: Map<number, FillStructure[]>;
    strokePaths: string[];
    svgWrap: SVGGElement;

    traceType = TRACE_TYPE.Full;
    strokeWidth: number;
    strokeColor: string;
    fillColor: string;
    mouseDown: boolean;

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
        this.updateCanvas();
        this.updateMousePosition(event);

        this.createBFSHelper();
        this.bfsHelper.computeBFS(this.currentMouseCoords);

        this.fill();

        this.drawStack.push(this.svgWrap);
        this.mouseDown = false;
    }

    createBFSHelper(): void {
        this.bfsHelper = new BFSHelper(
            this.canvas.width,
            this.canvas.height,
            this.context2D,
            this.attributesManagerService,
        );
    }

    updateMousePosition(event: MouseEvent): void {
        this.currentMouseCoords.x = event.clientX - this.elementRef.nativeElement.getBoundingClientRect().left;
        this.currentMouseCoords.y = event.clientY - this.elementRef.nativeElement.getBoundingClientRect().top;
    }

    fill(): void {
        this.createSVGWrapper();
        // switch (this.traceType) {
        //     case TRACE_TYPE.Outline: {
        //         const bodyWrap: SVGGElement = this.fillBody();
        //         this.renderer.removeChild(this.svgWrap, bodyWrap);
        //         this.fillStroke(bodyWrap);
        //         break;
        //     }
        //     case TRACE_TYPE.Full: {
        //         this.fillBody();
        //         break;
        //     }
        //     case TRACE_TYPE.Both: {
        //         const bodyWrap: SVGGElement = this.fillBody();
        //         this.fillStroke(bodyWrap);
        //         break;
        //     }
        // }

        const path: SVGPathElement = this.renderer.createElement('path', SVG_NS);
        let d = '';
        let lasPixel: Coords2D = this.bfsHelper.pathsToFill[0][0];
        this.bfsHelper.pathsToFill.forEach((el) => {
            el.forEach((pixel: Coords2D, i: number) => {
                if (i === 0 || this.isTooFar(lasPixel, pixel)) {
                    d += ` M${pixel.x + 0.5} ${pixel.y + 0.5}`;
                } else {
                    d += ` L${pixel.x + 0.5} ${pixel.y + 0.5}`;
                }
                lasPixel = pixel;
            });
            d += ' z';
        });
        this.renderer.setAttribute(path, HTML_ATTRIBUTE.stroke, 'red');
        this.renderer.setAttribute(path, 'd', d);
        // this.renderer.setAttribute(path, 'fill', 'none');
        this.renderer.setAttribute(path, 'fill-rule', 'evenodd');
        this.renderer.appendChild(this.svgWrap, path);

        this.renderer.appendChild(this.elementRef.nativeElement, this.svgWrap);
    }

    isTooFar(a: Coords2D, b: Coords2D): boolean {
        return Math.abs(a.x - b.x) + Math.abs(a.y - b.y) > 50;
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

    createSVGWrapper(): void {
        const wrap: SVGGElement = this.renderer.createElement('g', SVG_NS);
        this.renderer.setAttribute(wrap, HTML_ATTRIBUTE.title, TOOL_NAME.Fill);
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
