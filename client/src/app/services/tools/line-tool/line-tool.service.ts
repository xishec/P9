import { ElementRef, Injectable, Renderer2 } from '@angular/core';

import { Mouse, SVG_NS, Keys } from 'src/constants/constants';
import { DrawStackService } from '../../draw-stack/draw-stack.service';
import { AbstractToolService } from '../abstract-tools/abstract-tool.service';
import { AttributesManagerService } from '../attributes-manager/attributes-manager.service';
import { ColorToolService } from '../color-tool/color-tool.service';

@Injectable({
  providedIn: 'root',
})
export class LineToolService extends AbstractToolService {
    colorToolService: ColorToolService;
    currentColor = '';
    currentWidth = 0;
    isDrawing = false;

    startLineCoordinates: [number, number] = [0,0]
    linePoints = '';
    endPreviewLine = '';
    shouldCloseLine = false;

    // elementRef: ElementRef<SVGElement>;
    // renderer: Renderer2;
    // drawStack: DrawStackService;
    gWrap: SVGGElement;
    currentLine: SVGLineElement;

    attributesManagerService: AttributesManagerService;

    // tslint:disable-next-line: no-empty
    constructor(private elementRef: ElementRef<SVGElement>, private renderer: Renderer2, private drawStack: DrawStackService) {
        super();
        // this.elementRef = elementRef;
        // this.renderer = renderer;
        // this.drawStack = drawStack;
    }

    getXPos = (clientX: number) => clientX - this.elementRef.nativeElement.getBoundingClientRect().left;
    getYPos = (clientY: number) => clientY - this.elementRef.nativeElement.getBoundingClientRect().top;

    initializeColorToolService(colorToolService: ColorToolService) {
        this.colorToolService = colorToolService;
        this.colorToolService.primaryColor.subscribe((currentColor: string) => {
            this.currentColor = currentColor;
        });
    }

    initializeAttributesManagerService(attributesManagerService: AttributesManagerService) {
        this.attributesManagerService = attributesManagerService;
        this.attributesManagerService.currentThickness.subscribe((thickness) => {
            this.currentWidth = thickness;
        });
    }

    onMouseDown(event: MouseEvent): void {
        if (event.button === Mouse.LeftButton) {
            const x = this.getXPos(event.clientX);
            const y = this.getYPos(event.clientY);
            if (!this.isDrawing) {
                this.isDrawing = true;
                this.startLine(x, y);
            } else {
                this.appendLine(x, y);
            }
        }
    }

    onMouseMove(event: MouseEvent): void {
        if (this.isDrawing) {
            this.previewLine(this.getXPos(event.clientX), this.getYPos(event.clientY));
        }
    }

    onKeyDown(event: KeyboardEvent): void {
        if (event.key === Keys.Shift) {
            this.shouldCloseLine = true;
        }
    }

    onKeyUp(event: KeyboardEvent): void {
        if (event.key === Keys.Shift) {
            this.shouldCloseLine = false;
        }
    }

    onDblClick(event: MouseEvent): void {
        if (this.isDrawing) {
            this.isDrawing = false;
            const x = this.getXPos(event.clientX);
            const y = this.getYPos(event.clientY);
            this.appendLine(x, y);

            if (this.shouldCloseLine) {
                this.appendLine(this.startLineCoordinates[0], this.startLineCoordinates[1]);
            }

            this.drawStack.push(this.gWrap);
            this.linePoints = '';
            this.endPreviewLine = '';
        }
    }

    startLine(x: number, y: number): void {
        console.log(this.currentColor);
        this.gWrap = this.renderer.createElement('g', SVG_NS);
        this.currentLine = this.renderer.createElement('polyline', SVG_NS);

        this.startLineCoordinates = [x, y];
        this.linePoints  = `${x.toString()},${y.toString()}`;

        this.renderer.setAttribute(this.currentLine, 'points', `${this.linePoints} ${this.endPreviewLine}`);
        this.renderer.setAttribute(this.currentLine, 'fill', 'none');
        this.renderer.setAttribute(this.currentLine, 'stroke-width', this.currentWidth.toString());
        this.renderer.setAttribute(this.currentLine, 'stroke', `#${this.currentColor}`);
        this.renderer.setAttribute(this.currentLine, 'stroke-linejoin', 'round');
        this.renderer.setAttribute(this.currentLine, 'stroke-linecap', 'round');

        this.renderer.appendChild(this.gWrap, this.currentLine);
        this.renderer.appendChild(this.elementRef.nativeElement, this.gWrap);
    }

    previewLine(x: number, y: number): void {
        this.endPreviewLine = `${x.toString()},${y.toString()}`;
        this.renderer.setAttribute(this.currentLine, 'points', `${this.linePoints} ${this.endPreviewLine}`);
    }

    appendLine(x: number, y: number) {
        this.linePoints += ` ${x.toString()},${y.toString()}`;
        this.renderer.setAttribute(this.currentLine, 'points', `${this.linePoints}`);
    }

    onMouseUp(event: MouseEvent): void {}
    onMouseEnter(event: MouseEvent): void {}
    onMouseLeave(event: MouseEvent): void {}
}
