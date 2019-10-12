import { ElementRef, Injectable, Renderer2 } from '@angular/core';
import { DrawStackService } from '../../draw-stack/draw-stack.service';
import { AbstractToolService } from '../abstract-tools/abstract-tool.service';
import { SVG_NS } from 'src/constants/constants';
import { AttributesManagerService } from '../attributes-manager/attributes-manager.service';

@Injectable({
    providedIn: 'root',
})
export class StampToolService extends AbstractToolService {
    currentMouseX = 0;
    currentMouseY = 0;
    stampX = 0;
    stampY = 0;
    currentAngle = 0;
    currentScaling = 1;

    stampLink = '../../../../assets/stamps/iconmonstr-smiley-7.svg';

    stampIsAppended = false;
    isIn = false;

    readonly STAMP_BASE_WIDTH: number = 50;
    readonly STAMP_BASE_HEIGHT: number = 50;

    stamp: SVGImageElement = this.renderer.createElement('image', SVG_NS);

    attributesManagerService: AttributesManagerService;

    constructor(
        public drawStack: DrawStackService,
        public svgReference: ElementRef<SVGElement>,
        public renderer: Renderer2,
    ) {
        super();
    }

    initializeAttributesManagerService(attributesManagerService: AttributesManagerService): void {
        this.attributesManagerService = attributesManagerService;
        this.attributesManagerService.currentScaling.subscribe((newScaling) => {
            this.currentScaling = newScaling;
            this.setStamp();
        });
        this.attributesManagerService.currentStampType.subscribe((newStamp) => {
            this.stampLink = newStamp;
            this.setStamp();
        });
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
        this.renderer.setAttribute(this.stamp, 'width', (this.STAMP_BASE_WIDTH * this.currentScaling).toString());
        this.renderer.setAttribute(this.stamp, 'height', (this.STAMP_BASE_HEIGHT * this.currentScaling).toString());
        this.renderer.setAttribute(this.stamp, 'href', this.stampLink);
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
        this.renderer.setAttribute(stamp, 'width', (this.STAMP_BASE_WIDTH * this.currentScaling).toString());
        this.renderer.setAttribute(stamp, 'height', (this.STAMP_BASE_HEIGHT * this.currentScaling).toString());
        this.renderer.setAttribute(stamp, 'href', this.stampLink);
        this.renderer.setAttribute(stamp, 'transform', `rotate(${this.currentAngle}, ${this.stampX}, ${this.stampY})`);

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

    onWheel(event: WheelEvent): void {
        this.currentAngle += event.deltaY;
        this.renderer.setAttribute(this.stamp, 'transform', `rotate(${this.currentAngle}, ${this.stampX}, ${this.stampY})`);
    }

    onKeyDown(event: KeyboardEvent): void {}

    onKeyUp(event: KeyboardEvent): void {}
}
