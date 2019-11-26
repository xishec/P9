import { ElementRef, Injectable, Renderer2 } from '@angular/core';

import { Coords2D } from 'src/classes/Coords2D';
import { KEYS, MOUSE, SVG_NS } from 'src/constants/constants';
import {
    ALTER_ROTATION,
    BASE64_STAMPS_MAP,
    BASE_ROTATION,
    HTML_ATTRIBUTE,
    NO_STAMP,
    STAMP_ANGLE_ORIENTATION,
    STAMP_BASE_HEIGHT,
    STAMP_BASE_WIDTH,
    STAMP_SCALING,
} from 'src/constants/tool-constants';
import { DrawStackService } from '../../draw-stack/draw-stack.service';
import { AbstractToolService } from '../abstract-tools/abstract-tool.service';
import { AttributesManagerService } from '../attributes-manager/attributes-manager.service';

@Injectable({
    providedIn: 'root',
})
export class StampToolService extends AbstractToolService {
    currentMouseCoords: Coords2D = new Coords2D(0, 0);
    stampCoords: Coords2D = new Coords2D(0, 0);

    angle: STAMP_ANGLE_ORIENTATION = STAMP_ANGLE_ORIENTATION.Default;
    scaling: STAMP_SCALING = STAMP_SCALING.Default;
    selected: SVGGElement;

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
        this.attributesManagerService.scaling.subscribe((newScaling) => {
            this.scaling = newScaling;
            this.setStamp();
        });
        this.attributesManagerService.angle.subscribe((newAngle) => {
            this.angle = newAngle;
            this.applyTransformation();
        });
        this.attributesManagerService.stampType.subscribe((newStamp) => {
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
        this.renderer.setAttribute(this.stamp, HTML_ATTRIBUTE.width, (STAMP_BASE_WIDTH * this.scaling).toString());
        this.renderer.setAttribute(this.stamp, HTML_ATTRIBUTE.height, (STAMP_BASE_HEIGHT * this.scaling).toString());
        this.renderer.setAttribute(this.stamp, 'href', this.stampLink);
    }

    applyTransformation(): void {
        if (this.isStampLinkValid) {
            this.transform = `rotate(${this.angle}, ${this.currentMouseCoords.x},
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
        this.renderer.setAttribute(stamp, HTML_ATTRIBUTE.width, (STAMP_BASE_WIDTH * this.scaling).toString());
        this.renderer.setAttribute(stamp, HTML_ATTRIBUTE.height, (STAMP_BASE_HEIGHT * this.scaling).toString());
        this.renderer.setAttribute(stamp, 'x', this.stampCoords.x.toString());
        this.renderer.setAttribute(stamp, 'y', this.stampCoords.y.toString());
        this.renderer.setAttribute(stamp, 'href', BASE64_STAMPS_MAP.get(this.stampLink) as string);

        const rect: SVGRectElement = this.renderer.createElement('rect', SVG_NS);
        this.renderer.setAttribute(rect, HTML_ATTRIBUTE.width, (STAMP_BASE_WIDTH * this.scaling).toString());
        this.renderer.setAttribute(rect, HTML_ATTRIBUTE.height, (STAMP_BASE_HEIGHT * this.scaling).toString());
        this.renderer.setAttribute(rect, 'x', this.stampCoords.x.toString());
        this.renderer.setAttribute(rect, 'y', this.stampCoords.y.toString());
        this.renderer.setAttribute(rect, HTML_ATTRIBUTE.fill, '#ffffff00');
        this.renderer.setAttribute(rect, HTML_ATTRIBUTE.stroke, 'none');

        this.renderer.appendChild(el, stamp);
        this.renderer.appendChild(el, rect);
        this.renderer.setAttribute(el, 'transform', `translate(${this.stampCoords.x}, ${this.stampCoords.y})`);
        this.renderer.setAttribute(
            el,
            'transform',
            `rotate(${this.angle}, ${this.currentMouseCoords.x}, ${this.currentMouseCoords.y})`,
        );
        const svg: SVGSVGElement = this.renderer.createElement('svg', SVG_NS);
        const rotateToZero = svg.createSVGTransform();
        rotateToZero.setRotate(0, this.currentMouseCoords.x, this.currentMouseCoords.y);
        el.transform.baseVal.insertItemBefore(rotateToZero, 0);
        this.renderer.appendChild(this.elementRef.nativeElement, el);
        setTimeout(() => {
            this.drawStack.push(el);
        }, 0);
    }

    rotateStamp(direction: number): void {
        if (direction < 0) {
            this.angle = (this.angle - BASE_ROTATION) % 360;
        } else {
            this.angle = (this.angle + BASE_ROTATION) % 360;
        }
    }

    alterRotateStamp(direction: number): void {
        if (direction < 0) {
            this.angle = (this.angle - ALTER_ROTATION) % 360;
        } else {
            this.angle = (this.angle + ALTER_ROTATION) % 360;
        }
    }

    onMouseMove(event: MouseEvent): void {
        this.currentMouseCoords.x = event.clientX - this.elementRef.nativeElement.getBoundingClientRect().left;
        this.currentMouseCoords.y = event.clientY - this.elementRef.nativeElement.getBoundingClientRect().top;

        this.positionStamp();
    }

    isAbleToStamp(event: MouseEvent): boolean {
        return this.isMouseInRef(event, this.elementRef) && this.isStampLinkValid && this.stampIsAppended;
    }

    onMouseDown(event: MouseEvent): void {
        const button = event.button;

        if (button === MOUSE.LeftButton && this.isAbleToStamp(event)) {
            this.cleanUp();
            this.addStamp();
        }
    }

    onMouseUp(event: MouseEvent): void {
        const button = event.button;

        if (button === MOUSE.LeftButton && this.isAbleToStamp(event)) {
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

        if (key === KEYS.Alt) {
            event.preventDefault();
            this.isAlterRotation = true;
        }
    }

    onKeyUp(event: KeyboardEvent): void {
        const key = event.key;

        if (key === KEYS.Alt) {
            event.preventDefault();
            this.isAlterRotation = false;
        }
    }
}
