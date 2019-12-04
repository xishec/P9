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
    shouldBeNotified = false;

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
            if (this.shouldBeNotified) {
                this.currentStackTarget = stackTarget;
                this.isOnTarget = true;
            }
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

    isShape(): boolean {
        const isRectangle = this.currentStackTarget.toolName === TOOL_NAME.Rectangle;
        const isEllipsis = this.currentStackTarget.toolName === TOOL_NAME.Ellipsis;
        const isPolygon = this.currentStackTarget.toolName === TOOL_NAME.Polygon;
        return isRectangle || isEllipsis || isPolygon;
    }

    isText(): boolean {
        return this.currentStackTarget.toolName === TOOL_NAME.Text;
    }

    isBucketFill(): boolean {
        return this.currentStackTarget.toolName === TOOL_NAME.Fill;
    }

    changeFillColorOnShape(): void {
        if (
            (this.drawStack
                .getElementByPosition(this.currentStackTarget.targetPosition)
                .getAttribute(HTML_ATTRIBUTE.Fill) as string) === 'none'
        ) {
            return;
        }

        this.renderer.setAttribute(
            this.drawStack.getElementByPosition(this.currentStackTarget.targetPosition),
            HTML_ATTRIBUTE.Fill,
            this.primaryColor,
        );

        this.undoRedoerService.saveCurrentState(this.drawStack.idStack);
    }

    changeStrokeColorOnShape(): void {
        this.renderer.setAttribute(
            this.drawStack.getElementByPosition(this.currentStackTarget.targetPosition),
            HTML_ATTRIBUTE.Stroke,
            this.secondaryColor,
        );

        this.undoRedoerService.saveCurrentState(this.drawStack.idStack);
    }

    changeFillColorOnBucketFill(): void {
        const filledShapeWrap: SVGGElement = this.drawStack.getElementByPosition(
            this.currentStackTarget.targetPosition,
        );
        if (filledShapeWrap.children[0] && filledShapeWrap.children[0].getAttribute(HTML_ATTRIBUTE.Title) === 'body') {
            this.renderer.setAttribute(filledShapeWrap.children[0], HTML_ATTRIBUTE.Stroke, this.primaryColor);
            this.renderer.setAttribute(filledShapeWrap.children[0], HTML_ATTRIBUTE.Fill, this.primaryColor);
        }
        this.undoRedoerService.saveCurrentState(this.drawStack.idStack);
    }

    changeStrokeColorOnBucketFill(): void {
        const filledShapeWrap: SVGGElement = this.drawStack.getElementByPosition(
            this.currentStackTarget.targetPosition,
        );
        if (filledShapeWrap.children[2] && filledShapeWrap.children[2].getAttribute(HTML_ATTRIBUTE.Title) === HTML_ATTRIBUTE.Stroke) {
            this.renderer.setAttribute(filledShapeWrap.children[2], HTML_ATTRIBUTE.Stroke, this.secondaryColor);
        }
        this.undoRedoerService.saveCurrentState(this.drawStack.idStack);
    }

    changeColorOnTrace(): void {
        const color = this.primaryColor.slice(0, 7);
        const opacity = (parseInt(this.primaryColor.slice(7, 9), 16) / 255).toFixed(1);

        this.renderer.setAttribute(
            this.drawStack.getElementByPosition(this.currentStackTarget.targetPosition),
            HTML_ATTRIBUTE.Stroke,
            color,
        );

        this.renderer.setAttribute(
            this.drawStack.getElementByPosition(this.currentStackTarget.targetPosition),
            HTML_ATTRIBUTE.Fill,
            color,
        );

        this.renderer.setAttribute(
            this.drawStack.getElementByPosition(this.currentStackTarget.targetPosition),
            HTML_ATTRIBUTE.Opacity,
            opacity,
        );

        this.undoRedoerService.saveCurrentState(this.drawStack.idStack);
    }

    changeFillColorOnText(): void {
        this.renderer.setAttribute(
            this.drawStack.getElementByPosition(this.currentStackTarget.targetPosition),
            HTML_ATTRIBUTE.Fill,
            this.primaryColor,
        );
        this.undoRedoerService.saveCurrentState(this.drawStack.idStack);
    }

    changeStrokeColorOnText(): void {
        this.renderer.setAttribute(
            this.drawStack.getElementByPosition(this.currentStackTarget.targetPosition),
            HTML_ATTRIBUTE.Stroke,
            this.secondaryColor,
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
                if (this.isBucketFill()) {
                    this.changeFillColorOnBucketFill();
                } else if (this.isShape()) {
                    this.changeFillColorOnShape();
                } else if (this.isText()) {
                    this.changeFillColorOnText();
                } else {
                    this.changeColorOnTrace();
                }
                break;
            case MOUSE.RightButton:
                if (this.isBucketFill()) {
                    this.changeStrokeColorOnBucketFill();
                } else if (this.isShape()) {
                    this.changeStrokeColorOnShape();
                } else if (this.isText()) {
                    this.changeStrokeColorOnText();
                }
                break;
            default:
                break;
        }
        this.isOnTarget = false;
    }

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

    cleanUp(): void {
        this.shouldBeNotified = false;
    }
}
