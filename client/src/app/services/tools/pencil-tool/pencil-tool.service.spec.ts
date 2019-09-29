import { getTestBed, TestBed } from '@angular/core/testing';

import { ElementRef, Renderer2 } from '@angular/core';
import { DrawStackService } from '../../draw-stack/draw-stack.service';
import { createMockSVGCircle } from '../abstract-tools/test-helpers';
import { TracingToolService } from '../abstract-tools/tracing-tool/tracing-tool.service';
import { PencilToolService } from './pencil-tool.service';

const STACK_LENGTH = 1;
const X = 10;
const Y = 10;

describe('PencilToolService', () => {
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
                },
            }],
        });

        injector = getTestBed();
        service = injector.get(PencilToolService);

        // mockDrawStackService = injector.get<DrawStackService>(DrawStackService as Type<DrawStackService>);
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
