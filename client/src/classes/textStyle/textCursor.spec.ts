import { getTestBed, TestBed } from "@angular/core/testing";

import { BehaviorSubject } from "rxjs";

import { Renderer2 } from "@angular/core";
import {
    HTML_ATTRIBUTE,
    TEXT_CURSOR,
    TEXT_LINEBREAK
} from "src/constants/tool-constants";
import { createMockSVGTSpanElement } from "../test-helpers.spec";
import { TextCursor } from "./textCursor";

describe("TextCursor", () => {
    let injector: TestBed;
    let service: TextCursor;
    let currentLine: SVGTSpanElement;
    const TEXT = `te${TEXT_CURSOR}st`;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                TextCursor,
                {
                    provide: Renderer2,
                    useValue: {
                        setProperty: (
                            tspan: SVGTSpanElement,
                            name: HTML_ATTRIBUTE,
                            text: string
                        ) => {
                            tspan.textContent = text;
                        }
                    }
                },

                {
                    provide: BehaviorSubject,
                    useValue: {
                        subscribe: () => null
                    }
                }
            ]
        });

        injector = getTestBed();
        service = injector.get(TextCursor);
        service.currentCursorIndex = 2;
        currentLine = createMockSVGTSpanElement();
        currentLine.textContent = "";
    });

    it("should be created", () => {
        expect(service).toBeTruthy();
    });

    it(`swapInCurrentLine should return t${TEXT_CURSOR}est if string "${TEXT}" is passed,cursorindex is 2 and offset is -1`, () => {
        service.text = TEXT;

        expect(service.swapInCurrentLine(-1)).toEqual(`t${TEXT_CURSOR}est`);
    });

    it(`erase should return test if string ${TEXT} is passed and currentCursorIndex is 2`, () => {
        service.text = TEXT;

        expect(service.erase()).toEqual("test");
    });

    it(`leftSideText should return "te" if "${TEXT}" is passed and currentCursorIndex is 2`, () => {
        service.text = TEXT;

        expect(service.leftSideText()).toEqual("te");
    });

    it(`rightSideText should return "st" if "${TEXT}" is passed and currentCursorIndex is 2`, () => {
        service.text = TEXT;

        expect(service.rightSideText()).toEqual("st");
    });

    it("isAtStartOfLine should return true if text cursor is at start of line", () => {
        service.text = TEXT_CURSOR + "test";
        service.currentCursorIndex = 0;
        expect(service.isAtStartOfLine()).toBeTruthy();
    });

    it("isAtEndOfLine should return true if text cursor is at end of line", () => {
        service.text = "test" + TEXT_CURSOR;
        service.currentCursorIndex = service.text.indexOf(TEXT_CURSOR);

        expect(service.isAtEndOfLine()).toBeTruthy();
    });

    it("isAtStartOfLine should return false if text cursor is at end of line", () => {
        service.text = "test" + TEXT_CURSOR;
        service.currentCursorIndex = service.text.indexOf(TEXT_CURSOR);
        expect(service.isAtStartOfLine()).toBeFalsy();
    });

    it("isAtEndOfLine should return false if text cursor is at start of line", () => {
        service.text = TEXT_CURSOR + "test";
        service.currentCursorIndex = service.text.indexOf(TEXT_CURSOR);

        expect(service.isAtEndOfLine()).toBeFalsy();
    });

    it("findLinePosition should return 2 if currentLine is at index 1 in tspans", () => {
        const tspans: SVGTSpanElement[] = new Array<SVGTSpanElement>(
            createMockSVGTSpanElement(),
            currentLine
        );
        expect(service.findLinePosition(currentLine, tspans)).toEqual(1);
    });

    it("swapToAnotherLine should return the same text if there previous line doesnt exist", () => {
        service.text = TEXT;
        const tspans: SVGTSpanElement[] = new Array<SVGTSpanElement>(
            currentLine
        );
        expect(service.swapToAnotherLine(-1, [currentLine], tspans)).toEqual(
            TEXT
        );
    });

    it("swapToAnotherLine should return the same text if there next line doesnt exist", () => {
        service.text = TEXT;
        const tspans: SVGTSpanElement[] = new Array<SVGTSpanElement>(
            currentLine
        );
        expect(service.swapToAnotherLine(1, [currentLine], tspans)).toEqual(
            TEXT
        );
    });
    // tslint:disable-next-line: max-line-length
    it("swapToAnotherLine should set text to linebreak if text is empty and should only return cursor if next line is a linebreak", () => {
        service.text = "";
        const tspans: SVGTSpanElement[] = new Array<SVGTSpanElement>(
            currentLine,
            createMockSVGTSpanElement()
        );
        tspans[1].textContent = TEXT_LINEBREAK;

        expect(service.swapToAnotherLine(1, [currentLine], tspans)).toEqual(
            TEXT_CURSOR
        );
        expect(tspans[0].textContent).toEqual(TEXT_LINEBREAK);
    });
    // tslint:disable-next-line: max-line-length
    it("swapToAnotherLine should set text to linebreak if text is empty and should only return cursor if previous line is a linebreak", () => {
        service.text = "";
        const tspans: SVGTSpanElement[] = new Array<SVGTSpanElement>(
            createMockSVGTSpanElement(),
            currentLine
        );
        tspans[0].textContent = TEXT_LINEBREAK;

        expect(service.swapToAnotherLine(-1, [currentLine], tspans)).toEqual(
            TEXT_CURSOR
        );
        expect(tspans[1].textContent).toEqual(TEXT_LINEBREAK);
    });
});
