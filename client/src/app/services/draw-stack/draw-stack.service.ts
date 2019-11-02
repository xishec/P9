import { Injectable, Renderer2 } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

import { StackTargetInfo } from 'src/classes/StackTargetInfo';
import { DrawingLoaderService } from '../server/drawing-loader/drawing-loader.service';
import { HTMLAttribute } from 'src/constants/tool-constants';

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
    isEraserTool = false;

    constructor(renderer: Renderer2, private drawingLoaderService: DrawingLoaderService) {
        this.renderer = renderer;
    }

    changeTargetElement(stackTarget: StackTargetInfo): void {
        console.log('changeTragent Element to: ' + stackTarget.targetPosition);

        this.stackTarget.next(stackTarget);
    }

    mouseOverColorBorder(id_element: number, borderWidth: string | null, stackTarget?: StackTargetInfo): void {
        if (this.isEraserTool) {
            if (stackTarget !== undefined) {
                this.stackTarget.next(stackTarget);
            }
            // if (borderWidth !== '0' && borderWidth !== null) {
            //     borderWidth = (parseInt(borderWidth) + 5).toString();
            // } else {
            borderWidth = '5';
            // }
            console.log('on mouse over');

            this.renderer.setAttribute(this.getElementByPosition(id_element), HTMLAttribute.stroke, '#ff0000');
            this.renderer.setAttribute(this.getElementByPosition(id_element), HTMLAttribute.stroke_width, borderWidth);
        }
    }

    mouseOutRestoreBorder(id_element: number, border: string | null, borderWidth: string | null): void {
        if (this.isEraserTool) {
            if (border === null) {
                border = '';
            }
            console.log('on mouse out');

            if (borderWidth === null) {
                borderWidth = '0';
            }
            console.log('border: ' + border);

            this.renderer.setAttribute(this.getElementByPosition(id_element), HTMLAttribute.stroke, border);
            this.renderer.setAttribute(this.getElementByPosition(id_element), HTMLAttribute.stroke_width, borderWidth);
            //this.stackTarget.next(new StackTargetInfo(undefined, undefined));
        }
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
        //  const border = el.getAttribute(HTMLAttribute.stroke);
        //  const borderWidth = el.getAttribute(HTMLAttribute.stroke_width);
        this.renderer.setAttribute(el, 'id_element', position.toString());
        this.idStack.push(el.getAttribute('id_element') as string);

        for (let i = 0; i < el.children.length; i++) {
            this.renderer.listen(el.children.item(i), 'mousedown', () => {
                this.changeTargetElement(
                    new StackTargetInfo(parseInt(el.getAttribute('id_element') as string), tool as string),
                );
            });

            // this.renderer.listen(el.children.item(i), 'mousemove', () => {
            //     this.changeTargetElement(
            //         new StackTargetInfo(parseInt(el.getAttribute('id_element') as string), tool as string),
            //     );
            // });

            this.renderer.listen(el.children.item(i), 'mouseup', () => {
                this.changeTargetElement(
                    new StackTargetInfo(parseInt(el.getAttribute('id_element') as string), tool as string),
                );
            });

            // this.renderer.listen(el.children.item(i), 'mouseover', (event: MouseEvent) => {
            //     this.mouseOverColorBorder(
            //         parseInt(el.getAttribute('id_element') as string),
            //         borderWidth,
            //         new StackTargetInfo(parseInt(el.getAttribute('id_element') as string), tool as string),
            //     );
            // });

            // this.renderer.listen(el.children.item(i), 'mouseout', (event: MouseEvent) => {
            //     this.mouseOutRestoreBorder(parseInt(el.getAttribute('id_element') as string), border, borderWidth);
            // });
        }
        //console.log(this.idStack);

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
