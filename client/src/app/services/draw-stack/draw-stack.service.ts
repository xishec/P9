import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DrawStackService {
    private drawStack: SVGElement[];
    drawCount = 0;

  constructor() {
      this.drawStack = new Array<SVGElement>();
    }

  push(el: SVGElement): void {
      this.drawStack.push(el);
      this.drawCount++;
  }

  pop(): void {
    this.drawStack.pop();
    this.drawCount--;
  }

  reset(): SVGElement[] {
      const ret = this.drawStack.splice(0, this.drawCount);
      this.drawCount = 0;
      return ret;
  }
}
