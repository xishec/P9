import { ElementRef, Injectable, Renderer2 } from '@angular/core';
import { DrawStackService } from '../../draw-stack/draw-stack.service';
import { AbstractToolService } from '../abstract-tools/abstract-tool.service';
import { SVG_NS } from 'src/constants/constants';
import { ToolName } from 'src/constants/tool-constants';
import { StackTargetInfo } from 'src/classes/StackTargetInfo';

@Injectable({
    providedIn: 'root',
})
export class StampToolService extends AbstractToolService {
    currentMouseX: number;
    currentMouseY: number;
    stampX: number;
    stampY: number;
    currentAngle: number;

    stampIsAppended = false;
    isIn = false;

    readonly STAMP_BASE_WIDTH: number = 200;
    readonly STAMP_BASE_HEIGHT: number = 50;

    stamp: SVGImageElement = this.renderer.createElement('image', SVG_NS);

    constructor(
        public drawStack: DrawStackService,
        public svgReference: ElementRef<SVGElement>,
        public renderer: Renderer2
    ) {
        super();
        this.renderer.setAttribute(this.stamp, 'href', '../../../../assets/brush1.png');
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
    }

    positionStamp(): void {
        this.stampX = this.currentMouseX - this.stamp.getBoundingClientRect().width / 2;
        this.stampY = this.currentMouseY - this.stamp.getBoundingClientRect().height / 2;
        this.renderer.setAttribute(this.stamp, 'x', this.stampX.toString());
        this.renderer.setAttribute(this.stamp, 'y', this.stampY.toString());
    }

    addStamp(): void {
        const el: SVGGElement = this.renderer.createElement('g', SVG_NS);
        const stamp: SVGImageElement = this.renderer.createElement('image', SVG_NS);
        this.renderer.setAttribute(stamp, 'x', this.stampX.toString());
        this.renderer.setAttribute(stamp, 'y', this.stampY.toString());
        this.renderer.setAttribute(stamp, 'width', this.STAMP_BASE_WIDTH.toString());
        this.renderer.setAttribute(stamp, 'height', this.STAMP_BASE_HEIGHT.toString());
        this.renderer.setAttribute(stamp, 'href', '../../../../assets/brush1.png');

        const currentDrawStackLength = this.drawStack.getDrawStackLength();
        stamp.addEventListener('mousedown', (event: MouseEvent) => {
            this.drawStack.changeTargetElement(new StackTargetInfo(currentDrawStackLength, ToolName.Rectangle));
        });

        this.renderer.appendChild(el, stamp);
        this.drawStack.push(el);
        this.renderer.appendChild(this.svgReference.nativeElement, el);
    }

    onMouseMove(event: MouseEvent): void {
        this.currentMouseX = event.clientX - this.svgReference.nativeElement.getBoundingClientRect().left;
        this.currentMouseY = event.clientY - this.svgReference.nativeElement.getBoundingClientRect().top;

        this.positionStamp();
    }

    onMouseDown(event: MouseEvent): void {
        if (this.isIn) {
            this.cleanUpStamp();
            this.addStamp();
        }
    }

    onMouseUp(event: MouseEvent): void {
        if (this.isIn) {
            this.initStamp();
        }
    }

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
