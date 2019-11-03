import { Injectable, ElementRef, Renderer2 } from '@angular/core';

import { DrawStackService } from '../../draw-stack/draw-stack.service';
import { AbstractToolService } from '../abstract-tools/abstract-tool.service';
import { AttributesManagerService } from '../attributes-manager/attributes-manager.service';
//import { StackTargetInfo } from 'src/classes/StackTargetInfo';
import { Mouse, SVG_NS, SIDEBAR_WIDTH } from 'src/constants/constants';
import { EraserSize, HTMLAttribute } from 'src/constants/tool-constants';
import { DEFAULT_WHITE, DEFAULT_GRAY_0 } from 'src/constants/color-constants';
import { StackTargetInfo } from 'src/classes/StackTargetInfo';
import { SVGGElementInfo } from 'src/classes/svggelement-info';
//import { HTMLAttribute } from 'src/constants/tool-constants';

@Injectable({
    providedIn: 'root',
})
export class EraserToolService extends AbstractToolService {
    drawRectangle: SVGRectElement;
    attributesManagerService: AttributesManagerService;
    //currentStackTarget: StackTargetInfo;
    currentTarget = 0;
    currentSize = EraserSize.Default;
    isOnTarget = false;
    lastStrokeColor = '';
    isLeftMouseDown = false;
    isSquareAppended = false;

    //the string represents the id_element
    changedElements: Map<string, SVGGElementInfo> = new Map([]);

    currentMouseX = 0;
    currentMouseY = 0;

    elementRef: ElementRef<SVGElement>;
    renderer: Renderer2;
    drawStack: DrawStackService;

    constructor() {
        super();
    }

    initializeService(elementRef: ElementRef<SVGElement>, renderer: Renderer2, drawStack: DrawStackService) {
        this.elementRef = elementRef;
        this.renderer = renderer;
        this.drawStack = drawStack;

        this.drawStack.currentStackTarget.subscribe((stackTarget) => {
            //if (stackTarget.targetPosition !== undefined) {
            this.currentTarget = stackTarget.targetPosition;
            if (this.currentTarget !== undefined) {
                this.isOnTarget = true;
            } else {
                this.isOnTarget = false;
            }
            //  }
        });

        this.drawRectangle = this.renderer.createElement('rect', SVG_NS);
        this.renderer.setAttribute(this.drawRectangle, HTMLAttribute.width, this.currentSize.toString());
        this.renderer.setAttribute(this.drawRectangle, HTMLAttribute.height, this.currentSize.toString());

        this.renderer.setAttribute(this.drawRectangle, HTMLAttribute.fill, '#' + DEFAULT_WHITE);
        this.renderer.setAttribute(this.drawRectangle, HTMLAttribute.stroke, '#' + DEFAULT_GRAY_0);
        this.renderer.setAttribute(this.drawRectangle, HTMLAttribute.stroke_width, '3');
    }

    initializeAttributesManagerService(attributesManagerService: AttributesManagerService): void {
        this.attributesManagerService = attributesManagerService;
        this.attributesManagerService.currentEraserSize.subscribe((newSize) => {
            this.currentSize = newSize;
            this.renderer.setAttribute(this.drawRectangle, HTMLAttribute.width, this.currentSize.toString());
            this.renderer.setAttribute(this.drawRectangle, HTMLAttribute.height, this.currentSize.toString());
        });
    }

    onMouseMove(event: MouseEvent): void {
        if (this.isLeftMouseDown) {
            this.onMouseDown(event);
        }
        this.checkSelection();
        this.setSquareToMouse(event);
    }

    setSquareToMouse(event: MouseEvent): void {
        this.currentMouseX =
            event.clientX - this.elementRef.nativeElement.getBoundingClientRect().left - this.currentSize / 2;
        this.currentMouseY =
            event.clientY - this.elementRef.nativeElement.getBoundingClientRect().top - this.currentSize / 2;

        this.renderer.setAttribute(this.drawRectangle, 'x', this.currentMouseX.toString());
        this.renderer.setAttribute(this.drawRectangle, 'y', this.currentMouseY.toString());

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

        this.checkSelection();
        console.log(this.isOnTarget);

        if (
            this.isOnTarget &&
            this.drawStack.getElementByPosition(this.currentTarget) !== undefined &&
            button === Mouse.LeftButton
        ) {
            this.renderer.removeChild(
                this.elementRef.nativeElement,
                this.drawStack.getElementByPosition(this.currentTarget),
            );

            this.drawStack.removeElementByPosition(this.currentTarget);

            //set currentTarget to equal the next Target
            if (this.currentTarget + 1) {
                this.changedElements.set(this.currentTarget.toString(), this.changedElements.get(
                    (this.currentTarget + 1).toString(),
                ) as SVGGElementInfo);
            }
        }
        this.isOnTarget = false;
    }

