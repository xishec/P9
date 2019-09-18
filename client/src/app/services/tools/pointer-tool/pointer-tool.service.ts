import { Injectable, Renderer2 } from '@angular/core';
import { AbstractShapeToolService } from '../abstract-tools/abstract-shape-tool/abstract-shape-tool.service';

@Injectable({
  providedIn: 'root',
})
export class PointerToolService extends AbstractShapeToolService{

    constructor(renderer: Renderer2) {
        super(renderer);
    }

    onMouseMove(event: MouseEvent): void {
        console.log("Moving!");
    }
    onMouseDown(event: MouseEvent): void {
        console.log("Click!");
    }
    onMouseUp(event: MouseEvent): void {
        console.log("Unclick!");
    }
    onMouseEnter(event: MouseEvent): void {
        console.log("I'm in!")
    }
    onMouseLeave(event: MouseEvent): void {
        console.log("I'm out!");
    }
    onKeyDown(event: KeyboardEvent): void {
        console.log("Typing");
    }
    onKeyUp(event: KeyboardEvent): void {
        console.log("Untyping!");
    }
    createSVG(): void {

    }
}
