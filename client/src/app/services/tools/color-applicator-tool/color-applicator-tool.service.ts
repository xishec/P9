import { Injectable, Renderer2 } from '@angular/core';

import { Mouse } from '../../../../constants/constants';
import { DrawStackService } from '../../draw-stack/draw-stack.service';
import { AbstractToolService } from '../abstract-tools/abstract-tool.service';
import { ColorToolService } from '../color-tool/color-tool.service';

@Injectable({
    providedIn: 'root',
})
export class ColorApplicatorToolService extends AbstractToolService {
    currentTargetPosition = 0;
    private buttonClick = 0;
    private wasUsed = false;
    private colorToolService: ColorToolService;
    private primaryColor = '';
    private secondaryColor = '';

    constructor(private drawStack: DrawStackService, private renderer: Renderer2) {
        super();
        this.drawStack.currentStackTargetPosition.subscribe((targetPosition) => {
            this.currentTargetPosition = targetPosition;
            const butt = this.buttonClick;
            if (this.drawStack.getElementByPosition(this.currentTargetPosition) && this.wasUsed) {
                switch (butt) {
                    case Mouse.LeftButton:
                        this.renderer.setAttribute(
                            this.drawStack.getElementByPosition(this.currentTargetPosition),
                            'fill',
                            this.primaryColor,
                        );
                        break;
                    case Mouse.RightButton:
                        this.renderer.setAttribute(
                            this.drawStack.getElementByPosition(this.currentTargetPosition),
                            'stroke',
                            this.secondaryColor,
                        );
                        break;
                    default:
                        break;
                }
                this.wasUsed = false;
            }
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
        this.buttonClick = event.button;
        this.wasUsed = true;
        console.log('mouse ' + this.buttonClick);
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
