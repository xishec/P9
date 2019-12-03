import { ElementRef, Injectable, Renderer2 } from '@angular/core';

import { Coords2D } from 'src/classes/Coords2D';
import { StackTargetInfo } from 'src/classes/StackTargetInfo';
import { SVGGElementInfo } from 'src/classes/svggelement-info';
import { DEFAULT_GRAY_0, DEFAULT_RED, DEFAULT_WHITE } from 'src/constants/color-constants';
import {
    ELEMENTS_BEFORE_LAST_CIRCLE,
    MOUSE,
    SIDEBAR_WIDTH,
    SVG_NS,
    TITLE_ELEMENT_TO_REMOVE,
} from 'src/constants/constants';
import {
    ADDITIONAL_BORDER_WIDTH,
    DEFAULT_RADIX,
    ERASER_SIZE,
    ERASER_STROKE_WIDTH,
    HTML_ATTRIBUTE,
    RESET_POSITION_NUMBER,
    TOOL_NAME,
} from 'src/constants/tool-constants';
import { DrawStackService } from '../../draw-stack/draw-stack.service';
import { UndoRedoerService } from '../../undo-redoer/undo-redoer.service';
import { AbstractToolService } from '../abstract-tools/abstract-tool.service';
import { AttributesManagerService } from '../attributes-manager/attributes-manager.service';

@Injectable({
    providedIn: 'root',
})
export class EraserToolService extends AbstractToolService {
    eraser: SVGRectElement;
    textBorder: SVGRectElement;
    attributesManagerService: AttributesManagerService;
    currentTarget = 0;
    currentSize = ERASER_SIZE.Default;
    isOnTarget = false;
    isLeftMouseDown = false;
    isEraserAppended = false;
    lastElementColoredNumber = RESET_POSITION_NUMBER;
    lastToolName = '';
    erasedSomething = false;
    isHoveringText = false;

    // the string represents the id_element
    changedElements: Map<string, SVGGElementInfo> = new Map([]);

    currentMouseCoords: Coords2D = new Coords2D(0, 0);

    elementRef: ElementRef<SVGElement>;
    renderer: Renderer2;
    drawStack: DrawStackService;

    constructor(private undoRedoerService: UndoRedoerService) {
        super();
    }

    initializeService(elementRef: ElementRef<SVGElement>, renderer: Renderer2, drawStack: DrawStackService): void {
        this.elementRef = elementRef;
        this.renderer = renderer;
        this.drawStack = drawStack;

        this.drawStack.currentStackTarget.subscribe((stackTarget) => {
            this.currentTarget = stackTarget.targetPosition;
            this.isOnTarget = this.currentTarget !== undefined;
        });

        this.eraser = this.renderer.createElement('rect', SVG_NS);
        this.renderer.setAttribute(this.eraser, HTML_ATTRIBUTE.title, TITLE_ELEMENT_TO_REMOVE);
        this.renderer.setAttribute(this.eraser, HTML_ATTRIBUTE.width, this.currentSize.toString());
        this.renderer.setAttribute(this.eraser, HTML_ATTRIBUTE.height, this.currentSize.toString());

        this.renderer.setAttribute(this.eraser, HTML_ATTRIBUTE.fill, '#' + DEFAULT_WHITE);
        this.renderer.setAttribute(this.eraser, HTML_ATTRIBUTE.stroke, '#' + DEFAULT_GRAY_0);
        this.renderer.setAttribute(this.eraser, HTML_ATTRIBUTE.stroke_width, ERASER_STROKE_WIDTH);
    }

    initializeAttributesManagerService(attributesManagerService: AttributesManagerService): void {
        this.attributesManagerService = attributesManagerService;
        this.attributesManagerService.eraserSize.subscribe((newSize) => {
            this.currentSize = newSize;
            this.renderer.setAttribute(this.eraser, HTML_ATTRIBUTE.width, this.currentSize.toString());
            this.renderer.setAttribute(this.eraser, HTML_ATTRIBUTE.height, this.currentSize.toString());
        });
    }

    onMouseMove(event: MouseEvent): void {
        if (this.isLeftMouseDown) {
            this.onMouseDown(event);
        }
        this.checkElementsToErase();
        this.setEraserToMouse(event);
    }

    setEraserToMouse(event: MouseEvent): void {
        this.currentMouseCoords.x =
            event.clientX - this.elementRef.nativeElement.getBoundingClientRect().left - this.currentSize / 2;
        this.currentMouseCoords.y =
            event.clientY - this.elementRef.nativeElement.getBoundingClientRect().top - this.currentSize / 2;

        this.renderer.setAttribute(this.eraser, 'x', this.currentMouseCoords.x.toString());
        this.renderer.setAttribute(this.eraser, 'y', this.currentMouseCoords.y.toString());

        if (!this.isEraserAppended) {
            this.appendEraser();
        }
    }

