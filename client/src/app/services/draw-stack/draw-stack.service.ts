import { Injectable, Renderer2 } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

import { StackTargetInfo } from 'src/classes/StackTargetInfo';

@Injectable({
    providedIn: 'root',
})
export class DrawStackService {
    private drawStack: SVGGElement[] = new Array<SVGGElement>();
    private idStack: string[] = new Array<string>();
    private stackTarget: BehaviorSubject<StackTargetInfo> = new BehaviorSubject(new StackTargetInfo());
    currentStackTarget: Observable<StackTargetInfo> = this.stackTarget.asObservable();
    renderer: Renderer2;

    constructor(renderer: Renderer2){this.renderer = renderer;}

    changeTargetElement(stackTarget: StackTargetInfo): void {
        this.stackTarget.next(stackTarget);
    }

    getElementByPosition(elementPosition: number): SVGGElement {
        return this.drawStack[elementPosition];
    }

    getDrawStackLength(): number {
        return this.drawStack.length;
    }

    makeTargetable(el: SVGGElement): SVGGElement {
        const position = this.drawStack.length;
        const tool = el.getAttribute('title');
        this.renderer.setAttribute(el, 'id', position.toString());
        this.idStack.push(el.getAttribute('id') as string);

        for (let i = 0; i < el.children.length; i++) {
            this.renderer.listen(el.children.item(i), 'mousedown', () => {
                this.changeTargetElement(new StackTargetInfo(position, tool as string));
            });
        }

        return el;
    }

    push(el: SVGGElement): void {
        this.drawStack.push(this.makeTargetable(el));
    }

    pop(): SVGGElement | undefined {
        return this.drawStack.pop();
    }

    reset(): SVGGElement[] {
        this.idStack.splice(0, this.idStack.length);
        return this.drawStack.splice(0, this.drawStack.length);
    }
}
