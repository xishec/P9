import { ElementRef } from '@angular/core';
import { Keys } from 'src/constants/constants';

export const createMouseEvent = (x: number, y: number, buttonPressed: number): MouseEvent => {
    const mouseEvent = {
        clientX: x,
        clientY: y,
        button: buttonPressed,
    };
    return mouseEvent as unknown as MouseEvent;
};

export const createKeyBoardEvent = (keyPressed: Keys): KeyboardEvent => {
    const keyboardEvent = {
        key: keyPressed,
    };
    return keyboardEvent as unknown as KeyboardEvent;
}

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