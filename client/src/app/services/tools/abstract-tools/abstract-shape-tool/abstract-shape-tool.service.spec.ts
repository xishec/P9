import { TestBed, getTestBed } from '@angular/core/testing';

import { AbstractShapeToolService } from './abstract-shape-tool.service';
import { Renderer2, Type } from '@angular/core';

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
    currentX: number;
    currentY: number;
    initialX: number;
    initialY: number;
    width: number;
    height: number;
}



fdescribe('AbstractShapeToolService', () => {
    let injector: TestBed;
    let service: MockAbstractShapeToolService;
    let rendererMock: Renderer2;
    let rectMock: MockRect;
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
        service = new MockAbstractShapeToolService(rendererMock);
        service.setCurrentMouseX(0);
        service.setCurrentMouseY(0);
        service.setInitialMouseX(0);
        service.setInitialMouseY(0);

        // Spy setup
        spyOnSetAttribute = spyOn(rendererMock, 'setAttribute').and.returnValue();
    });

    it('Should be created in providers', () => {
        const abstractService: AbstractShapeToolService = TestBed.get(AbstractShapeToolService);
        expect(abstractService).toBeTruthy();
    });

    it('A class that correctly extends AbstractShapeToolService should be created with new', () => {
        expect(service).toBeTruthy();
    });

    it('setAttribute should be called 8 times when calling upadtePreviewRectangle', () => {
        service.callUpdatePreviewRectangle();
        expect(spyOnSetAttribute).toHaveBeenCalledTimes(8);
    });

    it('If currentMouseX > initialMouseX, rectangle width should be positif and rectangle current X should be smaller than initial X', () => {

    });
});