    appendEraser(): void {
        this.renderer.appendChild(this.elementRef.nativeElement, this.eraser);
        this.isEraserAppended = true;
    }

    onMouseDown(event: MouseEvent): void {
        const button = event.button;
        if (button === MOUSE.LeftButton) {
            this.isLeftMouseDown = true;
        }

        this.checkElementsToErase();

        if (this.needToBeErased(button)) {
            this.renderer.removeChild(
                this.elementRef.nativeElement,
                this.drawStack.getElementByPosition(this.currentTarget),
            );

            if (this.isHoveringText) {
                this.renderer.removeChild(this.elementRef.nativeElement, this.textBorder);
            }

            this.drawStack.delete(this.drawStack.drawStack[this.currentTarget]);

            this.erasedSomething = true;

            if (this.currentTarget + 1) {
                this.changedElements.set(
                    this.currentTarget.toString(),
                    this.changedElements.get((this.currentTarget + 1).toString()) as SVGGElementInfo,
                );
            }
            this.checkElementsToErase();
        }

        this.isOnTarget = false;
    }

    needToBeErased(button: number): boolean {
        return (
            this.isOnTarget &&
            this.drawStack.getElementByPosition(this.currentTarget) !== undefined &&
            button === MOUSE.LeftButton
        );
    }

    isEraserTouchingElement(eraserBox: DOMRect, elementBox: DOMRect, strokeWidth?: number): boolean {
        const boxLeft = eraserBox.x + window.scrollX - SIDEBAR_WIDTH;
        const boxRight = eraserBox.x + window.scrollX - SIDEBAR_WIDTH + eraserBox.width;
        const boxTop = eraserBox.y + window.scrollY;
        const boxBottom = eraserBox.y + window.scrollY + eraserBox.height;

        let elLeft = elementBox.x + window.scrollX - SIDEBAR_WIDTH;
        let elRight = elementBox.x + window.scrollX - SIDEBAR_WIDTH + elementBox.width;
        let elTop = elementBox.y + window.scrollY;
        let elBottom = elementBox.y + window.scrollY + elementBox.height;

        if (strokeWidth) {
            const halfStrokeWidth = strokeWidth / 2;

            elLeft = elLeft - halfStrokeWidth;
            elRight = elRight + halfStrokeWidth;
            elTop = elTop - halfStrokeWidth;
            elBottom = elBottom + halfStrokeWidth;
        }

        // Check all cases where el and box don't touch each other
        if (elRight < boxLeft || boxRight < elLeft || elBottom < boxTop || boxBottom < elTop) {
            return false;
        }

        return true;
    }

    checkElementsToErase(): void {
        const eraserBox = this.getDOMRect(this.eraser);

        let enteredInSelection = false;
        let topElement = this.drawStack.getDrawStackLength() - 1;
        for (let drawStackIndex = this.drawStack.getDrawStackLength() - 1; drawStackIndex >= 0; drawStackIndex--) {
            const svgGElement = this.drawStack.drawStack[drawStackIndex];
            const elBox = this.getDOMRect(svgGElement);

            if (
                this.isEraserTouchingElement(eraserBox, elBox, this.getStrokeWidth(svgGElement)) &&
                topElement <= drawStackIndex
            ) {
                this.updateElementToColor(topElement, svgGElement, drawStackIndex);
                enteredInSelection = true;
                this.isOnTarget = true;
            } else {
                topElement--;
                this.removeBorder(
                    svgGElement.getAttribute('id_element') as string,
                    svgGElement.getAttribute('title') as string,
                );
            }
        }
        if (!enteredInSelection) {
            this.isOnTarget = false;
            this.lastElementColoredNumber = RESET_POSITION_NUMBER;
        }
    }

    updateElementToColor(topElement: number, svgGElement: SVGGElement, index: number): void {
        if (this.lastElementColoredNumber !== topElement) {
            this.addElementToMap(svgGElement);

            this.lastToolName = svgGElement.getAttribute('title') as string;

            this.drawStack.changeTargetElement(
                new StackTargetInfo(
                    parseInt(svgGElement.getAttribute('id_element') as string, DEFAULT_RADIX),
                    this.lastToolName,
                ),
            );

            this.lastElementColoredNumber = index;

            this.colorBorder(
                this.currentTarget,
                this.drawStack.drawStack[this.currentTarget].getAttribute(HTML_ATTRIBUTE.stroke_width),
                this.lastToolName,
            );
        }
    }

