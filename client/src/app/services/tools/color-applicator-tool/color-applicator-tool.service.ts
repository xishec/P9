import { ElementRef, Injectable, Renderer2 } from '@angular/core';

import { StackTargetInfo } from 'src/classes/StackTargetInfo';
import { HTMLAttribute, ToolName } from 'src/constants/tool-constants';
import { Mouse } from '../../../../constants/constants';
import { DrawStackService } from '../../draw-stack/draw-stack.service';
import { AbstractToolService } from '../abstract-tools/abstract-tool.service';
import { ColorToolService } from '../color-tool/color-tool.service';
import { UndoRedoerService } from '../../undo-redoer/undo-redoer.service';

@Injectable({
    providedIn: 'root',
})
export class ColorApplicatorToolService extends AbstractToolService {
    currentStackTarget: StackTargetInfo;
    private colorToolService: ColorToolService;
    private primaryColor = '';
    private secondaryColor = '';
    isOnTarget = false;

    elementRef: ElementRef<SVGElement>;
    renderer: Renderer2;
    drawStack: DrawStackService;

    constructor(private undoRedoerService: UndoRedoerService) {
        super();
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

    // tslint:disable-next-line: no-empty
    onMouseMove(event: MouseEvent): void {}
    onMouseDown(event: MouseEvent): void {
        const button = event.button;
        if (
            this.isOnTarget &&
            this.drawStack.getElementByPosition(this.currentStackTarget.targetPosition) !== undefined
        ) {
            switch (button) {
                case Mouse.LeftButton:
                    this.renderer.setAttribute(
                        this.drawStack.getElementByPosition(this.currentStackTarget.targetPosition),
                        HTMLAttribute.fill,
                        this.primaryColor,
                    );
                    if (
                        this.currentStackTarget.toolName === ToolName.Brush ||
                        this.currentStackTarget.toolName === ToolName.Pencil ||
                        this.currentStackTarget.toolName === ToolName.Line
                    ) {
                        this.renderer.setAttribute(
                            this.drawStack.getElementByPosition(this.currentStackTarget.targetPosition),
                            HTMLAttribute.stroke,
                            this.primaryColor,
                        );
                    }
                    break;
                case Mouse.RightButton:
                    if (
                        this.currentStackTarget.toolName === ToolName.Brush ||
                        this.currentStackTarget.toolName === ToolName.Pencil ||
                        this.currentStackTarget.toolName === ToolName.Line
                    ) {
                        break;
                    }
                    this.renderer.setAttribute(
                        this.drawStack.getElementByPosition(this.currentStackTarget.targetPosition),
                        HTMLAttribute.stroke,
                        this.secondaryColor,
                    );
                    break;
                default:
                    break;
            }
            this.undoRedoerService.saveCurrentState(this.drawStack.idStack.slice(0));
            this.isOnTarget = false;
        }
    }
    // tslint:disable-next-line: no-empty
    onMouseUp(event: MouseEvent): void {}
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
