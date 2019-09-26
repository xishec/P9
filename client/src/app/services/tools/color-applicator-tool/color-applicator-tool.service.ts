import { Injectable, Renderer2 } from '@angular/core';
import { AbstractToolService } from '../abstract-tools/abstract-tool.service';
import { DrawStackService } from '../../draw-stack/draw-stack.service';
import { Mouse } from '../../constants';
import { ColorToolService } from '../color-tool/color-tool.service';

@Injectable({
    providedIn: 'root',
})
export class ColorApplicatorToolService extends AbstractToolService {
    currentTargetPosition = 0;
    private buttonClick = 0;
    private colorToolService: ColorToolService;
    private primaryColor = '';
    private secondaryColor = '';

    constructor(private drawStack: DrawStackService, private renderer: Renderer2) {
        super();
        this.drawStack.currentStackTargetPosition.subscribe((targetPosition) => {
            this.currentTargetPosition = targetPosition;
            const butt = this.buttonClick;
            if (this.drawStack.getElementByPosition(this.currentTargetPosition) !== undefined) {
                console.log('sub mouse ' + butt);
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

    onMouseMove(event: MouseEvent): void {}
    onMouseDown(event: MouseEvent): void {
        this.buttonClick = event.button;
        console.log('mouse ' + this.buttonClick);
    }
    onMouseUp(event: MouseEvent): void {}
    onMouseEnter(event: MouseEvent): void {}
    onMouseLeave(event: MouseEvent): void {}
    onKeyDown(event: KeyboardEvent): void {}
    onKeyUp(event: KeyboardEvent): void {}
}
