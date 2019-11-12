import { ElementRef, Injectable, Renderer2 } from '@angular/core';
import { MatSnackBar } from '@angular/material';

import { BehaviorSubject } from 'rxjs';
import { FontInfo } from 'src/classes/FontInfos';
import { TextCursor } from 'src/classes/textStyle/textCursor';
import { KEYS, MOUSE, SVG_NS } from 'src/constants/constants';
import {
    FONT_ALIGN,
    FONT_STYLE,
    FONT_WEIGHT,
    HTML_ATTRIBUTE,
    SNACKBAR_DURATION,
    TEXT_CURSOR,
    TEXT_LINEBREAK,
    TEXT_SPACE,
} from 'src/constants/tool-constants';
import { DrawStackService } from '../../draw-stack/draw-stack.service';
import { ShortcutManagerService } from '../../shortcut-manager/shortcut-manager.service';
import { AbstractToolService } from '../abstract-tools/abstract-tool.service';
import { AttributesManagerService } from '../attributes-manager/attributes-manager.service';
import { ColorToolService } from '../color-tool/color-tool.service';

@Injectable({
    providedIn: 'root',
})
export class TextToolService extends AbstractToolService {
    elementRef: ElementRef<SVGElement>;
    renderer: Renderer2;
    drawStack: DrawStackService;

    attributesManagerService: AttributesManagerService;

    fontInfo: FontInfo = new FontInfo();

    gWrap: SVGGElement;
    previewBox: SVGRectElement;
    textBox: SVGTextElement;
    currentLine: SVGTSpanElement;
    tspans: SVGTSpanElement[] = new Array<SVGTSpanElement>();
    currentText: BehaviorSubject<string> = new BehaviorSubject('');
    get text(): string {
        return this.currentText.value;
    }
    set text(text: string) {
        this.currentText.next(text);
    }

    bBoxAnchorLeft: number;
    bBoxWidth: number;
    bBoxHeight: number;

    textBoxXPosition: number;
    textBoxYPosition: number;

    textCursor: TextCursor;
    isWriting: boolean;

    keyboardActions: Map<string, (key: string) => void> = new Map([
        [KEYS.Enter, this.createNewLine],
        [KEYS.Backspace, this.erase],
        [KEYS.ArrowLeft, this.moveCursor],
        [KEYS.ArrowRight, this.moveCursor],
        [KEYS.SmallerThan, this.openSnackBar],
    ]);

    constructor(
        private shortCutManagerService: ShortcutManagerService,
        private colorToolService: ColorToolService,
        public snackBar: MatSnackBar,
    ) {
        super();
        this.colorToolService.primaryColor.subscribe((color: string) => {
            this.updateStyle(HTML_ATTRIBUTE.fill, '#' + color);
        });
    }

    getXPos = (clientX: number) => clientX - this.elementRef.nativeElement.getBoundingClientRect().left;
    getYPos = (clientY: number) => clientY - this.elementRef.nativeElement.getBoundingClientRect().top;

    initializeService(elementRef: ElementRef<SVGElement>, renderer: Renderer2, drawStack: DrawStackService): void {
        this.elementRef = elementRef;
        this.renderer = renderer;
        this.drawStack = drawStack;
        this.textCursor = new TextCursor(renderer, this.currentText);
    }

    initializeAttributesManagerService(attributeManagerService: AttributesManagerService): void {
        this.attributesManagerService = attributeManagerService;

        this.attributesManagerService.font.subscribe((font) => {
            this.updateStyle(HTML_ATTRIBUTE.font_family, font);
        });
        this.attributesManagerService.fontSize.subscribe((size) => {
            this.updateStyle(HTML_ATTRIBUTE.font_size, size.toString());
        });
        this.attributesManagerService.fontAlign.subscribe((align) => {
            this.updateAlign(align);
        });
        this.attributesManagerService.italicState.subscribe((italic) => {
            this.updateItalic(italic);
        });
        this.attributesManagerService.boldState.subscribe((bold) => {
            this.updateBold(bold);
        });
        this.attributesManagerService.isWritingState.subscribe((isWriting) => {
            this.isWriting = isWriting;
        });
    }

