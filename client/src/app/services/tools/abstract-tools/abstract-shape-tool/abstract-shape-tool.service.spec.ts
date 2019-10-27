import { Renderer2, Type } from '@angular/core';
import { getTestBed, TestBed } from '@angular/core/testing';

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
            ],
        });

        injector = getTestBed();
        rendererMock = injector.get<Renderer2>(Renderer2 as Type<Renderer2>);
        service = injector.get<AbstractShapeToolService>(AbstractShapeToolService as Type<AbstractShapeToolService>);
        mockRect = new MockRect();
    });

    it('Should be created in providers', () => {
        const abstractService: AbstractShapeToolService = TestBed.get(AbstractShapeToolService);
        expect(abstractService).toBeTruthy();
    });

    it('should call setAttribute 8 times when calling updatePreviewRectangle', () => {
        spyOnSetAttribute = spyOn(rendererMock, 'setAttribute');
        service.updatePreviewRectangle();
        expect(spyOnSetAttribute).toHaveBeenCalledTimes(8);
    });

    it('should always give rectangle with positive dimensions', () => {
        service.currentMouseX = -10;
        service.initialMouseX = 0;
        service.currentMouseY = -10;
        service.initialMouseY = 0;

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
        service.updatePreviewRectangle();
        expect(mockRect.width).toBeGreaterThan(0);
        expect(mockRect.height).toBeGreaterThan(0);
    });
});
