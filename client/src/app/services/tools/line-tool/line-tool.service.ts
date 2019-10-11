import { ElementRef, Injectable, Renderer2 } from '@angular/core';

import { Keys, Mouse, SVG_NS } from 'src/constants/constants';
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
    currentStrokeType = 0;
    currentJointType = 0;
    isDrawing = false;

    pointsArray = new Array();
    endPreviewLine = '';
    shouldCloseLine = false;

    gWrap: SVGGElement;
    currentLine: SVGLineElement;

    attributesManagerService: AttributesManagerService;

    constructor(private elementRef: ElementRef<SVGElement>, private renderer: Renderer2, private drawStack: DrawStackService) {
        super();
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
        this.attributesManagerService.currentLineStrokeType.subscribe((strokeType) => {
            this.currentStrokeType = strokeType;
        });
        this.attributesManagerService.currentLineJointType.subscribe((jointType) => {
            this.currentJointType = jointType;
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
        } else if (event.key === Keys.Escape) {
            this.isDrawing = false;
            this.renderer.removeChild(this.elementRef, this.gWrap);
            this.endPreviewLine = '';
            this.pointsArray = new Array();
        } else if (event.key === Keys.Backspace) {
            if (this.pointsArray.length > 1) {
                this.pointsArray.pop();
                this.renderer.setAttribute(this.currentLine, 'points', `${this.arrayToStringLine()} ${this.endPreviewLine}`);
            }
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

            if (this.shouldCloseLine) {
                this.pointsArray.push(this.pointsArray[0]);
                this.renderer.setAttribute(this.currentLine, 'points', this.arrayToStringLine());
            }

            this.drawStack.push(this.gWrap);
            this.pointsArray = new Array();
            this.endPreviewLine = '';
        }
    }

    startLine(x: number, y: number): void {
        this.gWrap = this.renderer.createElement('g', SVG_NS);
        this.currentLine = this.renderer.createElement('polyline', SVG_NS);

        this.pointsArray.push(`${x.toString()},${y.toString()}`);

        this.renderer.setAttribute(this.currentLine, 'points', this.arrayToStringLine());
        this.renderer.setAttribute(this.currentLine, 'fill', 'none');
        this.renderer.setAttribute(this.currentLine, 'stroke-width', this.currentWidth.toString());
        this.renderer.setAttribute(this.currentLine, 'stroke', `#${this.currentColor}`);

        switch (this.currentStrokeType) {
            case 1 :
                this.renderer.setAttribute(this.currentLine, 'stroke-dasharray', `${this.currentWidth}, ${this.currentWidth / 2}`);
                break;
            case 2 :
                this.renderer.setAttribute(this.currentLine, 'stroke-dasharray', `1, ${this.currentWidth * 1.5}`);
                this.renderer.setAttribute(this.currentLine, 'stroke-linecap', 'round');
                break;
        }

        switch (this.currentJointType) {
            case 1 :
                this.renderer.setAttribute(this.currentLine, 'stroke-linejoin', 'round');
                break;
        }

        this.renderer.appendChild(this.gWrap, this.currentLine);
        this.renderer.appendChild(this.elementRef.nativeElement, this.gWrap);
    }

    previewLine(x: number, y: number): void {
        this.endPreviewLine = `${x.toString()},${y.toString()}`;
        this.renderer.setAttribute(this.currentLine, 'points', `${this.arrayToStringLine()} ${this.endPreviewLine}`);
    }

    appendLine(x: number, y: number) {
        this.pointsArray.push(` ${x.toString()},${y.toString()}`);
        this.renderer.setAttribute(this.currentLine, 'points', `${this.arrayToStringLine()}`);
    }

    arrayToStringLine(): string {
        return this.pointsArray.join(' ');
    }

    onMouseUp(event: MouseEvent): void {}
    onMouseEnter(event: MouseEvent): void {}
    onMouseLeave(event: MouseEvent): void {}
}
