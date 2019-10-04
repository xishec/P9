import { ElementRef, Injectable, Renderer2, EventEmitter } from '@angular/core';

import { DrawStackService } from '../../draw-stack/draw-stack.service';
import { AbstractToolService } from '../abstract-tools/abstract-tool.service';
import { AttributesManagerService } from '../attributes-manager/attributes-manager.service';
import { ColorToolService } from '../color-tool/color-tool.service';
import { Mouse, SVG_NS } from 'src/constants/constants';

@Injectable({
  providedIn: 'root',
})
export class LineToolService extends AbstractToolService {
    colorToolService: ColorToolService;
    currentColor = '';
    currentWidth = 0;
    isDrawing = false;

    linePoints = '';
    endPreviewLine = '';

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

    startLine(x: number, y: number): void {
        this.gWrap = this.renderer.createElement('g', SVG_NS);
        this.currentLine = this.renderer.createElement('polyline', SVG_NS);

        this.linePoints = `${x.toString()},${y.toString()}`;

        this.renderer.setAttribute(this.currentLine, 'points', `${this.linePoints}`);
        this.renderer.setAttribute(this.currentLine, 'style', 'stroke-linejoin:round;fill:none;stroke:rgb(255,0,0);stroke-width:10px');

        this.renderer.appendChild(this.gWrap, this.currentLine);
        this.renderer.appendChild(this.elementRef.nativeElement, this.gWrap);
    }

    previewLine(x: number, y: number): void {
        this.endPreviewLine = `${x.toString()},${y.toString()}`;
        this.renderer.setAttribute(this.currentLine, 'points', `${this.linePoints} ${this.endPreviewLine}`);
    }

    appendLine(x: number, y: number){
        this.linePoints += ` ${x.toString()},${y.toString()}`;
        this.endPreviewLine = `${x.toString()},${y.toString()}`;
    }

    onMouseUp(event: MouseEvent): void {}
    onMouseEnter(event: MouseEvent): void {}
    onMouseLeave(event: MouseEvent): void {}
    onKeyDown(event: KeyboardEvent): void {
        this.drawStack.push(this.currentLine);
    }
    onKeyUp(event: KeyboardEvent): void {}
}
