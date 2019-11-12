import { ElementRef, Injectable, Renderer2 } from '@angular/core';

import { Coords2D } from 'src/classes/Coords2D';
import { StackTargetInfo } from 'src/classes/StackTargetInfo';
import { SVGGElementInfo } from 'src/classes/svggelement-info';
import { DEFAULT_GRAY_0, DEFAULT_RED, DEFAULT_WHITE } from 'src/constants/color-constants';
import { Mouse, SIDEBAR_WIDTH, SVG_NS } from 'src/constants/constants';
import {
    ADDITIONAL_BORDER_WIDTH,
    DEFAULT_RADIX,
    ERASER_STROKE_WIDTH,
    EraserSize,
    HTMLAttribute,
    RESET_POSITION_NUMBER,
    ToolName,
} from 'src/constants/tool-constants';
import { DrawStackService } from '../../draw-stack/draw-stack.service';
import { UndoRedoerService } from '../../undo-redoer/undo-redoer.service';
import { AbstractToolService } from '../abstract-tools/abstract-tool.service';
import { AttributesManagerService } from '../attributes-manager/attributes-manager.service';

@Injectable({
    providedIn: 'root',
})
export class EraserToolService extends AbstractToolService {
    drawRectangle: SVGRectElement;
    attributesManagerService: AttributesManagerService;
    currentTarget = 0;
    currentSize = EraserSize.Default;
    isOnTarget = false;
    isLeftMouseDown = false;
    isSquareAppended = false;
    lastElementColoredNumber = RESET_POSITION_NUMBER;
    lastToolName = '';
    erasedSomething = false;

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

        this.drawRectangle = this.renderer.createElement('rect', SVG_NS);
        this.renderer.setAttribute(this.drawRectangle, HTMLAttribute.width, this.currentSize.toString());
        this.renderer.setAttribute(this.drawRectangle, HTMLAttribute.height, this.currentSize.toString());

