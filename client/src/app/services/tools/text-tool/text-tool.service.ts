import { Injectable, ElementRef, Renderer2 } from '@angular/core';
import { AbstractToolService } from '../abstract-tools/abstract-tool.service';
import { DrawStackService } from '../../draw-stack/draw-stack.service';

@Injectable({
    providedIn: 'root',
})

export class TextToolService extends AbstractToolService {

    elementRef: ElementRef<SVGElement>;
    renderer: Renderer2;
    drawStack: DrawStackService;

    constructor() {
        super();
    }

    initializeService(elementRef: ElementRef<SVGElement>, renderer: Renderer2, drawStack: DrawStackService): void {
        this.elementRef = elementRef;
        this.renderer = renderer;
        this.drawStack = drawStack;
    }

    onMouseMove(event: MouseEvent): void {
        // nothing
    }

    onMouseDown(event: MouseEvent): void {
        // create the rectangle
        // disable shortcuts until on mouse down outside

    }
    onMouseUp(event: MouseEvent): void {
        throw new Error("Method not implemented.");
    }
    onMouseEnter(event: MouseEvent): void {
        throw new Error("Method not implemented.");
    }
    onMouseLeave(event: MouseEvent): void {
        throw new Error("Method not implemented.");
    }
    onKeyDown(event: KeyboardEvent): void {
        // update the text
    }
    onKeyUp(event: KeyboardEvent): void {
        throw new Error("Method not implemented.");
    }
    cleanUp(): void {
        throw new Error("Method not implemented.");
    }

    

    
}
