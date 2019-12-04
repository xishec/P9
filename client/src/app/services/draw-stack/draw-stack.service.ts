import { Injectable, Renderer2 } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

import { StackTargetInfo } from 'src/classes/StackTargetInfo';
import { HTML_ATTRIBUTE, DEFAULT_RADIX } from 'src/constants/tool-constants';
import { DrawingLoaderService } from '../server/drawing-loader/drawing-loader.service';
import { UndoRedoerService } from '../undo-redoer/undo-redoer.service';

@Injectable({
    providedIn: 'root',
})
export class DrawStackService {
    private stackTarget: BehaviorSubject<StackTargetInfo> = new BehaviorSubject(new StackTargetInfo());

    drawStack: SVGGElement[] = new Array<SVGGElement>();
    idStack: string[] = new Array<string>();
    currentStackTarget: Observable<StackTargetInfo> = this.stackTarget.asObservable();
    renderer: Renderer2;

    constructor(
        renderer: Renderer2,
        private drawingLoaderService: DrawingLoaderService,
        private undoRedoerService: UndoRedoerService,
    ) {
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

    delete(elementToDelete: SVGGElement): void {
        const indexOfDeletion = this.drawStack.indexOf(elementToDelete);

        this.drawStack.splice(indexOfDeletion, 1);
        this.idStack.splice(indexOfDeletion, 1);

        this.resolveDrawStackOrdering(indexOfDeletion);

        if (this.drawStack.length === 0) {
            this.drawingLoaderService.emptyDrawStack.next(true);
        }
    }

    resolveDrawStackOrdering(displacementIndex: number): void {
        for (let i = displacementIndex; i < this.drawStack.length; i++) {
            this.renderer.setAttribute(this.drawStack[i], 'id_element', i.toString());
        }

        for (let i = displacementIndex; i < this.idStack.length; i++) {
            this.idStack[i] = i.toString();
        }
    }

    getDrawStackLength(): number {
        return this.drawStack.length;
    }

    makeTargetable(el: SVGGElement): SVGGElement {
        const position = this.drawStack.length;
        const tool = el.getAttribute(HTML_ATTRIBUTE.Title);
        this.renderer.setAttribute(el, 'id_element', position.toString());
        this.idStack.push(el.getAttribute('id_element') as string);

        for (let i = 0; i < el.children.length; i++) {
            this.renderer.listen(el.children.item(i), 'mousedown', () => {
                this.changeTargetElement(
                    new StackTargetInfo(parseInt(el.getAttribute('id_element') as string, DEFAULT_RADIX), tool as string),
                );
            });

            this.renderer.listen(el.children.item(i), 'mouseup', () => {
                this.changeTargetElement(
                    new StackTargetInfo(parseInt(el.getAttribute('id_element') as string, DEFAULT_RADIX), tool as string),
                );
            });
        }

        return el;
    }

    push(el: SVGGElement, byTool: boolean = true): void {
        this.drawStack.push(this.makeTargetable(el));
        if (this.idStack.length > 0) {
            this.drawingLoaderService.emptyDrawStack.next(false);
        }

        if (byTool) {
            this.undoRedoerService.saveCurrentState(this.idStack);
        }
    }

    reset(): SVGGElement[] {
        this.drawingLoaderService.emptyDrawStack.next(true);
        this.idStack.splice(0, this.idStack.length);
        return this.drawStack.splice(0, this.drawStack.length);
    }
}
