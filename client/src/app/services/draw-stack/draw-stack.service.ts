import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DrawStackService {
    private drawStack: SVGElement[];
    drawCount: number;

  constructor() {
      this.drawStack = new Array<SVGElement>();
      this.drawCount = 0;
  }

  push(el: SVGElement): void{
      this.drawStack.push(el);
      this.drawCount++;
  }

  pop(): void{
    this.drawStack.pop();
    this.drawCount--;
  }

  reset(): SVGElement[]{
      const ret = this.drawStack.splice(0, this.drawCount);
      this.drawCount = 0;
      return ret;
  }
}
