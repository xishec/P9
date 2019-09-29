import { TestBed, getTestBed } from "@angular/core/testing";

import { BrushToolService } from "./brush-tool.service";
import { Renderer2, ElementRef, Type } from "@angular/core";
import { DrawStackService } from "../../draw-stack/draw-stack.service";
import { createMockFilter } from '../abstract-tools/test-helpers';
import { SVG_NS } from 'src/constants/constants';

const STACK_LENGTH = 1;
const MOCK_FILTER = createMockFilter();

fdescribe("BrushToolService", () => {
    let injector: TestBed;
    let service: BrushToolService;
    let rendererMock: Renderer2;
    // let mockDrawStackService: DrawStackService;

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
        spyOn(service, 'createFilter').and.returnValue(createMockFilter());
        let spyRendererAppendChild = spyOn(rendererMock, 'appendChild').and.returnValue();
        
        service.createSVGWrapper();

        expect(spyOnSetAttribute).toHaveBeenCalledTimes(2);
        expect(spyRendererAppendChild).toHaveBeenCalledTimes(2);
    });

    it('createSVGWrapper should call createFilter', () => {
        let spyCreateFilter = spyOn(service, 'createFilter').and.returnValue(createMockFilter());
        service.createSVGWrapper();

        expect(spyCreateFilter).toHaveBeenCalled();
    });

    it('when patternId = 1 createFilter should call createElement with feGaussianBlur and setAttribute with stdDeviation', () => {
        const patternId = 1;
        service.createFilter(patternId);

        expect(spyOnCreateElement).toHaveBeenCalledWith('feGaussianBlur', SVG_NS);
        expect(spyOnSetAttribute).toHaveBeenCalledWith(MOCK_FILTER, 'stdDeviation', '3');
    });

    it('when patternId !== 1 createFilter should call createElement with feTurbulence and feDisplacementMap', () => {
        const patternId = 100;
        service.createFilter(patternId);

        expect(spyOnCreateElement).toHaveBeenCalledWith('feTurbulence', SVG_NS);
        expect(spyOnCreateElement).toHaveBeenCalledWith('feDisplacementMap', SVG_NS);
    });

    it('when patternId = 2 setAttribute is called with baseFrequency 0.1 0.9', () => {
        const patternId = 2;
        service.createFilter(patternId);

        expect(spyOnSetAttribute).toHaveBeenCalledWith(MOCK_FILTER, 'baseFrequency', '0.1 0.9');
    });

    it('when patternId = 3 setAttribute is called with baseFrequency 0.01 0.57', () => {
        const patternId = 3;
        service.createFilter(patternId);

        expect(spyOnSetAttribute).toHaveBeenCalledWith(MOCK_FILTER, 'baseFrequency', '0.01 0.57');
    });

    it('when patternId = 4 setAttribute is called with baseFrequency 0.05', () => {
        const patternId = 4;
        service.createFilter(patternId);

        expect(spyOnSetAttribute).toHaveBeenCalledWith(MOCK_FILTER, 'baseFrequency', '0.05');
    });

    it('when patternId = 5 setAttribute is called with baseFrequency 0.9', () => {
        const patternId = 5;
        service.createFilter(patternId);

        expect(spyOnSetAttribute).toHaveBeenCalledWith(MOCK_FILTER, 'baseFrequency', '0.9');
    });

});
