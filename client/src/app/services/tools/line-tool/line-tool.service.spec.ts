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
        expect(service).toBeTruthy();
    });

    it('getXPos should return clientX - BOUNDLEFT', () => {
        const clientX = 10;

        const resXPos = service.getXPos(clientX);

        expect(resXPos).toBe(clientX - BOUNDLEFT);
    });

    it('getYPos should return clientY - BOUNDTOP', () => {
        const clientY = 10;

        const resYPos = service.getYPos(clientY);

        expect(resYPos).toBe(clientY - BOUNDTOP);
    });

    it('should call startLine onMouseDown if Mouse.LeftButton and !isDrawing', () => {
        const spyOnStartLine = spyOn(service, 'startLine');
        service.isDrawing = false;

        service.onMouseDown(mockLeftButton);

        expect(spyOnStartLine).toHaveBeenCalled();
    });

    it('should call appendLine onMouseDown if Mouse.LeftButton and isDrawing', () => {
        const spyOnAppendLine = spyOn(service, 'appendLine');
        service.isDrawing = true;

        service.onMouseDown(mockLeftButton);

        expect(spyOnAppendLine).toHaveBeenCalled();
    });

    it('should call appendCircle onMouseDown if Mouse.LeftButton and currentJointType is Circle', () => {
        const spyOnAppendCircle = spyOn(service, 'appendCircle');
        service.currentJointType = LineJointType.Circle;

        service.onMouseDown(mockLeftButton);

        expect(spyOnAppendCircle).toHaveBeenCalled();
    });

    it('isMouseDown should be true when onMouseDown', () => {
        service.isMouseDown = false;

        service.onMouseDown(mockLeftButton);

        expect(service.isMouseDown).toBeTruthy();
    });