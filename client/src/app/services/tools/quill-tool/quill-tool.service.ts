import { ElementRef, Injectable, Renderer2 } from '@angular/core';

import { Coords2D } from 'src/classes/Coords2D';
import { Offset } from 'src/classes/Offset';
import { KEYS, MOUSE, SVG_NS } from 'src/constants/constants';
import { HTML_ATTRIBUTE, ROTATION_ANGLE } from 'src/constants/tool-constants';
import { DrawStackService } from '../../draw-stack/draw-stack.service';
import { TracingToolService } from '../abstract-tools/tracing-tool/tracing-tool.service';
import { AttributesManagerService } from '../attributes-manager/attributes-manager.service';
import { ColorToolService } from '../color-tool/color-tool.service';

@Injectable({
    providedIn: 'root',
})
export class QuillToolService extends TracingToolService {
    elementRef: ElementRef<SVGElement>;
    renderer: Renderer2;
    drawStack: DrawStackService;

    gWrap: SVGGElement;

    previousCoords: Coords2D[] = new Array<Coords2D>(2);
    currentCoords: Coords2D[] = new Array<Coords2D>(2);

    preview: SVGLineElement;
    previewEnabled = false;

    thickness = 80;
    angle = 80;

    offsets: Offset[] = [
        { x: 0, y: 0 },
        { x: 0, y: 0 },
    ];

    currentMousePosition: Coords2D = new Coords2D(0, 0);

    counter = 0;

    isAlterRotation: boolean;

    isDrawing: boolean;

    attributesManagerService: AttributesManagerService;

    constructor(private colorToolService: ColorToolService) {
        super();
        this.colorToolService.primaryColor.subscribe((currentColor: string) => {
            this.currentColorAndOpacity = currentColor;
            this.getColorAndOpacity();
        });
    }

    initializeService(elementRef: ElementRef<SVGElement>, renderer: Renderer2, drawStack: DrawStackService): void {
        this.elementRef = elementRef;
        this.renderer = renderer;
        this.drawStack = drawStack;
    }

    initializeAttributesManagerService(attributeManagerService: AttributesManagerService) {
        this.attributesManagerService = attributeManagerService;
        this.attributesManagerService.thickness.subscribe((value) => {
            this.thickness = value;
            this.computeOffset();
        });

        this.attributesManagerService.angle.subscribe((value) => {
            this.angle = value;
            this.computeOffset();
        });
    }

    onMouseEnter(event: MouseEvent): void {
        this.appendPreview();
    }

    onMouseLeave(event: MouseEvent): void {
        this.removePreview();
    }

    onMouseDown(event: MouseEvent): void {
        if (event.button !== MOUSE.LeftButton) {
            return;
        }

        this.isDrawing = true;
        this.gWrap = this.renderer.createElement('g', SVG_NS);

        this.previousCoords[0] = new Coords2D(
            this.getXPos(event.clientX) + this.offsets[0].x,
            this.getYPos(event.clientY) + this.offsets[0].y,
        );

        this.previousCoords[1] = new Coords2D(
            this.getXPos(event.clientX) + this.offsets[1].x,
            this.getYPos(event.clientY) + this.offsets[1].y,
        );

        this.getColorAndOpacity();

        this.renderer.setAttribute(this.gWrap, HTML_ATTRIBUTE.stroke_width, '1');
        this.renderer.setAttribute(this.gWrap, HTML_ATTRIBUTE.stroke, '#' + this.currentColor);
        this.renderer.setAttribute(this.gWrap, HTML_ATTRIBUTE.fill, '#' + this.currentColor);
        this.renderer.setAttribute(this.gWrap, HTML_ATTRIBUTE.opacity, this.currentOpacity);
        this.renderer.appendChild(this.elementRef.nativeElement, this.gWrap);
    }

    appendPreview(): void {
        this.previewEnabled = true;
        this.preview = this.renderer.createElement('line', SVG_NS);
        this.renderer.setAttribute(this.preview, HTML_ATTRIBUTE.stroke_width, '2');
        this.renderer.setAttribute(this.preview, HTML_ATTRIBUTE.stroke, '#' + this.currentColor);
        this.renderer.appendChild(this.elementRef.nativeElement, this.preview);
    }

