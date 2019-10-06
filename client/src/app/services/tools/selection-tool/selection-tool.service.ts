import { ElementRef, Injectable, Renderer2 } from '@angular/core';
import { Mouse, SVG_NS } from 'src/constants/constants';
import { AbstractToolService } from '../abstract-tools/abstract-tool.service';
import { DrawStackService } from '../../draw-stack/draw-stack.service';

@Injectable({
    providedIn: 'root',
})
export class SelectionToolService extends AbstractToolService {
    currentMouseX = 0;
    currentMouseY = 0;
    initialMouseX = 0;
    initialMouseY = 0;

    isSelecting = false;
    isManipulating = false;
    isIn = false;

    selectionRectangle: SVGRectElement = this.renderer.createElement('rect', SVG_NS);
    selection: Set<SVGGElement> = new Set();

    constructor(
        public drawStack: DrawStackService,
        public svgReference: ElementRef<SVGElement>,
        public renderer: Renderer2,
    ) {
        super();
    }

    updateSelectionRectangle(): void {
        let deltaX = this.currentMouseX - this.initialMouseX;
        let deltaY = this.currentMouseY - this.initialMouseY;

        // adjust x
        if (deltaX < 0) {
            deltaX *= -1;
            this.renderer.setAttribute(this.selectionRectangle, 'x', (this.initialMouseX - deltaX).toString());
            this.renderer.setAttribute(this.selectionRectangle, 'width', deltaX.toString());
        } else {
            this.renderer.setAttribute(this.selectionRectangle, 'x', this.initialMouseX.toString());
            this.renderer.setAttribute(this.selectionRectangle, 'width', deltaX.toString());
        }

        // adjust y
        if (deltaY < 0) {
            deltaY *= -1;
            this.renderer.setAttribute(this.selectionRectangle, 'y', (this.initialMouseY - deltaY).toString());
            this.renderer.setAttribute(this.selectionRectangle, 'height', deltaY.toString());
        } else {
            this.renderer.setAttribute(this.selectionRectangle, 'y', this.initialMouseY.toString());
            this.renderer.setAttribute(this.selectionRectangle, 'height', deltaY.toString());
        }

        this.renderer.setAttribute(this.selectionRectangle, 'fill', 'white');
        this.renderer.setAttribute(this.selectionRectangle, 'fill-opacity', '0.3');
        this.renderer.setAttribute(this.selectionRectangle, 'stroke', 'black');
        this.renderer.setAttribute(this.selectionRectangle, 'stroke-dasharray', '5 5');
    }

    isInSelection(selectionBox: DOMRect | ClientRect, elementBox: DOMRect | ClientRect): boolean {
        return (
            elementBox.left > selectionBox.left &&
            elementBox.right < selectionBox.right &&
            elementBox.top > selectionBox.top &&
            elementBox.bottom < selectionBox.bottom
        );
    }

    checkSelection(): void {
        const selectionBox = this.selectionRectangle.getBoundingClientRect();

        for (const el of this.drawStack.drawStack) {
            const elBox = el.getBoundingClientRect();
            if (this.isInSelection(selectionBox, elBox)) {
                this.selection.add(el);
            }
        }
    }

    hasSelected(): boolean {
        console.log(this.selection.size);
        console.log(this.selection);
        return this.selection.size > 0;
    }

    onMouseMove(event: MouseEvent): void {
        this.currentMouseX = event.clientX - this.svgReference.nativeElement.getBoundingClientRect().left;
        this.currentMouseY = event.clientY - this.svgReference.nativeElement.getBoundingClientRect().top;
        if (this.isSelecting) {
            this.updateSelectionRectangle();
            this.checkSelection();
        }
    }

    onMouseDown(event: MouseEvent): void {
        const button = event.button;

        if (button === Mouse.LeftButton && !this.isManipulating) {
            this.initialMouseX = this.currentMouseX;
            this.initialMouseY = this.currentMouseY;
            this.isSelecting = true;
            this.updateSelectionRectangle();
            this.renderer.appendChild(this.svgReference.nativeElement, this.selectionRectangle);
        } else {
            this.selection.clear();
            this.isManipulating = false;
        }
    }

    onMouseUp(event: MouseEvent): void {
        const button = event.button;

        if (button === Mouse.LeftButton) {
            this.isSelecting = false;
            this.renderer.removeChild(this.svgReference.nativeElement, this.selectionRectangle);
            if (this.hasSelected()) {
                this.isManipulating = true;
            }
        }
    }

    onMouseEnter(event: MouseEvent): void {
        this.isIn = true;
    }
    onMouseLeave(event: MouseEvent): void {
        this.isIn = false;
    }
    onKeyDown(event: KeyboardEvent): void {}
    onKeyUp(event: KeyboardEvent): void {}
}
