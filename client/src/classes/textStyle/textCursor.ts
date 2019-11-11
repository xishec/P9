import { Renderer2 } from '@angular/core';
import { HTMLAttribute, TEXT_CURSOR, TEXT_LINEBREAK } from 'src/constants/tool-constants';

export class TextCursor {
    currentCursorIndex = 0;

    constructor(private renderer: Renderer2) {}

    swapInCurrentLine(text: string, offset: number): string {
        const buffer = text.split('');
        buffer[this.currentCursorIndex] = buffer[this.currentCursorIndex + offset];
        buffer[this.currentCursorIndex + offset] = TEXT_CURSOR;
        return buffer.join('').toString();
    }

    swapToAnotherLine(
        text: string,
        offset: number,
        textRef: { currentLine: SVGTSpanElement; tspans: SVGTSpanElement[] }
    ): string {
        const nextLinePosition = this.findLinePosition(textRef.currentLine, textRef.tspans) + offset;
        if (nextLinePosition > textRef.tspans.length - 1 || nextLinePosition < 0) {
            return text;
        }

        text = this.erase(text);
        if (text === '') {
            text += TEXT_LINEBREAK;
        }

        this.renderer.setProperty(textRef.currentLine, HTMLAttribute.innerHTML, text);
        textRef.currentLine = textRef.tspans[nextLinePosition];
        text = textRef.currentLine.textContent as string;
        if (text === TEXT_LINEBREAK) {
            text = '';
        }

        offset < 0 ? (text += TEXT_CURSOR) : (text = TEXT_CURSOR + text);
        return text;
    }

    erase(text: string): string {
        const buffer = text.split('');
        buffer.splice(this.currentCursorIndex, 1);
        return buffer.join('').toString();
    }

    findLinePosition(currentLine: SVGTSpanElement, tspans: SVGTSpanElement[]): number {
        return tspans.findIndex((el: SVGTSpanElement) => {
            return el === currentLine;
        });
    }
}
