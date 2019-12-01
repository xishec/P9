import { ElementRef } from '@angular/core';
import { KEYS } from 'src/constants/constants';

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

export const createWheelEvent = (deltaX: number, deltaY: number): WheelEvent => {
    const wheelEvent = {
        deltaX,
        deltaY,
        preventDefault: () => null,
    };
    return (wheelEvent as unknown) as WheelEvent;
};

export const createKeyBoardEvent = (keyPressed: KEYS): KeyboardEvent => {
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
    const mockSVGElement = {
        transform : {
            baseVal : {
                insertItemBefore: () => null,
            },
        },
    };
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
            selectionBox: () => {
                const mockSelectionBox = {
                    x: {
                        baseVal: {
                            value: 0,
                        },
                    },
                    y: {
                        baseVal: {
                            value: 0,
                        },
                    },
                    width: {
                        baseVal: {
                            value: 100,
                        },
                    },
                    height: {
                        baseVal: {
                            value: 100,
                        },
                    },
                } as SVGRectElement;
                return mockSelectionBox;
            },
        },
    };
    return (mockSVGElement as unknown) as ElementRef<SVGElement>;
};

export const createMockSVGTransform = (): SVGTransform => {
    const mockTransform = {
        setTranslate: () => null,
        setRotate: () => null,
        setScale: () => null,
    };
    return mockTransform as unknown as SVGTransform;
};

export const createMockSVGSVGElementWithTransform = (): SVGSVGElement => {
    const mockSVGSVG = {
        createSVGTransform: () => {
            createMockSVGTransform();
        },
        setTranslate: () => null,
        setScale: () => null,
    };
    return mockSVGSVG as unknown as SVGSVGElement;
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

export const createMockSVGTextElement = (): SVGTextElement => {
    const mockSVGTextElement = {
        childNodes: [createMockSVGElement(), createMockSVGElement()] as SVGTSpanElement[],
        getBBox: () => {
            const mockDOMRect = { x: 500, y: 500, width: 50, height: 50 };
            return (mockDOMRect as unknown) as DOMRect;
        },
    };
    return (mockSVGTextElement as unknown) as SVGTextElement;
};

export const createMockSVGTSpanElement = (): SVGTSpanElement => {
    const mockTSpanElement = { textcontent: '' };
    return (mockTSpanElement as unknown) as SVGTSpanElement;
};