    updateStyle(attribute: HTML_ATTRIBUTE, value: string) {
        switch (attribute) {
            case HTML_ATTRIBUTE.fill:
                this.fontInfo.fontColor = value;
                break;
            case HTML_ATTRIBUTE.font_family:
                this.fontInfo.fontFamily = value;
                break;
            case HTML_ATTRIBUTE.font_size:
                this.fontInfo.fontSize = value;
                break;
        }
        if (this.isWriting) {
            this.renderer.setAttribute(this.textBox, attribute, value);
            this.updatePreviewBox();
        }
    }

    updateAlign(align: FONT_ALIGN): void {
        this.fontInfo.fontAlign = align;
        if (this.isWriting) {
            switch (align) {
                case FONT_ALIGN.Middle: {
                    this.textBoxXPosition = this.bBoxAnchorLeft + this.bBoxWidth / 2;
                    break;
                }
                case FONT_ALIGN.Start: {
                    this.textBoxXPosition = this.bBoxAnchorLeft;
                    break;
                }
                case FONT_ALIGN.End: {
                    this.textBoxXPosition = this.bBoxAnchorLeft + this.bBoxWidth;
                }
            }

            this.textBox.childNodes.forEach((tspan: SVGTSpanElement) => {
                this.renderer.setAttribute(tspan, 'x', this.textBoxXPosition.toString());
            });
            this.renderer.setAttribute(this.textBox, HTML_ATTRIBUTE.text_anchor, this.fontInfo.fontAlign);
        }
    }

    updateItalic(isItalic: boolean): void {
        this.fontInfo.fontStyle = isItalic ? FONT_STYLE.Italic : FONT_STYLE.Normal;
        if (this.isWriting) {
            this.renderer.setAttribute(this.textBox, HTML_ATTRIBUTE.font_style, this.fontInfo.fontStyle);
            this.updatePreviewBox();
        }
    }

    updateBold(isBold: boolean): void {
        this.fontInfo.fontWeight = isBold ? FONT_WEIGHT.Bold : FONT_WEIGHT.Normal;
        if (this.isWriting) {
            this.renderer.setAttribute(this.textBox, HTML_ATTRIBUTE.font_weight, this.fontInfo.fontWeight);
            this.updatePreviewBox();
        }
    }

    ifClickInTextBox(x: number, y: number): boolean {
        return (
            x >= this.bBoxAnchorLeft &&
            x <= this.bBoxAnchorLeft + this.bBoxWidth &&
            y >= this.textBoxYPosition &&
            y <= this.textBoxYPosition + this.bBoxHeight
        );
    }

    updatePreviewBox(): void {
        const textBBox = this.textBox.getBBox();
        this.bBoxAnchorLeft = textBBox.x;
        this.bBoxWidth = textBBox.width;
        this.bBoxHeight = textBBox.height;

        this.renderer.setAttribute(this.previewBox, 'x', this.bBoxAnchorLeft.toString());
        this.renderer.setAttribute(this.previewBox, 'y', textBBox.y.toString());
        this.renderer.setAttribute(this.previewBox, HTML_ATTRIBUTE.width, this.bBoxWidth.toString());
        this.renderer.setAttribute(this.previewBox, HTML_ATTRIBUTE.height, textBBox.height.toString());
    }

    initPreviewRect(): void {
        this.previewBox = this.renderer.createElement('rect', SVG_NS);
        this.renderer.setAttribute(this.previewBox, HTML_ATTRIBUTE.stroke, 'black');
        this.renderer.setAttribute(this.previewBox, HTML_ATTRIBUTE.stroke_width, '1');
        this.renderer.setAttribute(this.previewBox, HTML_ATTRIBUTE.fill, 'none');
        this.renderer.setAttribute(this.previewBox, HTML_ATTRIBUTE.stroke_dasharray, '5 5');
    }

