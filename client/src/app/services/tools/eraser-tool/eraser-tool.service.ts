import { Injectable, ElementRef, Renderer2 } from '@angular/core';

import { DrawStackService } from '../../draw-stack/draw-stack.service';
import { AbstractToolService } from '../abstract-tools/abstract-tool.service';
import { AttributesManagerService } from '../attributes-manager/attributes-manager.service';

@Injectable({
    providedIn: 'root',
})
export class EraserToolService extends AbstractToolService {
    attributesManagerService: AttributesManagerService;
    currentSize = 1;

    constructor(
        public drawStack: DrawStackService,
        public svgReference: ElementRef<SVGElement>,
        public renderer: Renderer2,
    ) {
        super();
    }

    initializeAttributesManagerService(attributesManagerService: AttributesManagerService): void {
        this.attributesManagerService = attributesManagerService;
        this.attributesManagerService.currentEraserSize.subscribe((newSize) => {
            this.currentSize = newSize;
            // this.setStamp();
        });
    }

    onMouseMove(event: MouseEvent): void {
        // this.currentMouseX = event.clientX - this.svgReference.nativeElement.getBoundingClientRect().left;
        // this.currentMouseY = event.clientY - this.svgReference.nativeElement.getBoundingClientRect().top;
        // this.positionStamp();
    }

    onMouseDown(event: MouseEvent): void {
        // const button = event.button;
        // if (button === Mouse.LeftButton && this.verifyPosition(event) && this.isIn && this.shouldStamp) {
        //     this.cleanUp();
        //     this.addStamp();
        // }
    }

    onMouseUp(event: MouseEvent): void {
        // const button = event.button;
        // if (button === Mouse.LeftButton && this.verifyPosition(event) && this.isIn && this.shouldStamp) {
        //     this.initStamp();
        // }
    }

    onMouseEnter(event: MouseEvent): void {
        // this.isIn = true;
        // if (this.shouldStamp) {
        //     this.initStamp();
        // }
    }

    onMouseLeave(event: MouseEvent): void {
        // this.isIn = false;
        // if (this.shouldStamp) {
        //     this.cleanUp();
        // }
    }

    onKeyDown(event: KeyboardEvent): void {
        // const key = event.key;
        // if (key === Keys.Alt) {
        //     event.preventDefault();
        //     if (!this.isAlterRotation) {
        //         this.isAlterRotation = true;
        //     }
        // }
    }

    onKeyUp(event: KeyboardEvent): void {
        // const key = event.key;
        // if (key === Keys.Alt) {
        //     event.preventDefault();
        //     if (this.isAlterRotation) {
        //         this.isAlterRotation = false;
        //     }
        // }
    }

    cleanUp(): void {
        // if (this.stampIsAppended) {
        //     this.renderer.removeChild(this.svgReference.nativeElement, this.stampWrapper);
        //     this.stampIsAppended = false;
        // }
    }
}
