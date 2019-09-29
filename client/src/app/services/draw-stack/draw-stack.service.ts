import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

import { StackTargetInfo } from 'src/classes/StackTargetInfo';

@Injectable({
    providedIn: 'root',
})
export class DrawStackService {
    private drawStack: SVGGElement[] = new Array<SVGGElement>();
    private stackTarget: BehaviorSubject<StackTargetInfo> = new BehaviorSubject(new StackTargetInfo());
    currentStackTarget: Observable<StackTargetInfo> = this.stackTarget.asObservable();

    // tslint:disable-next-line: no-empty
    constructor() {}

    changeTargetElement(stackTarget: StackTargetInfo): void {
        this.stackTarget.next(stackTarget);
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
