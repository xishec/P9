import { Renderer2 } from '@angular/core';
import { getTestBed, TestBed } from '@angular/core/testing';

import { BehaviorSubject } from 'rxjs';
import { TextCursor } from './textCursor';
import { TEXT_CURSOR } from 'src/constants/tool-constants';

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
                        setProperty: () => null,
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

    it(`swapInCurrentLine should return t${TEXT_CURSOR}est if string "${TEXT_CURSOR}test" is passed and CurrentCursorIndex is 0`, () => {
        service.text = TEXT_CURSOR + 'test';
        service.currentCursorIndex = 0;
        expect(service.swapInCurrentLine(1)).toEqual(`t${TEXT_CURSOR}est`);
    });

    it('erase should return "est" if test is passed and currentCursorIndex is zero', () => {
        service.text = 'test';

        expect(service.erase()).toEqual('est');
    });

    // to do swapToAnotherLine, findLinePosition and two last functions.

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
