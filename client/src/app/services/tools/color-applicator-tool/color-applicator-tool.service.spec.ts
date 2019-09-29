import { TestBed } from '@angular/core/testing';
import { /*Injectable,*/ Renderer2 } from '@angular/core';
//import { BehaviorSubject } from 'rxjs';

import { ColorApplicatorToolService } from './color-applicator-tool.service';
import { DrawStackService } from '../../draw-stack/draw-stack.service';
import { StackTargetInfo } from 'src/classes/StackTargetInfo';

//const MOCK_COLOR = '#000000';

export class FakeDrawStackService extends DrawStackService {
    // drawStack = new Array<SVGGElement>();
    // stackTarget = new BehaviorSubject(new StackTargetInfo());
    // currentStackTarget = this.stackTarget.asObservable();
}

fdescribe('ColorApplicatorToolService', () => {
    beforeEach(() =>
        TestBed.configureTestingModule({
            providers: [
                {
                    provide: DrawStackService,
                    useValue: {
                        currentStackTarget: new StackTargetInfo(), //how do I do it???
                    },
                },
                {
                    provide: Renderer2,
                    useValue: {
                        createElement: () => null,
                        setAttribute: () => null,
                        appendChild: () => null,
                    },
                },
            ],
        }),
    );

    it('should be created', () => {
        //spyOn(DrawStackService, 'currentStackTarget').and.returnValue({ subscribe: () => {} });
        const service: ColorApplicatorToolService = TestBed.get(ColorApplicatorToolService);
        expect(service).toBeTruthy();
    });
});
