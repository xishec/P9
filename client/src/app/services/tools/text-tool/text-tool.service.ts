import { ElementRef, Injectable, Renderer2 } from '@angular/core';
import { MatSnackBar } from '@angular/material';

import { BehaviorSubject } from 'rxjs';
import { FontInfo } from 'src/classes/FontInfos';
import { TextCursor } from 'src/classes/textStyle/textCursor';
import { KEYS, MOUSE, SVG_NS, TITLE_ELEMENT_TO_REMOVE } from 'src/constants/constants';
import {
    FONT_ALIGN,
    FONT_STYLE,
    FONT_WEIGHT,
    HTML_ATTRIBUTE,
    SNACKBAR_DURATION,
    TEXT_CURSOR,
    TEXT_LINEBREAK,
    TEXT_SPACE,
    TOOL_NAME,
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
    private elementRef: ElementRef<SVGElement>;
    private renderer: Renderer2;
    private drawStack: DrawStackService;

    private attributesManagerService: AttributesManagerService;

    private fontInfo: FontInfo = {} as FontInfo;

    private gWrap: SVGGElement;
    private previewBox: SVGRectElement;
    private textBox: SVGTextElement;
    private currentLine: SVGTSpanElement;
    private tspans: SVGTSpanElement[] = new Array<SVGTSpanElement>();
    private currentText: BehaviorSubject<string> = new BehaviorSubject('');
    get text(): string {
        return this.currentText.value;
    }
    set text(text: string) {
        this.currentText.next(text);
    }

    private bBoxAnchorLeft: number;
    private bBoxWidth: number;
    private bBoxHeight: number;

    private textBoxXPosition: number;
    private textBoxYPosition: number;

    private textCursor: TextCursor;
    private isWriting: boolean;

    private keyboardActions: Map<string, (key: string) => void> = new Map([
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
            this.updateStyle(HTML_ATTRIBUTE.Fill, '#' + color);
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
            this.updateStyle(HTML_ATTRIBUTE.FontFamily, font);
        });
        this.attributesManagerService.fontSize.subscribe((size) => {
            this.updateStyle(HTML_ATTRIBUTE.FontSize, size.toString());
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

    private updateStyle(attribute: HTML_ATTRIBUTE, value: string) {
        switch (attribute) {
            case HTML_ATTRIBUTE.Fill:
                this.fontInfo.fontColor = value;
                break;
            case HTML_ATTRIBUTE.FontFamily:
                this.fontInfo.fontFamily = value;
                break;
            case HTML_ATTRIBUTE.FontSize:
                this.fontInfo.fontSize = value;
                break;
        }
        if (this.isWriting) {
            this.renderer.setAttribute(this.gWrap, attribute, value);
            this.updatePreviewBox();
        }
    }

    private updateAlign(align: FONT_ALIGN): void {
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
                this.renderer.setAttribute(tspan, HTML_ATTRIBUTE.X, this.textBoxXPosition.toString());
            });
            this.renderer.setAttribute(this.textBox, HTML_ATTRIBUTE.TextAnchor, this.fontInfo.fontAlign);
        }
    }

    private updateItalic(isItalic: boolean): void {
        this.fontInfo.fontStyle = isItalic ? FONT_STYLE.Italic : FONT_STYLE.Normal;
        if (this.isWriting) {
            this.renderer.setAttribute(this.textBox, HTML_ATTRIBUTE.FontStyle, this.fontInfo.fontStyle);
            this.updatePreviewBox();
        }
    }

    private updateBold(isBold: boolean): void {
        this.fontInfo.fontWeight = isBold ? FONT_WEIGHT.Bold : FONT_WEIGHT.Normal;
        if (this.isWriting) {
            this.renderer.setAttribute(this.textBox, HTML_ATTRIBUTE.FontWeight, this.fontInfo.fontWeight);
            this.updatePreviewBox();
        }
    }

    private ifClickInTextBox(x: number, y: number): boolean {
        return (
            x >= this.bBoxAnchorLeft &&
            x <= this.bBoxAnchorLeft + this.bBoxWidth &&
            y >= this.textBoxYPosition &&
            y <= this.textBoxYPosition + this.bBoxHeight
        );
    }

    private updatePreviewBox(): void {
        const textBBox = this.textBox.getBBox();
        this.bBoxAnchorLeft = textBBox.x;
        this.bBoxWidth = textBBox.width;
        this.bBoxHeight = textBBox.height;

        this.renderer.setAttribute(this.previewBox, HTML_ATTRIBUTE.X, this.bBoxAnchorLeft.toString());
        this.renderer.setAttribute(this.previewBox, HTML_ATTRIBUTE.Y, textBBox.y.toString());
        this.renderer.setAttribute(this.previewBox, HTML_ATTRIBUTE.Width, this.bBoxWidth.toString());
        this.renderer.setAttribute(this.previewBox, HTML_ATTRIBUTE.Height, textBBox.height.toString());

        this.renderer.setAttribute(this.gWrap, HTML_ATTRIBUTE.X, this.bBoxAnchorLeft.toString());
        this.renderer.setAttribute(this.gWrap, HTML_ATTRIBUTE.Y, textBBox.y.toString());
        this.renderer.setAttribute(this.gWrap, HTML_ATTRIBUTE.Width, this.bBoxWidth.toString());
        this.renderer.setAttribute(this.gWrap, HTML_ATTRIBUTE.Height, textBBox.height.toString());
    }

    private initPreviewRect(): void {
        this.previewBox = this.renderer.createElement('rect', SVG_NS);
        this.renderer.setAttribute(this.previewBox, HTML_ATTRIBUTE.Title, TITLE_ELEMENT_TO_REMOVE);
        this.renderer.setAttribute(this.previewBox, HTML_ATTRIBUTE.Stroke, 'black');
        this.renderer.setAttribute(this.previewBox, HTML_ATTRIBUTE.StrokeWidth, '1');
        this.renderer.setAttribute(this.previewBox, HTML_ATTRIBUTE.Fill, 'none');
        this.renderer.setAttribute(this.previewBox, HTML_ATTRIBUTE.StrokeDasharray, '5 5');
    }

    private createTextBox(x: number, y: number): void {
        this.textBox = this.renderer.createElement('text', SVG_NS);
        this.renderer.setAttribute(this.textBox, HTML_ATTRIBUTE.X, x.toString());
        this.renderer.setAttribute(this.textBox, HTML_ATTRIBUTE.Y, y.toString());
    }

    private createNewLine(): void {
        const remainingRightText = this.textCursor.rightSideText();
        const tsSpanStackIsNotEmpty = this.tspans.length !== 0;
        let refChilpos = 0;

        if (tsSpanStackIsNotEmpty) {
            refChilpos = this.textCursor.findLinePosition(this.currentLine, this.tspans);
            this.text = this.textCursor.isAtStartOfLine() ? TEXT_LINEBREAK : this.textCursor.leftSideText();
            this.renderer.setProperty(this.currentLine, HTML_ATTRIBUTE.InnerHTML, this.text);
        }

        this.text = TEXT_CURSOR + remainingRightText;
        this.currentLine = this.renderer.createElement('tspan', SVG_NS);
        this.renderer.setAttribute(this.currentLine, HTML_ATTRIBUTE.X, this.textBoxXPosition.toString());
        this.renderer.setAttribute(this.currentLine, 'dy', '1em');
        this.renderer.setProperty(this.currentLine, HTML_ATTRIBUTE.InnerHTML, this.text);

        if (tsSpanStackIsNotEmpty) {
            this.renderer.insertBefore(this.textBox, this.currentLine, this.tspans[refChilpos + 1]);
            this.tspans.splice(refChilpos + 1, 0, this.currentLine);
        } else {
            this.renderer.appendChild(this.textBox, this.currentLine);
            this.tspans.push(this.currentLine);
        }
    }

    private removeLine(): void {
        this.renderer.removeChild(this.textBox, this.currentLine);
        const toRemoveChildPos = this.textCursor.findLinePosition(this.currentLine, this.tspans);
        this.tspans.splice(toRemoveChildPos, 1);
        this.currentLine = this.tspans[toRemoveChildPos - 1];

        const textContent = this.currentLine.textContent as string;
        const lastLineText = this.textCursor.rightSideText();
        this.text =
            textContent === TEXT_LINEBREAK ? TEXT_CURSOR + lastLineText : textContent + TEXT_CURSOR + lastLineText;
    }

    private erase(): void {
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
            this.renderer.setAttribute(this.gWrap, HTML_ATTRIBUTE.Title, TOOL_NAME.Text);
            this.renderer.setAttribute(this.gWrap, HTML_ATTRIBUTE.Fill, this.fontInfo.fontColor);
            this.renderer.setAttribute(this.gWrap, HTML_ATTRIBUTE.FontFamily, this.fontInfo.fontFamily);
            this.renderer.setAttribute(this.gWrap, HTML_ATTRIBUTE.FontSize, this.fontInfo.fontSize);
            this.renderer.setAttribute(this.gWrap, HTML_ATTRIBUTE.FontStyle, this.fontInfo.fontStyle);
            this.renderer.setAttribute(this.gWrap, HTML_ATTRIBUTE.FontWeight, this.fontInfo.fontWeight);
            this.renderer.setAttribute(this.gWrap, HTML_ATTRIBUTE.TextAnchor, this.fontInfo.fontAlign);

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
        this.renderer.setProperty(this.currentLine, HTML_ATTRIBUTE.InnerHTML, this.text);
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
                this.renderer.setProperty(this.currentLine, HTML_ATTRIBUTE.InnerHTML, this.text);
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
    private moveCursor(key: string): void {
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
    private addText(key: string): void {
        if (key.length > 1) {
            return;
        } else if (key === KEYS.Space) {
            key = TEXT_SPACE;
        }
        const newLeftSideText = (this.textCursor.leftSideText() + TEXT_CURSOR).replace(TEXT_CURSOR, key);
        this.text = newLeftSideText + TEXT_CURSOR + this.textCursor.rightSideText();
    }

    private openSnackBar(): void {
        this.snackBar.open(`Le caractère ${KEYS.SmallerThan} n'est malheureusement pas disponible`, '', {
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
