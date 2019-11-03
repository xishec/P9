import { Injectable, Renderer2 } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

import { StackTargetInfo } from 'src/classes/StackTargetInfo';
import { DrawingLoaderService } from '../server/drawing-loader/drawing-loader.service';

@Injectable({
    providedIn: 'root',
})
export class DrawStackService {
    drawStack: SVGGElement[] = new Array<SVGGElement>();
    idStack: string[] = new Array<string>();
    private stackTarget: BehaviorSubject<StackTargetInfo> = new BehaviorSubject(new StackTargetInfo());
    currentStackTarget: Observable<StackTargetInfo> = this.stackTarget.asObservable();
    currentStackTargetOver: Observable<StackTargetInfo> = this.stackTarget.asObservable();
    renderer: Renderer2;

    constructor(renderer: Renderer2, private drawingLoaderService: DrawingLoaderService) {
        this.renderer = renderer;
    }

    changeTargetElement(stackTarget: StackTargetInfo): void {
        this.stackTarget.next(stackTarget);
    }

    getElementByPosition(elementPosition: number): SVGGElement {
        return this.drawStack[elementPosition];
    }

    setElementByPosition(elementPosition: number, element: SVGGElement): void {
        this.drawStack[elementPosition] = element;
    }

    removeElementByPosition(elementPosition: number): void {
        this.drawStack.splice(elementPosition, 1);

        for (let i = 0; i < this.getDrawStackLength(); i++) {
            if (i >= elementPosition) {
                this.renderer.setAttribute(this.drawStack[i], 'id_element', i.toString());
            }
        }
    }

    getDrawStackLength(): number {
        return this.drawStack.length;
    }

    makeTargetable(el: SVGGElement): SVGGElement {
        const position = this.drawStack.length;
        const tool = el.getAttribute('title');
        this.renderer.setAttribute(el, 'id_element', position.toString());
        this.idStack.push(el.getAttribute('id_element') as string);

        for (let i = 0; i < el.children.length; i++) {
            this.renderer.listen(el.children.item(i), 'mousedown', () => {
                this.changeTargetElement(
                    new StackTargetInfo(parseInt(el.getAttribute('id_element') as string), tool as string),
                );
            });

            this.renderer.listen(el.children.item(i), 'mouseup', () => {
                this.changeTargetElement(
                    new StackTargetInfo(parseInt(el.getAttribute('id_element') as string), tool as string),
                );
            });
        }

        return el;
    }

    push(el: SVGGElement): void {
        this.drawStack.push(this.makeTargetable(el));
        if (this.idStack.length > 0) {
            this.drawingLoaderService.emptyDrawStack.next(false);
        }
    }

    pop(): SVGGElement | undefined {
        return this.drawStack.pop();
    }

    reset(): SVGGElement[] {
        this.drawingLoaderService.emptyDrawStack.next(true);
        this.idStack.splice(0, this.idStack.length);
        return this.drawStack.splice(0, this.drawStack.length);
    }
}
