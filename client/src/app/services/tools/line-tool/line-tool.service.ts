import { ElementRef, Injectable, Renderer2 } from '@angular/core';

import { KEYS, MOUSE, SVG_NS } from 'src/constants/constants';
import { HTML_ATTRIBUTE, LINE_JOINT_TYPE, LINE_STROKE_TYPE, TOOL_NAME } from 'src/constants/tool-constants';
import { DrawStackService } from '../../draw-stack/draw-stack.service';
import { AbstractToolService } from '../abstract-tools/abstract-tool.service';
import { AttributesManagerService } from '../attributes-manager/attributes-manager.service';
import { ColorToolService } from '../color-tool/color-tool.service';

@Injectable({
    providedIn: 'root',
})
export class LineToolService extends AbstractToolService {
    private attributesManagerService: AttributesManagerService;

    private currentColorAndOpacity = '';
    private currentColor = '';
    private currentOpacity = '';
    private currentStrokeWidth = 0;
    private circleJointDiameter = 0;

    private currentStrokeType = LINE_STROKE_TYPE.Continuous;
    private currentJointType = LINE_JOINT_TYPE.Curvy;

    private pointsArray = new Array();
    private jointCircles = new Array();

    private currentMousePosition = '';

    private shouldCloseLine = false;
    private isDrawing = false;
    private isLineInStack = false;
    private isMouseDown = false;

    private gWrap: SVGGElement;
    private currentLine: SVGPolylineElement;

    private elementRef: ElementRef<SVGElement>;
    private renderer: Renderer2;
    private drawStack: DrawStackService;

    constructor(private colorToolService: ColorToolService) {
        super();
        this.colorToolService.primaryColor.subscribe((currentColor: string) => {
            this.currentColorAndOpacity = currentColor;
        });
    }

    private getXPos = (clientX: number): number => clientX - this.elementRef.nativeElement.getBoundingClientRect().left;
    private getYPos = (clientY: number): number => clientY - this.elementRef.nativeElement.getBoundingClientRect().top;

    initializeService(elementRef: ElementRef<SVGElement>, renderer: Renderer2, drawStack: DrawStackService) {
        this.elementRef = elementRef;
        this.renderer = renderer;
        this.drawStack = drawStack;
    }

    initializeAttributesManagerService(attributesManagerService: AttributesManagerService) {
        this.attributesManagerService = attributesManagerService;
        this.attributesManagerService.thickness.subscribe((thickness: number) => {
            this.currentStrokeWidth = thickness;
        });
        this.attributesManagerService.lineStrokeType.subscribe((strokeType) => {
            this.currentStrokeType = strokeType;
        });
        this.attributesManagerService.lineJointType.subscribe((jointType) => {
            this.currentJointType = jointType;
        });
        this.attributesManagerService.circleJointDiameter.subscribe((circleJointDiameter: number) => {
            this.circleJointDiameter = circleJointDiameter;
        });
    }

    getColorAndOpacity(): void {
        this.currentColor = this.currentColorAndOpacity.slice(0, 6);
        this.currentOpacity = (parseInt(this.currentColorAndOpacity.slice(-2), 16) / 255).toFixed(1).toString();
    }

    onMouseDown(event: MouseEvent): void {
        if (event.button === MOUSE.LeftButton) {
            this.getColorAndOpacity();
            const x = this.getXPos(event.clientX);
            const y = this.getYPos(event.clientY);
            if (!this.isDrawing) {
                this.isDrawing = true;
                this.startLine(x, y);
            } else {
                this.appendLine(x, y);
            }
            if (this.currentJointType === LINE_JOINT_TYPE.Circle) {
                this.appendCircle(x, y);
            }
        }
        this.isMouseDown = true;
    }

    onMouseUp(event: MouseEvent): void {
        this.isMouseDown = false;
    }

    onMouseMove(event: MouseEvent): void {
        if (this.isDrawing && !this.isMouseDown) {
            this.previewLine(this.getXPos(event.clientX), this.getYPos(event.clientY));
        }
    }

    onKeyDown(event: KeyboardEvent): void {
        if (event.key === KEYS.Shift) {
            this.shouldCloseLine = true;
        } else if (event.key === KEYS.Escape) {
            this.isDrawing = false;
            this.renderer.removeChild(this.elementRef, this.gWrap);
            this.currentMousePosition = '';
            this.pointsArray = new Array();
        } else if (event.key === KEYS.Backspace) {
            if (this.pointsArray.length > 1) {
                this.pointsArray.pop();
                this.renderer.setAttribute(
                    this.currentLine,
                    HTML_ATTRIBUTE.Points,
                    `${this.arrayToStringLine()} ${this.currentMousePosition}`,
                );

                if (this.currentJointType === LINE_JOINT_TYPE.Circle) {
                    const circle = this.jointCircles.pop();
                    this.renderer.removeChild(this.gWrap, circle);
                }
            }
        }
    }

