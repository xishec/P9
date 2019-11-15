import { Injectable, ElementRef, Renderer2 } from '@angular/core';
import { DrawStackService } from '../../draw-stack/draw-stack.service';
import { TracingToolService } from '../abstract-tools/tracing-tool/tracing-tool.service';
import { Coords2D } from 'src/classes/Coords2D';
import { SVG_NS } from 'src/constants/constants';
import { HTML_ATTRIBUTE } from 'src/constants/tool-constants';
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

    thickness: number = 80;
    angle: number = 45;

    offsetXA: number;
    offsetYA: number;

    offsetXB: number;
    offsetYB: number;

    isDrawing: boolean;

    constructor(private colorToolService: ColorToolService) {
        super();
        this.colorToolService.primaryColor.subscribe((currentColor: string) => {
          this.currentColorAndOpacity = currentColor;
        });
    }

    initializeService(elementRef: ElementRef<SVGElement>, renderer: Renderer2, drawStack: DrawStackService): void {
        this.elementRef = elementRef;
        this.renderer = renderer;
        this.drawStack = drawStack;
    }

    onMouseDown(event: MouseEvent): void {
        this.isDrawing = true;
        this.gWrap = this.renderer.createElement('g', SVG_NS);

        this.computeOffset();

        this.previousCoords[0] = new Coords2D(
          this.getXPos(event.clientX) + this.offsetXA,
          this.getYPos(event.clientY) + this.offsetYA);

        this.previousCoords[1] = new Coords2D(
            this.getXPos(event.clientX) + this.offsetXB,
            this.getYPos(event.clientY) + this.offsetYB,
        );

        this.getColorAndOpacity();
        console.log(this.currentColor);

        this.renderer.setAttribute(this.gWrap, HTML_ATTRIBUTE.stroke_width, '1');
        this.renderer.setAttribute(this.gWrap, HTML_ATTRIBUTE.stroke, '#' + this.currentColor);
        this.renderer.setAttribute(this.gWrap, HTML_ATTRIBUTE.fill, '#' + this.currentColor);
        this.renderer.setAttribute(this.gWrap, HTML_ATTRIBUTE.opacity, this.currentOpacity);
        this.renderer.appendChild(this.elementRef.nativeElement, this.gWrap);
    }

    onMouseMove(event: MouseEvent): void {
      if (this.isDrawing) {

        this.currentCoords[0] = new Coords2D(
          this.getXPos(event.clientX) + this.offsetXA,
          this.getYPos(event.clientY) + this.offsetYA);

        this.currentCoords[1] = new Coords2D(
            this.getXPos(event.clientX) + this.offsetXB,
            this.getYPos(event.clientY) + this.offsetYB,
        );

        this.tracePolygon();

        this.previousCoords = this.currentCoords.slice(0);
      }
    }

    onMouseUp() {
      this.isDrawing = false;
    }

    tracePolygon(): void {
        const polygon: SVGPolygonElement = this.renderer.createElement('polygon', SVG_NS);
        const points: string = `${this.previousCoords[0].x},${this.previousCoords[0].y} ${this.previousCoords[1].x},${this.previousCoords[1].y} ${this.currentCoords[1].x},${this.currentCoords[1].y} ${this.currentCoords[0].x},${this.currentCoords[0].y}`;

        this.renderer.setAttribute(polygon, HTML_ATTRIBUTE.points, points);

        this.renderer.appendChild(this.gWrap, polygon);
    }

    computeOffset(): void {
      this.offsetXA = (this.thickness / 2) * Math.sin(this.degreesToRadians(this.angle));
      this.offsetYA = (this.thickness / 2) * Math.cos(this.degreesToRadians(this.angle));

      console.log(this.offsetXA);
      console.log(this.offsetYA);

      this.offsetXB = this.offsetXA === 0 ? 0 : -this.offsetXA;
      this.offsetYB = this.offsetYA === 0 ? 0 : -this.offsetYA;

      console.log(this.offsetXB);
      console.log(this.offsetYB);
    }

    degreesToRadians(degrees: number): number {
      return degrees * (Math.PI / 180);
    }
}
