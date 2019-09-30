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
};

export const createMockSVGCircle = (): any => {
    const mockCircle = {
        addEventListener: () => null,
    };
    return mockCircle;
};

export const createMockSVGRect = (): SVGRectElement => {
    const mockRect = {
        addEventListener: () => null,

    };
    return mockRect as unknown as SVGRectElement;
};

export const createMockFilter = (): SVGFilterElement => {
    const mockFilter = {

    };
    return mockFilter as unknown as SVGFilterElement;
};

export class MockElementRef extends ElementRef {
    nativeElement: {
    };
}

export const getRandomNumber = (): number => {
    return Math.random() * 100;
}
