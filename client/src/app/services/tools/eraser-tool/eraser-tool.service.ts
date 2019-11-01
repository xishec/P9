import { Injectable, ElementRef, Renderer2 } from '@angular/core';

import { DrawStackService } from '../../draw-stack/draw-stack.service';
import { AbstractToolService } from '../abstract-tools/abstract-tool.service';
import { AttributesManagerService } from '../attributes-manager/attributes-manager.service';
import { StackTargetInfo } from 'src/classes/StackTargetInfo';
import { Mouse, SVG_NS } from 'src/constants/constants';
import { EraserSize, HTMLAttribute } from 'src/constants/tool-constants';
import { DEFAULT_WHITE, DEFAULT_GRAY_0 } from 'src/constants/color-constants';
//import { HTMLAttribute } from 'src/constants/tool-constants';

@Injectable({
    providedIn: 'root',
})
export class EraserToolService extends AbstractToolService {
    drawRectangle: SVGRectElement;
    attributesManagerService: AttributesManagerService;
    currentStackTarget: StackTargetInfo;
    currentSize = EraserSize.Default;
    isOnTarget = false;
    lastStrokeColor = '';
    isOnMouseDown = false;

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
            console.log('what2');
            this.currentStackTarget = stackTarget;
            this.isOnTarget = true;
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
            // this.setStamp();
        });
    }

    onMouseMove(event: MouseEvent): void {
        if (this.isOnMouseDown) {
            this.onMouseDown(event);
        }
        let currentMouseX =
            event.clientX - this.elementRef.nativeElement.getBoundingClientRect().left - EraserSize.Default / 2;
        let currentMouseY =
            event.clientY - this.elementRef.nativeElement.getBoundingClientRect().top - EraserSize.Default / 2;
        this.renderer.setAttribute(this.drawRectangle, 'x', currentMouseX.toString());
        this.renderer.setAttribute(this.drawRectangle, 'y', currentMouseY.toString());
        //this.renderer.setAttribute(this.)
    }

    onMouseDown(event: MouseEvent): void {
        const button = event.button;
        this.isOnMouseDown = true;
        let elementPosition = this.currentStackTarget.targetPosition;
        if (this.isOnTarget && this.drawStack.getElementByPosition(elementPosition) !== undefined) {
            if (button === Mouse.LeftButton) {
                this.renderer.removeChild(
                    this.elementRef.nativeElement,
                    this.drawStack.getElementByPosition(elementPosition),
                );

                this.drawStack.removeElementByPosition(elementPosition);
            }
        }
        this.isOnTarget = false;
        console.log('in mouse down');
    }

    appendRectangleOnMouse(): void {}

    // checkSelection(): void {
    //     const selectionBox = this.getDOMRect(this.selectionRectangle);

    //     for (const el of this.drawStack.drawStack) {
    //         const elBox = this.getDOMRect(el);

    //         if (this.isInSelection(selectionBox, elBox, this.getStrokeWidth(el))) {
    //             if (this.isLeftMouseDown) {
    //                 this.selection.add(el);
    //             } else if (this.isRightMouseDown) {
    //                 this.invertSelection.add(el);
    //             }
    //         } else {
    //             if (this.isLeftMouseDown) {
    //                 this.selection.delete(el);
    //             } else if (this.isRightMouseDown) {
    //                 this.invertSelection.delete(el);
    //             }
    //         }
    //     }
    // }

    // isInSelection(selectionBox: DOMRect, elementBox: DOMRect, strokeWidth?: number): boolean {
    //     const boxLeft = selectionBox.x + window.scrollX - SIDEBAR_WIDTH;
    //     const boxRight = selectionBox.x + window.scrollX - SIDEBAR_WIDTH + selectionBox.width;
    //     const boxTop = selectionBox.y + window.scrollY;
    //     const boxBottom = selectionBox.y + window.scrollY + selectionBox.height;

    //     let elLeft = elementBox.x + window.scrollX - SIDEBAR_WIDTH;
    //     let elRight = elementBox.x + window.scrollX - SIDEBAR_WIDTH + elementBox.width;
    //     let elTop = elementBox.y + window.scrollY;
    //     let elBottom = elementBox.y + window.scrollY + elementBox.height;

    //     if (strokeWidth) {
    //         const halfStrokeWidth = strokeWidth / 2;

    //         elLeft = elLeft - halfStrokeWidth;
    //         elRight = elRight + halfStrokeWidth;
    //         elTop = elTop - halfStrokeWidth;
    //         elBottom = elBottom + halfStrokeWidth;
    //     }

    //     // Check all cases where el and box don't touch each other
    //     if (elRight < boxLeft || boxRight < elLeft || elBottom < boxTop || boxBottom < elTop) {
    //         return false;
    //     }

    //     return true;
    // }

    onMouseUp(event: MouseEvent): void {
        // const button = event.button;
        // if (button === Mouse.LeftButton && this.verifyPosition(event) && this.isIn && this.shouldStamp) {
        //     this.initStamp();
        // }
        this.isOnMouseDown = false;
    }

    // tslint:disable-next-line: no-empty
    onMouseEnter(event: MouseEvent): void {
        // document.getElementById('container').style.cursor = 'wait';
        this.renderer.appendChild(this.elementRef.nativeElement, this.drawRectangle);
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
        // this.renderer.removeChild(this.elementRef, this.drawRectangle);
        // if (this.stampIsAppended) {
        //     this.renderer.removeChild(this.elementRef.nativeElement, this.stampWrapper);
        //     this.stampIsAppended = false;
        // }
    }
}
