import { TestBed, getTestBed } from '@angular/core/testing';

import { RectangleToolService } from './rectangle-tool.service';
import { ElementRef, Renderer2, Type } from '@angular/core';
import { DrawStackService } from '../../draw-stack/draw-stack.service';
import { Keys, Mouse } from 'src/constants/constants';

class MockBoundRect {
    left: number = 0;
    top: number = 0;
}

class MockKeyboardEvent extends KeyboardEvent {
    key: string;
}

class MockMouseEvent extends MouseEvent {
    clientX: number;
    clientY: number;
    button: number;
}

fdescribe('RectangleToolService', () => {
    let injector: TestBed;
    let drawStack: DrawStackService;
    let rendererMock: Renderer2;
    let elementRefMock: ElementRef;
    let rectangleTool: RectangleToolService;
    let mockMouseEvent: MockMouseEvent;
    let mockKeyboardEvent: MockKeyboardEvent;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                DrawStackService,
                {
                    provide: Renderer2,
                    useValue: {
                        setAttribute: () => null,
                        createElement: () => null,
                    }
                },
                {
                    provide: ElementRef,
                    useValue: {
                        nativeElement: {
                            getBoundingClientRect: () => { return new MockBoundRect(); },
                        }
                    }
                },
            ],
        });

        // Injector and service setup
        injector = getTestBed();
        rendererMock = injector.get<Renderer2>(Renderer2 as Type<Renderer2>);
        elementRefMock = injector.get<ElementRef>(ElementRef as Type<ElementRef>);
        drawStack = injector.get<DrawStackService>(DrawStackService as Type<DrawStackService>);
        rectangleTool = new RectangleToolService(drawStack, elementRefMock, rendererMock);

        // Setup mock events
        mockMouseEvent = new MockMouseEvent('');
        mockMouseEvent.button = Mouse.LeftButton;
        mockMouseEvent.clientX = 0;
        mockMouseEvent.clientY = 0;

        mockKeyboardEvent.key = Keys.Shift;
    });

    it('should be created with call to new', () => {
        expect(rectangleTool).toBeTruthy();
    });
});
