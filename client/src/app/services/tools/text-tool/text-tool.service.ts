import { ElementRef, Injectable, Renderer2 } from '@angular/core';
import { MatSnackBar } from '@angular/material';

import { Keys, Mouse, SVG_NS } from 'src/constants/constants';
import {
    HTMLAttribute,
    TEXT_CURSOR,
    SNACKBAR_DURATION,
    TEXT_LINEBREAK,
    TEXT_SPACE,
} from 'src/constants/tool-constants';
import { DrawStackService } from '../../draw-stack/draw-stack.service';
import { ShortcutManagerService } from '../../shortcut-manager/shortcut-manager.service';
import { AbstractToolService } from '../abstract-tools/abstract-tool.service';
import { AttributesManagerService } from '../attributes-manager/attributes-manager.service';
import { ColorToolService } from '../color-tool/color-tool.service';
import { FontInfo } from 'src/classes/FontInfos';
import { TextCursor } from 'src/classes/textStyle/textCursor';

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
    text = '';

    bBoxAnchorLeft: number;
    bBoxWidth: number;
    bBoxHeight: number;

    textBoxXPosition: number;
    textBoxYPosition: number;

    textCursor: TextCursor;
    isWriting: boolean;

    actionMap: Map<string, (key: string) => void> = new Map([
        [Keys.Enter, this.createNewLine],
        [Keys.Backspace, this.erase],
        [Keys.ArrowLeft, this.moveCursor],
        [Keys.ArrowRight, this.moveCursor],
        [Keys.SmallerThan, this.openSnackBar],
    ]); //Change my name plz

    constructor(
        private shortCutManagerService: ShortcutManagerService,
        private colorToolService: ColorToolService,
        private snackBar: MatSnackBar
    ) {
        super();
        this.colorToolService.primaryColor.subscribe((color: string) => {
            this.updateStyle(HTMLAttribute.fill, '#' + color);
        });
    }

    getXPos = (clientX: number) => clientX - this.elementRef.nativeElement.getBoundingClientRect().left;
    getYPos = (clientY: number) => clientY - this.elementRef.nativeElement.getBoundingClientRect().top;

    initializeService(elementRef: ElementRef<SVGElement>, renderer: Renderer2, drawStack: DrawStackService): void {
        this.elementRef = elementRef;
        this.renderer = renderer;
        this.drawStack = drawStack;
        this.textCursor = new TextCursor(renderer);
    }

    initializeAttributesManagerService(attributeManagerService: AttributesManagerService): void {
        this.attributesManagerService = attributeManagerService;

        this.attributesManagerService.currentFont.subscribe((font) => {
            this.updateStyle(HTMLAttribute.font_family, font);
        });
        this.attributesManagerService.currentFontSize.subscribe((size) => {
            this.updateStyle(HTMLAttribute.font_size, size.toString());
        });
        this.attributesManagerService.currenTfontAlign.subscribe((align) => {
            this.updateAlign(align);
        });
        this.attributesManagerService.currentItalicState.subscribe((italic) => {
            this.updateItalic(italic);
        });
        this.attributesManagerService.currentBoldState.subscribe((bold) => {
            this.updateBold(bold);
        });
        this.attributesManagerService.currentIsWriting.subscribe((isWriting) => {
            this.isWriting = isWriting;
        });
    }

    updateStyle(attribute: HTMLAttribute, value: string) {
        switch (attribute) {
            case HTMLAttribute.fill:
                this.fontInfo.fontColor = value;
                break;
            case HTMLAttribute.font_family:
                this.fontInfo.fontType = value;
                break;
            case HTMLAttribute.font_size:
                this.fontInfo.fontSize = value;
                break;
        }
        if (this.isWriting) {
            this.renderer.setAttribute(this.textBox, attribute, value);
            this.updatePreviewBox();
        }
    }

    updateAlign(align: string): void {
        this.fontInfo.fontAlign = align;
        if (this.isWriting) {
            switch (align) {
                case 'middle': {
                    this.textBoxXPosition = this.bBoxAnchorLeft + this.bBoxWidth / 2;
                    break;
                }
                case 'start': {
                    this.textBoxXPosition = this.bBoxAnchorLeft;
                    break;
                }
                case 'end': {
                    this.textBoxXPosition = this.bBoxAnchorLeft + this.bBoxWidth;
                }
            }

            this.textBox.childNodes.forEach((tspan: SVGTSpanElement) => {
                this.renderer.setAttribute(tspan, 'x', this.textBoxXPosition.toString());
            });
            this.renderer.setAttribute(this.textBox, HTMLAttribute.text_anchor, this.fontInfo.fontAlign);
        }
    }

    updateItalic(isItalic: boolean): void {
        this.fontInfo.fontStyle = isItalic ? 'italic' : 'normal';
        if (this.isWriting) {
            this.renderer.setAttribute(this.textBox, HTMLAttribute.font_style, this.fontInfo.fontStyle);
            this.updatePreviewBox();
        }
    }

    updateBold(isBold: boolean): void {
        this.fontInfo.fontWeight = isBold ? 'bold' : 'normal';
        if (this.isWriting) {
            this.renderer.setAttribute(this.textBox, 'font-weight', this.fontInfo.fontWeight);
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
        // after the text is appended, get the bounding box of the text element and update the preview rectangle
        const textBBox = this.textBox.getBBox();
        this.bBoxAnchorLeft = textBBox.x;
        this.bBoxWidth = textBBox.width;
        this.bBoxHeight = textBBox.height;

        this.renderer.setAttribute(this.previewBox, 'x', this.bBoxAnchorLeft.toString());
        this.renderer.setAttribute(this.previewBox, 'y', textBBox.y.toString());
        this.renderer.setAttribute(this.previewBox, HTMLAttribute.width, this.bBoxWidth.toString());
        this.renderer.setAttribute(this.previewBox, HTMLAttribute.height, textBBox.height.toString());
    }

    initPreviewRect(): void {
        this.previewBox = this.renderer.createElement('rect', SVG_NS);
        this.renderer.setAttribute(this.previewBox, HTMLAttribute.stroke, 'black');
        this.renderer.setAttribute(this.previewBox, HTMLAttribute.stroke_width, '1');
        this.renderer.setAttribute(this.previewBox, HTMLAttribute.fill, 'none');
        this.renderer.setAttribute(this.previewBox, HTMLAttribute.stroke_dasharray, '5 5');
    }

    createTextBox(x: number, y: number): void {
        this.textBox = this.renderer.createElement('text', SVG_NS);
        this.renderer.setAttribute(this.textBox, 'x', x.toString());
        this.renderer.setAttribute(this.textBox, 'y', y.toString());
        this.renderer.setAttribute(this.textBox, HTMLAttribute.font_family, this.fontInfo.fontType);
        this.renderer.setAttribute(this.textBox, HTMLAttribute.font_size, this.fontInfo.fontSize);
        this.renderer.setAttribute(this.textBox, HTMLAttribute.font_style, this.fontInfo.fontStyle);
        this.renderer.setAttribute(this.textBox, HTMLAttribute.font_weight, this.fontInfo.fontWeight);
        this.renderer.setAttribute(this.textBox, HTMLAttribute.text_anchor, this.fontInfo.fontAlign);
        this.renderer.setAttribute(this.textBox, HTMLAttribute.fill, this.fontInfo.fontColor);
    }

    createNewLine(): void {
        const rightSideText = this.text.slice(this.textCursor.currentCursorIndex);
        const tsSpanStackIsNotEmpty = this.tspans.length !== 0;
        let refChilpos = 0;

        if (tsSpanStackIsNotEmpty) {
            refChilpos = this.textCursor.findLinePosition(this.currentLine, this.tspans);
            if (this.textCursor.currentCursorIndex === 0) {
                this.text = TEXT_LINEBREAK;
            } else {
                this.text = this.text.slice(0, this.textCursor.currentCursorIndex);
            }
            this.renderer.setProperty(this.currentLine, HTMLAttribute.innerHTML, this.text);
        }

        this.text = rightSideText.length === 0 ? TEXT_CURSOR : rightSideText;
        this.currentLine = this.renderer.createElement('tspan', SVG_NS);
        this.renderer.setAttribute(this.currentLine, 'x', this.textBoxXPosition.toString());
        this.renderer.setAttribute(this.currentLine, 'dy', '1em');
        this.renderer.setProperty(this.currentLine, HTMLAttribute.innerHTML, this.text);

        if (tsSpanStackIsNotEmpty) {
            this.renderer.insertBefore(this.textBox, this.currentLine, this.tspans[refChilpos + 1]);
            this.tspans.splice(refChilpos + 1, 0, this.currentLine);
        } else {
            this.renderer.appendChild(this.textBox, this.currentLine);
            this.tspans.push(this.currentLine);
        }
    }

    removeLine(): void {
        const remainingText = this.text.slice(this.textCursor.currentCursorIndex + 1);
        this.renderer.removeChild(this.textBox, this.currentLine);
        const toRemoveChildPos = this.textCursor.findLinePosition(this.currentLine, this.tspans);
        this.tspans.splice(toRemoveChildPos, 1);
        this.currentLine = this.tspans[toRemoveChildPos - 1];

        const textContent = this.currentLine.textContent as string;
        this.text =
            textContent === TEXT_LINEBREAK ? TEXT_CURSOR + remainingText : textContent + TEXT_CURSOR + remainingText;
    }

    erase(): void {
        if (this.textCursor.currentCursorIndex === 0 && this.tspans[0] !== this.currentLine) {
            this.removeLine();
        } else if (this.text.length !== 1) {
            const leftSideText = this.text.slice(0, this.textCursor.currentCursorIndex + 1).slice(0, -2);
            const rightSideText = this.text.slice(this.textCursor.currentCursorIndex + 1);
            this.text = leftSideText + TEXT_CURSOR + rightSideText;
        }
    }

    onMouseDown(event: MouseEvent): void {
        const xClick = this.getXPos(event.clientX);
        const yClick = this.getYPos(event.clientY);
        const button = event.button;

        if (!this.isWriting && button === Mouse.LeftButton) {
            this.shortCutManagerService.changeIsOnInput(true);
            this.attributesManagerService.changeIsWriting(true);

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
            this.textCursor.currentCursorIndex = this.text.indexOf(TEXT_CURSOR);
            this.cleanUp();
        }
    }

    onKeyDown(event: KeyboardEvent): void {
        if (!this.isWriting || event.ctrlKey || event.altKey) {
            return;
        }
        event.preventDefault();
        this.textCursor.currentCursorIndex = this.text.indexOf(TEXT_CURSOR);

        if (this.actionMap.has(event.key)) {
            (this.actionMap.get(event.key) as () => void).apply(this, [event.key]);
        } else {
            event.key === Keys.Space ? this.addText(TEXT_SPACE) : this.addText(event.key);
        }
        this.renderer.setProperty(this.currentLine, HTMLAttribute.innerHTML, this.text);
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
                this.text = this.textCursor.eraseCursor(this.text);
                this.renderer.setProperty(this.currentLine, HTMLAttribute.innerHTML, this.text);
                this.drawStack.push(this.gWrap);
            }
            this.tspans = new Array<SVGTSpanElement>();
            this.text = '';
            this.attributesManagerService.changeIsWriting(false);
            this.shortCutManagerService.changeIsOnInput(false);
        }
    }
    moveCursor(key: string): void {
        const textRef = { currentLine: this.currentLine, tspans: this.tspans };
        if (key === 'ArrowLeft') {
            this.text =
                this.textCursor.currentCursorIndex !== 0
                    ? this.textCursor.swapCursorInCurrentLine(this.text, -1)
                    : this.textCursor.swapCursorToAnotherLine(this.text, -1, textRef);
        } else {
            this.text =
                this.textCursor.currentCursorIndex !== this.text.length - 1
                    ? this.textCursor.swapCursorInCurrentLine(this.text, 1)
                    : this.textCursor.swapCursorToAnotherLine(this.text, 1, textRef);
        }
        this.currentLine = textRef.currentLine;
    }
    addText(key: string): void {
        if (key.length > 1) {
            return;
        }
        const leftSideText = this.text.slice(0, this.textCursor.currentCursorIndex + 1).replace(TEXT_CURSOR, key);
        const rightSideText = this.text.slice(this.textCursor.currentCursorIndex + 1);
        this.text = leftSideText + TEXT_CURSOR + rightSideText;
    }

    openSnackBar(): void {
        this.snackBar.open(`Le carractères ${Keys.SmallerThan}  n'est malheureusement pas disponible`, '', {
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
