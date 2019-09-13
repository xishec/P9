import { ElementRef, Injectable } from '@angular/core';
import { TracingToolService } from '../tracing-tool.service';

@Injectable({
  providedIn: 'root',
})
export class PencilToolService extends TracingToolService {
  private svgPath: SVGPathElement;
  private currentPath: string;
  // They Could be in TracingToolService
  private currentWidth = 2;
  private currentColor = 'black';

  constructor(){
    super();
  }

  onMouseDown(e: MouseEvent, elementRef: ElementRef<SVGElement>): void {
    super.onMouseDown(e, elementRef);
    this.currentPath = `M${e.offsetX} ${e.offsetY}`;
    this.createSVGCircle(e.offsetX, e.offsetY, this.currentWidth, elementRef);
    this.createSVGPath(elementRef);
  }

  onMouseMove(e: MouseEvent, elementRef: ElementRef<SVGElement>): void {
    if (this.isDrawing) {
      this.createSVGCircle(e.offsetX, e.offsetY, this.currentWidth, elementRef);
      this.currentPath += ` L${e.offsetX} ${e.offsetY}`;
      this.svgPath.setAttribute('d', this.currentPath);
    }
  }

  onMouseUp(e: MouseEvent, elementRef: ElementRef<SVGElement>): void {
    super.onMouseUp(e, elementRef);
    this.currentPath = '';
  }

  onMouseLeave(e: MouseEvent, elementRef: ElementRef<SVGElement>): void {
    this.isDrawing = false;
  }

  createSVGCircle(x: number, y: number, w: number, elementRef: ElementRef<SVGElement>) {
    const el = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    el.setAttribute('x1', x.toString());
    el.setAttribute('y1', y.toString());
    el.setAttribute('x2', x.toString());
    el.setAttribute('y2', y.toString());
    el.setAttribute('stroke-width', w.toString());
    el.setAttribute('stroke-linecap', 'round');
    el.setAttribute('stroke', this.currentColor);
    elementRef.nativeElement.appendChild(el);
  }

  createSVGPath(elementRef: ElementRef<SVGElement>): void {
    this.svgPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    this.svgPath.setAttribute('d', this.currentPath);
    this.svgPath.setAttribute('fill', 'none');
    this.svgPath.setAttribute('stroke', this.currentColor);
    this.svgPath.setAttribute('stroke-width', this.currentWidth.toString());
    elementRef.nativeElement.appendChild(this.svgPath);
  }
}
