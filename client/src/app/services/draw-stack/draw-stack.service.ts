import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class DrawStackService {
    private drawStack: SVGGElement[];
    private targetStackElementPosition: BehaviorSubject<number> = new BehaviorSubject(0);
    currentStackTargetPosition = this.targetStackElementPosition.asObservable();

    constructor() {
        this.drawStack = new Array<SVGGElement>();
    }

    changeTargetElement(targetPositionInStack: number): void {
        this.targetStackElementPosition.next(targetPositionInStack);
    }

    getElementByPosition(elementPosition: number): SVGGElement {
        return this.drawStack[elementPosition];
    }

    getDrawStackLength(): number {
        return this.drawStack.length;
    }

    push(el: SVGGElement): void {
        this.drawStack.push(el);
    }

    pop(): SVGGElement | undefined {
        return this.drawStack.pop();
    }

    reset(): SVGGElement[] {
        return this.drawStack.splice(0, this.drawStack.length);
    }
}
