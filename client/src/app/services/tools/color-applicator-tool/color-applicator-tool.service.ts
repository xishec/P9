import { ElementRef, Injectable, Renderer2 } from '@angular/core';

import { StackTargetInfo } from 'src/classes/StackTargetInfo';
import { HTML_ATTRIBUTE, TOOL_NAME } from 'src/constants/tool-constants';
import { MOUSE } from '../../../../constants/constants';
import { DrawStackService } from '../../draw-stack/draw-stack.service';
import { UndoRedoerService } from '../../undo-redoer/undo-redoer.service';
import { AbstractToolService } from '../abstract-tools/abstract-tool.service';
import { ColorToolService } from '../color-tool/color-tool.service';

@Injectable({
    providedIn: 'root',
})
export class ColorApplicatorToolService extends AbstractToolService {
    currentStackTarget: StackTargetInfo;
    private primaryColor = '';
    private secondaryColor = '';
    isOnTarget = false;

    elementRef: ElementRef<SVGElement>;
    renderer: Renderer2;
    drawStack: DrawStackService;

    constructor(private colorToolService: ColorToolService, private undoRedoerService: UndoRedoerService) {
        super();
        this.colorToolService.primaryColor.subscribe((primaryColor) => {
            this.primaryColor = '#' + primaryColor;
        });
        this.colorToolService.secondaryColor.subscribe((secondaryColor) => {
            this.secondaryColor = '#' + secondaryColor;
        });
    }

    initializeService(elementRef: ElementRef<SVGElement>, renderer: Renderer2, drawStack: DrawStackService) {
        this.elementRef = elementRef;
        this.renderer = renderer;
        this.drawStack = drawStack;

        this.drawStack.currentStackTarget.subscribe((stackTarget) => {
            this.currentStackTarget = stackTarget;
            this.isOnTarget = true;
        });
    }

    initializeColorToolService(colorToolService: ColorToolService): void {
        this.colorToolService = colorToolService;
        this.colorToolService.primaryColor.subscribe((primaryColor) => {
            this.primaryColor = '#' + primaryColor;
        });
        this.colorToolService.secondaryColor.subscribe((secondaryColor) => {
            this.secondaryColor = '#' + secondaryColor;
        });
    }

    isStackTargetShape(): boolean {
        const isRectangle = this.currentStackTarget.toolName === TOOL_NAME.Rectangle;
        const isEllipsis = this.currentStackTarget.toolName === TOOL_NAME.Ellipsis;
        const isPolygon = this.currentStackTarget.toolName === TOOL_NAME.Polygon;
        return isRectangle || isEllipsis || isPolygon;
    }

    changeFillColorOnShape(): void {
        if (
            (this.drawStack
                .getElementByPosition(this.currentStackTarget.targetPosition)
                .getAttribute('fill') as string) === 'none'
        ) {
            return;
        }

        this.renderer.setAttribute(
            this.drawStack.getElementByPosition(this.currentStackTarget.targetPosition),
            HTML_ATTRIBUTE.fill,
            this.primaryColor,
        );

        this.undoRedoerService.saveCurrentState(this.drawStack.idStack);
    }

    changeStrokeColorOnShape(): void {
        this.renderer.setAttribute(
            this.drawStack.getElementByPosition(this.currentStackTarget.targetPosition),
            HTML_ATTRIBUTE.stroke,
            this.secondaryColor,
        );

        this.undoRedoerService.saveCurrentState(this.drawStack.idStack);
    }

    changeColorOnTrace(): void {
        this.renderer.setAttribute(
            this.drawStack.getElementByPosition(this.currentStackTarget.targetPosition),
            HTML_ATTRIBUTE.stroke,
            this.primaryColor,
        );

        this.renderer.setAttribute(
            this.drawStack.getElementByPosition(this.currentStackTarget.targetPosition),
            HTML_ATTRIBUTE.fill,
            this.primaryColor,
        );

        this.undoRedoerService.saveCurrentState(this.drawStack.idStack);
    }

    // tslint:disable-next-line: no-empty
    onMouseMove(event: MouseEvent): void {}
    onMouseDown(event: MouseEvent): void {
        const button = event.button;
        if (
            !this.isOnTarget ||
            this.drawStack.getElementByPosition(this.currentStackTarget.targetPosition) === undefined
        ) {
            return;
        }

        switch (button) {
            case MOUSE.LeftButton:
                if (this.isStackTargetShape()) {
                    this.changeFillColorOnShape();
                } else {
                    this.changeColorOnTrace();
                }
                break;
            case MOUSE.RightButton:
                if (this.isStackTargetShape()) {
                    this.changeStrokeColorOnShape();
                }
                break;
            default:
                break;
        }
        this.isOnTarget = false;
    }
    // tslint:disable-next-line: no-empty
    onMouseUp(event: MouseEvent): void {
        this.isOnTarget = false;
    }
    // tslint:disable-next-line: no-empty
    onMouseEnter(event: MouseEvent): void {}
    // tslint:disable-next-line: no-empty
    onMouseLeave(event: MouseEvent): void {}
    // tslint:disable-next-line: no-empty
    onKeyDown(event: KeyboardEvent): void {}
    // tslint:disable-next-line: no-empty
    onKeyUp(event: KeyboardEvent): void {}
    // tslint:disable-next-line: no-empty
    cleanUp(): void {}
}
