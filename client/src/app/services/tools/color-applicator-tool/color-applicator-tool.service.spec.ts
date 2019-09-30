import { TestBed, getTestBed } from '@angular/core/testing';
import { /*Injectable,*/ Renderer2 } from '@angular/core';
//import { BehaviorSubject } from 'rxjs';

import { ColorApplicatorToolService } from './color-applicator-tool.service';
import { DrawStackService } from '../../draw-stack/draw-stack.service';
//import { AbstractToolService } from '../abstract-tools/abstract-tool.service';
//import { StackTargetInfo } from 'src/classes/StackTargetInfo';

//const MOCK_COLOR = '#000000';

export class FakeDrawStackService extends DrawStackService {
    // drawStack = new Array<SVGGElement>();
    // stackTarget = new BehaviorSubject(new StackTargetInfo());
    // currentStackTarget = this.stackTarget.asObservable();
}

fdescribe('ColorApplicatorToolService', () => {
    let service: ColorApplicatorToolService;
    let injector: TestBed;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [DrawStackService, Renderer2],
            // providers: [
            //     {
            //         provide: DrawStackService,
            //         useValue: {
            //             currentStackTarget: new StackTargetInfo(), //how do I do it???
            //         },
            //     },
            //     {
            //         provide: Renderer2,
            //         useValue: {
            //             createElement: () => null,
            //             setAttribute: () => null,
            //             appendChild: () => null,
            //         },
            //     },
            // ],
        });
        injector = getTestBed();
        service = injector.get(ColorApplicatorToolService);
    });

    it('ColorApplicatorToolService should be created', () => {
        expect(service).toBeTruthy();
    });

    it('#onMouseDown should ', () => {
        let event: MouseEvent = new MouseEvent('click');
        service.onMouseDown(event);
        expect(service).toBeTruthy();
    });

    it('#onMouseUp should not change ColorApplicatorToolService', () => {
        let event: MouseEvent = new MouseEvent('click');
        service.onMouseUp(event);
        expect(service).toBeTruthy();
    });

    it('#onMouseEnter should not change ColorApplicatorToolService', () => {
        let event: MouseEvent = new MouseEvent('click');
        service.onMouseEnter(event);
        expect(service).toBeTruthy();
    });

    it('#onMouseLeave should not change ColorApplicatorToolService', () => {
        let event: MouseEvent = new MouseEvent('click');
        service.onMouseLeave(event);
        expect(service).toBeTruthy();
    });

    it('#onKeyDown should not change ColorApplicatorToolService', () => {
        let event: KeyboardEvent = new KeyboardEvent('click');
        service.onKeyDown(event);
        expect(service).toBeTruthy();
    });

    it('#onKeyUp should not change ColorApplicatorToolService', () => {
        let event: KeyboardEvent = new KeyboardEvent('click');
        service.onKeyUp(event);
        expect(service).toBeTruthy();
    });

    it('#onMouseMove should not change ColorApplicatorToolService', () => {
        let event: MouseEvent = new MouseEvent('click');
        service.onMouseMove(event);
        expect(service).toBeTruthy();
    });
});
