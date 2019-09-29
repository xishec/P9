import { TestBed, getTestBed } from '@angular/core/testing';

import { RectangleToolService } from './rectangle-tool.service';
import { ElementRef, Renderer2, Type } from '@angular/core';
import { DrawStackService } from '../../draw-stack/draw-stack.service';
import { Keys, Mouse } from 'src/constants/constants';
import { createMouseEvent, createKeyBoardEvent } from '../../../../classes/test-helpers';
import { AbstractShapeToolService } from '../abstract-tools/abstract-shape-tool/abstract-shape-tool.service';

class MockBoundRect {
    left: number = 0;
    top: number = 0;
}

class MockRect {
    x: {
        baseVal: {
            value: number;
        }
    };
    y: {
        baseVal: {
            value: number;
        }
    };
    width: {
        baseVal: {
            value: number;
        }
    };
    height: {
        baseVal: {
            value: number;
        }
    };
    fill: string = '';
    stroke: string = '';
}

fdescribe('RectangleToolService', () => {
    let injector: TestBed;
    let drawStack: DrawStackService;
    let rendererMock: Renderer2;
    let elementRefMock: ElementRef;
    let rectangleTool: RectangleToolService;
    let mockMouseEvent: MouseEvent;
    let mockKeyboardEvent: KeyboardEvent;
    let spy: jasmine.Spy;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                DrawStackService,
                {
                    provide: RectangleToolService,
                    useValue: {
                        drawRectangle: MockRect,
                    },
                },
                {
                    provide: AbstractShapeToolService,
                    useValue: {
                        previewRectangle: MockRect,
                    },
                },
                {
                    provide: Renderer2,
                    useValue: {
                        setAttribute: () => null,
                        createElement: () => new MockRect(),
                        appendChild: () => null,
                    },
                },
                {
                    provide: ElementRef,
                    useValue: {
                        nativeElement: {
                            getBoundingClientRect: () => { return new MockBoundRect(); },
                        },
                    },
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
        mockMouseEvent = createMouseEvent(0, 0, Mouse.LeftButton);

        mockKeyboardEvent = createKeyBoardEvent(Keys.Shift);
    });

    it('should be created with call to new', () => {
        expect(rectangleTool).toBeTruthy();
    });

    it('Nothing should happen when mouse click outside of workzone', () => {
        spy = spyOn(rendererMock, 'appendChild');
        rectangleTool.onMouseDown(mockMouseEvent);
        expect(spy).toHaveBeenCalledTimes(0);
    });

    it('If shift pressed and left mouse not pressed, nothing should happen', () => {
        spy = spyOn(rendererMock, 'appendChild');
        rectangleTool.onKeyDown(mockKeyboardEvent);
        expect(spy).not.toHaveBeenCalled();
    });
});