        this.renderer.setAttribute(this.drawRectangle, HTMLAttribute.fill, '#' + DEFAULT_WHITE);
        this.renderer.setAttribute(this.drawRectangle, HTMLAttribute.stroke, '#' + DEFAULT_GRAY_0);
        this.renderer.setAttribute(this.drawRectangle, HTMLAttribute.stroke_width, ERASER_STROKE_WIDTH);
    }

    initializeAttributesManagerService(attributesManagerService: AttributesManagerService): void {
        this.attributesManagerService = attributesManagerService;
        this.attributesManagerService.eraserSize.subscribe((newSize) => {
            this.currentSize = newSize;
            this.renderer.setAttribute(this.drawRectangle, HTMLAttribute.width, this.currentSize.toString());
            this.renderer.setAttribute(this.drawRectangle, HTMLAttribute.height, this.currentSize.toString());
        });
    }

    onMouseMove(event: MouseEvent): void {
        if (this.isLeftMouseDown) {
            this.onMouseDown(event);
        }
        this.checkElementsToErase();
        this.setSquareToMouse(event);
    }

    setSquareToMouse(event: MouseEvent): void {
        this.currentMouseCoords.x =
            event.clientX - this.elementRef.nativeElement.getBoundingClientRect().left - this.currentSize / 2;
        this.currentMouseCoords.y =
            event.clientY - this.elementRef.nativeElement.getBoundingClientRect().top - this.currentSize / 2;

        this.renderer.setAttribute(this.drawRectangle, 'x', this.currentMouseCoords.x.toString());
        this.renderer.setAttribute(this.drawRectangle, 'y', this.currentMouseCoords.y.toString());

        if (!this.isSquareAppended) {
            this.appendSquare();
        }
    }

    appendSquare(): void {
        this.renderer.appendChild(this.elementRef.nativeElement, this.drawRectangle);
        this.isSquareAppended = true;
    }

    onMouseDown(event: MouseEvent): void {
        const button = event.button;
        if (button === Mouse.LeftButton) {
            this.isLeftMouseDown = true;
        }

        this.checkElementsToErase();

        if (this.needToBeErased(button)) {
            this.renderer.removeChild(
                this.elementRef.nativeElement,
                this.drawStack.getElementByPosition(this.currentTarget),
            );

            this.drawStack.delete(this.drawStack.drawStack[this.currentTarget]);

            this.erasedSomething = true;

            // set currentTarget in changedElements to equal the next Target
            if (this.currentTarget + 1) {
                this.changedElements.set(this.currentTarget.toString(), this.changedElements.get(
                    (this.currentTarget + 1).toString(),
                ) as SVGGElementInfo);
            }
            this.checkElementsToErase();
        }

        this.isOnTarget = false;
    }

    needToBeErased(button: number): boolean {
        return (
            this.isOnTarget &&
            this.drawStack.getElementByPosition(this.currentTarget) !== undefined &&
            button === Mouse.LeftButton
        );
    }

    isTouchingElementBox(selectionBox: DOMRect, elementBox: DOMRect, strokeWidth?: number): boolean {
        const boxLeft = selectionBox.x + window.scrollX - SIDEBAR_WIDTH;
        const boxRight = selectionBox.x + window.scrollX - SIDEBAR_WIDTH + selectionBox.width;
        const boxTop = selectionBox.y + window.scrollY;
        const boxBottom = selectionBox.y + window.scrollY + selectionBox.height;

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
        const selectionBox = this.getDOMRect(this.drawRectangle);

        let enteredInSelection = false;
        let topElement = this.drawStack.getDrawStackLength() - 1;
        for (let i = this.drawStack.getDrawStackLength() - 1; i >= 0; i--) {
            const el = this.drawStack.drawStack[i];
            const elBox = this.getDOMRect(el);

            if (this.isTouchingElementBox(selectionBox, elBox, this.getStrokeWidth(el)) && topElement <= i) {
                if (this.lastElementColoredNumber !== topElement) {
                    if (!this.changedElements.get(el.getAttribute('id_element') as string)) {
                        this.changedElements.set(
                            el.getAttribute('id_element') as string,
                            new SVGGElementInfo(
                                el.getAttribute(HTMLAttribute.stroke) as string,
                                el.getAttribute(HTMLAttribute.stroke_width) as string,
                            ),
                        );
                    }

                    this.lastToolName = el.getAttribute('title') as string;

                    this.drawStack.changeTargetElement(
                        new StackTargetInfo(
                            parseInt(el.getAttribute('id_element') as string, DEFAULT_RADIX),
                            this.lastToolName,
                        ),
                    );

                    topElement = i;
                    this.lastElementColoredNumber = topElement;
                    this.mouseOverColorBorder(
                        this.currentTarget,
                        this.drawStack.drawStack[this.currentTarget].getAttribute(HTMLAttribute.stroke_width),
                        this.lastToolName,
                    );
                }
                enteredInSelection = true;
                this.isOnTarget = true;
            } else {
                topElement--;
                this.removeBorder(el.getAttribute('id_element') as string, el.getAttribute('title') as string);
            }
        }
        if (!enteredInSelection) {
            this.isOnTarget = false;
            this.lastElementColoredNumber = RESET_POSITION_NUMBER;
        }
    }

    mouseOverColorBorder(idElement: number, borderWidth: string | null, tool: string | null): void {
        if (borderWidth !== '0' && borderWidth !== null) {
            borderWidth = (parseInt(borderWidth, DEFAULT_RADIX) + ADDITIONAL_BORDER_WIDTH).toString();
        } else {
            borderWidth = ADDITIONAL_BORDER_WIDTH.toString();
        }

        if (tool === ToolName.Pen) {
            const childrenNumber = this.drawStack.getElementByPosition(idElement).childElementCount;
            this.renderer.setAttribute(
                this.drawStack.getElementByPosition(idElement).childNodes[childrenNumber - 2],
                HTMLAttribute.fill,
                '#' + DEFAULT_RED,
            );
        }

        if (tool === ToolName.Line && this.drawStack.getElementByPosition(idElement).childElementCount > 1) {
            const childrenCount = this.drawStack.getElementByPosition(idElement).childElementCount;
            const children = this.drawStack.getElementByPosition(idElement).childNodes;

            for (let i = 1; i < childrenCount; i++) {
                this.renderer.setAttribute(children[i], HTMLAttribute.fill, '#' + DEFAULT_RED);
            }
        }

        this.renderer.setAttribute(
            this.drawStack.getElementByPosition(idElement),
            HTMLAttribute.stroke,
            '#' + DEFAULT_RED,
        );
        this.renderer.setAttribute(
            this.drawStack.getElementByPosition(idElement),
            HTMLAttribute.stroke_width,
            borderWidth,
        );
    }

    mouseOutRestoreBorder(
        idElement: number,
        border: string | null,
        borderWidth: string | null,
        tool: string | null,
    ): void {
        if (border === null) {
            border = '';
        }

        if (borderWidth === null) {
            borderWidth = '0';
        }
        if (tool === ToolName.Pen) {
            const childrenNumber = this.drawStack.getElementByPosition(idElement).childElementCount;
            this.renderer.setAttribute(
                this.drawStack.getElementByPosition(idElement).childNodes[childrenNumber - 2],
                HTMLAttribute.fill,
                border,
            );
        }

        if (tool === ToolName.Line && this.drawStack.getElementByPosition(idElement).childElementCount > 1) {
            const childrenCount = this.drawStack.getElementByPosition(idElement).childElementCount;
            const children = this.drawStack.getElementByPosition(idElement).childNodes;

            for (let i = 1; i < childrenCount; i++) {
                this.renderer.setAttribute(children[i], HTMLAttribute.fill, border);
            }
        }

        this.renderer.setAttribute(this.drawStack.getElementByPosition(idElement), HTMLAttribute.stroke, border);
        this.renderer.setAttribute(
            this.drawStack.getElementByPosition(idElement),
            HTMLAttribute.stroke_width,
            borderWidth,
        );
    }

    removeBorder(position: string, tool?: string | null): void {
        if (this.drawStack.drawStack[this.currentTarget] !== undefined) {
            const element = this.changedElements.get(position) as SVGGElementInfo;
            if (element !== undefined && tool !== undefined) {
                this.mouseOutRestoreBorder(
                    parseInt(position, DEFAULT_RADIX),
                    element.borderColor,
                    element.borderWidth,
                    tool,
                );
                this.changedElements.delete(position);
            }
        }
    }

    getDOMRect(el: SVGGElement): DOMRect {
        return el.getBoundingClientRect() as DOMRect;
    }

    getStrokeWidth(el: SVGGElement): number {
        if (el.getAttribute(HTMLAttribute.stroke_width)) {
            return parseInt(el.getAttribute(HTMLAttribute.stroke_width) as string, DEFAULT_RADIX);
        }
        return 0;
    }

    onMouseUp(event: MouseEvent): void {
        const button = event.button;
        if (button === Mouse.LeftButton) {
            this.isLeftMouseDown = false;
        }

        this.isOnTarget = false;

        if (this.erasedSomething) {
            this.renderer.removeChild(this.elementRef, this.drawRectangle);
            setTimeout(() => {
                this.undoRedoerService.saveCurrentState(this.drawStack.idStack);
            }, 0);
            setTimeout(() => {
                this.appendSquare();
            }, 0);
        }
        this.erasedSomething = false;
    }

    onMouseEnter(event: MouseEvent): void {
        this.appendSquare();
    }

    // tslint:disable-next-line: no-empty
    onMouseOver(event: MouseEvent): void {}

    onMouseLeave(event: MouseEvent): void {
        this.renderer.removeChild(this.elementRef, this.drawRectangle);
    }

    // tslint:disable-next-line: no-empty
    onKeyDown(event: KeyboardEvent): void {}

    // tslint:disable-next-line: no-empty
    onKeyUp(event: KeyboardEvent): void {}

    cleanUp(): void {
        this.renderer.removeChild(this.elementRef, this.drawRectangle);
        this.isSquareAppended = false;
        if (this.lastElementColoredNumber !== -1) {
            this.removeBorder(this.lastElementColoredNumber.toString(), this.lastToolName as string);
        }
        this.lastElementColoredNumber = RESET_POSITION_NUMBER;
    }
}
