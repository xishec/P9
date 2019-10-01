import { ElementRef, Renderer2 } from '@angular/core';
import { getTestBed, TestBed } from '@angular/core/testing';

import { createMockSVGCircle } from '../../../../classes/test-helpers';
import { DrawStackService } from '../../draw-stack/draw-stack.service';
import { TracingToolService } from '../abstract-tools/tracing-tool/tracing-tool.service';
import { PencilToolService } from './pencil-tool.service';

const STACK_LENGTH = 1;
const X = 10;
const Y = 10;

describe('PencilToolService', () => {
    let injector: TestBed;
    let service: PencilToolService;

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
                },
            }],
        });

        injector = getTestBed();
        service = injector.get(PencilToolService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('when createSVGCirle it should call super.createSVGCircle', () => {
        const spyOnSuperCreateCircle = spyOn(TracingToolService.prototype, 'createSVGCircle').and.returnValue(createMockSVGCircle());

        service.createSVGCircle(X, Y);

        expect(spyOnSuperCreateCircle).toHaveBeenCalled();

    });
});
