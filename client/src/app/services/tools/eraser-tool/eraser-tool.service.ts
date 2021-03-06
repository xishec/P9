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
    private eraser: SVGRectElement;
    private textBorder: SVGRectElement;
    private attributesManagerService: AttributesManagerService;
    private currentTarget = 0;
    private currentSize = ERASER_SIZE.Default;
    private isOnTarget = false;
    private isLeftMouseDown = false;
    private isEraserAppended = false;
    private lastElementColoredNumber = RESET_POSITION_NUMBER;
    private lastToolName = '';
    private erasedSomething = false;
    private isHoveringText = false;

    // the number represents the id_element
    changedElements: Map<number, SVGGElementInfo> = new Map([]);

    private currentMouseCoords: Coords2D = new Coords2D(0, 0);

    private elementRef: ElementRef<SVGElement>;
    private renderer: Renderer2;
    private drawStack: DrawStackService;

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
        this.renderer.setAttribute(this.eraser, HTML_ATTRIBUTE.Title, TITLE_ELEMENT_TO_REMOVE);
        this.renderer.setAttribute(this.eraser, HTML_ATTRIBUTE.Width, this.currentSize.toString());
        this.renderer.setAttribute(this.eraser, HTML_ATTRIBUTE.Height, this.currentSize.toString());

        this.renderer.setAttribute(this.eraser, HTML_ATTRIBUTE.Fill, '#' + DEFAULT_WHITE);
        this.renderer.setAttribute(this.eraser, HTML_ATTRIBUTE.Stroke, '#' + DEFAULT_GRAY_0);
        this.renderer.setAttribute(this.eraser, HTML_ATTRIBUTE.StrokeWidth, ERASER_STROKE_WIDTH);
    }

    initializeAttributesManagerService(attributesManagerService: AttributesManagerService): void {
        this.attributesManagerService = attributesManagerService;
        this.attributesManagerService.eraserSize.subscribe((newSize) => {
            this.currentSize = newSize;
            this.renderer.setAttribute(this.eraser, HTML_ATTRIBUTE.Width, this.currentSize.toString());
            this.renderer.setAttribute(this.eraser, HTML_ATTRIBUTE.Height, this.currentSize.toString());
        });
    }

    onMouseMove(event: MouseEvent): void {
        if (this.isLeftMouseDown) {
            this.onMouseDown(event);
        }
        this.checkElementsToErase();
        this.setEraserToMouse(event);
    }

    private setEraserToMouse(event: MouseEvent): void {
        this.currentMouseCoords.x =
            event.clientX - this.elementRef.nativeElement.getBoundingClientRect().left - this.currentSize / 2;
        this.currentMouseCoords.y =
            event.clientY - this.elementRef.nativeElement.getBoundingClientRect().top - this.currentSize / 2;

        this.renderer.setAttribute(this.eraser, HTML_ATTRIBUTE.X, this.currentMouseCoords.x.toString());
        this.renderer.setAttribute(this.eraser, HTML_ATTRIBUTE.Y, this.currentMouseCoords.y.toString());

        if (!this.isEraserAppended) {
            this.appendEraser();
        }
    }

    private appendEraser(): void {
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
                    this.currentTarget,
                    this.changedElements.get(this.currentTarget + 1) as SVGGElementInfo,
                );
            }
            this.checkElementsToErase();
        }

        this.isOnTarget = false;
    }

    private needToBeErased(button: number): boolean {
        return (
            this.isOnTarget &&
            this.drawStack.getElementByPosition(this.currentTarget) !== undefined &&
            button === MOUSE.LeftButton
        );
    }

    private isEraserTouchingElement(eraserBox: DOMRect, elementBox: DOMRect, strokeWidth?: number): boolean {
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

    private checkElementsToErase(): void {
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
                    svgGElement.getAttribute(HTML_ATTRIBUTE.Title) as string,
                );
            }
        }
        if (!enteredInSelection) {
            this.isOnTarget = false;
            this.lastElementColoredNumber = RESET_POSITION_NUMBER;
        }
    }

    private updateElementToColor(topElement: number, svgGElement: SVGGElement, index: number): void {
        if (this.lastElementColoredNumber !== topElement) {
            this.lastToolName = svgGElement.getAttribute(HTML_ATTRIBUTE.Title) as string;

            this.drawStack.changeTargetElement(
                new StackTargetInfo(
                    parseInt(svgGElement.getAttribute('id_element') as string, DEFAULT_RADIX),
                    this.lastToolName,
                ),
            );

            this.addElementToMap(svgGElement, this.lastToolName, this.currentTarget);

            this.lastElementColoredNumber = index;

            let borderWidth = this.drawStack.drawStack[this.currentTarget].getAttribute(HTML_ATTRIBUTE.StrokeWidth);

            if (this.lastToolName === TOOL_NAME.Fill) {
                const childrenCount = this.drawStack.getElementByPosition(this.currentTarget).childElementCount;
                const borderElement = this.drawStack.getElementByPosition(this.currentTarget).childNodes[
                    childrenCount - 1
                ] as SVGGElement;
                borderWidth = borderElement.getAttribute(HTML_ATTRIBUTE.StrokeWidth);
            }

            this.colorBorder(this.currentTarget, borderWidth, this.lastToolName);
        }
    }

    private addElementToMap(svgGElement: SVGGElement, tool: string, idElement: number): void {
        if (!this.changedElements.get(parseInt(svgGElement.getAttribute('id_element') as string, DEFAULT_RADIX))) {
            if (tool === TOOL_NAME.Fill) {
                const childrenCount = this.drawStack.getElementByPosition(idElement).childElementCount;
                const borderElement = this.drawStack.getElementByPosition(idElement).childNodes[
                    childrenCount - 1
                ] as SVGGElement;

                this.changedElements.set(parseInt(svgGElement.getAttribute('id_element') as string, DEFAULT_RADIX), {
                    borderColor: borderElement.getAttribute(HTML_ATTRIBUTE.Stroke) as string,
                    borderWidth: borderElement.getAttribute(HTML_ATTRIBUTE.StrokeWidth) as string,
                } as SVGGElementInfo);
            } else {
                this.changedElements.set(parseInt(svgGElement.getAttribute('id_element') as string, DEFAULT_RADIX), {
                    borderColor: svgGElement.getAttribute(HTML_ATTRIBUTE.Stroke) as string,
                    borderWidth: svgGElement.getAttribute(HTML_ATTRIBUTE.StrokeWidth) as string,
                } as SVGGElementInfo);
            }
        }
    }

    private colorBorder(idElement: number, borderWidth: string | null, tool: string): void {
        if (borderWidth !== '0' && borderWidth !== null) {
            borderWidth = (parseInt(borderWidth, DEFAULT_RADIX) + ADDITIONAL_BORDER_WIDTH).toString();
        } else {
            borderWidth = ADDITIONAL_BORDER_WIDTH.toString();
        }

        const borderColor = '#' + DEFAULT_RED;

        switch (tool) {
            case TOOL_NAME.Text:
                this.changeBorderOnText(idElement, borderColor, borderWidth);
                return;

            case TOOL_NAME.Pen:
                this.changeBorderOnPen(idElement, borderColor);
                break;

            case TOOL_NAME.Quill:
                this.changeBorderOnQuill(idElement, borderColor);
                break;

            case TOOL_NAME.Stamp:
                this.changeBorderOnStamp(idElement, borderColor);
                break;

            case TOOL_NAME.Line:
                this.changeBorderOnLine(idElement, borderColor);
                break;

            case TOOL_NAME.Fill:
                this.changeBorderOnFill(idElement, borderColor, borderWidth);
                break;

            default:
                break;
        }

        this.renderer.setAttribute(this.drawStack.getElementByPosition(idElement), HTML_ATTRIBUTE.Stroke, borderColor);
        this.renderer.setAttribute(
            this.drawStack.getElementByPosition(idElement),
            HTML_ATTRIBUTE.StrokeWidth,
            borderWidth,
        );
    }

    private changeBorderOnPen(idElement: number, borderColor: string): void {
        const childrenCount = this.drawStack.getElementByPosition(idElement).childElementCount;
        this.renderer.setAttribute(
            this.drawStack.getElementByPosition(idElement).childNodes[childrenCount - 1 - ELEMENTS_BEFORE_LAST_CIRCLE],
            HTML_ATTRIBUTE.Fill,
            borderColor,
        );
    }

    private changeBorderOnFill(idElement: number, borderColor: string, borderWidth: string): void {
        const childrenCount = this.drawStack.getElementByPosition(idElement).childElementCount;

        this.renderer.setAttribute(
            this.drawStack.getElementByPosition(idElement).childNodes[childrenCount - 1],
            HTML_ATTRIBUTE.Stroke,
            borderColor,
        );
        this.renderer.setAttribute(
            this.drawStack.getElementByPosition(idElement).childNodes[childrenCount - 1],
            HTML_ATTRIBUTE.StrokeWidth,
            borderWidth,
        );
    }

    private changeBorderOnQuill(idElement: number, borderColor: string): void {
        const childrenCount = this.drawStack.getElementByPosition(idElement).childElementCount;
        const children = this.drawStack.getElementByPosition(idElement).childNodes;

        for (let childIndex = 0; childIndex < childrenCount; childIndex++) {
            this.renderer.setAttribute(children[childIndex], HTML_ATTRIBUTE.Fill, borderColor);
        }
    }

    private changeBorderOnText(idElement: number, borderColor: string, borderWidth: string): void {
        if (borderWidth === '0') {
            this.renderer.removeChild(this.elementRef.nativeElement, this.textBorder);
            this.isHoveringText = false;
            return;
        }

        this.isHoveringText = true;

        this.appendTextBorder(idElement, borderColor, borderWidth);

        this.appendEraser();
    }

    private appendTextBorder(idElement: number, borderColor: string, borderWidth: string): void {
        const width = this.drawStack.getElementByPosition(idElement).getAttribute(HTML_ATTRIBUTE.Width) as string;
        const height = this.drawStack.getElementByPosition(idElement).getAttribute(HTML_ATTRIBUTE.Height) as string;

        const x = parseInt(
            this.drawStack.getElementByPosition(idElement).getAttribute(HTML_ATTRIBUTE.X) as string,
            DEFAULT_RADIX,
        );
        const y = parseInt(
            this.drawStack.getElementByPosition(idElement).getAttribute(HTML_ATTRIBUTE.Y) as string,
            DEFAULT_RADIX,
        );

        this.textBorder = this.renderer.createElement('rect', SVG_NS);
        this.renderer.setAttribute(this.textBorder, HTML_ATTRIBUTE.Title, TITLE_ELEMENT_TO_REMOVE);
        this.renderer.setAttribute(this.textBorder, HTML_ATTRIBUTE.Width, width);
        this.renderer.setAttribute(this.textBorder, HTML_ATTRIBUTE.Height, height);

        this.renderer.setAttribute(this.textBorder, HTML_ATTRIBUTE.Fill, 'none');
        this.renderer.setAttribute(this.textBorder, HTML_ATTRIBUTE.Stroke, borderColor);
        this.renderer.setAttribute(this.textBorder, HTML_ATTRIBUTE.StrokeWidth, borderWidth);

        this.renderer.setAttribute(this.textBorder, HTML_ATTRIBUTE.X, x.toString());
        this.renderer.setAttribute(this.textBorder, HTML_ATTRIBUTE.Y, y.toString());
        this.renderer.appendChild(this.elementRef.nativeElement, this.textBorder);
    }

    private changeBorderOnStamp(idElement: number, borderColor: string): void {
        const childrenCount = this.drawStack.getElementByPosition(idElement).childElementCount;
        this.renderer.setAttribute(
            this.drawStack.getElementByPosition(idElement).childNodes[childrenCount - 1],
            HTML_ATTRIBUTE.Stroke,
            borderColor,
        );
    }

    private changeBorderOnLine(idElement: number, borderColor: string): void {
        const childrenCount = this.drawStack.getElementByPosition(idElement).childElementCount;
        const children = this.drawStack.getElementByPosition(idElement).childNodes;

        for (let childIndex = 1; childIndex < childrenCount; childIndex++) {
            this.renderer.setAttribute(children[childIndex], HTML_ATTRIBUTE.Fill, borderColor);
        }
    }

    private restoreBorder(
        idElement: number,
        borderColor: string | null,
        borderWidth: string | null,
        tool: string,
    ): void {
        if (borderColor === null) {
            borderColor = '';
        }

        if (borderWidth === null) {
            borderWidth = '0';
        }

        switch (tool) {
            case TOOL_NAME.Text:
                this.changeBorderOnText(idElement, borderColor, borderWidth);
                return;

            case TOOL_NAME.Pen:
                this.changeBorderOnPen(idElement, borderColor);
                break;

            case TOOL_NAME.Quill:
                this.changeBorderOnQuill(idElement, borderColor);
                break;

            case TOOL_NAME.Line:
                this.changeBorderOnLine(idElement, borderColor);
                break;

            case TOOL_NAME.Fill:
                this.changeBorderOnFill(idElement, borderColor, borderWidth);
                break;

            default:
                break;
        }

        this.renderer.setAttribute(this.drawStack.getElementByPosition(idElement), HTML_ATTRIBUTE.Stroke, borderColor);
        this.renderer.setAttribute(
            this.drawStack.getElementByPosition(idElement),
            HTML_ATTRIBUTE.StrokeWidth,
            borderWidth,
        );
    }

    private removeBorder(position: string, tool: string): void {
        if (this.drawStack.drawStack[this.currentTarget] !== undefined) {
            const element = this.changedElements.get(parseInt(position, DEFAULT_RADIX)) as SVGGElementInfo;

            if (element !== undefined) {
                this.restoreBorder(parseInt(position, DEFAULT_RADIX), element.borderColor, element.borderWidth, tool);
                this.changedElements.delete(parseInt(position, DEFAULT_RADIX));
            }
        }
    }

    private getDOMRect(el: SVGGElement): DOMRect {
        return el.getBoundingClientRect() as DOMRect;
    }

    private getStrokeWidth(el: SVGGElement): number {
        if (el.getAttribute(HTML_ATTRIBUTE.StrokeWidth)) {
            return parseInt(el.getAttribute(HTML_ATTRIBUTE.StrokeWidth) as string, DEFAULT_RADIX);
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
            const currentChangedTargetIsValid = this.changedElements.get(this.currentTarget) !== undefined;

            if (this.erasedSomething && currentChangedTargetIsValid) {
                const currentChangedTarget = this.changedElements.get(this.currentTarget) as SVGGElementInfo;
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
