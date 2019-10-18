import { ElementRef, Renderer2, Type } from '@angular/core';
import { getTestBed, TestBed } from '@angular/core/testing';

import { createMockFilter, createMockSVGCircle } from '../../../../classes/test-helpers';
import { DrawStackService } from '../../draw-stack/draw-stack.service';
import { TracingToolService } from '../abstract-tools/tracing-tool/tracing-tool.service';
import { BrushToolService } from './brush-tool.service';

const STACK_LENGTH = 1;
const MOCK_FILTER = createMockFilter();

describe('BrushToolService', () => {
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

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('createSVGWrapper should call setAttribute 3 times in parent and appendChild twice (once in parent)', () => {
        spyOn(service, 'createFilter').and.returnValue(createMockFilter());
        const spyRendererAppendChild = spyOn(rendererMock, 'appendChild').and.returnValue();

        service.createSVGWrapper();

        expect(spyOnSetAttribute).toHaveBeenCalledTimes(3);
        expect(spyRendererAppendChild).toHaveBeenCalledTimes(2);
    });

    it('createSVGWrapper should call createFilter', () => {

        const spyCreateFilter = spyOn(service, 'createFilter').and.returnValue(createMockFilter());

        service.createSVGWrapper();

        expect(spyCreateFilter).toHaveBeenCalled();
    });

    it('when patternId = 1 createFilter should only call createGayssianBlurFilter', () => {
        const patternId = 1;
        const spyOnCreateGaussianBlurFilter = spyOn(service, 'createGaussianBlurFilter');

        service.createFilter(patternId);

        expect(spyOnCreateGaussianBlurFilter).toHaveBeenCalled();
    });

    it('when patternId = 2 createFilter should call createGayssianBlurFilter and createTurbulenceDisplacementFilter', () => {
        const patternId = 2;
        const spyOnCreateGaussianBlurFilter = spyOn(service, 'createGaussianBlurFilter');
        const spyOnCreateTurbulenceDisplacementFilter = spyOn(service, 'createTurbulenceDisplacementFilter');

        service.createFilter(patternId);

        expect(spyOnCreateGaussianBlurFilter).toHaveBeenCalled();
        expect(spyOnCreateTurbulenceDisplacementFilter).toHaveBeenCalled();
    });

    it('when patternId = 3,4 or 5 createFilter should call only createTurbulenceDisplacementFilter', () => {
        const patternId = 4;
        const spyOnCreateTurbulenceDisplacementFilter = spyOn(service, 'createTurbulenceDisplacementFilter');

        service.createFilter(patternId);

        expect(spyOnCreateTurbulenceDisplacementFilter).toHaveBeenCalled();
    });

    it('when createGaussianBlurFilter renderer.setAttribute and appendChild should be called', () => {

        service.createGaussianBlurFilter(MOCK_FILTER);

        expect(spyOnSetAttribute).toHaveBeenCalled();
        expect(spyOnCreateElement).toHaveBeenCalled();
    });

    it('when patternId = 2 createTurbulenceDisplacementFilter call setAttribute with baseFrequency 0.1 0.9', () => {
        const patternId = 2;

        service.createTurbulenceDisplacementFilter(MOCK_FILTER, patternId);

        expect(spyOnSetAttribute).toHaveBeenCalledWith(MOCK_FILTER, 'baseFrequency', '0.1 0.9');
    });

    it('when patternId = 3 createTurbulenceDisplacementFilter call setAttribute with baseFrequency 0.01 0.57', () => {
        const patternId = 3;

        service.createTurbulenceDisplacementFilter(MOCK_FILTER, patternId);

        expect(spyOnSetAttribute).toHaveBeenCalledWith(MOCK_FILTER, 'baseFrequency', '0.01 0.57');
    });

    it('when patternId = 4 createTurbulenceDisplacementFilter call setAttribute with baseFrequency 0.05', () => {
        const patternId = 4;

        service.createTurbulenceDisplacementFilter(MOCK_FILTER, patternId);

        expect(spyOnSetAttribute).toHaveBeenCalledWith(MOCK_FILTER, 'baseFrequency', '0.05');
    });

    it('when patternId = 5 createTurbulenceDisplacementFilter call setAttribute with baseFrequency 0.9', () => {
        const patternId = 5;

        service.createTurbulenceDisplacementFilter(MOCK_FILTER, patternId);

        expect(spyOnSetAttribute).toHaveBeenCalledWith(MOCK_FILTER, 'baseFrequency', '0.9');
    });

    it('when createSVGCircle it should call super.getDrawStackLength', () => {
        const spyOnSuperCreateCircle = spyOn(TracingToolService.prototype, 'createSVGCircle').and.returnValue(createMockSVGCircle());

        service.createSVGCircle(0, 0);

        expect(spyOnSuperCreateCircle).toHaveBeenCalled();
    });

    it('when createSVGPath should call renderer.setAttribute', () => {
        service.createSVGPath();

        expect(spyOnSetAttribute).toHaveBeenCalled();
    });

});
