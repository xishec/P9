import { ElementRef, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export abstract class TracingToolService {
  protected isDrawing = false;

  constructor() {
    this.isDrawing = false;
  }

  onMouseDown(e: MouseEvent): void {
    this.isDrawing = true;
  }

  onMouseUp(e: MouseEvent): void {
    this.isDrawing = false;
  }

  onMouseLeave(e: MouseEvent): void {
    this.isDrawing = false;
  }

  abstract onMouseMove(e: MouseEvent): void;
}
