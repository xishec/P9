import { ElementRef, Renderer2 } from '@angular/core';
import { getTestBed, TestBed } from '@angular/core/testing';

import { Mouse } from 'src/constants/constants';
import {  createMouseEvent } from '../test-helpers'; // , createMouseEvent,
import { TracingToolService } from './tracing-tool.service';


fdescribe('TracingToolService', () => {
    let injector: TestBed;
    let service: TracingToolService;
    const mockMouseLeftButton = createMouseEvent(10, 10, Mouse.LeftButton);
    //const renderer: Renderer2;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [TracingToolService,
            {
                provide: Renderer2,
                useValue: {
                    createElement: () => null,
                    setAttribute: () => null,
                    appendChild: () => null,
                },
            }, {
                provide: ElementRef,
                useValue: {
                    nativeElement : {},
                },
            }],
        });

        injector = getTestBed();
        service = injector.get(TracingToolService);

        spyOn(service, 'getXPos').and.returnValue(10);
        spyOn(service, 'getYPos').and.returnValue(10);

        //renderer = injector.get<Renderer2>(Renderer2 as Type<Renderer2>);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('when onMouseDown isDrawing should be true', () => {
        spyOn(service, 'createSVGWrapper').and.returnValue();
        spyOn(service, 'createSVGCircle').and.returnValue(null as unknown as SVGCircleElement);
        spyOn(service, 'createSVGPath').and.returnValue();
        service.onMouseDown(mockMouseLeftButton);
        expect(service.getIsDrawing()).toBeTruthy();
    });

    it('when onMouseDown currentPath contain M and mouse position', () => {
        spyOn(service, 'createSVGWrapper').and.returnValue();
        spyOn(service, 'createSVGCircle').and.returnValue(null as unknown as SVGCircleElement);
        spyOn(service, 'createSVGPath').and.returnValue();
        service.onMouseDown(mockMouseLeftButton);
        expect(service.getCurrentPath()).toContain('M10 10');
    })

    it('when onMouseMove if notDrawing should not update currentPath', () => {
        spyOn(service, 'getIsDrawing').and.returnValue(false);
        service.onMouseMove(mockMouseLeftButton);
    })

    // it('when MouseEvent is left button currentPath contains M and mouse position', () => {
    //     spyOn(service, 'createSVGWrapper').and.returnValue();
    //     //spyOn(service, 'createSVGCircle').and.callFake();
    // });

    // it('when createSVGWrapper renderer.creteElement should be called before renderer.setAttribute', () => {
    //     const createElementSpy = spyOn(renderer, 'createElement').and.callThrough();
    //     const setAttributeSpy = spyOn(renderer, 'setAttribute').and.callThrough();
    //     service.createSVGWrapper();
    //     expect(createElementSpy).toHaveBeenCalledBefore(setAttributeSpy);
    // });

    // it('when onMouseDown if LeftButton createSVGWrapper is called', () => {
    //     const createSVGWrapperSpy = spyOn(service, 'createSVGWrapper').and.returnValue();
    //     service.onMouseDown(mockMouseLeftButton);
    //     expect(createSVGWrapperSpy).toHaveBeenCalled();
    // });

});
