import { ElementRef, Injectable, Renderer2 } from '@angular/core';

import { Keys, Mouse, SVG_NS } from 'src/constants/constants';
import {
    BASE64_STAMPS_MAP,
    HTMLAttribute,
    NO_STAMP,
    STAMP_BASE_WIDTH,
    STAMP_BASE_HEIGHT,
    STAMP_BASE_ROTATION,
    STAMP_ALTER_ROTATION,
} from 'src/constants/tool-constants';
import { DrawStackService } from '../../draw-stack/draw-stack.service';
import { AbstractToolService } from '../abstract-tools/abstract-tool.service';
import { AttributesManagerService } from '../attributes-manager/attributes-manager.service';
import { Coords2D } from 'src/classes/Coords2D';

@Injectable({
    providedIn: 'root',
})
export class StampToolService extends AbstractToolService {
    currentMouseCoords: Coords2D = { x: 0, y: 0 };
    stampCoords: Coords2D = { x: 0, y: 0 };

    currentAngle = 0;
    currentScaling = 1;

    stampLink = NO_STAMP;
    transform = '';

    stampIsAppended = false;
    isAlterRotation = false;
    isStampLinkValid = false;

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
                this.isStampLinkValid = false;
            } else {
                this.stampLink = newStamp;
                this.setStamp();
                this.isStampLinkValid = true;
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
            (STAMP_BASE_WIDTH * this.currentScaling).toString()
        );
        this.renderer.setAttribute(
            this.stamp,
            HTMLAttribute.height,
            (STAMP_BASE_HEIGHT * this.currentScaling).toString()
        );
        this.renderer.setAttribute(this.stamp, 'href', this.stampLink);
    }

    applyTransformation(): void {
        if (this.isStampLinkValid) {
            this.transform = `rotate(${this.currentAngle}, ${this.currentMouseCoords.x},
                ${this.currentMouseCoords.y}) translate(${this.stampCoords.x}, ${this.stampCoords.y})`;
            this.renderer.setAttribute(this.stampWrapper, 'transform', this.transform);
        }
    }

    positionStamp(): void {
        this.stampCoords.x = this.currentMouseCoords.x - this.stampWidth / 2;
        this.stampCoords.y = this.currentMouseCoords.y - this.stampHeight / 2;
        this.applyTransformation();
    }

    addStamp(): void {
        const el: SVGGElement = this.renderer.createElement('g', SVG_NS);
        const stamp: SVGImageElement = this.renderer.createElement('image', SVG_NS);
        this.renderer.setAttribute(
            stamp,
            HTMLAttribute.width,
            (STAMP_BASE_WIDTH * this.currentScaling).toString()
        );
        this.renderer.setAttribute(
            stamp,
            HTMLAttribute.height,
            (STAMP_BASE_HEIGHT * this.currentScaling).toString()
        );
        this.renderer.setAttribute(stamp, 'x', this.stampCoords.x.toString());
        this.renderer.setAttribute(stamp, 'y', this.stampCoords.y.toString());
        this.renderer.setAttribute(stamp, 'href', BASE64_STAMPS_MAP.get(this.stampLink) as string);

        const rect: SVGRectElement = this.renderer.createElement('rect', SVG_NS);
        this.renderer.setAttribute(rect, HTMLAttribute.width, (STAMP_BASE_WIDTH * this.currentScaling).toString());
        this.renderer.setAttribute(
            rect,
            HTMLAttribute.height,
            (STAMP_BASE_HEIGHT * this.currentScaling).toString()
        );
        this.renderer.setAttribute(rect, 'x', this.stampCoords.x.toString());
        this.renderer.setAttribute(rect, 'y', this.stampCoords.y.toString());
        this.renderer.setAttribute(rect, HTMLAttribute.fill, '#ffffff00');
        this.renderer.setAttribute(rect, HTMLAttribute.stroke, 'none');

        this.renderer.appendChild(el, stamp);
        this.renderer.appendChild(el, rect);
        this.renderer.setAttribute(el, 'transform', `translate(${this.stampCoords.x}, ${this.stampCoords.y})`);
        this.renderer.setAttribute(
            el,
            'transform',
            `rotate(${this.currentAngle}, ${this.currentMouseCoords.x}, ${this.currentMouseCoords.y})`
        );
        this.renderer.appendChild(this.elementRef.nativeElement, el);
        setTimeout(() => {
            this.drawStack.push(el);
        }, 0);
    }

    rotateStamp(direction: number): void {
        if (direction < 0) {
            this.currentAngle = (this.currentAngle - STAMP_BASE_ROTATION) % 360;
        } else {
            this.currentAngle = (this.currentAngle + STAMP_BASE_ROTATION) % 360;
        }
    }

    alterRotateStamp(direction: number): void {
        if (direction < 0) {
            this.currentAngle = (this.currentAngle - STAMP_ALTER_ROTATION) % 360;
        } else {
            this.currentAngle = (this.currentAngle + STAMP_ALTER_ROTATION) % 360;
        }
    }

    onMouseMove(event: MouseEvent): void {
        this.currentMouseCoords.x = event.clientX - this.elementRef.nativeElement.getBoundingClientRect().left;
        this.currentMouseCoords.y = event.clientY - this.elementRef.nativeElement.getBoundingClientRect().top;

        this.positionStamp();
    }

    isAbleToStamp(event: MouseEvent): boolean {
        return this.isMouseInRef(event, this.elementRef) && this.isStampLinkValid;
    }

    onMouseDown(event: MouseEvent): void {
        const button = event.button;

        if (button === Mouse.LeftButton && this.isAbleToStamp(event)) {
            this.cleanUp();
            this.addStamp();
        }
    }

    onMouseUp(event: MouseEvent): void {
        const button = event.button;

        if (button === Mouse.LeftButton && this.isAbleToStamp(event)) {
            this.initStamp();
        }
    }

    onMouseEnter(event: MouseEvent): void {
        if (this.isStampLinkValid) {
            this.initStamp();
        }
    }

    onMouseLeave(event: MouseEvent): void {
        if (this.isStampLinkValid) {
            this.cleanUp();
        }
    }

    onWheel(event: WheelEvent): void {
        if (!this.isStampLinkValid) {
            return;
        }

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
            this.isAlterRotation = true;
        }
    }

    onKeyUp(event: KeyboardEvent): void {
        const key = event.key;

        if (key === Keys.Alt) {
            event.preventDefault();
            this.isAlterRotation = false;
        }
    }
}