    isInSelection(selectionBox: DOMRect, elementBox: DOMRect, strokeWidth?: number): boolean {
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

    checkSelection(): void {
        const selectionBox = this.getDOMRect(this.drawRectangle);

        let enteredInSelection = false;
        let topElement = this.drawStack.getDrawStackLength() - 1;
        for (let i = this.drawStack.getDrawStackLength() - 1; i >= 0; i--) {
            //for (const el of this.drawStack.drawStack) {
            let el = this.drawStack.drawStack[i];
            const elBox = this.getDOMRect(el);

            if (
                this.isInSelection(selectionBox, elBox, this.getStrokeWidth(el)) &&
                topElement <= i
                // (this.currentTarget !== parseInt(el.getAttribute('id_element').toString()) ||
                //   parseInt(el.getAttribute('id_element') as string) == 0)
            ) {
                if (!this.changedElements.get(el.getAttribute('id_element') as string)) {
                    this.changedElements.set(
                        el.getAttribute('id_element') as string,
                        new SVGGElementInfo(
                            el.getAttribute(HTMLAttribute.stroke) as string,
                            el.getAttribute(HTMLAttribute.stroke_width) as string,
                        ),
                    );
                }

                const tool = el.getAttribute('title');
                this.drawStack.changeTargetElement(
                    new StackTargetInfo(parseInt(el.getAttribute('id_element') as string), tool as string),
                );

                console.log(' this.currentTarget: ' + this.currentTarget);
                this.isOnTarget = true;
                enteredInSelection = true;

                //color border in red

                // if (this.currentTarget - 1 >= 0) {
                //     console.log('CURRENT ELEMENT IS BIGGER THAN ID_ELEMENT');
                //     this.removeBorder(this.drawStack.drawStack[this.currentTarget - 1]);
                // }
                topElement = i;
                this.mouseOverColorBorder(
                    this.currentTarget,
                    this.drawStack.drawStack[this.currentTarget].getAttribute(HTMLAttribute.stroke_width),
                );
                // break;
            } else {
                // this.isOnTarget = false;
                topElement--;
                this.removeBorder(el.getAttribute('id_element') as string);
            }
            //  }
        }
        if (!enteredInSelection) {
            this.isOnTarget = false;
        }
    }

    mouseOverColorBorder(id_element: number, borderWidth: string | null): void {
        // if (borderWidth !== '0' && borderWidth !== null) {
        //     borderWidth = (parseInt(borderWidth) + 5).toString();
        // } else {
        borderWidth = '5';
        // }

        this.renderer.setAttribute(this.drawStack.getElementByPosition(id_element), HTMLAttribute.stroke, '#ff0000');
        this.renderer.setAttribute(
            this.drawStack.getElementByPosition(id_element),
            HTMLAttribute.stroke_width,
            borderWidth,
        );
    }

    mouseOutRestoreBorder(id_element: number, border: string | null, borderWidth: string | null): void {
        if (border === null) {
            border = '';
        }

        if (borderWidth === null) {
            borderWidth = '0';
        }

        this.renderer.setAttribute(this.drawStack.getElementByPosition(id_element), HTMLAttribute.stroke, border);
        this.renderer.setAttribute(
            this.drawStack.getElementByPosition(id_element),
            HTMLAttribute.stroke_width,
            borderWidth,
        );
    }

    removeBorder(position: string): void {
        if (this.drawStack.drawStack[this.currentTarget] !== undefined) {
            let element = this.changedElements.get(position) as SVGGElementInfo;
            if (element !== undefined) {
                console.log('position : ' + position);

                this.mouseOutRestoreBorder(parseInt(position), element.borderColor, element.borderWidth);
                this.changedElements.delete(position);
            }
        }
    }

    getDOMRect(el: SVGGElement): DOMRect {
        return el.getBoundingClientRect() as DOMRect;
    }

    getStrokeWidth(el: SVGGElement): number {
        if (el.getAttribute(HTMLAttribute.stroke_width)) {
            return parseInt(el.getAttribute(HTMLAttribute.stroke_width) as string, 10);
        }
        return 0;
    }

    onMouseUp(event: MouseEvent): void {
        const button = event.button;
        if (button === Mouse.LeftButton) {
            this.isLeftMouseDown = false;
        }

        this.isOnTarget = false;
    }

    // tslint:disable-next-line: no-empty
    onMouseEnter(event: MouseEvent): void {
        // document.getElementById('container').style.cursor = 'wait';
        this.appendSquare();
    }

    // tslint:disable-next-line: no-empty
    onMouseOver(event: MouseEvent): void {}

    // tslint:disable-next-line: no-empty
    onMouseLeave(event: MouseEvent): void {
        this.renderer.removeChild(this.elementRef, this.drawRectangle);
        // this.isIn = false;
        // if (this.shouldStamp) {
        //     this.cleanUp();
        // }
    }

    // tslint:disable-next-line: no-empty
    onKeyDown(event: KeyboardEvent): void {}

    // tslint:disable-next-line: no-empty
    onKeyUp(event: KeyboardEvent): void {}

    // tslint:disable-next-line: no-empty
    cleanUp(): void {
        this.renderer.removeChild(this.elementRef, this.drawRectangle);
        this.isSquareAppended = false;
        this.removeBorder(this.currentTarget.toString()); //remove all those that are colored

        // if (this.stampIsAppended) {
        //     this.renderer.removeChild(this.elementRef.nativeElement, this.stampWrapper);
        //     this.stampIsAppended = false;
        // }
    }
}
