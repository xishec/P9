import { ElementRef, Injectable, Renderer2, AfterViewInit } from '@angular/core';
import { DrawStackService } from '../../draw-stack/draw-stack.service';
import { AbstractToolService } from '../abstract-tools/abstract-tool.service';
import { SVG_NS } from 'src/constants/constants';
import { ToolName } from 'src/constants/tool-constants';

@Injectable({
    providedIn: 'root',
})
export class StampToolService extends AbstractToolService {
    currentMouseX: number;
    currentMouseY: number;
    currentAngle: number;

    stampIsAppended = false;
    isIn = false;

    readonly STAMP_BASE_WIDTH: number = 50;
    readonly STAMP_BASE_HEIGHT: number = 50;

    stamp: SVGRectElement = this.renderer.createElement('rect', SVG_NS);

    constructor(
        public drawStack: DrawStackService,
        public svgReference: ElementRef<SVGElement>,
        public renderer: Renderer2
    ) {
        super();
    }

    initStamp(): void {
        if (!this.stampIsAppended) {
            this.setStamp();
            this.renderer.appendChild(this.svgReference.nativeElement, this.stamp);
            this.stampIsAppended = true;
        }
    }

    cleanUpStamp(): void {
        if (this.stampIsAppended) {
            this.renderer.removeChild(this.svgReference.nativeElement, this.stamp);
            this.stampIsAppended = false;
        }
    }

    setStamp(): void {
        this.renderer.setAttribute(this.stamp, 'width', this.STAMP_BASE_WIDTH.toString());
        this.renderer.setAttribute(this.stamp, 'height', this.STAMP_BASE_HEIGHT.toString());
        this.renderer.setAttribute(this.stamp, 'fill', 'green');
    }

    positionStamp(): void {
        const stampX = this.currentMouseX - this.stamp.getBoundingClientRect().width / 2;
        const stampY = this.currentMouseY - this.stamp.getBoundingClientRect().height / 2;
        this.renderer.setAttribute(this.stamp, 'x', stampX.toString());
        this.renderer.setAttribute(this.stamp, 'y', stampY.toString());
    }

    onMouseMove(event: MouseEvent): void {
        this.currentMouseX = event.clientX - this.svgReference.nativeElement.getBoundingClientRect().left;
        this.currentMouseY = event.clientY - this.svgReference.nativeElement.getBoundingClientRect().top;

        this.positionStamp();
    }

    onMouseDown(event: MouseEvent): void {}

    onMouseUp(event: MouseEvent): void {}

    onMouseEnter(event: MouseEvent): void {
        this.isIn = true;
        this.initStamp();
    }

    onMouseLeave(event: MouseEvent): void {
        this.isIn = false;
        this.cleanUpStamp();
    }

    onKeyDown(event: KeyboardEvent): void {}

    onKeyUp(event: KeyboardEvent): void {}
}
