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

// tslint:disable-next-line: max-classes-per-file
export class MockPolygon {
    points = '200,10 250,190 160,210';
}

export const createMouseEvent = (
    x: number,
    y: number,
    buttonPressed: number,
    offSetx?: number,
    offSety?: number,
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
        preventDefault: () => null,
    };
    return (keyboardEvent as unknown) as KeyboardEvent;
};

export const createMockSVGCircle = (): any => {
    const mockCircle = {
        addEventListener: () => null,
    };
    return mockCircle;
};

export const createMockSVGLine = (): any => {
    const mockLine = {};
    return (mockLine as unknown) as SVGLineElement;
};

export const createMockSVGGElement = (): any => {
    const mockSVGElement = {};
    return (mockSVGElement as unknown) as SVGGElement;
};

export const createMockSVGGElementWithAttribute = (att: string): any => {
    const attribute = att;
    const mockSVGElement = {
        getAttribute: (attToGet: string) => {
            if (attToGet === attribute) {
                return '10';
            } else {
                return false;
            }
        },
        getBoundingClientRect: () => {
            const mockDOMRect = { x: 500, y: 500, width: 50, height: 50 };
            return (mockDOMRect as unknown) as DOMRect;
        },
    };
    return (mockSVGElement as unknown) as SVGGElement;
};

export const createMockFilter = (): SVGFilterElement => {
    const mockFilter = {};
    return (mockFilter as unknown) as SVGFilterElement;
};

// tslint:disable-next-line: max-classes-per-file
export class MockElementRef extends ElementRef {
    nativeElement: {};
}
