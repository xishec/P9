import { ElementRef, Injectable, Renderer2 } from '@angular/core';

import { Coords2D } from 'src/classes/Coords2D';
import { MOUSE } from 'src/constants/constants';
import { AbstractToolService } from '../abstract-tools/abstract-tool.service';
import { ColorToolService } from '../color-tool/color-tool.service';
import { HTML_ATTRIBUTE } from 'src/constants/tool-constants';

@Injectable({
    providedIn: 'root',
})
export class DropperToolService extends AbstractToolService {
    private currentMouseCoords: Coords2D = new Coords2D(0, 0);
    private canvas: HTMLCanvasElement;
    private context2D: CanvasRenderingContext2D;
    private SVGImg: HTMLImageElement;

    private elementRef: ElementRef<SVGElement>;
    private renderer: Renderer2;

    constructor(private colorToolService: ColorToolService) {
        super();
    }

    initializeService(elementRef: ElementRef<SVGElement>, renderer: Renderer2) {
        this.elementRef = elementRef;
        this.renderer = renderer;

        this.canvas = this.renderer.createElement(HTML_ATTRIBUTE.Canvas);
        this.SVGImg = this.renderer.createElement(HTML_ATTRIBUTE.Img);
        this.context2D = this.canvas.getContext('2d') as CanvasRenderingContext2D;
    }

    updateSVGCopy(): void {
        const serializedSVG = new XMLSerializer().serializeToString(this.elementRef.nativeElement);
        this.renderer.setProperty(this.SVGImg, 'src', 'data:image/svg+xml,' + encodeURIComponent(serializedSVG));
        this.renderer.setProperty(this.canvas, HTML_ATTRIBUTE.Width, this.elementRef.nativeElement.getBoundingClientRect().width);
        this.renderer.setProperty(this.canvas, HTML_ATTRIBUTE.Height, this.elementRef.nativeElement.getBoundingClientRect().height);
        this.context2D = this.canvas.getContext('2d') as CanvasRenderingContext2D;
        this.context2D.drawImage(this.SVGImg, 0, 0);
    }

    pickColor(): Uint8ClampedArray {
        this.updateSVGCopy();
        return this.context2D.getImageData(this.currentMouseCoords.x, this.currentMouseCoords.y, 1, 1).data;
    }

    onMouseMove(event: MouseEvent): void {
        this.currentMouseCoords.x = event.clientX - this.elementRef.nativeElement.getBoundingClientRect().left;
        this.currentMouseCoords.y = event.clientY - this.elementRef.nativeElement.getBoundingClientRect().top;
    }
    onMouseDown(event: MouseEvent): void {
        this.getColor(event);
    }
    onMouseUp(event: MouseEvent): void {
        const colorHex = this.getColor(event);

        const button = event.button;
        if (button === MOUSE.LeftButton && this.isMouseInRef(event, this.elementRef)) {
            this.colorToolService.changePrimaryColor(colorHex);
        } else if (button === MOUSE.RightButton && this.isMouseInRef(event, this.elementRef)) {
            this.colorToolService.changeSecondaryColor(colorHex);
        }
    }
    // tslint:disable-next-line: no-empty
    onMouseEnter(event: MouseEvent): void {}
    // tslint:disable-next-line: no-empty
    onMouseLeave(event: MouseEvent): void {}
    // tslint:disable-next-line: no-empty
    onKeyDown(event: KeyboardEvent): void {}
    // tslint:disable-next-line: no-empty
    onKeyUp(event: KeyboardEvent): void {}
    // tslint:disable-next-line: no-empty
    cleanUp(): void {}

    getColor(event: MouseEvent): string {
        this.currentMouseCoords.x = event.clientX - this.elementRef.nativeElement.getBoundingClientRect().left;
        this.currentMouseCoords.y = event.clientY - this.elementRef.nativeElement.getBoundingClientRect().top;
        const colorRGB = this.pickColor();
        return this.colorToolService.translateRGBToHex(colorRGB[0], colorRGB[1], colorRGB[2]);
    }
}
