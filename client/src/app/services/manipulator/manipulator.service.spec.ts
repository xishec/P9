import { getTestBed, TestBed } from '@angular/core/testing';

import { ElementRef, Renderer2, Type } from '@angular/core';
import { Coords2D } from 'src/classes/Coords2D';
import * as TestHelpers from 'src/classes/test-helpers.spec';
import { autoMock } from 'src/classes/test.helper.msTeams.spec';
import { Selection } from '../../../classes/selection/selection';
import { ManipulatorService } from './manipulator.service';

fdescribe('ManipulatorService', () => {
    let selection: Selection;
    let service: ManipulatorService;
    let injector: TestBed;
    let rendererMock: Renderer2;
    let elementRefMock: ElementRef<SVGGElement>;
    let spyOnCreateElement: jasmine.Spy;

    let createMockSVGSVGElement = () : SVGSVGElement => {
        const mockSVGSVG = {
            createSVGTransform: () => {
                const mockTransform = {
                    setTranslate: () => null,
                    setRotate: () => null,
                    setScale: () => null,
                    matrix: autoMock(DOMMatrix) as unknown as DOMMatrix,
                }
                return mockTransform as unknown as SVGTransform;
            },
            createSVGTransformFromMatrix: () => null,
        }
        return mockSVGSVG as unknown as SVGSVGElement;
    }

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

});
