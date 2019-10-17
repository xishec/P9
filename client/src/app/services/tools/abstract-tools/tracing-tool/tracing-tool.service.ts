import { ElementRef, Injectable, Renderer2 } from '@angular/core';

import { DrawStackService } from 'src/app/services/draw-stack/draw-stack.service';
import { Mouse, SVG_NS } from 'src/constants/constants';
import { AttributesManagerService } from '../../attributes-manager/attributes-manager.service';
import { ColorToolService } from '../../color-tool/color-tool.service';
import { AbstractToolService } from '../abstract-tool.service';
import { ToolName } from 'src/constants/tool-constants';

@Injectable({
    providedIn: 'root',
})
export abstract class TracingToolService extends AbstractToolService {
    protected isDrawing = false;
    protected currentPath = '';
    protected currentWidth = 0;
    protected currentColor = '';
    protected svgPath: SVGPathElement = this.renderer.createElement('path', SVG_NS);
    protected svgWrap: SVGGElement = this.renderer.createElement('g', SVG_NS);
    protected svgPreviewCircle: SVGCircleElement = this.renderer.createElement('circle', SVG_NS);

    protected attributesManagerService: AttributesManagerService;
    protected colorToolService: ColorToolService;

    constructor(
        protected elementRef: ElementRef<SVGElement>,
        protected renderer: Renderer2,
        protected drawStack: DrawStackService,
    ) {
        super();
    }

    getIsDrawing = () => this.isDrawing;
    getCurrentPath = () => this.currentPath;

    initializeAttributesManagerService(attributesManagerService: AttributesManagerService) {
        this.attributesManagerService = attributesManagerService;
        this.attributesManagerService.currentThickness.subscribe((thickness) => {
            this.currentWidth = thickness;
        });
    }

    initializeColorToolService(colorToolService: ColorToolService) {
        this.colorToolService = colorToolService;
        this.colorToolService.primaryColor.subscribe((currentColor: string) => {
            this.currentColor = currentColor;
        });
    }

    getXPos = (clientX: number) => clientX - this.elementRef.nativeElement.getBoundingClientRect().left;
    getYPos = (clientY: number) => clientY - this.elementRef.nativeElement.getBoundingClientRect().top;

    onMouseDown(e: MouseEvent): void {
        if (e.button === Mouse.LeftButton) {
            this.isDrawing = true;
            this.createSVGWrapper();
            const x = this.getXPos(e.clientX);
            const y = this.getYPos(e.clientY);
            this.currentPath = `M${x} ${y}`;
            this.svgPreviewCircle = this.createSVGCircle(x, y);
            this.renderer.appendChild(this.elementRef.nativeElement, this.svgPreviewCircle);
            this.createSVGPath();
        }
    }

    onMouseMove(e: MouseEvent): void {
        if (e.button === Mouse.LeftButton && this.getIsDrawing()) {
            const x = this.getXPos(e.clientX);
            const y = this.getYPos(e.clientY);
            this.currentPath += ` L${x} ${y}`;
            this.updateSVGPath();
            this.renderer.removeChild(this.elementRef.nativeElement, this.svgPreviewCircle);
        }
    }

    onMouseUp(e: MouseEvent): void {
        if (e.button === Mouse.LeftButton && this.getIsDrawing()) {
            this.isDrawing = false;
            this.currentPath = '';
            this.drawStack.push(this.svgWrap);
        }
    }

    onMouseLeave(e: MouseEvent): void {
        this.onMouseUp(e);
    }

    // tslint:disable-next-line: no-empty
    onMouseEnter(event: MouseEvent): void {}
    // tslint:disable-next-line: no-empty
    onKeyDown(event: KeyboardEvent): void {}
    // tslint:disable-next-line: no-empty
    onKeyUp(event: KeyboardEvent): void {}

    createSVGWrapper(): void {
        const wrap: SVGGElement = this.renderer.createElement('g', SVG_NS);
        this.renderer.setAttribute(wrap, 'stroke', '#' + this.currentColor);
        this.renderer.setAttribute(wrap, 'fill', '#' + this.currentColor);
        this.renderer.setAttribute(wrap, 'title', ToolName.Pencil);
        this.svgWrap = wrap;
        this.renderer.appendChild(this.elementRef.nativeElement, wrap);
    }

    createSVGCircle(x: number, y: number): SVGCircleElement {
        const circle = this.renderer.createElement('circle', SVG_NS);
        this.renderer.setAttribute(circle, 'fill', '#' + this.currentColor);
        this.renderer.setAttribute(circle, 'stroke', 'none');
        this.renderer.setAttribute(circle, 'cx', x.toString());
        this.renderer.setAttribute(circle, 'cy', y.toString());
        this.renderer.setAttribute(circle, 'r', (this.currentWidth / 2).toString());
        return circle;
    }

    createSVGPath(): void {
        this.svgPath = this.renderer.createElement('path', SVG_NS);
        this.renderer.setAttribute(this.svgPath, 'fill', 'none');
        this.renderer.setAttribute(this.svgPath, 'stroke-width', this.currentWidth.toString());
        this.renderer.setAttribute(this.svgPath, 'stroke-linejoin', 'round');
        this.renderer.setAttribute(this.svgPath, 'stroke-linecap', 'round');
        this.renderer.appendChild(this.svgWrap, this.svgPath);
    }

    updatePreviewCircle(x: number, y: number): void {
        this.renderer.setAttribute(this.svgPreviewCircle, 'cx', x.toString());
        this.renderer.setAttribute(this.svgPreviewCircle, 'cy', y.toString());
    }

    updateSVGPath(): void {
        this.renderer.setAttribute(this.svgPath, 'd', this.currentPath);
    }
}
