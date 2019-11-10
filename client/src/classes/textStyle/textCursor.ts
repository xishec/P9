import { TEXT_CURSOR } from 'src/constants/tool-constants';

export class TextCursor {
    currentCursorIndex = 0;

    updateTextCursorIndex(text: string): void {
        this.currentCursorIndex = text.indexOf(TEXT_CURSOR);
    }

    swapCursorToCurrentLine(text: string, offset: number) {
        const arr = text.split('');
        arr[this.currentCursorIndex] = arr[this.currentCursorIndex + offset];
        arr[this.currentCursorIndex + offset] = TEXT_CURSOR;
        this.text = arr.join('').toString();
    }

    eraseCursor(text: string): string {
        const buffer = text.split('');
        buffer.splice(this.currentCursorIndex, 1);
        return buffer.join('').toString();
    }
}
