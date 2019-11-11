import { Renderer2 } from '@angular/core';
import { HTMLAttribute, TEXT_CURSOR, TEXT_LINEBREAK } from 'src/constants/tool-constants';
import { BehaviorSubject } from 'rxjs';

export class TextCursor {
    currentCursorIndex = 0;
    text: string;
    constructor(private renderer: Renderer2, textObservable: BehaviorSubject<string>) {
        textObservable.subscribe((text) => {
            this.text = text;
        });
    }

    swapInCurrentLine(offset: number): string {
        const buffer = this.text.split('');
        buffer[this.currentCursorIndex] = buffer[this.currentCursorIndex + offset];
        buffer[this.currentCursorIndex + offset] = TEXT_CURSOR;
        return buffer.join('').toString();
    }

    swapToAnotherLine(offset: number, textRef: { currentLine: SVGTSpanElement; tspans: SVGTSpanElement[] }): string {
        const nextLinePosition = this.findLinePosition(textRef.currentLine, textRef.tspans) + offset;
        if (nextLinePosition > textRef.tspans.length - 1 || nextLinePosition < 0) {
            return this.text;
        }

        this.text = this.erase();
        if (this.text === '') {
            this.text += TEXT_LINEBREAK;
        }

        this.renderer.setProperty(textRef.currentLine, HTMLAttribute.innerHTML, this.text);
        textRef.currentLine = textRef.tspans[nextLinePosition];
        this.text = textRef.currentLine.textContent as string;
        if (this.text === TEXT_LINEBREAK) {
            this.text = '';
        }

        offset < 0 ? (this.text += TEXT_CURSOR) : (this.text = TEXT_CURSOR + this.text);
        return this.text;
    }

    erase(): string {
        const buffer = this.text.split('');
        buffer.splice(this.currentCursorIndex, 1);
        return buffer.join('').toString();
    }

    findLinePosition(currentLine: SVGTSpanElement, tspans: SVGTSpanElement[]): number {
        return tspans.findIndex((el: SVGTSpanElement) => {
            return el === currentLine;
        });
    }

    leftSideText(text: string): string {
        return text.slice(0, this.currentCursorIndex);
    }

    rightSideText(): string {
        return this.text.slice(this.currentCursorIndex + 1);
    }

    isAtStartOfLine(): boolean {
        return this.currentCursorIndex === 0;
    }

    isAtEndOfLine(): boolean {
        return this.currentCursorIndex === this.text.length - 1;
    }
}
