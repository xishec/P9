import { ElementRef, Renderer2, Type } from '@angular/core';
import { getTestBed, TestBed } from '@angular/core/testing';

import { DrawStackService } from 'src/app/services/draw-stack/draw-stack.service';
import { provideAutoMock } from 'src/classes/test.helper.msTeams.spec';
import { MockRect } from '../../../../../classes/test-helpers.spec';
import { AbstractShapeToolService } from './abstract-shape-tool.service';

describe('AbstractShapeToolService', () => {
    let injector: TestBed;
    let service: AbstractShapeToolService;
    let mockRect: MockRect;
    let rendererMock: Renderer2;
    let spyOnSetAttribute: jasmine.Spy;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                AbstractShapeToolService,
                {
                    provide: Renderer2,
                    useValue: {
                        setAttribute: () => null,
                        createElement: () => null,
                    },
                },
                provideAutoMock(ElementRef),
            ],
        });

        injector = getTestBed();
        rendererMock = injector.get<Renderer2>(Renderer2 as Type<Renderer2>);
        service = injector.get<AbstractShapeToolService>(AbstractShapeToolService as Type<AbstractShapeToolService>);
        mockRect = new MockRect();

        const drawStackMock = injector.get<DrawStackService>(DrawStackService as Type<DrawStackService>);
        const elementRefMock = injector.get<ElementRef>(ElementRef as Type<ElementRef>);
        service.initializeService(elementRefMock, rendererMock, drawStackMock);
    });

    it('should be created in providers', () => {
        const abstractService: AbstractShapeToolService = TestBed.get(AbstractShapeToolService);
        expect(abstractService).toBeTruthy();
    });

    it('should get previewRectangleX', () => {
        service.previewRectangle = {
            x: {
                baseVal: {
                    value: 1,
                },
            },
        } as SVGRectElement;
        expect(service.previewRectangleX).toEqual(service.previewRectangle.x.baseVal.value);
    });

    it('should get previewRectangleY', () => {
        service.previewRectangle = {
            y: {
                baseVal: {
                    value: 1,
                },
            },
        } as SVGRectElement;
        expect(service.previewRectangleY).toEqual(service.previewRectangle.y.baseVal.value);
    });

    it('should get previewRectangleWidth', () => {
        service.previewRectangle = {
            width: {
                baseVal: {
                    value: 1,
                },
            },
        } as SVGRectElement;
        expect(service.previewRectangleWidth).toEqual(service.previewRectangle.width.baseVal.value);
    });

    it('should get previewRectangleHeight', () => {
        service.previewRectangle = {
            height: {
                baseVal: {
                    value: 1,
                },
            },
        } as SVGRectElement;
        expect(service.previewRectangleHeight).toEqual(service.previewRectangle.height.baseVal.value);
    });

    it('should call setAttribute 8 times when calling updatePreviewRectangle', () => {
        spyOnSetAttribute = spyOn(rendererMock, 'setAttribute');
        service[`updatePreviewRectangle`]();
        expect(spyOnSetAttribute).toHaveBeenCalledTimes(8);
    });

    it('should always give rectangle with positive dimensions', () => {
        service.currentMouseCoords.x = -10;
        service.initialMouseCoords.x = 0;
        service.currentMouseCoords.y = -10;
        service.initialMouseCoords.y = 0;

        spyOnSetAttribute = spyOn(rendererMock, 'setAttribute').and.callFake(
            (el: MockRect, name: string, value: string) => {
                switch (name) {
                    case 'x':
                        mockRect.x = Number(value);
                        break;
                    case 'y':
                        mockRect.y = Number(value);
                        break;
                    case 'width':
                        mockRect.width = Number(value);
                        break;
                    case 'height':
                        mockRect.height = Number(value);
                        break;
                    default:
                        break;
                }
            },
        );
        service[`updatePreviewRectangle`]();
        expect(mockRect.width).toBeGreaterThan(0);
        expect(mockRect.height).toBeGreaterThan(0);
    });
});
