import { Component, ElementRef } from '@angular/core';
import { TracingTool } from 'src/classes/TracingTool/tracing-tool';

@Component({
  selector: 'app-pencil',
  templateUrl: './pencil.component.html',
  styleUrls: ['./pencil.component.scss'],
})
export class PencilComponent extends TracingTool {
  private svgRef: ElementRef<SVGElement>;
  private svgPath: SVGPathElement;
  private currentPath: string;

  constructor(elementReference: ElementRef<SVGElement>) {
    super(elementReference);
    this.svgRef = elementReference;
  }

  mouseDown(e: MouseEvent) {
    super.mouseDown(e);
    this.currentPath = `M${e.offsetX} ${e.offsetY}`;
    this.createSVGCircle(e.offsetX, e.offsetY, 2);
    this.createSVGPath();
  }

  mouseMove(e: MouseEvent) {
    if (this.isDrawing) {
      this.createSVGCircle(e.offsetX, e.offsetY, 2);
      this.currentPath += ` L${e.offsetX} ${e.offsetY}`;
      this.svgPath.setAttribute('d', this.currentPath);
    }
  }

  mouseUp(e: MouseEvent) {
    super.mouseUp(e);
    this.currentPath = '';
  }

  createSVGCircle(x: number, y: number, w: number) {
    const el = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    el.setAttribute('x1', x.toString());
    el.setAttribute('y1', y.toString());
    el.setAttribute('x2', x.toString());
    el.setAttribute('y2', y.toString());
    el.setAttribute('stroke-width', w.toString());
    el.setAttribute('stroke-linecap', 'round');
    el.setAttribute('stroke', 'black');
    this.svgRef.nativeElement.appendChild(el);
  }

  createSVGPath(): void {
    this.svgPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    this.svgPath.setAttribute('d', this.currentPath);
    this.svgPath.setAttribute('fill', 'none');
    this.svgPath.setAttribute('stroke', 'black');
    this.svgPath.setAttribute('stroke-width', '2');
    this.svgRef.nativeElement.appendChild(this.svgPath);
  }

}
