import { TestBed, getTestBed } from "@angular/core/testing";

import { PencilToolService } from "./pencil-tool.service";
import { Renderer2, ElementRef } from '@angular/core';
import { DrawStackService } from '../../draw-stack/draw-stack.service';
import { createMockSVGCircle } from '../abstract-tools/test-helpers';
import { type } from 'os';

const STACK_LENGTH = 1;
const X = 10;
const Y = 10;

fdescribe("PencilToolService", () => {
    let injector: TestBed;
    let service: PencilToolService;
    // let mockDrawStackService: DrawStackService;
    beforeEach(() =>  {
        TestBed.configureTestingModule({
            providers: [PencilToolService,
            {
                provide: Renderer2,
                useValue: {
                    createElement: () => null,
                },
            }, {
                provide: ElementRef,
                useValue: {
                    nativeElement : {},
                }, 
            }, {
                provide: DrawStackService,
                useValue: {
                    getDrawStackLength: () => STACK_LENGTH,
                }
            }],
        });

        injector = getTestBed();
        service = injector.get(PencilToolService);

        // mockDrawStackService = injector.get<DrawStackService>(DrawStackService as Type<DrawStackService>);
    });

    it("should be created", () => {
        expect(service).toBeTruthy();
    });

    it('when createSVGCirle it should call super.createSVGCircle', () => {
        // Arrange
        const spyOnParentCreateSVGCircle = spyOn(Object.getPrototypeOf(service), 'createSVGCircle').and.returnValue(createMockSVGCircle());
        //const spyOnDrawStackGetLength = spyOn(mockDrawStackService, 'getDrawStackLength').and.returnValue(1);
        // Act
        service.createSVGCircle(X, Y);
        // Assert
        expect(spyOnParentCreateSVGCircle).toHaveBeenCalled();
    });

    it('when createSVGPath it should call super.createSVGPath', () => {
        // Arrange
        const spyOnParentCreateSVGPath = spyOn(Object.getPrototypeOf(service), 'createSVGPath').and.returnValue(type);
        // Act
        service.createSVGPath();
        // Assert
        expect(spyOnParentCreateSVGPath).toHaveBeenCalled();
    });
});