    removePreview(): void {
        this.previewEnabled = false;
        this.renderer.removeChild(this.elementRef.nativeElement, this.preview);
    }

    updatePreview() {
        this.renderer.setAttribute(this.preview, 'x1', `${this.currentMousePosition.x + this.offsets[0].x}`);
        this.renderer.setAttribute(this.preview, 'y1', `${this.currentMousePosition.y + this.offsets[0].y}`);
        this.renderer.setAttribute(this.preview, 'x2', `${this.currentMousePosition.x + this.offsets[1].x}`);
        this.renderer.setAttribute(this.preview, 'y2', `${this.currentMousePosition.y + this.offsets[1].y}`);
    }

    onMouseMove(event: MouseEvent): void {
        if (!this.previewEnabled) {
            this.appendPreview();
        }

        this.currentMousePosition.x = this.getXPos(event.clientX);
        this.currentMousePosition.y = this.getYPos(event.clientY);

        this.updatePreview();

        if (!this.isDrawing) {
            return;
        }

        // to keep only one point out of two....
        if (this.counter++ % 2 !== 0) {
            return;
        }

        this.currentCoords[0] = new Coords2D(
            this.currentMousePosition.x + this.offsets[0].x,
            this.currentMousePosition.y + this.offsets[0].y,
        );

        this.currentCoords[1] = new Coords2D(
            this.currentMousePosition.x + this.offsets[1].x,
            this.currentMousePosition.y + this.offsets[1].y,
        );

        this.tracePolygon();

        this.previousCoords = this.currentCoords.slice(0);
    }

    onWheel(event: WheelEvent): void {
        let val = this.isAlterRotation ? ROTATION_ANGLE.Alter : ROTATION_ANGLE.Base;
        val = (event.deltaY < 0 ? -val : val);
        this.angle = ( this.angle + val ) % 360;

        this.computeOffset();
        this.updatePreview();
    }

    onKeyDown(event: KeyboardEvent): void {
        if (event.key === KEYS.Alt) {
            this.isAlterRotation = true;
        }
    }

    onKeyUp(event: KeyboardEvent): void {
        if ( event.key === KEYS.Alt) {
            this.isAlterRotation = false;
        }
    }

    onMouseUp() {
        if (!this.isDrawing) {
            return;
        }

        this.isDrawing = false;

        this.saveState();
    }

    tracePolygon(): void {
        const polygon: SVGPolygonElement = this.renderer.createElement('polygon', SVG_NS);

        const points: string =
            `${this.previousCoords[0].x},${this.previousCoords[0].y} ` +
            `${this.previousCoords[1].x},${this.previousCoords[1].y} ` +
            `${this.currentCoords[1].x},${this.currentCoords[1].y} ` +
            `${this.currentCoords[0].x},${this.currentCoords[0].y} `;

        this.renderer.setAttribute(polygon, HTML_ATTRIBUTE.points, points);

        this.renderer.appendChild(this.gWrap, polygon);
    }

    computeOffset(): void {
        this.offsets[0].x = (this.thickness / 2) * Math.sin(this.degreesToRadians(this.angle));
        this.offsets[0].y = (this.thickness / 2) * Math.cos(this.degreesToRadians(this.angle));

        this.offsets[1].x = this.offsets[0].x === 0 ? 0 : -this.offsets[0].x;
        this.offsets[1].y = this.offsets[0].y === 0 ? 0 : -this.offsets[0].y;
    }

    degreesToRadians(degrees: number): number {
        return degrees * (Math.PI / 180);
    }

    saveState(): void {
        setTimeout(() => {
            this.renderer.removeChild(this.elementRef.nativeElement, this.preview);
        }, 0);
        setTimeout(() => {
            this.drawStack.push(this.gWrap);
        }, 0);
        setTimeout(() => {
            this.renderer.appendChild(this.elementRef.nativeElement, this.preview);
        }, 0);
    }

    cleanUp(): void {
        this.removePreview();
        if (this.isDrawing) {
            this.renderer.removeChild(this.elementRef.nativeElement, this.gWrap);
        }
    }
}
