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
                this.changeTargetElement(new StackTargetInfo(parseInt(el.getAttribute('id_element') as string), tool as string));
            });
            this.renderer.listen(el.children.item(i), 'mouseup', () => {
                this.changeTargetElement(new StackTargetInfo(parseInt(el.getAttribute('id_element') as string), tool as string));
            });
        }

        return el;
    }

    push(el: SVGGElement): void {
        this.drawStack.push(this.makeTargetable(el));
        if (this.idStack.length > 0) { this.drawingLoaderService.emptyDrawStack.next(false); }
    }

    pop(): SVGGElement | undefined {
        return this.drawStack.pop();
    }

    delete(elementToDelete: SVGGElement): void {
        const indexOfDeletion = this.drawStack.indexOf(elementToDelete);

        this.drawStack.splice(indexOfDeletion, 1);
        this.idStack.splice(indexOfDeletion, 1);

        this.resolveDrawStackOrdering(indexOfDeletion);
    }

    resolveDrawStackOrdering(displacementIndex: number): void {
        for (let i = displacementIndex; i < this.drawStack.length; i++) {
            this.renderer.setAttribute(this.drawStack[i], 'id_element', i.toString());
        }

        for (let i = displacementIndex; i < this.idStack.length; i++) {
            this.idStack[i] = i.toString();
        }
    }

    reset(): SVGGElement[] {
        this.drawingLoaderService.emptyDrawStack.next(true);
        this.idStack.splice(0, this.idStack.length);
        return this.drawStack.splice(0, this.drawStack.length);
    }
}
