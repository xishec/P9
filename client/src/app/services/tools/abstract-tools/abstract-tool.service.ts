import { Injectable, ElementRef, Renderer2 } from '@angular/core';
import { DrawStackService } from '../../draw-stack/draw-stack.service';

@Injectable({
    providedIn: 'root',
})
export abstract class AbstractToolService {
    // tslint:disable-next-line: no-empty
    constructor() {}

    abstract initializeService(
        elementRef: ElementRef<SVGElement>,
        renderer: Renderer2,
        drawStack: DrawStackService,
    ): void;
    abstract onMouseMove(event: MouseEvent): void;
    abstract onMouseDown(event: MouseEvent): void;
    abstract onMouseUp(event: MouseEvent): void;
    abstract onMouseEnter(event: MouseEvent): void;
    abstract onMouseLeave(event: MouseEvent): void;
    abstract onKeyDown(event: KeyboardEvent): void;
    abstract onKeyUp(event: KeyboardEvent): void;
    abstract cleanUp(): void;
}
