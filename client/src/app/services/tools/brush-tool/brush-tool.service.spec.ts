import { TestBed, getTestBed } from "@angular/core/testing";

import { BrushToolService } from "./brush-tool.service";
import { Renderer2, ElementRef, Type } from "@angular/core";
import { DrawStackService } from "../../draw-stack/draw-stack.service";
import { createMockFilter, createMockSVGCircle } from '../abstract-tools/test-helpers';
import { SVG_NS } from 'src/constants/constants';
import { TracingToolService } from '../abstract-tools/tracing-tool/tracing-tool.service';

const STACK_LENGTH = 1;
const MOCK_FILTER = createMockFilter();

describe("BrushToolService", () => {
    let injector: TestBed;
    let service: BrushToolService;
    let rendererMock: Renderer2;

    let spyOnSetAttribute: jasmine.Spy;
    let spyOnCreateElement: jasmine.Spy;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                BrushToolService,
                {
                    provide: Renderer2,
                    useValue: {
                        createElement: () => null,
                        setAttribute: () => null,
                        appendChild: () => null,
                    },
                },
                {
                    provide: ElementRef,
                    useValue: {
                        nativeElement: {},
                    },
                },
                {
                    provide: DrawStackService,
                    useValue: {
                        getDrawStackLength: () => STACK_LENGTH,
                    },
                },
            ],
        });

        injector = getTestBed();
        service = injector.get(BrushToolService);

        rendererMock = injector.get<Renderer2>(Renderer2 as Type<Renderer2>);

        spyOnSetAttribute = spyOn(rendererMock, 'setAttribute').and.returnValue();
        spyOnCreateElement = spyOn(rendererMock, 'createElement').and.returnValue(MOCK_FILTER);
    });

    it("should be created", () => {
        expect(service).toBeTruthy();
    });

    it('createSVGWrapper should call setAttribute 2 times in parent and appendChild twice (once in parent)', () => {
        // Arrange
        spyOn(service, 'createFilter').and.returnValue(createMockFilter());
        let spyRendererAppendChild = spyOn(rendererMock, 'appendChild').and.returnValue();
        // Act
        service.createSVGWrapper();
        // Assert
        expect(spyOnSetAttribute).toHaveBeenCalledTimes(2);
        expect(spyRendererAppendChild).toHaveBeenCalledTimes(2);
    });

    it('createSVGWrapper should call createFilter', () => {
        // Arrange
        let spyCreateFilter = spyOn(service, 'createFilter').and.returnValue(createMockFilter());
        // Act
        service.createSVGWrapper();
        // Assert
        expect(spyCreateFilter).toHaveBeenCalled();
    });

    it('when patternId = 1 createFilter should call createElement with feGaussianBlur and setAttribute with stdDeviation', () => {
        // Arrange
        const patternId = 1;
        // Act
        service.createFilter(patternId);
        // Assert
        expect(spyOnCreateElement).toHaveBeenCalledWith('feGaussianBlur', SVG_NS);
        expect(spyOnSetAttribute).toHaveBeenCalledWith(MOCK_FILTER, 'stdDeviation', '3');
    });

    it('when patternId !== 1 createFilter should call createElement with feTurbulence and feDisplacementMap', () => {
        // Arrange
        const patternId = 100;
        // Act
        service.createFilter(patternId);
        // Assert
        expect(spyOnCreateElement).toHaveBeenCalledWith('feTurbulence', SVG_NS);
        expect(spyOnCreateElement).toHaveBeenCalledWith('feDisplacementMap', SVG_NS);
    });

    it('when patternId = 2 setAttribute is called with baseFrequency 0.1 0.9', () => {
        // Arrange
        const patternId = 2;
        // Act
        service.createFilter(patternId);
        // Assert
        expect(spyOnSetAttribute).toHaveBeenCalledWith(MOCK_FILTER, 'baseFrequency', '0.1 0.9');
    });

    it('when patternId = 3 setAttribute is called with baseFrequency 0.01 0.57', () => {
        // Arrange
        const patternId = 3;
        // Act
        service.createFilter(patternId);
        // Assert
        expect(spyOnSetAttribute).toHaveBeenCalledWith(MOCK_FILTER, 'baseFrequency', '0.01 0.57');
    });

    it('when patternId = 4 setAttribute is called with baseFrequency 0.05', () => {
        // Arrange
        const patternId = 4;
        // Act
        service.createFilter(patternId);
        // Assert
        expect(spyOnSetAttribute).toHaveBeenCalledWith(MOCK_FILTER, 'baseFrequency', '0.05');
    });

    it('when patternId = 5 setAttribute is called with baseFrequency 0.9', () => {
        // Arrange
        const patternId = 5;
        // Act
        service.createFilter(patternId);
        // Assert
        expect(spyOnSetAttribute).toHaveBeenCalledWith(MOCK_FILTER, 'baseFrequency', '0.9');
    });

    it('when createSVGCircle it should call super.getDrawStackLength', () => {
        // Arrange
        let spyOnSuperCreateCircle = spyOn(TracingToolService.prototype, 'createSVGCircle').and.returnValue(createMockSVGCircle());
        // Act
        service.createSVGCircle(0, 0);
        // Assert
        expect(spyOnSuperCreateCircle).toHaveBeenCalled();
    });

});
