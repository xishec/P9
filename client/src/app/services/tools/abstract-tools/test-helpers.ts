import { ElementRef } from '@angular/core';

export const createMouseEvent = (x: number, y: number, buttonPressed: number): MouseEvent => {
    const mouseEvent = {
        clientX: x,
        clientY: y,
        button: buttonPressed,
    };
    return mouseEvent as unknown as MouseEvent;
};

export const createMockSVGCircle = (): any => {
    const mockCircle = {
        addEventListener: () => null,
    };
    return mockCircle;
};

export class MockElementRef extends ElementRef {
    nativeElement: {
    };
}