    createTextBox(x: number, y: number): void {
        this.textBox = this.renderer.createElement('text', SVG_NS);
        this.renderer.setAttribute(this.textBox, 'x', x.toString());
        this.renderer.setAttribute(this.textBox, 'y', y.toString());
        this.renderer.setAttribute(this.textBox, HTML_ATTRIBUTE.font_family, this.fontInfo.fontFamily);
        this.renderer.setAttribute(this.textBox, HTML_ATTRIBUTE.font_size, this.fontInfo.fontSize);
        this.renderer.setAttribute(this.textBox, HTML_ATTRIBUTE.font_style, this.fontInfo.fontStyle);
        this.renderer.setAttribute(this.textBox, HTML_ATTRIBUTE.font_weight, this.fontInfo.fontWeight);
        this.renderer.setAttribute(this.textBox, HTML_ATTRIBUTE.text_anchor, this.fontInfo.fontAlign);
        this.renderer.setAttribute(this.textBox, HTML_ATTRIBUTE.fill, this.fontInfo.fontColor);
    }

    createNewLine(): void {
        const remainingRightText = this.textCursor.rightSideText();
        const tsSpanStackIsNotEmpty = this.tspans.length !== 0;
        let refChilpos = 0;

        if (tsSpanStackIsNotEmpty) {
            refChilpos = this.textCursor.findLinePosition(this.currentLine, this.tspans);
            this.text = this.textCursor.isAtStartOfLine() ? TEXT_LINEBREAK : this.textCursor.leftSideText();
            this.renderer.setProperty(this.currentLine, HTML_ATTRIBUTE.innerHTML, this.text);
        }

        this.text = TEXT_CURSOR + remainingRightText;
        this.currentLine = this.renderer.createElement('tspan', SVG_NS);
        this.renderer.setAttribute(this.currentLine, 'x', this.textBoxXPosition.toString());
        this.renderer.setAttribute(this.currentLine, 'dy', '1em');
        this.renderer.setProperty(this.currentLine, HTML_ATTRIBUTE.innerHTML, this.text);

        if (tsSpanStackIsNotEmpty) {
            this.renderer.insertBefore(this.textBox, this.currentLine, this.tspans[refChilpos + 1]);
            this.tspans.splice(refChilpos + 1, 0, this.currentLine);
        } else {
            this.renderer.appendChild(this.textBox, this.currentLine);
            this.tspans.push(this.currentLine);
        }
    }

    removeLine(): void {
        this.renderer.removeChild(this.textBox, this.currentLine);
        const toRemoveChildPos = this.textCursor.findLinePosition(this.currentLine, this.tspans);
        this.tspans.splice(toRemoveChildPos, 1);
        this.currentLine = this.tspans[toRemoveChildPos - 1];

        const textContent = this.currentLine.textContent as string;
        const lastLineText = this.textCursor.rightSideText();
        this.text =
            textContent === TEXT_LINEBREAK ? TEXT_CURSOR + lastLineText : textContent + TEXT_CURSOR + lastLineText;
    }

    erase(): void {
        if (this.textCursor.isAtStartOfLine() && this.tspans[0] !== this.currentLine) {
            this.removeLine();
        } else {
            const newLeftSideText = this.textCursor.leftSideText().slice(0, -1);
            this.text = newLeftSideText + TEXT_CURSOR + this.textCursor.rightSideText();
        }
    }

