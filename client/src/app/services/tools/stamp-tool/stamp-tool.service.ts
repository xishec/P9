import { ElementRef, Injectable, Renderer2 } from '@angular/core';

import { Keys, Mouse, SVG_NS } from 'src/constants/constants';
import { BASE64_STAMPS_MAP, HTMLAttribute, NO_STAMP } from 'src/constants/tool-constants';
import { DrawStackService } from '../../draw-stack/draw-stack.service';
import { AbstractToolService } from '../abstract-tools/abstract-tool.service';
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

    stamp: SVGImageElement;
    stampWrapper: SVGGElement;

    attributesManagerService: AttributesManagerService;

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

        this.stamp = this.renderer.createElement('image', SVG_NS);
        this.stampWrapper = this.renderer.createElement('g', SVG_NS);
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
                this.cleanUp();
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

    verifyPosition(event: MouseEvent): boolean {
        return (
            event.clientX > this.elementRef.nativeElement.getBoundingClientRect().left + window.scrollX &&
            event.clientY > this.elementRef.nativeElement.getBoundingClientRect().top + window.scrollY
        );
    }

    initStamp(): void {
        if (!this.stampIsAppended) {
            this.setStamp();
            this.renderer.appendChild(this.elementRef.nativeElement, this.stampWrapper);
            this.stampIsAppended = true;
        }
    }

    cleanUp(): void {
        if (this.stampIsAppended) {
            this.renderer.removeChild(this.elementRef.nativeElement, this.stampWrapper);
            this.stampIsAppended = false;
        }
    }

    setStamp(): void {
        this.renderer.setAttribute(
            this.stamp,
            HTMLAttribute.width,
            (this.STAMP_BASE_WIDTH * this.currentScaling).toString(),
        );
        this.renderer.setAttribute(
            this.stamp,
            HTMLAttribute.height,
            (this.STAMP_BASE_HEIGHT * this.currentScaling).toString(),
        );
        this.renderer.setAttribute(this.stamp, 'href', this.stampLink);
    }

    applyTransformation(): void {
        if (this.shouldStamp) {
            this.transform = `rotate(${this.currentAngle}, ${this.currentMouseX},
                ${this.currentMouseY}) translate(${this.stampX}, ${this.stampY})`;
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
        this.renderer.setAttribute(
            stamp,
            HTMLAttribute.width,
            (this.STAMP_BASE_WIDTH * this.currentScaling).toString(),
        );
        this.renderer.setAttribute(
            stamp,
            HTMLAttribute.height,
            (this.STAMP_BASE_HEIGHT * this.currentScaling).toString(),
        );
        this.renderer.setAttribute(stamp, 'x', this.stampX.toString());
        this.renderer.setAttribute(stamp, 'y', this.stampY.toString());
        this.renderer.setAttribute(stamp, 'href', BASE64_STAMPS_MAP.get(this.stampLink) as string);

        const rect: SVGRectElement = this.renderer.createElement('rect', SVG_NS);
        this.renderer.setAttribute(rect, HTMLAttribute.width, (this.STAMP_BASE_WIDTH * this.currentScaling).toString());
        this.renderer.setAttribute(
            rect,
            HTMLAttribute.height,
            (this.STAMP_BASE_HEIGHT * this.currentScaling).toString(),
        );
        this.renderer.setAttribute(rect, 'x', this.stampX.toString());
        this.renderer.setAttribute(rect, 'y', this.stampY.toString());
        this.renderer.setAttribute(rect, HTMLAttribute.fill, '#ffffff00');
        this.renderer.setAttribute(rect, HTMLAttribute.stroke, 'none');

        this.renderer.appendChild(el, stamp);
        this.renderer.appendChild(el, rect);
        this.renderer.setAttribute(el, 'transform', `translate(${this.stampX}, ${this.stampY})`);
        this.renderer.setAttribute(
            el,
            'transform',
            `rotate(${this.currentAngle}, ${this.currentMouseX}, ${this.currentMouseY})`,
        );
        this.renderer.appendChild(this.elementRef.nativeElement, el);
        setTimeout(() => {
            this.drawStack.push(el);
        }, 1);
    }

    rotateStamp(direction: number): void {
        if (direction < 0) {
            this.currentAngle = (this.currentAngle - this.STAMP_BASE_ROTATION) % 360;
        } else {
            this.currentAngle = (this.currentAngle + this.STAMP_BASE_ROTATION) % 360;
        }
    }

    alterRotateStamp(direction: number): void {
        if (direction < 0) {
            this.currentAngle = (this.currentAngle - this.STAMP_ALTER_ROTATION) % 360;
        } else {
            this.currentAngle = (this.currentAngle + this.STAMP_ALTER_ROTATION) % 360;
        }
    }

    onMouseMove(event: MouseEvent): void {
        this.currentMouseX = event.clientX - this.elementRef.nativeElement.getBoundingClientRect().left;
        this.currentMouseY = event.clientY - this.elementRef.nativeElement.getBoundingClientRect().top;

        this.positionStamp();
    }

    onMouseDown(event: MouseEvent): void {
        const button = event.button;

        if (button === Mouse.LeftButton && this.verifyPosition(event) && this.isIn && this.shouldStamp) {
            this.cleanUp();
            this.addStamp();
        }
    }

    onMouseUp(event: MouseEvent): void {
        const button = event.button;

        if (button === Mouse.LeftButton && this.verifyPosition(event) && this.isIn && this.shouldStamp) {
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
            this.cleanUp();
        }
    }

    onWheel(event: WheelEvent): void {
        if (this.isAlterRotation) {
            this.alterRotateStamp(event.deltaY);
        } else {
            this.rotateStamp(event.deltaY);
        }

        this.applyTransformation();
    }

    onKeyDown(event: KeyboardEvent): void {
        const key = event.key;

        if (key === Keys.Alt) {
            event.preventDefault();
            if (!this.isAlterRotation) {
                this.isAlterRotation = true;
            }
        }
    }

    onKeyUp(event: KeyboardEvent): void {
        const key = event.key;

        if (key === Keys.Alt) {
            event.preventDefault();
            if (this.isAlterRotation) {
                this.isAlterRotation = false;
            }
        }
    }
}
