import { ElementRef, Renderer2 } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { PenToolService } from './pen-tool.service';
import { provideAutoMock } from '../../../../classes/test.helper.msTeams.spec';
import { DrawStackService } from '../../draw-stack/draw-stack.service';

fdescribe('PenToolService', () => {
    beforeEach(() =>
        TestBed.configureTestingModule({
            providers: [
                provideAutoMock(ElementRef),
                {
                    provide: Renderer2,
                    useValue: {
                        createElement: () => null,
                    },
                },
                provideAutoMock(DrawStackService),
            ],
        }),
    );

    it('should be created', () => {
        const service: PenToolService = TestBed.get(PenToolService);
        expect(service).toBeTruthy();
    });
});
