import { Injectable, Renderer2, ElementRef } from '@angular/core';
import { DrawStackService } from '../draw-stack/draw-stack.service';
import { Selection } from '../../../classes/selection/selection';

@Injectable({
  providedIn: 'root'
})
export class ClipboardService {
    renderer: Renderer2;
    elementRef: ElementRef<SVGElement>;
    drawStack: DrawStackService;
    selection: Selection;

  constructor() { }

  initializeService(elementRef: ElementRef<SVGElement>, renderer: Renderer2, drawStack: DrawStackService, selection: Selection): void {
      this.renderer = renderer;
      this.elementRef = elementRef;
      this.drawStack = drawStack;
      this.selection = selection;
  }
}
