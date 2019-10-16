import { TestBed, getTestBed } from '@angular/core/testing';

import { LineToolService } from './line-tool.service';
import { ElementRef, Renderer2, Type } from '@angular/core';
import { createMouseEvent, createKeyBoardEvent, createMockSVGCircle } from 'src/classes/test-helpers';
import { Mouse, Keys } from 'src/constants/constants';
import { LineJointType } from 'src/constants/tool-constants';
import { DrawStackService } from '../../draw-stack/draw-stack.service';

fdescribe('LineToolService', () => {

    let injector: TestBed;
    let service: LineToolService;
    let mockLeftButton: MouseEvent;
    let rendererMock: Renderer2;
    let drawStackMock: DrawStackService;

    const BOUNDLEFT = 0;
    const BOUNDTOP = 0;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                {
                    provide: Renderer2,
                    useValue: {
                        createElement: () => null,
                        setAttribute: () => null,
                        appendChild: () => null,
                        removeChild: () => null,
                    },
                },
                {
                    provide: DrawStackService,
                    useValue: {
                        getDrawStackLength: () => 1,
                        push: () => null,
                    },
                },
                {
                    provide: ElementRef,
                    useValue: {
                        nativeElement: {
                            getBoundingClientRect: () => {
                                const boundleft = BOUNDLEFT;
                                const boundtop = BOUNDTOP;
                                const boundRect = {
                                    left: boundleft,
                                    top: boundtop,
                                };
                                return boundRect;
                            }
                        },
                    }
                }
            ]
        })

        injector = getTestBed();
        service = injector.get(LineToolService);

        rendererMock = injector.get<Renderer2>(Renderer2 as Type<Renderer2>);
        drawStackMock = injector.get<DrawStackService>(DrawStackService as Type<DrawStackService>);

        mockLeftButton = createMouseEvent(0,0,Mouse.LeftButton);
    });
    
    it('should be created', () => {
    const service: LineToolService = TestBed.get(LineToolService);
        expect(service).toBeTruthy();
    });
    });


});
