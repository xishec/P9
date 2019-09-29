import { Injectable, Renderer2 } from '@angular/core';

import { StackTargetInfo } from 'src/classes/StackTargetInfo';
import { ToolName } from 'src/constants/tool-constants';
import { Mouse } from '../../../../constants/constants';
import { DrawStackService } from '../../draw-stack/draw-stack.service';
import { AbstractToolService } from '../abstract-tools/abstract-tool.service';
import { ColorToolService } from '../color-tool/color-tool.service';

@Injectable({
    providedIn: 'root',
})
export class ColorApplicatorToolService extends AbstractToolService {
    private currentStackTarget: StackTargetInfo;
    private colorToolService: ColorToolService;
    private primaryColor = '';
    private secondaryColor = '';

    constructor(private drawStack: DrawStackService, private renderer: Renderer2) {
        super();
        this.drawStack.currentStackTarget.subscribe((stackTarget) => {
            this.currentStackTarget = stackTarget;
        });
    }

    initializeColorToolService(colorToolService: ColorToolService): void {
        this.colorToolService = colorToolService;
        this.colorToolService.currentPrimaryColor.subscribe((primaryColor) => {
            this.primaryColor = '#' + primaryColor;
        });
        this.colorToolService.currentSecondaryColor.subscribe((secondaryColor) => {
            this.secondaryColor = '#' + secondaryColor;
        });
    }

    // tslint:disable-next-line: no-empty
    onMouseMove(event: MouseEvent): void {}
    onMouseDown(event: MouseEvent): void {
        const button = event.button;
        if (this.drawStack.getElementByPosition(this.currentStackTarget.targetPosition) !== undefined) {
            switch (button) {
                case Mouse.LeftButton:
                    this.renderer.setAttribute(
                        this.drawStack.getElementByPosition(this.currentStackTarget.targetPosition),
                        'fill',
                        this.primaryColor,
                    );
                    if (
                        this.currentStackTarget.toolName === ToolName.Brush ||
                        this.currentStackTarget.toolName === ToolName.Pencil
                    ) {
                        this.renderer.setAttribute(
                            this.drawStack.getElementByPosition(this.currentStackTarget.targetPosition),
                            'stroke',
                            this.primaryColor,
                        );
                    }
                    break;
                case Mouse.RightButton:
                    if (
                        this.currentStackTarget.toolName === ToolName.Brush ||
                        this.currentStackTarget.toolName === ToolName.Pencil
                    ) {
                        break;
                    }
                    this.renderer.setAttribute(
                        this.drawStack.getElementByPosition(this.currentStackTarget.targetPosition),
                        'stroke',
                        this.secondaryColor,
                    );
                    break;
                default:
                    break;
            }
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
}
