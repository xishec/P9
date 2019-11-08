import { ElementRef, Injectable, Renderer2 } from '@angular/core';

import { SVG_NS } from 'src/constants/constants';
import { HTMLAttribute, TEXT_CURSOR, TEXT_SPACE } from 'src/constants/tool-constants';
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

    fontType: string;
    fontSize: number;
    fontAlign: string;
    fontStyle = 'normal';
    fontWeight = 'normal';

    gWrap: SVGGElement;
    previewBox: SVGRectElement;
    textBox: SVGTextElement;
    currentLine: SVGTSpanElement;
    tspanStack: SVGTSpanElement[] = new Array<SVGTSpanElement>();
    text = '';

    bBoxAnchorLeft: number;
    bBoxWidth: number;
    bBoxHeight: number;

    textBoxXPosition: number;
    textBoxYPosition: number;

    currentCursorIndex = 0;
    isWriting: boolean;

    primColor: string;

    constructor(private shortCutManagerService: ShortcutManagerService, private colorToolService: ColorToolService) {
        super();
        this.colorToolService.primaryColor.subscribe((color: string) => {
            this.updateColor(color);
        });
    }

    getXPos = (clientX: number) => clientX - this.elementRef.nativeElement.getBoundingClientRect().left;
    getYPos = (clientY: number) => clientY - this.elementRef.nativeElement.getBoundingClientRect().top;

    initializeService(elementRef: ElementRef<SVGElement>, renderer: Renderer2, drawStack: DrawStackService): void {
        this.elementRef = elementRef;
        this.renderer = renderer;
        this.drawStack = drawStack;
    }

    initializeAttributesManagerService(attributeManagerService: AttributesManagerService): void {
        this.attributesManagerService = attributeManagerService;

        this.attributesManagerService.currentFont.subscribe((font) => {
            this.updateFont(font);
        });
        this.attributesManagerService.currentFontSize.subscribe((size) => {
            this.updateFontSize(size);
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

    updateColor(color: string) {
        this.primColor = color;
        if (this.isWriting) {
            this.renderer.setAttribute(this.textBox, 'fill', '#' + this.primColor);
        }
    }

    updateFont(font: string): void {
        this.fontType = font;
        if (this.isWriting) {
            this.renderer.setAttribute(this.textBox, 'font-family', this.fontType);
            this.updatePreviewBox();
        }
    }

    updateFontSize(size: number): void {
        this.fontSize = size;
        if (this.isWriting) {
            this.renderer.setAttribute(this.textBox, 'font-size', this.fontSize.toString());
            this.updatePreviewBox();
        }
    }

    updateAlign(align: string): void {
        this.fontAlign = align;
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
            this.renderer.setAttribute(this.textBox, 'text-anchor', this.fontAlign);
        }
    }

    updateItalic(isItalic: boolean): void {
        this.fontStyle = isItalic ? 'italic' : 'normal';
        if (this.isWriting) {
            this.renderer.setAttribute(this.textBox, 'font-style', this.fontStyle);
            this.updatePreviewBox();
        }
    }

    updateBold(isBold: boolean): void {
        this.fontWeight = isBold ? 'bold' : 'normal';
        if (this.isWriting) {
            this.renderer.setAttribute(this.textBox, 'font-weight', this.fontWeight);
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

    onMouseMove(event: MouseEvent): void {
        // nothing
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
        this.renderer.setAttribute(this.textBox, 'font-family', this.fontType);
        this.renderer.setAttribute(this.textBox, 'font-size', this.fontSize.toString());
        this.renderer.setAttribute(this.textBox, 'font-style', this.fontStyle);
        this.renderer.setAttribute(this.textBox, 'font-weight', this.fontWeight);
        this.renderer.setAttribute(this.textBox, 'text-anchor', this.fontAlign);
        this.renderer.setAttribute(this.textBox, 'fill', '#' + this.primColor);
    }

    createNewLine(): void {
        if (this.tspanStack.length !== 0) {
            this.text = this.text.length === 1 ? this.text.slice(0, -1) + TEXT_SPACE : this.text.slice(0, -1);
            this.renderer.setProperty(this.currentLine, 'innerHTML', this.text);
        }

        this.text = TEXT_CURSOR;
        this.currentLine = this.renderer.createElement('tspan', SVG_NS);
        this.renderer.setAttribute(this.currentLine, 'x', this.textBoxXPosition.toString());
        this.renderer.setAttribute(this.currentLine, 'dy', '1em');
        this.renderer.setProperty(this.currentLine, 'innerHTML', this.text);
        this.renderer.appendChild(this.textBox, this.currentLine);
        this.tspanStack.push(this.currentLine);
    }

    removeLine(): void {
        this.renderer.removeChild(this.textBox, this.currentLine);
        this.tspanStack.pop();
        this.currentLine = this.tspanStack[this.tspanStack.length - 1];
        const textContent = this.currentLine.textContent as string;
        this.text = textContent === TEXT_SPACE ? TEXT_CURSOR : textContent + TEXT_CURSOR;
    }
    erase(): void {
        if (this.text.length === 1 && this.tspanStack[0] !== this.currentLine) {
            this.removeLine();
        } else if (this.text.length !== 1) {
            this.text = this.text.slice(0, -2);
            this.text += TEXT_CURSOR;
        }
    }

    onMouseDown(event: MouseEvent): void {
        const xClick = this.getXPos(event.clientX);
        const yClick = this.getYPos(event.clientY);
        if (!this.isWriting) {
            this.shortCutManagerService.changeIsOnInput(true);

            this.textBoxXPosition = xClick;
            this.textBoxYPosition = yClick;

            // init the text box with position and style
            this.createTextBox(this.textBoxXPosition, this.textBoxYPosition);

            // init the preview Box with style
            this.initPreviewRect();

            this.createNewLine();

            this.gWrap = this.renderer.createElement('g', SVG_NS);

            this.renderer.appendChild(this.gWrap, this.previewBox);
            this.renderer.appendChild(this.gWrap, this.textBox);

            this.renderer.appendChild(this.elementRef.nativeElement, this.gWrap);
            this.updatePreviewBox();
            this.attributesManagerService.changeIsWriting(true);
        } else if (!this.ifClickInTextBox(xClick, yClick)) {
            this.cleanUp();
        }
    }

    onMouseUp(event: MouseEvent): void {}
    onMouseEnter(event: MouseEvent): void {}
    onMouseLeave(event: MouseEvent): void {}
    onKeyDown(event: KeyboardEvent): void {
        console.log(event.key.toString());
        if (!this.isWriting || event.ctrlKey || event.altKey) {
            return;
        }
        event.preventDefault();
        this.currentCursorIndex = this.text.indexOf(TEXT_CURSOR);

        if (event.key === 'Enter') {
            this.createNewLine();
        } else if (event.key === 'Backspace') {
            this.erase();
        } else if (event.key === ' ') {
            this.addText(TEXT_SPACE);
        } else if (event.key === 'ArrowLeft') {
            this.moveCursorLeft();
        } else if (event.key === 'ArrowRight') {
            this.moveCursorRight();
        } else {
            if (event.key.length < 2) {
                this.addText(event.key);
            }
        }
        this.renderer.setProperty(this.currentLine, 'innerHTML', this.text);
        setTimeout(() => {
            //Change me
            this.updatePreviewBox();
        }, 0);
    }

    onKeyUp(event: KeyboardEvent): void {}
    cleanUp(): void {
        if (this.gWrap !== undefined) {
            this.renderer.removeChild(this.gWrap, this.previewBox);
            if (this.tspanStack.length === 1 && this.text.length === 1) {
                // textbox is empty
                this.renderer.removeChild(this.elementRef, this.gWrap);
            } else {
                this.renderer.setProperty(this.currentLine, 'innerHTML', this.text.slice(0, -1));
                this.drawStack.push(this.gWrap);
            }
            this.tspanStack = new Array<SVGTSpanElement>();
            this.attributesManagerService.changeIsWriting(false);
            this.shortCutManagerService.changeIsOnInput(false);
        }
    }
    moveCursorLeft(): void {
        if (this.currentCursorIndex !== 0) {
            this.swapCursor(-1);
        }
    }

    moveCursorRight(): void {
        if (this.currentCursorIndex !== this.text.length - 1) {
            this.swapCursor(1);
        }
    }
    swapCursor(offset: number): void {
        const arr = this.text.split('');
        arr[this.currentCursorIndex] = arr[this.currentCursorIndex + offset];
        arr[this.currentCursorIndex + offset] = TEXT_CURSOR;
        this.text = arr.join('').toString();
    }

    addText(key: string): void {
        let textToAddValue = this.text.slice(0, this.currentCursorIndex + 1);
        const restOfText = this.text.slice(this.currentCursorIndex + 1);
        textToAddValue = textToAddValue.replace(TEXT_CURSOR, key);
        this.text = textToAddValue + TEXT_CURSOR + restOfText;
    }
}
