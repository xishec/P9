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

export const createMockSVGElement = (): any => {
    const mockSVGElement = {
        nativeElement: {
            getBoundingClientRect: () => {
                const boundleft = 0;
                const boundtop = 0;
                const boundRect = {
                    left: boundleft,
                    top: boundtop,
                    width: boundleft * 2,
                    height: boundtop * 2,
                };
                return boundRect;
            },
        },
    };
    return (mockSVGElement as unknown) as ElementRef<SVGElement>;
};

export const createMockCanvasElement = (): any => {
    const mockCanvasElement = {};
    return (mockCanvasElement as unknown) as HTMLCanvasElement;
};

export const createMockSVGGElementWithAttribute = (att: string): any => {
    const attribute = att;
    const mockSVGElement = {
        getAttribute: (attToGet: string) => {
            return attToGet === attribute ? '10' : false;
        },
        getBoundingClientRect: () => {
            const mockDOMRect = { x: 500, y: 500, width: 50, height: 50 };
            return (mockDOMRect as unknown) as DOMRect;
        },
        childElementCount: 3,
        childNodes: () => {
            const mockGelementArray: SVGGElement[] = [
                createMockSVGGElement(),
                createMockSVGGElement(),
                createMockSVGGElement(),
            ];
            return mockGelementArray;
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
    constructor() {
        super(null);
    }
}
