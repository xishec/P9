import { Renderer2 } from '@angular/core';
import { getTestBed, TestBed } from '@angular/core/testing';

import { BehaviorSubject } from 'rxjs';

import { TEXT_CURSOR } from 'src/constants/tool-constants';
import { TextCursor } from './textCursor';

describe('TextCursor', () => {
    let injector: TestBed;
    let service: TextCursor;
    const TEXT = `te${TEXT_CURSOR}st`;

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
        service.currentCursorIndex = 2;
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it(`swapInCurrentLine should return t${TEXT_CURSOR}est if string "${TEXT}" is passed,cursorindex is 2 and offset is -1`, () => {
        service.text = TEXT;

        expect(service.swapInCurrentLine(-1)).toEqual(`t${TEXT_CURSOR}est`);
    });

    it(`erase should return test if string ${TEXT} is passed and currentCursorIndex is 2`, () => {
        service.text = TEXT;

        expect(service.erase()).toEqual('test');
    });

    it(`leftSideText should return "te" if "${TEXT}" is passed and currentCursorIndex is 2`, () => {
        service.text = TEXT;

        expect(service.leftSideText()).toEqual('te');
    });

    it(`rightSideText should return "st" if "${TEXT}" is passed and currentCursorIndex is 2`, () => {
        service.text = TEXT;

        expect(service.rightSideText()).toEqual('st');
    });

    it('isAtStartOfLine should return true if text cursor is at start of line', () => {
        service.text = TEXT_CURSOR + 'test';
        service.currentCursorIndex = 0;
        expect(service.isAtStartOfLine()).toBeTruthy();
    });

    it('isAtEndOfLine should return true if text cursor is at end of line', () => {
        service.text = 'test' + TEXT_CURSOR;
        service.currentCursorIndex = service.text.indexOf(TEXT_CURSOR);

        expect(service.isAtEndOfLine()).toBeTruthy();
    });
});
