import { Renderer2 } from '@angular/core';
import { getTestBed, TestBed } from '@angular/core/testing';

import { BehaviorSubject } from 'rxjs';
import { TextCursor } from './textCursor';

fdescribe('TextCursor', () => {
    let injector: TestBed;
    let service: TextCursor;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                TextCursor,
                {
                    provide: Renderer2,
                    useValue: {
                        createElement: () => null,
                        setAttribute: () => null,
                        appendChild: () => null,
                        removeChild: () => null,
                        setProperty: () => null,
                        insertBefore: () => null,
                    },
                },
                {
                    provide: BehaviorSubject,
                    useValue: {
                        subscribe: () => null,
                    },
                },
            ],
        });

        injector = getTestBed();
        service = injector.get(TextCursor);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('swapInCurrentLine should return █est is string "test" is passed and currentCursorIndex is zero', () => {
        service.text = 'test';

        expect(service.swapInCurrentLine(0)).toEqual('█est');
    });

    it('erase should return "est" if test is passed and currentCursorIndex is zero', () => {
        service.text = 'test';

        expect(service.erase()).toEqual('est');
    });

    // to do swapToAnotherLine and findLinePosition and two last functions.
    // it('findLinePosition should return ', () => {
    //     service.text = 'test';

    //     expect(service.erase()).toEqual('est');
    // });

    it('leftSideText should return "" if "test" is passed and currentCursorIndex is zero', () => {
        expect(service.leftSideText('test')).toEqual('');
    });

    it('rightSideText should return "est" if "test" is passed and currentCursorIndex is zero', () => {
        service.text = 'test';

        expect(service.rightSideText()).toEqual('est');
    });
});
