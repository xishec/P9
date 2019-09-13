import { ElementRef, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export abstract class TracingToolService {
  protected isDrawing = false;

  constructor() {
    this.isDrawing = false;
  }

  onMouseDown(e: MouseEvent, elementRef: ElementRef<SVGElement>): void {
    this.isDrawing = true;
  }

  onMouseUp(e: MouseEvent, elementRef: ElementRef<SVGElement>): void {
    this.isDrawing = false;
  }

  onMouseLeave(e: MouseEvent, elementRef: ElementRef<SVGElement>): void {
    this.isDrawing = false;
  }

  abstract onMouseMove(e: MouseEvent, elementRef: ElementRef<SVGElement>): void;
}