    addElementToMap(svgGElement: SVGGElement): void {
        if (!this.changedElements.get(svgGElement.getAttribute('id_element') as string)) {
            this.changedElements.set(
                svgGElement.getAttribute('id_element') as string,
                new SVGGElementInfo(
                    svgGElement.getAttribute(HTML_ATTRIBUTE.stroke) as string,
                    svgGElement.getAttribute(HTML_ATTRIBUTE.stroke_width) as string,
                ),
            );
        }
    }

    colorBorder(idElement: number, borderWidth: string | null, tool: string): void {
        if (borderWidth !== '0' && borderWidth !== null) {
            borderWidth = (parseInt(borderWidth, DEFAULT_RADIX) + ADDITIONAL_BORDER_WIDTH).toString();
        } else {
            borderWidth = ADDITIONAL_BORDER_WIDTH.toString();
        }

        if (this.checkIfText(idElement, tool, '#' + DEFAULT_RED, borderWidth)) {
            return;
        }

        this.checkIfPen(idElement, tool, '#' + DEFAULT_RED);

        this.checkIfStamp(idElement, tool, '#' + DEFAULT_RED);

        this.checkIfLineOrQuill(idElement, tool, '#' + DEFAULT_RED);

        this.renderer.setAttribute(
            this.drawStack.getElementByPosition(idElement),
            HTML_ATTRIBUTE.stroke,
            '#' + DEFAULT_RED,
        );
        this.renderer.setAttribute(
            this.drawStack.getElementByPosition(idElement),
            HTML_ATTRIBUTE.stroke_width,
            borderWidth,
        );
    }

    checkIfPen(idElement: number, tool: string, borderColor: string): void {
        if (tool === TOOL_NAME.Pen) {
            const childrenCount = this.drawStack.getElementByPosition(idElement).childElementCount;
            this.renderer.setAttribute(
                this.drawStack.getElementByPosition(idElement).childNodes[
                    childrenCount - 1 - ELEMENTS_BEFORE_LAST_CIRCLE
                ],
                HTML_ATTRIBUTE.fill,
                borderColor,
            );
        }
    }

    checkIfText(idElement: number, tool: string, borderColor: string, borderWidth: string): boolean {
        if (tool !== TOOL_NAME.Text) {
            return false;
        }

        if (borderWidth === '0') {
            this.renderer.removeChild(this.elementRef.nativeElement, this.textBorder);
            this.isHoveringText = false;
            return true;
        }

        this.isHoveringText = true;

        this.appendTextBorder(idElement, borderColor, borderWidth);

        this.appendEraser();

        return true;
    }

    appendTextBorder(idElement: number, borderColor: string, borderWidth: string): void {
        const width = this.drawStack.getElementByPosition(idElement).getAttribute(HTML_ATTRIBUTE.width) as string;
        const height = this.drawStack.getElementByPosition(idElement).getAttribute(HTML_ATTRIBUTE.height) as string;

        const x = parseInt(
            this.drawStack.getElementByPosition(idElement).getAttribute(HTML_ATTRIBUTE.x) as string,
            DEFAULT_RADIX,
        );
        const y = parseInt(
            this.drawStack.getElementByPosition(idElement).getAttribute(HTML_ATTRIBUTE.y) as string,
            DEFAULT_RADIX,
        );

        this.textBorder = this.renderer.createElement('rect', SVG_NS);
        this.renderer.setAttribute(this.textBorder, HTML_ATTRIBUTE.title, TITLE_ELEMENT_TO_REMOVE);
        this.renderer.setAttribute(this.textBorder, HTML_ATTRIBUTE.width, width);
        this.renderer.setAttribute(this.textBorder, HTML_ATTRIBUTE.height, height);

        this.renderer.setAttribute(this.textBorder, HTML_ATTRIBUTE.fill, 'none');
        this.renderer.setAttribute(this.textBorder, HTML_ATTRIBUTE.stroke, borderColor);
        this.renderer.setAttribute(this.textBorder, HTML_ATTRIBUTE.stroke_width, borderWidth);

        this.renderer.setAttribute(this.textBorder, HTML_ATTRIBUTE.x, x.toString());
        this.renderer.setAttribute(this.textBorder, HTML_ATTRIBUTE.y, y.toString());
        this.renderer.appendChild(this.elementRef.nativeElement, this.textBorder);
    }

    checkIfStamp(idElement: number, tool: string, borderColor: string): void {
        if (tool === TOOL_NAME.Stamp) {
            const childrenCount = this.drawStack.getElementByPosition(idElement).childElementCount;
            this.renderer.setAttribute(
                this.drawStack.getElementByPosition(idElement).childNodes[childrenCount - 1],
                HTML_ATTRIBUTE.stroke,
                borderColor,
            );
        }
    }

