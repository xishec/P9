import { TestBed, getTestBed } from '@angular/core/testing';

import { AbstractShapeToolService } from './abstract-shape-tool.service';
import { Renderer2, Type } from '@angular/core';

class MockRect {
    mockX: number = 0;
    mockY: number = 0;
    mockWidth: number = 0;
    mockHeight: number = 0;
}

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

        // Injector and service setup
        injector = getTestBed();
        rendererMock = injector.get<Renderer2>(Renderer2 as Type<Renderer2>);
        mockRect = new MockRect();
    });

    it('Should be created in providers', () => {
        const abstractService: AbstractShapeToolService = TestBed.get(AbstractShapeToolService);
        expect(abstractService).toBeTruthy();
    });

    it('setAttribute should be called 8 times when calling updatePreviewRectangle', () => {
        spyOnSetAttribute = spyOn(rendererMock, 'setAttribute');
        service.updatePreviewRectangle();
        expect(spyOnSetAttribute).toHaveBeenCalledTimes(8);
    });

    it('If currentMouseX > initialMouseX, width should be positif', () => {
        service.currentMouseX = -10;
        service.initialMouseX = 0;
        spyOnSetAttribute = spyOn(rendererMock, 'setAttribute').and.callFake((el: MockRect, name: string, value: string) => {
            switch(name) {
                case 'x':
                    mockRect.mockX = Number(value);
                    break;
                case 'y':
                    mockRect.mockY = Number(value);
                    break;
                case 'width':
                    mockRect.mockWidth = Number(value);
                    break;
                case 'height':
                    mockRect.mockHeight = Number(value);
                    break;
                default:
                    break;
            }
        });
        service.updatePreviewRectangle();
        expect(mockRect.mockWidth).toBeGreaterThan(0);
    });

    it('If currentMouseY > initialMouseY, height should be positif', () => {
        service.currentMouseY = -10;
        service.initialMouseY = 0;
        spyOnSetAttribute = spyOn(rendererMock, 'setAttribute').and.callFake((el: any, name: string, value: string) => {
            switch(name) {
                case 'x':
                    mockRect.mockX = Number(value);
                    break;
                case 'y':
                    mockRect.mockY = Number(value);
                    break;
                case 'width':
                    mockRect.mockWidth = Number(value);
                    break;
                case 'height':
                    mockRect.mockHeight = Number(value);
                    break;
                default:
                    break;
            }
        });
        service.updatePreviewRectangle();
        expect(mockRect.mockHeight).toBeGreaterThan(0);
    });
});
