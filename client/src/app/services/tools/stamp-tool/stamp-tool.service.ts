import { ElementRef, Injectable, Renderer2 } from '@angular/core';
import { DrawStackService } from '../../draw-stack/draw-stack.service';
import { AbstractToolService } from '../abstract-tools/abstract-tool.service';
import { SVG_NS, Keys, Mouse} from 'src/constants/constants';
import { NO_STAMP } from 'src/constants/tool-constants';
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

    stampLink = NO_STAMP;
    transform = '';

    stampIsAppended = false;
    isIn = false;
    isAlterRotation = false;
    shouldStamp = false;

    readonly STAMP_BASE_WIDTH: number = 50;
    readonly STAMP_BASE_HEIGHT: number = 50;
    readonly STAMP_BASE_ROTATION: number = 15;
    readonly STAMP_ALTER_ROTATION: number = 1;

    stamp: SVGImageElement = this.renderer.createElement('image', SVG_NS);
    stampWrapper: SVGGElement = this.renderer.createElement('g', SVG_NS);

    attributesManagerService: AttributesManagerService;

    constructor(
        public drawStack: DrawStackService,
        public svgReference: ElementRef<SVGElement>,
        public renderer: Renderer2,
    ) {
        super();
        this.renderer.appendChild(this.stampWrapper, this.stamp);
    }

    initializeAttributesManagerService(attributesManagerService: AttributesManagerService): void {
        this.attributesManagerService = attributesManagerService;
        this.attributesManagerService.currentScaling.subscribe((newScaling) => {
            this.currentScaling = newScaling;
            this.setStamp();
        });
        this.attributesManagerService.currentAngle.subscribe((newAngle) => {
            this.currentAngle = newAngle;
            this.applyTransformation();
        });
        this.attributesManagerService.currentStampType.subscribe((newStamp) => {
            if (newStamp === NO_STAMP) {
                this.cleanUpStamp();
                this.shouldStamp = false;
            } else {
                this.stampLink = newStamp;
                this.setStamp();
                this.shouldStamp = true;
            }
        });
    }

    get stampWidth(): number {
        return this.stamp.width.baseVal.value;
    }

    get stampHeight(): number {
        return this.stamp.height.baseVal.value;
    }

    initStamp(): void {
        if (!this.stampIsAppended) {
            this.setStamp();
            this.renderer.appendChild(this.svgReference.nativeElement, this.stampWrapper);
            this.stampIsAppended = true;
        }
    }

    cleanUpStamp(): void {
        if (this.stampIsAppended) {
            this.renderer.removeChild(this.svgReference.nativeElement, this.stampWrapper);
            this.stampIsAppended = false;
        }
    }

    setStamp(): void {
        this.renderer.setAttribute(this.stamp, 'width', (this.STAMP_BASE_WIDTH * this.currentScaling).toString());
        this.renderer.setAttribute(this.stamp, 'height', (this.STAMP_BASE_HEIGHT * this.currentScaling).toString());
        this.renderer.setAttribute(this.stamp, 'href', this.stampLink);
    }

    applyTransformation(): void {
        if (this.shouldStamp) {
            this.transform = `rotate(${this.currentAngle}, ${this.currentMouseX}, ${this.currentMouseY}) translate(${this.stampX}, ${this.stampY})`;
            this.renderer.setAttribute(this.stampWrapper, 'transform', this.transform);
        }
    }

    positionStamp(): void {
        this.stampX = this.currentMouseX - this.stampWidth / 2;
        this.stampY = this.currentMouseY - this.stampHeight / 2;
        this.applyTransformation();
    }

    addStamp(): void {
        const el: SVGGElement = this.renderer.createElement('g', SVG_NS);
        const stamp: SVGImageElement = this.renderer.createElement('image', SVG_NS);
        this.renderer.setAttribute(stamp, 'width', (this.STAMP_BASE_WIDTH * this.currentScaling).toString());
        this.renderer.setAttribute(stamp, 'height', (this.STAMP_BASE_HEIGHT * this.currentScaling).toString());
        this.renderer.setAttribute(stamp, 'href', this.stampLink);

        this.renderer.appendChild(el, stamp);
        this.renderer.setAttribute(el, 'transform', this.transform);
        this.drawStack.push(el);
        this.renderer.appendChild(this.svgReference.nativeElement, el);
    }

    rotateStamp(direction: number): void {
        if (direction < 0) {
            this.currentAngle -= this.STAMP_BASE_ROTATION;
        } else {
            this.currentAngle += this.STAMP_BASE_ROTATION;
        }
    }

    alterRotateStamp(direction: number): void {
        if (direction < 0) {
            this.currentAngle -= this.STAMP_ALTER_ROTATION;
        } else {
            this.currentAngle += this.STAMP_ALTER_ROTATION;
        }
    }

    onMouseMove(event: MouseEvent): void {
        this.currentMouseX = event.clientX - this.svgReference.nativeElement.getBoundingClientRect().left;
        this.currentMouseY = event.clientY - this.svgReference.nativeElement.getBoundingClientRect().top;

        this.positionStamp();
    }

    onMouseDown(event: MouseEvent): void {
        const button = event.button;

        if (button === Mouse.LeftButton && this.isIn && this.shouldStamp) {
            this.cleanUpStamp();
            this.addStamp();
        }
    }

    onMouseUp(event: MouseEvent): void {
        const button = event.button;

        if (button === Mouse.LeftButton && this.isIn && this.shouldStamp) {
            this.initStamp();
        }
    }

    onMouseEnter(event: MouseEvent): void {
        this.isIn = true;

        if (this.shouldStamp) {
            this.initStamp();
        }
    }

    onMouseLeave(event: MouseEvent): void {
        this.isIn = false;

        if (this.shouldStamp) {
            this.cleanUpStamp();
        }
    }

    onWheel(event: WheelEvent): void {
        console.log(this.isAlterRotation);
        if (this.isAlterRotation) {
            this.alterRotateStamp(event.deltaY);
        } else {
            this.rotateStamp(event.deltaY);
        }

        this.applyTransformation();
    }

    onKeyDown(event: KeyboardEvent): void {
        event.preventDefault();
        const key = event.key;

        if (key === Keys.Alt) {
            if (!this.isAlterRotation) {
                this.isAlterRotation = true;
            }
        }
    }

    onKeyUp(event: KeyboardEvent): void {
        event.preventDefault();
        const key = event.key;

        if (key === Keys.Alt) {
            if (this.isAlterRotation) {
                this.isAlterRotation = false;
            }
        }
    }
}
