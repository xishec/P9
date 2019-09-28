import { ElementRef } from '@angular/core';

export const createMouseEvent = (x: number, y: number, buttonPressed: number): MouseEvent => {
    const mouseEvent = {
        offsetX: x,
        offsety: y,
        button: buttonPressed,
    };
    return mouseEvent as unknown as MouseEvent;
};

export const createMockSVGCircle = (x: number, y: number): SVGCircleElement => {
    return new SVGCircleElement();
};

export class MockElementRef extends ElementRef {
    nativeElement = {};
}