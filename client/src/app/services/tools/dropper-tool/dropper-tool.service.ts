import { ElementRef, Injectable, Renderer2 } from '@angular/core';
import { Mouse } from 'src/constants/constants';
import { DrawStackService } from '../../draw-stack/draw-stack.service';
import { AbstractToolService } from '../abstract-tools/abstract-tool.service';
import { ColorToolService } from '../color-tool/color-tool.service';

@Injectable({
    providedIn: 'root',
})
export class DropperToolService extends AbstractToolService {
    colorTool: ColorToolService;
    svg: SVGElement;
    currentMouseX = 0;
    currentMouseY = 0;
    isIn = false;
    pixelColor: string;
    canvas: HTMLCanvasElement = this.renderer.createElement('canvas');
    context2D: CanvasRenderingContext2D = this.canvas.getContext('2d') as CanvasRenderingContext2D;
    SVGImg: HTMLImageElement = this.renderer.createElement('img');

    constructor(
        public drawStack: DrawStackService,
        public svgReference: ElementRef<SVGElement>,
        public renderer: Renderer2,
    ) {
        super();
    }

    verifyPosition(event: MouseEvent): boolean {
        return (
            event.clientX > this.svgReference.nativeElement.getBoundingClientRect().left &&
            event.clientY > this.svgReference.nativeElement.getBoundingClientRect().top
        );
    }

    initializeColorToolService(colorToolService: ColorToolService): void {
        this.colorTool = colorToolService;
    }

    updateSVGCopy(): void {
        const serializedSVG = new XMLSerializer().serializeToString(this.svgReference.nativeElement);
        const base64SVG = btoa(serializedSVG);
        this.renderer.setProperty(this.SVGImg, 'src', 'data:image/svg+xml;base64,' + base64SVG);
        this.renderer.setProperty(this.canvas, 'width', this.svgReference.nativeElement.getBoundingClientRect().width);
        this.renderer.setProperty(
            this.canvas,
            'height',
            this.svgReference.nativeElement.getBoundingClientRect().height,
        );
        this.context2D = this.canvas.getContext('2d') as CanvasRenderingContext2D;
        this.context2D.drawImage(this.SVGImg, 0, 0);
        console.log(this.SVGImg.src);
    }

    pickColor(): Uint8ClampedArray {
        this.updateSVGCopy();
        return this.context2D.getImageData(this.currentMouseX, this.currentMouseY, 1, 1).data;
    }

    onMouseMove(event: MouseEvent): void {
        this.currentMouseX = event.clientX - this.svgReference.nativeElement.getBoundingClientRect().left;
        this.currentMouseY = event.clientY - this.svgReference.nativeElement.getBoundingClientRect().top;
    }
    onMouseDown(event: MouseEvent): void {
        this.isIn = this.verifyPosition(event);
        this.getColor(event);
    }
    onMouseUp(event: MouseEvent): void {
        const colorHex = this.getColor(event);

        const button = event.button;
        if (button === Mouse.LeftButton && this.isIn) {
            this.colorTool.changePrimaryColor(colorHex);
        } else if (button === Mouse.RightButton && this.isIn) {
            this.colorTool.changeSecondaryColor(colorHex);
        }

        // DEBUGGING
        //let d = this.canvas.toDataURL('image/png');
        //let w = window.open(d) as Window;
        //w.document.write("<img src='"+d+"' alt='from canvas'/>");
        // DEBUGGING
    }
    onMouseEnter(event: MouseEvent): void {
        this.isIn = true;
    }
    onMouseLeave(event: MouseEvent): void {
        this.isIn = false;
    }
    onKeyDown(event: KeyboardEvent): void {}
    onKeyUp(event: KeyboardEvent): void {}

    getColor(event: MouseEvent): string {
        this.currentMouseX = event.clientX - this.svgReference.nativeElement.getBoundingClientRect().left;
        this.currentMouseY = event.clientY - this.svgReference.nativeElement.getBoundingClientRect().top;
        const colorRGB = this.pickColor();
        return this.colorTool.translateRGBToHex(colorRGB[0], colorRGB[1], colorRGB[2]);
    }
}
