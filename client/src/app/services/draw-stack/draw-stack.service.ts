import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class DrawStackService {
    private drawStack: SVGElement[];

    constructor() {
        this.drawStack = new Array<SVGElement>();
    }

    push(el: SVGElement): void {
        this.drawStack.push(el);
    }

    pop(): SVGElement | undefined {
        return this.drawStack.pop();
    }

    reset(): SVGElement[] {
        const ret = this.drawStack.splice(0, this.drawStack.length);
        return ret;
    }
}
