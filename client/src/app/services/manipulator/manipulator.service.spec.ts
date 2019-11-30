import { getTestBed, TestBed } from '@angular/core/testing';

import { ElementRef, Renderer2, Type } from '@angular/core';
import { Coords2D } from 'src/classes/Coords2D';
import * as TestHelpers from 'src/classes/test-helpers.spec';
import { autoMock } from 'src/classes/test.helper.msTeams.spec';
import { Selection } from '../../../classes/selection/selection';
import { ManipulatorService } from './manipulator.service';

describe('ManipulatorService', () => {
    let selection: Selection;
    let service: ManipulatorService;
    let injector: TestBed;
    let rendererMock: Renderer2;
    let elementRefMock: ElementRef<SVGGElement>;
    let spyOnCreateElement: jasmine.Spy;

    const createMockSVGSVGElement = (): SVGSVGElement => {
        const mockSVGSVG = {
            createSVGTransform: () => {
                const mockTransform = {
                    setTranslate: () => null,
                    setRotate: () => null,
                    setScale: () => null,
                    matrix: autoMock(DOMMatrix) as unknown as DOMMatrix,
                };
                return mockTransform as unknown as SVGTransform;
            },
            createSVGTransformFromMatrix: () => null,
        };
        return mockSVGSVG as unknown as SVGSVGElement;
    };

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                Selection,
                ManipulatorService,
                {
                    provide: Renderer2,
                    useValue: {
                        createElement: () => null,
                        setAttribute: () => null,
                        appendChild: () => null,
                        removeChild: () => null,
                    },
                },
                {
                    provide: ElementRef,
                    useValue: {
                        nativeElement: {
                            getBoundingClientRect: () => {
                                const boundLeft = 0;
                                const boundTop = 0;
                                const boundRect = {
                                    left: boundLeft,
                                    top: boundTop,
                                };
                                return boundRect;
                            },
                        },
                    },
                },
            ],
        });
        injector = getTestBed();
        rendererMock = injector.get<Renderer2>(Renderer2 as Type<Renderer2>);
        elementRefMock = injector.get<ElementRef>(ElementRef as Type<ElementRef>);
        selection = new Selection(rendererMock, elementRefMock);
        service = injector.get(ManipulatorService);
        service.initializeService(rendererMock);
        spyOnCreateElement = spyOn(rendererMock, 'createElement');
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should assign the renderer on initializeService', () => {
        expect(service.renderer).toBeTruthy();
    });

    it('should update selected elements origins and boxOrigin on updateOrigins', () => {
        const mockRect = {
            x: {
                baseVal: {
                    value: 10,
                },
            },
            y: {
                baseVal: {
                    value: 10,
                },
            },
            width: {
                baseVal: {
                    value: 10,
                },
            },
            height: {
                baseVal: {
                    value: 10,
                },
            },
        };
        selection.selectionBox = mockRect as unknown as SVGRectElement;
        const spy = spyOn(service, 'updateElementsOrigins').and.callFake(() => null);

        service.updateOrigins(selection);

        expect(spy).toHaveBeenCalled();
        expect(service.boxOrigin.x).toEqual(15);
        expect(service.boxOrigin.y).toEqual(15);
    });

    it('should update selected elements origins and boxOrigin on updateOrigins', () => {
        const mockRect = {
            x: {
                baseVal: {
                    value: 10 as number,
                },
            },
            y: {
                baseVal: {
                    value: 10 as number,
                },
            },
            width: {
                baseVal: {
                    value: 10 as number,
                },
            },
            height: {
                baseVal: {
                    value: 10 as number,
                },
            },
        };

        const mockSvgG = {
            getBoundingClientRect: () => {
                return mockRect as unknown as ClientRect;
            },
        };

        const spyClear = spyOn(service.selectedElementsOrigin, 'clear').and.callFake(() => null);
        const spySet = spyOn(service.selectedElementsOrigin, 'set').and.callFake(() => new Map<SVGGElement, Coords2D>());
        selection.selectedElements.add(mockSvgG as unknown as SVGGElement);
        service.updateElementsOrigins(selection);

        expect(spyClear).toHaveBeenCalled();
        expect(spySet).toHaveBeenCalled();
    });

    it('should not do anything if there is more than 0 transforms on element on prepareForTransform', () => {
        const mockSVGG = {
            transform: {
                baseVal: {
                    numberOfItems: 1,
                    appendItem: () => null,
                },
            },
        };

        spyOnCreateElement.and.callFake(createMockSVGSVGElement);

        const spy = spyOn(mockSVGG.transform.baseVal, 'appendItem');

        service.prepareForTransform(mockSVGG as unknown as SVGGElement);

        expect(spyOnCreateElement).not.toHaveBeenCalled();
        expect(spy).not.toHaveBeenCalled();
    });

    it('should set a dummy transform if there is 0 transforms on element on prepareForTransform', () => {
        const mockSVGG = {
            transform: {
                baseVal: {
                    numberOfItems: 0,
                    appendItem: () => null,
                },
            },
        };

        spyOnCreateElement.and.callFake(createMockSVGSVGElement);

        const spy = spyOn(mockSVGG.transform.baseVal, 'appendItem');

        service.prepareForTransform(mockSVGG as unknown as SVGGElement);

        expect(spyOnCreateElement).toHaveBeenCalled();
        expect(spy).toHaveBeenCalled();
    });

    it('should use a negative rotation step for negative deltaY on rotateSelection', () => {
        service.rotateSelection(TestHelpers.createWheelEvent(0, -150), selection);

        expect(service.rotationStep).toBeLessThan(0);
    });

    it('should use a positive rotation step for positive deltaY on rotateSelection', () => {
        service.rotateSelection(TestHelpers.createWheelEvent(0, 150), selection);

        expect(service.rotationStep).toBeGreaterThan(0);
    });

    it('should get center from selected elements origins when rotateOnSelf is true and not update origins on rotateSelection', () => {
        service.isRotateOnSelf = true;
        const element = TestHelpers.createMockSVGGElement();
        const coords = new Coords2D(0, 0);
        selection.selectedElements.add(element as unknown as SVGGElement);
        service.selectedElementsOrigin.set(element, coords);
        const spyOnRotate = spyOn(service, 'rotateElement').and.callFake(() => null);
        const spyOnUpdateOrigins = spyOn(service, 'updateElementsOrigins').and.callFake(() => null);
        const spyOnUpdateSelection = spyOn(selection, 'updateFullSelectionBox').and.callFake(() => null);

        service.rotateSelection(TestHelpers.createWheelEvent(0, 150), selection);

        expect(spyOnRotate).toHaveBeenCalledWith(element, coords);
        expect(spyOnUpdateOrigins).not.toHaveBeenCalled();
        expect(spyOnUpdateSelection).toHaveBeenCalled();
    });

    it('should use boxOrigin as center when rotateOnSelf is false and update origins on rotateSelection', () => {
        service.isRotateOnSelf = false;
        const element = TestHelpers.createMockSVGGElement();
        selection.selectedElements.add(element as unknown as SVGGElement);
        const spyOnRotate = spyOn(service, 'rotateElement').and.callFake(() => null);
        const spyOnUpdateOrigins = spyOn(service, 'updateElementsOrigins').and.callFake(() => null);
        const spyOnUpdateSelection = spyOn(selection, 'updateFullSelectionBox').and.callFake(() => null);

        service.rotateSelection(TestHelpers.createWheelEvent(0, 150), selection);

        expect(spyOnRotate).toHaveBeenCalledWith(element, service.boxOrigin);
        expect(spyOnUpdateOrigins).toHaveBeenCalled();
        expect(spyOnUpdateSelection).toHaveBeenCalled();
    });

    it('should prepare element for transform, consolidate all transforms and return DOMMatrix on getCurrentTransformationMatrix', () => {
        const mockSVGG = {
            transform: {
                baseVal: {
                    clear: () => null,
                    consolidate: () => {
                        const mockTransform = {
                            matrix: autoMock(DOMMatrix) as unknown as DOMMatrix,
                        };
                        return mockTransform as unknown as SVGTransform;
                    },
                    appendItem: () => null,
                },
            },
        };
        const spyOnPrepare = spyOn(service, 'prepareForTransform').and.callFake(() => null);
        service.getCurrentTransformMatrix(mockSVGG as unknown as SVGGElement);

        expect(spyOnPrepare).toHaveBeenCalled();
    });

    it('should perform matrix multiplication and apply only the combo matrix to transforms on applyTransformation', () => {
        const mockSVGG = {
            transform: {
                baseVal: {
                    clear: () => null,
                    consolidate: () => {
                        const mockTransform = {
                            matrix: autoMock(DOMMatrix) as unknown as DOMMatrix,
                        };
                        return mockTransform as unknown as SVGTransform;
                    },
                    appendItem: () => null,
                },
            },
        };

        const transformMock = {
            matrix: autoMock(DOMMatrix) as unknown as DOMMatrix,
        };

        spyOnCreateElement.and.callFake(() => {
            const mockSVG = {
                createSVGTransform: () => {
                    const mockTransform = {
                        matrix: autoMock(DOMMatrix) as unknown as DOMMatrix,
                    };
                    return mockTransform as unknown as SVGTransform;
                },
                createSVGTransformFromMatrix: () => null,
            };

            return mockSVG as unknown as SVGSVGElement;
        });

        const spyOnGetTransformMatrix = spyOn(service, 'getCurrentTransformMatrix').and.callFake(() => autoMock(DOMMatrix));

        service.applyTransformation(mockSVGG as unknown as SVGGElement, transformMock as unknown as SVGTransform);

        expect(spyOnGetTransformMatrix).toHaveBeenCalledWith(mockSVGG);
    });

    it('should perform matrix multiplication to include rotation and apply only the combo matrix to transforms', () => {
        const mockSVGG = {
            transform: {
                baseVal: {
                    clear: () => null,
                    consolidate: () => {
                        const mockTransform = {
                            matrix: autoMock(DOMMatrix) as unknown as DOMMatrix,
                        };
                        return mockTransform as unknown as SVGTransform;
                    },
                    appendItem: () => null,
                },
            },
        };

        spyOnCreateElement.and.callFake(() => {
            const mockSVG = {
                createSVGTransform: () => {
                    const transformMock = {
                        setRotate: () => null,
                        matrix: autoMock(DOMMatrix) as unknown as DOMMatrix,
                    };
                    return transformMock as unknown as SVGTransform;
                },
                createSVGTransformFromMatrix: () => null,
            };

            return mockSVG as unknown as SVGSVGElement;
        });

        const spyOnApplyTransformation = spyOn(service, 'applyTransformation').and.callFake(() => null);

        service.rotateElement(mockSVGG as unknown as SVGGElement, new Coords2D(0, 0));
        expect(spyOnApplyTransformation).toHaveBeenCalled();
    });

    it('should perform matrix multiplication to include translation and apply only the combo matrix to transforms', () => {
        const mockSVGG = {
            transform: {
                baseVal: {
                    clear: () => null,
                    consolidate: () => {
                        const mockTransform = {
                            matrix: autoMock(DOMMatrix) as unknown as DOMMatrix,
                        };
                        return mockTransform as unknown as SVGTransform;
                    },
                    appendItem: () => null,
                },
            },
        };

        spyOnCreateElement.and.callFake(createMockSVGSVGElement);

        const spyOnApplyTransformation = spyOn(service, 'applyTransformation').and.callFake(() => null);

        service.translateElement(0, 0, mockSVGG as unknown as SVGGElement);
        expect(spyOnApplyTransformation).toHaveBeenCalled();
    });

    it('should call translateElement for all elements and update the selection box on translateSelection', () => {
        const spyTranslate = spyOn(service, 'translateElement').and.callFake(() => null);
        const spySelection = spyOn(selection, 'updateFullSelectionBox').and.callFake(() => null);

        selection.selectedElements.add(TestHelpers.createMockSVGGElement());
        selection.selectedElements.add(TestHelpers.createMockSVGGElement());
        selection.selectedElements.add(TestHelpers.createMockSVGGElement());

        service.translateSelection(10, 10, selection);

        expect(spyTranslate).toHaveBeenCalledTimes(3);
        expect(spySelection).toHaveBeenCalled();
    });

    // PARTIE REDIM !

    it('should create a svg element for each selected elements in selection', () => {
        selection.selectedElements.add(TestHelpers.createMockSVGGElement() as unknown as SVGGElement);
        selection.selectedElements.add(TestHelpers.createMockSVGGElement() as unknown as SVGGElement);
        spyOnCreateElement.and.callFake(createMockSVGSVGElement);

        service.initTransformMatrix(selection);

        expect(spyOnCreateElement).toHaveBeenCalledTimes(2);
    });

    it('should retun a scale factor of 2 when dx is the same as width(10) and isRight and going in positive direction', () => {
        selection.ogSelectionBoxWidth = 10;
        selection.isAltDown = false;

        const xScaleFactor = service.getXScaleFactor(10, selection, true);

        expect(xScaleFactor).toEqual(2);
    });

    it('should retun a scale factor of 0.5 when dx is the same as width/2(5) and isRight and going in negative direction', () => {
        selection.ogSelectionBoxWidth = 10;
        selection.isAltDown = false;

        const xScaleFactor = service.getXScaleFactor(-5, selection, true);

        expect(xScaleFactor).toEqual(0.5);
    });

    it('should retun a scale factor of 3 when dx is the same as width(10)' +
        'and isRight and going in positive direction and altIsDown', () => {
        selection.ogSelectionBoxWidth = 10;
        selection.isAltDown = true;

        const xScaleFactor = service.getXScaleFactor(10, selection, true);

        expect(xScaleFactor).toEqual(3);
    });

    it('should retun a xTranslate of -10 when dx is the same as width(10) and isRight and scalefactor is 2', () => {
        selection.ogSelectionBoxWidth = 10;
        selection.isAltDown = false;
        selection.ogSelectionBoxPositions = new Coords2D(10, 10);

        const xTranslate = service.getXTranslate(10, 2, selection, true);

        expect(xTranslate).toEqual(-10);
    });

    it('should retun a xTranslate of -30 when dx is the same as width(10) and isRight and scalefactor is 3 and altIsDown', () => {
        selection.ogSelectionBoxWidth = 10;
        selection.isAltDown = true;
        selection.ogSelectionBoxPositions = new Coords2D(10, 10);

        const xTranslate = service.getXTranslate(10, 3, selection, true);

        expect(xTranslate).toEqual(-30);
    });

    it('should retun a scale factor of 2 when dy is the same as height(10) and isBottom and going in positive direction', () => {
        selection.ogSelectionBoxHeight = 10;
        selection.isAltDown = false;

        const yScaleFactor = service.getYScaleFactor(10, selection, true);

        expect(yScaleFactor).toEqual(2);
    });

    it('should retun a scale factor of 3 when dy is the same as height(10)' +
        'and isBottom and going in positive direction and altIsDown', () => {
        selection.ogSelectionBoxHeight = 10;
        selection.isAltDown = true;

        const yScaleFactor = service.getYScaleFactor(10, selection, true);

        expect(yScaleFactor).toEqual(3);
    });

    it('should retun a yTranslate of -10 when dy is the same as height(10) and isBottom and scalefactor is 2', () => {
        selection.ogSelectionBoxHeight = 10;
        selection.isAltDown = false;
        selection.ogSelectionBoxPositions = new Coords2D(10, 10);

        const yTranslate = service.getYTranslate(10, 2, selection, true);

        expect(yTranslate).toEqual(-10);
    });

    it('should retun a yTranslate of -30 when dy is the same as height(10) and isBottom and scalefactor is 3 and altIsDown', () => {
        selection.ogSelectionBoxHeight = 10;
        selection.isAltDown = true;
        selection.ogSelectionBoxPositions = new Coords2D(10, 10);

        const yTranslate = service.getYTranslate(10, 3, selection, true);

        expect(yTranslate).toEqual(-30);
    });

    it('should return a distance of 10 when mousePos is 10 pix away from activeControlPoint in positive direction and isRight', () => {
        const distance = service.getDistanceFromControlPoint(20, 10, true);

        expect(distance).toEqual(10);
    });

    it('should return a distance of -10 when mousePos is 10 pix away from activeControlPoint in negative direction and isRight', () => {
        const distance = service.getDistanceFromControlPoint(10, 20, true);

        expect(distance).toEqual(-10);
    });

    it('should get X and Y scale factor and X and Y translate when applyScaleCorner and call function with starting dx dy', () => {
        const mockDist = 10;
        const mockScale = 2;
        spyOn(service, 'getDistanceFromControlPoint').and.callFake(() => mockDist);
        selection.isShiftDown = false;

        const spyXScale = spyOn(service, 'getXScaleFactor').and.callFake(() => mockScale);
        const spyYScale = spyOn(service, 'getYScaleFactor').and.callFake(() => mockScale);

        const spyXTranslate = spyOn(service, 'getXTranslate').and.callFake(() => 1);
        const spyYTranslate = spyOn(service, 'getYTranslate').and.callFake(() => 1);

        spyOn(service, 'applyRedimTransformations').and.callFake(() => null);

        spyOn(selection, 'updateFullSelectionBox').and.callFake(() => null);

        const coords = new Coords2D(10, 10);
        selection.ogActiveControlPointCoords = new Coords2D(10, 10);

        service.applyScaleCorner(coords, selection, true, true);

        expect(spyXScale).toHaveBeenCalledWith(mockDist, selection, true);
        expect(spyYScale).toHaveBeenCalledWith(mockDist, selection, true);
        expect(spyXTranslate).toHaveBeenCalledWith(mockDist, mockScale, selection, true);
        expect(spyYTranslate).toHaveBeenCalledWith(mockDist, mockScale, selection, true);
    });

    it('should get X and Y scale factor and X and Y translate when applyScaleCorner' +
        'and isShiftDown and call function with dx dy scaled', () => {
        const mockDist = 10;
        const mockScale = 2;
        spyOn(service, 'getDistanceFromControlPoint').and.callFake(() => mockDist);
        selection.isShiftDown = true;

        selection.ogSelectionBoxWidth = 20;
        selection.ogSelectionBoxHeight = 10;

        const expectedDx = 10;
        const expectedDy = 5;

        const spyXScale = spyOn(service, 'getXScaleFactor').and.callFake(() => mockScale);
        const spyYScale = spyOn(service, 'getYScaleFactor').and.callFake(() => mockScale);

        const spyXTranslate = spyOn(service, 'getXTranslate').and.callFake(() => 1);
        const spyYTranslate = spyOn(service, 'getYTranslate').and.callFake(() => 1);

        spyOn(service, 'applyRedimTransformations').and.callFake(() => null);

        spyOn(selection, 'updateFullSelectionBox').and.callFake(() => null);

        const coords = new Coords2D(10, 10);
        selection.ogActiveControlPointCoords = new Coords2D(10, 10);

        service.applyScaleCorner(coords, selection, true, true);

        expect(spyXScale).toHaveBeenCalledWith(expectedDx, selection, true);
        expect(spyYScale).toHaveBeenCalledWith(expectedDy, selection, true);
        expect(spyXTranslate).toHaveBeenCalledWith(expectedDx, mockScale, selection, true);
        expect(spyYTranslate).toHaveBeenCalledWith(expectedDy, mockScale, selection, true);
    });

    it('shoul call applyTransformation with corresponding value when applyScaleX', () => {
        selection.ogActiveControlPointCoords = new Coords2D(10, 10);
        const mockDx = 10;
        spyOn(service, 'getDistanceFromControlPoint').and.returnValue(mockDx);
        const mockScaleFactor = 2;
        spyOn(service, 'getXScaleFactor').and.returnValue(mockScaleFactor);
        const mockXTranslate = 10;
        spyOn(service, 'getXTranslate').and.returnValue(mockXTranslate);

        const spyOnApplyTransformation = spyOn(service, 'applyRedimTransformations').and.callFake(() => null);
        spyOn(selection, 'updateFullSelectionBox').and.callFake(() =>  null);

        service.applyScaleX(new Coords2D(10, 10), selection, true);

        expect(spyOnApplyTransformation).toHaveBeenCalledWith(selection, mockScaleFactor, 1, mockXTranslate, 0);
    });

    it('shoul call applyTransformation with corresponding value when applyScaleY', () => {
        selection.ogActiveControlPointCoords = new Coords2D(10, 10);
        const mockDy = 10;
        spyOn(service, 'getDistanceFromControlPoint').and.returnValue(mockDy);
        const mockScaleFactor = 2;
        spyOn(service, 'getYScaleFactor').and.returnValue(mockScaleFactor);
        const mockYTranslate = 10;
        spyOn(service, 'getYTranslate').and.returnValue(mockYTranslate);

        const spyOnApplyTransformation = spyOn(service, 'applyRedimTransformations').and.callFake(() => null);
        spyOn(selection, 'updateFullSelectionBox').and.callFake(() =>  null);

        service.applyScaleY(new Coords2D(10, 10), selection, true);

        expect(spyOnApplyTransformation).toHaveBeenCalledWith(selection, 1, mockScaleFactor, 0, mockYTranslate);
    });

    it('should call setTranslate on each element when applyRedimTransformations', () => {

        const transformElem = {
            setTranslate: () => null,
            setScale: () => null,
        } as unknown as SVGTransform;

        const mockSVGGElement = {
            transform : {
                baseVal : {
                    getItem: () => transformElem as SVGTransform,
                },
            },
        } as unknown as SVGGElement;

        selection.selectedElements.add(mockSVGGElement);

        const spy = spyOn(mockSVGGElement.transform.baseVal.getItem(0), 'setTranslate').and.callFake(() => null);

        service.applyRedimTransformations(selection, 1, 1, 1, 1);

        expect(spy).toHaveBeenCalled();
    });

    it('should call corresponding function when scaleSelection with activeControlPoint', () => {
        const spyCorner = spyOn(service, 'applyScaleCorner').and.callFake(() => null);
        const spyX = spyOn(service, 'applyScaleX').and.callFake(() => null);
        const spyY = spyOn(service, 'applyScaleY').and.callFake(() => null);

        for (let i = 0; i < 10; i++) {
            const mockControlPoint = {
                getAttribute: () => null,
            } as unknown as SVGCircleElement;

            spyOn(mockControlPoint, 'getAttribute').and.returnValue(i.toString());

            service.scaleSelection(new Coords2D(10, 10), mockControlPoint, selection);
        }

        expect(spyCorner).toHaveBeenCalledTimes(4);
        expect(spyX).toHaveBeenCalledTimes(2);
        expect(spyY).toHaveBeenCalledTimes(2);
    });
});
