import { Injectable, ElementRef, Renderer2 } from '@angular/core';
import { AbstractToolService } from '../abstract-tools/abstract-tool.service';
import { DrawStackService } from '../../draw-stack/draw-stack.service';
import { ColorToolService } from '../color-tool/color-tool.service';
import { Mouse } from 'src/constants/constants';

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
    }

    pickColor(): Uint8ClampedArray {
        this.updateSVGCopy();
        return this.context2D.getImageData(this.currentMouseX, this.currentMouseY, 1, 1).data;
    }

    onMouseMove(event: MouseEvent): void {}
    onMouseDown(event: MouseEvent): void {
        if (this.isIn) {
            this.getColor(event);
        }
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
    onMouseEnter(event: MouseEvent): void {this.isIn = true;}
    onMouseLeave(event: MouseEvent): void {this.isIn = false}
    onKeyDown(event: KeyboardEvent): void {}
    onKeyUp(event: KeyboardEvent): void {}

    getColor(event: MouseEvent): string {
        this.currentMouseX = event.clientX - this.svgReference.nativeElement.getBoundingClientRect().left;
        this.currentMouseY = event.offsetY - this.svgReference.nativeElement.getBoundingClientRect().top;
        const colorRGB = this.pickColor();
        return this.colorTool.translateRGBToHex(colorRGB[0], colorRGB[1], colorRGB[2]);
    }
}
