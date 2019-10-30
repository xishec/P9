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
    canvas: HTMLCanvasElement;
    context2D: CanvasRenderingContext2D;
    SVGImg: HTMLImageElement;

    elementRef: ElementRef<SVGElement>;
    renderer: Renderer2;
    drawStack: DrawStackService;

    constructor() {
        super();
    }

    initializeService(elementRef: ElementRef<SVGElement>, renderer: Renderer2, drawStack: DrawStackService) {
        this.elementRef = elementRef;
        this.renderer = renderer;
        this.drawStack = drawStack;

        this.canvas = this.renderer.createElement('canvas');
        this.SVGImg = this.renderer.createElement('img');
        this.context2D = this.canvas.getContext('2d') as CanvasRenderingContext2D;
    }

    verifyPosition(event: MouseEvent): boolean {
        return (
            event.clientX > this.elementRef.nativeElement.getBoundingClientRect().left &&
            event.clientY > this.elementRef.nativeElement.getBoundingClientRect().top
        );
    }

    initializeColorToolService(colorToolService: ColorToolService): void {
        this.colorTool = colorToolService;
    }

    updateSVGCopy(): void {
        const serializedSVG = new XMLSerializer().serializeToString(this.elementRef.nativeElement);
        const base64SVG = btoa(serializedSVG);
        this.renderer.setProperty(this.SVGImg, 'src', 'data:image/svg+xml;base64,' + base64SVG);
        this.renderer.setProperty(this.canvas, 'width', this.elementRef.nativeElement.getBoundingClientRect().width);
        this.renderer.setProperty(this.canvas, 'height', this.elementRef.nativeElement.getBoundingClientRect().height);
        this.context2D = this.canvas.getContext('2d') as CanvasRenderingContext2D;
        this.context2D.drawImage(this.SVGImg, 0, 0);
    }

    pickColor(): Uint8ClampedArray {
        this.updateSVGCopy();
        return this.context2D.getImageData(this.currentMouseX, this.currentMouseY, 1, 1).data;
    }

    onMouseMove(event: MouseEvent): void {
        this.currentMouseX = event.clientX - this.elementRef.nativeElement.getBoundingClientRect().left;
        this.currentMouseY = event.clientY - this.elementRef.nativeElement.getBoundingClientRect().top;
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
    }
    onMouseEnter(event: MouseEvent): void {
        this.isIn = true;
    }
    onMouseLeave(event: MouseEvent): void {
        this.isIn = false;
    }

    // tslint:disable-next-line: no-empty
    onKeyDown(event: KeyboardEvent): void {}
    // tslint:disable-next-line: no-empty
    onKeyUp(event: KeyboardEvent): void {}
    // tslint:disable-next-line: no-empty
    cleanUp(): void {}

    getColor(event: MouseEvent): string {
        this.currentMouseX = event.clientX - this.elementRef.nativeElement.getBoundingClientRect().left;
        this.currentMouseY = event.clientY - this.elementRef.nativeElement.getBoundingClientRect().top;
        const colorRGB = this.pickColor();
        return this.colorTool.translateRGBToHex(colorRGB[0], colorRGB[1], colorRGB[2]);
    }
}
