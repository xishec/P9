import { ElementRef } from '@angular/core';
import { Keys } from 'src/constants/constants';

export class MockRect {
    x = 0;
    y = 0;
    width = 0;
    height = 0;
    // tslint:disable-next-line: no-empty
    addEventListener(): void {}
}

export const createMouseEvent = (
    x: number,
    y: number,
    buttonPressed: number,
    offSetx?: number,
    offSety?: number
): MouseEvent => {
    const mouseEvent = {
        clientX: x,
        clientY: y,
        button: buttonPressed,
        offsetX: offSetx,
        offsetY: offSety,
    };
    return (mouseEvent as unknown) as MouseEvent;
};

export const createKeyBoardEvent = (keyPressed: Keys): KeyboardEvent => {
    const keyboardEvent = {
        key: keyPressed,
        preventDefault: () => {},
    };
    return (keyboardEvent as unknown) as KeyboardEvent;
};

export const createMockSVGCircle = (): any => {
    const mockCircle = {
        addEventListener: () => null,
    };
    return mockCircle;
};

export const createMockFilter = (): SVGFilterElement => {
    const mockFilter = {};
    return (mockFilter as unknown) as SVGFilterElement;
};

// tslint:disable-next-line: max-classes-per-file
export class MockElementRef extends ElementRef {
    nativeElement: {};
}