    onKeyUp(event: KeyboardEvent): void {
        if (event.key === KEYS.Shift) {
            this.shouldCloseLine = false;
        }
    }

    onDblClick(event: MouseEvent): void {
        if (this.isDrawing) {
            this.isDrawing = false;

            if (this.shouldCloseLine && this.pointsArray.length > 3) {
                this.pointsArray.push(this.pointsArray[0]);
                this.renderer.setAttribute(this.currentLine, HTML_ATTRIBUTE.Points, this.arrayToStringLine());
            }

            this.drawStack.push(this.gWrap);
            this.isLineInStack = true;
            this.pointsArray = new Array();
            this.currentMousePosition = '';
            this.gWrap = this.renderer.createElement('g', SVG_NS);
        }
    }

    startLine(x: number, y: number): void {
        this.gWrap = this.renderer.createElement('g', SVG_NS);
        this.renderer.setAttribute(this.gWrap, HTML_ATTRIBUTE.Title, TOOL_NAME.Line);
        this.currentLine = this.renderer.createElement('polyline', SVG_NS);

        this.isLineInStack = false;

        this.pointsArray.push(`${x.toString()},${y.toString()}`);

        this.renderer.setAttribute(this.currentLine, HTML_ATTRIBUTE.Points, this.arrayToStringLine());
        this.renderer.setAttribute(this.currentLine, HTML_ATTRIBUTE.Fill, 'none');
        this.renderer.setAttribute(this.currentLine, HTML_ATTRIBUTE.StrokeWidth, this.currentStrokeWidth.toString());

        this.renderer.setAttribute(this.gWrap, HTML_ATTRIBUTE.Stroke, `#${this.currentColor}`);
        this.renderer.setAttribute(this.gWrap, HTML_ATTRIBUTE.Fill, `#${this.currentColor}`);
        this.renderer.setAttribute(this.gWrap, HTML_ATTRIBUTE.Opacity, this.currentOpacity);

        switch (this.currentStrokeType) {
            case LINE_STROKE_TYPE.DottedLine:
                this.renderer.setAttribute(
                    this.currentLine,
                    HTML_ATTRIBUTE.StrokeDasharray,
                    `${this.currentStrokeWidth}, ${this.currentStrokeWidth / 2}`,
                );
                break;
            case LINE_STROKE_TYPE.DottedCircle:
                this.renderer.setAttribute(
                    this.currentLine,
                    HTML_ATTRIBUTE.StrokeDasharray,
                    `1, ${this.currentStrokeWidth * 1.5}`,
                );
                this.renderer.setAttribute(this.currentLine, HTML_ATTRIBUTE.StrokeLinecap, 'round');
                break;
        }

        switch (this.currentJointType) {
            case LINE_JOINT_TYPE.Curvy:
            case LINE_JOINT_TYPE.Circle:
                this.renderer.setAttribute(this.currentLine, HTML_ATTRIBUTE.StrokeLinejoin, 'round');
                break;
        }

        this.renderer.appendChild(this.gWrap, this.currentLine);
        this.renderer.appendChild(this.elementRef.nativeElement, this.gWrap);
    }

    previewLine(x: number, y: number): void {
        this.currentMousePosition = `${x.toString()},${y.toString()}`;
        this.renderer.setAttribute(
            this.currentLine,
            HTML_ATTRIBUTE.Points,
            `${this.arrayToStringLine()} ${this.currentMousePosition}`,
        );
    }

    appendLine(x: number, y: number): void {
        this.pointsArray.push(` ${x.toString()},${y.toString()}`);
        this.renderer.setAttribute(this.currentLine, HTML_ATTRIBUTE.Points, `${this.arrayToStringLine()}`);
    }

    appendCircle(x: number, y: number): void {
        const circle = this.renderer.createElement('circle', SVG_NS);

        this.renderer.setAttribute(circle, HTML_ATTRIBUTE.Cx, x.toString());
        this.renderer.setAttribute(circle, HTML_ATTRIBUTE.Cy, y.toString());
        this.renderer.setAttribute(circle, 'r', (this.circleJointDiameter / 2).toString());

        this.renderer.appendChild(this.gWrap, circle);

        this.jointCircles.push(circle);
    }

    arrayToStringLine(): string {
        return this.pointsArray.join(' ');
    }

    cleanUp(): void {
        if (!this.isLineInStack && this.gWrap !== undefined) {
            this.renderer.removeChild(this.elementRef, this.gWrap);
            this.pointsArray = new Array();
        }
        this.isDrawing = false;
    }

    // tslint:disable-next-line: no-empty
    onMouseEnter(event: MouseEvent): void {}
    // tslint:disable-next-line: no-empty
    onMouseLeave(event: MouseEvent): void {}
}
