import { Component, ElementRef } from '@angular/core';
import { TracingTool } from 'src/classes/TracingTool/tracing-tool';

@Component({
  selector: 'app-pencil',
  templateUrl: './pencil.component.html',
  styleUrls: ['./pencil.component.scss'],
})
export class PencilComponent extends TracingTool {
  private svgRef: ElementRef<SVGElement>;

  constructor(elementReference: ElementRef<SVGElement>) {
    super(elementReference);
    this.svgRef = elementReference;
  }

  mouseDown(e: MouseEvent) {
    super.mouseDown(e);
    this.createSVGCircle(e.offsetX, e.offsetY, 3);
  }

  createSVGCircle(x: number, y: number, w: number){
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

  mouseMove(e: MouseEvent) {
    if (this.isDrawing) {
      this.createSVGCircle(e.offsetX, e.offsetY, 3);
    }
  }

}