    checkIfLineOrQuill(idElement: number, tool: string, borderColor: string): void {
        if (
            (tool === TOOL_NAME.Line || tool === TOOL_NAME.Quill) &&
            this.drawStack.getElementByPosition(idElement).childElementCount > 1
        ) {
            const startingIndex = tool === TOOL_NAME.Line ? 1 : 0;
            const childrenCount = this.drawStack.getElementByPosition(idElement).childElementCount;
            const children = this.drawStack.getElementByPosition(idElement).childNodes;

            for (let childIndex = startingIndex; childIndex < childrenCount; childIndex++) {
                this.renderer.setAttribute(children[childIndex], HTML_ATTRIBUTE.fill, borderColor);
            }
        }
    }

    restoreBorder(idElement: number, borderColor: string | null, borderWidth: string | null, tool: string): void {
        if (borderColor === null) {
            borderColor = '';
        }

        if (borderWidth === null) {
            borderWidth = '0';
        }

        if (this.checkIfText(idElement, tool, borderColor, borderWidth)) {
            return;
        }

        this.checkIfPen(idElement, tool, borderColor);

        this.checkIfLineOrQuill(idElement, tool, borderColor);

        this.renderer.setAttribute(this.drawStack.getElementByPosition(idElement), HTML_ATTRIBUTE.stroke, borderColor);
        this.renderer.setAttribute(
            this.drawStack.getElementByPosition(idElement),
            HTML_ATTRIBUTE.stroke_width,
            borderWidth,
        );
    }

    removeBorder(position: string, tool: string): void {
        if (this.drawStack.drawStack[this.currentTarget] !== undefined) {
            const element = this.changedElements.get(position) as SVGGElementInfo;
            if (element !== undefined) {
                this.restoreBorder(parseInt(position, DEFAULT_RADIX), element.borderColor, element.borderWidth, tool);
                this.changedElements.delete(position);
            }
        }
    }

    getDOMRect(el: SVGGElement): DOMRect {
        return el.getBoundingClientRect() as DOMRect;
    }

    getStrokeWidth(el: SVGGElement): number {
        if (el.getAttribute(HTML_ATTRIBUTE.stroke_width)) {
            return parseInt(el.getAttribute(HTML_ATTRIBUTE.stroke_width) as string, DEFAULT_RADIX);
        }
        return 0;
    }

    onMouseUp(event: MouseEvent): void {
        const button = event.button;
        if (button === MOUSE.LeftButton) {
            this.isLeftMouseDown = false;
        }

        this.isOnTarget = false;

        if (this.currentTarget !== undefined) {
            const currentChangedTargetIsValid = this.changedElements.get(this.currentTarget.toString()) !== undefined;

            if (this.erasedSomething && currentChangedTargetIsValid) {
                const currentChangedTarget = this.changedElements.get(this.currentTarget.toString()) as SVGGElementInfo;
                this.renderer.removeChild(this.elementRef, this.eraser);
                this.restoreBorder(
                    this.currentTarget,
                    currentChangedTarget.borderColor,
                    currentChangedTarget.borderWidth,
                    this.lastToolName,
                );
                setTimeout(() => {
                    this.undoRedoerService.saveCurrentState(this.drawStack.idStack);
                }, 0);
                setTimeout(() => {
                    this.colorBorder(this.currentTarget, currentChangedTarget.borderWidth, this.lastToolName);
                    this.appendEraser();
                }, 0);
            } else {
                this.undoRedoerService.saveCurrentState(this.drawStack.idStack);
            }
        }
        this.erasedSomething = false;
    }

    onMouseEnter(event: MouseEvent): void {
        this.appendEraser();
    }

    // tslint:disable-next-line: no-empty
    onMouseOver(event: MouseEvent): void {}

    onMouseLeave(event: MouseEvent): void {
        this.cleanUp();
    }

    // tslint:disable-next-line: no-empty
    onKeyDown(event: KeyboardEvent): void {}

    // tslint:disable-next-line: no-empty
    onKeyUp(event: KeyboardEvent): void {}

    cleanUp(): void {
        this.renderer.removeChild(this.elementRef, this.eraser);
        this.isEraserAppended = false;
        if (this.lastElementColoredNumber !== -1) {
            this.removeBorder(this.lastElementColoredNumber.toString(), this.lastToolName as string);
        }
        this.lastElementColoredNumber = RESET_POSITION_NUMBER;
    }
}
