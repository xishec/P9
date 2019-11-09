import { ElementRef, Injectable, Renderer2 } from '@angular/core';
import { DrawStackService } from '../../draw-stack/draw-stack.service';

@Injectable({
    providedIn: 'root',
})
export abstract class AbstractToolService {
    abstract initializeService(
        elementRef: ElementRef<SVGElement>,
        renderer: Renderer2,
        drawStack: DrawStackService,
    ): void;
    isMouseInRef(event: MouseEvent, elementRef: ElementRef): boolean {
        return (
            event.clientX > elementRef.nativeElement.getBoundingClientRect().left + window.scrollX &&
            event.clientY > elementRef.nativeElement.getBoundingClientRect().top + window.scrollY
        );
    }
    abstract onMouseMove(event: MouseEvent): void;
    abstract onMouseDown(event: MouseEvent): void;
    abstract onMouseUp(event: MouseEvent): void;
    abstract onMouseEnter(event: MouseEvent): void;
    abstract onMouseLeave(event: MouseEvent): void;
    abstract onKeyDown(event: KeyboardEvent): void;
    abstract onKeyUp(event: KeyboardEvent): void;
    abstract cleanUp(): void;
}

export interface MouseCoords {
    x: number;
    y: number;
}
