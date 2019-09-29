import { TestBed, getTestBed } from '@angular/core/testing';

import { AbstractShapeToolService } from './abstract-shape-tool.service';
import { Renderer2, Type } from '@angular/core';

// Test class to have access to everything
class MockAbstractShapeToolService extends AbstractShapeToolService {
    constructor(renderer: Renderer2) {super(renderer); }

    // Inherited methods
    onMouseMove(event: MouseEvent): void {}
    onMouseDown(event: MouseEvent): void {}
    onMouseUp(event: MouseEvent): void {}
    onMouseEnter(event: MouseEvent): void {}
    onMouseLeave(event: MouseEvent): void {}
    onKeyDown(event: KeyboardEvent): void {}
    onKeyUp(event: KeyboardEvent): void {}
    protected createSVG(): void {}

    // Setters and getters only used for testing. Otherwise, useless for the real service.
    setCurrentMouseX(x: number): void { this.currentMouseX = x; }
    setCurrentMouseY(y: number): void { this.currentMouseY = y; }
    setInitialMouseX(x: number): void { this.initialMouseX = x; }
    setInitialMouseY(y: number): void { this.initialMouseY = y; }
    callUpdatePreviewRectangle(): void { this.updatePreviewRectangle(); }
}

class MockRect {
    mockX: number = 0;
    mockY: number = 0;
    mockWidth: number = 0;
    mockHeight: number = 0;
}

fdescribe('AbstractShapeToolService', () => {
    let injector: TestBed;
    let service: MockAbstractShapeToolService;
    let mockRect: MockRect;
    let rendererMock: Renderer2;
    let spyOnSetAttribute: jasmine.Spy;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                AbstractShapeToolService,
                MockAbstractShapeToolService,
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
        service = new MockAbstractShapeToolService(rendererMock);
        service.setCurrentMouseX(0);
        service.setCurrentMouseY(0);
        service.setInitialMouseX(0);
        service.setInitialMouseY(0);
    });

    it('Should be created in providers', () => {
        const abstractService: AbstractShapeToolService = TestBed.get(AbstractShapeToolService);
        expect(abstractService).toBeTruthy();
    });

    it('setAttribute should be called 8 times when calling updatePreviewRectangle', () => {
        spyOnSetAttribute = spyOn(rendererMock, 'setAttribute');
        service.callUpdatePreviewRectangle();
        expect(spyOnSetAttribute).toHaveBeenCalledTimes(8);
    });

    it('If currentMouseX > initialMouseX, width should be positif', () => {
        service.setCurrentMouseX(-10);
        service.setInitialMouseX(0);
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
        service.callUpdatePreviewRectangle();
        expect(mockRect.mockWidth).toBeGreaterThan(0);
    });

    it('If currentMouseY > initialMouseY, height should be positif', () => {
        service.setCurrentMouseY(-10);
        service.setInitialMouseY(0);
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
        service.callUpdatePreviewRectangle();
        expect(mockRect.mockHeight).toBeGreaterThan(0);
    });
});
