import { Injectable, ElementRef, Renderer2 } from '@angular/core';
import { AbstractToolService } from '../abstract-tools/abstract-tool.service';
import { DrawStackService } from '../../draw-stack/draw-stack.service';

@Injectable({
    providedIn: 'root',
})
export class DropperToolService extends AbstractToolService {
    currentMouseX = 0;
    currentMouseY = 0;
    pixelColor: string;
    canvas: HTMLCanvasElement;
    context2D: CanvasRenderingContext2D;
    SVGImg: HTMLImageElement = this.renderer.createElement('img');

    constructor(public drawStack: DrawStackService, public svgReference: ElementRef<SVGElement>, public renderer: Renderer2) {
        super();

        this.canvas = this.renderer.createElement('canvas');
        this.context2D = this.canvas.getContext('2d') as CanvasRenderingContext2D;
    }

    updateSVGCopy(): void {
        const serializedSVG = new XMLSerializer().serializeToString(this.svgReference.nativeElement);
        const base64SVG = btoa(serializedSVG);
        this.SVGImg.src = 'data:image/svg+xml;base64,' + base64SVG;
        this.context2D.drawImage(this.SVGImg, 0, 0);
    }

    pickColor(): void {
        console.log(this.currentMouseX + ' ' + this.currentMouseY);
        const data = this.context2D.getImageData(this.currentMouseX, this.currentMouseY, 1, 1);
        console.log(data);
    }

    onMouseMove(event: MouseEvent): void {}
    onMouseDown(event: MouseEvent): void {
        this.currentMouseX = event.clientX - this.svgReference.nativeElement.getBoundingClientRect().left;
        this.currentMouseY = event.offsetY - this.svgReference.nativeElement.getBoundingClientRect().top;
        this.updateSVGCopy();
        this.pickColor();
    }
    onMouseUp(event: MouseEvent): void {}
    onMouseEnter(event: MouseEvent): void {}
    onMouseLeave(event: MouseEvent): void {}
    onKeyDown(event: KeyboardEvent): void {}
    onKeyUp(event: KeyboardEvent): void {}
}