    onMouseDown(event: MouseEvent): void {
        const xClick = this.getXPos(event.clientX);
        const yClick = this.getYPos(event.clientY);
        const button = event.button;

        if (!this.isWriting && button === MOUSE.LeftButton) {
            this.shortCutManagerService.changeIsOnInput(true);
            this.attributesManagerService.isWritingState.next(true);

            this.textBoxXPosition = xClick;
            this.textBoxYPosition = yClick;

            this.createTextBox(this.textBoxXPosition, this.textBoxYPosition);
            this.initPreviewRect();
            this.createNewLine();

            this.gWrap = this.renderer.createElement('g', SVG_NS);

            this.renderer.appendChild(this.gWrap, this.previewBox);
            this.renderer.appendChild(this.gWrap, this.textBox);
            this.renderer.appendChild(this.elementRef.nativeElement, this.gWrap);
            this.updatePreviewBox();
        } else if (!this.ifClickInTextBox(xClick, yClick)) {
            this.cleanUp();
        }
    }

    onKeyDown(event: KeyboardEvent): void {
        if (!this.isWriting || event.ctrlKey || event.altKey) {
            return;
        }
        event.preventDefault();
        this.textCursor.currentCursorIndex = this.text.indexOf(TEXT_CURSOR);

        if (this.keyboardActions.has(event.key)) {
            (this.keyboardActions.get(event.key) as () => void).apply(this, [event.key]);
        } else {
            this.addText(event.key);
        }
        this.renderer.setProperty(this.currentLine, HTML_ATTRIBUTE.innerHTML, this.text);
        setTimeout(() => {
            this.updatePreviewBox();
        }, 0);
    }

    cleanUp(): void {
        if (this.gWrap !== undefined && this.tspans.length !== 0) {
            this.renderer.removeChild(this.gWrap, this.previewBox);
            if (this.tspans.length === 1 && this.text === TEXT_CURSOR) {
                this.renderer.removeChild(this.elementRef, this.gWrap);
            } else {
                this.textCursor.currentCursorIndex = this.text.indexOf(TEXT_CURSOR);
                this.text = this.textCursor.erase();
                this.renderer.setProperty(this.currentLine, HTML_ATTRIBUTE.innerHTML, this.text);
                setTimeout(() => {
                    this.drawStack.push(this.gWrap);
                }, 0);
            }

            this.tspans = new Array<SVGTSpanElement>();
            this.text = '';
            this.attributesManagerService.isWritingState.next(false);
            this.shortCutManagerService.changeIsOnInput(false);
        }
    }
    moveCursor(key: string): void {
        const currentLineRef: SVGTSpanElement[] = [this.currentLine];
        if (key === KEYS.ArrowLeft) {
            this.text = this.textCursor.isAtStartOfLine()
                ? this.textCursor.swapToAnotherLine(-1, currentLineRef, this.tspans)
                : this.textCursor.swapInCurrentLine(-1);
        } else {
            this.text = this.textCursor.isAtEndOfLine()
                ? this.textCursor.swapToAnotherLine(1, currentLineRef, this.tspans)
                : this.textCursor.swapInCurrentLine(1);
        }
        this.currentLine = currentLineRef[0];
    }
    addText(key: string): void {
        if (key.length > 1) {
            return;
        } else if (key === KEYS.Space) {
            key = TEXT_SPACE;
        }
        const newLeftSideText = (this.textCursor.leftSideText() + TEXT_CURSOR).replace(TEXT_CURSOR, key);
        this.text = newLeftSideText + TEXT_CURSOR + this.textCursor.rightSideText();
    }

    openSnackBar(): void {
        this.snackBar.open(`Le carractères ${KEYS.SmallerThan}  n'est malheureusement pas disponible`, '', {
            duration: SNACKBAR_DURATION,
        });
    }
    // tslint:disable-next-line: no-empty
    onMouseUp(event: MouseEvent): void {}
    // tslint:disable-next-line: no-empty
    onMouseEnter(event: MouseEvent): void {}
    // tslint:disable-next-line: no-empty
    onMouseLeave(event: MouseEvent): void {}
    // tslint:disable-next-line: no-empty
    onKeyUp(event: KeyboardEvent): void {}
    // tslint:disable-next-line: no-empty
    onMouseMove(event: MouseEvent): void {}
}
