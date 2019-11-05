import { Injectable, ElementRef, Renderer2 } from '@angular/core';
import { AbstractToolService } from '../abstract-tools/abstract-tool.service';
import { DrawStackService } from '../../draw-stack/draw-stack.service';
import { SVG_NS } from 'src/constants/constants';
import { HTMLAttribute } from 'src/constants/tool-constants';
import { ShortcutManagerService } from '../../shortcut-manager/shortcut-manager.service';

@Injectable({
    providedIn: 'root',
})

export class TextToolService extends AbstractToolService {

    elementRef: ElementRef<SVGElement>;
    renderer: Renderer2;
    drawStack: DrawStackService;

    text = '';
    textBox : SVGTextElement;
    gWrap: SVGGElement;
    previewBox: SVGRectElement;

    constructor(private shortCutManagerService: ShortcutManagerService) {
        super();
    }

    getXPos = (clientX: number) => clientX - this.elementRef.nativeElement.getBoundingClientRect().left;
    getYPos = (clientY: number) => clientY - this.elementRef.nativeElement.getBoundingClientRect().top;

    initializeService(elementRef: ElementRef<SVGElement>, renderer: Renderer2, drawStack: DrawStackService): void {
        this.elementRef = elementRef;
        this.renderer = renderer;
        this.drawStack = drawStack;
    }

    onMouseMove(event: MouseEvent): void {
        // nothing
    }

    updatePreviewBox() {
        // after the text is appended, get the bounding box of the text element and update the preview rectangle
        const bBox = this.textBox.getBBox();
        this.renderer.setAttribute(this.previewBox, HTMLAttribute.width, bBox.width.toString());
        this.renderer.setAttribute(this.previewBox, HTMLAttribute.height, bBox.height.toString());
        this.renderer.setAttribute(this.previewBox, 'x', bBox.x.toString());
        this.renderer.setAttribute(this.previewBox, 'y', bBox.y.toString());
    }

    onMouseDown(event: MouseEvent): void {
        // create the rectangle
        // disable shortcuts until on mouse down outside
        this.text = '';
        this.shortCutManagerService.changeIsOnInput(true);

        this.gWrap = this.renderer.createElement('g', SVG_NS);

        // init the text box with position and style
        this.textBox = this.renderer.createElement('text', SVG_NS);
        this.renderer.setAttribute(this.textBox, 'x', this.getXPos(event.clientX).toString());
        this.renderer.setAttribute(this.textBox, 'y', this.getYPos(event.clientY).toString());
        this.renderer.setAttribute(this.textBox, 'font-family', 'Verdana');
        this.renderer.setAttribute(this.textBox, 'font-size', '12');

        // init the preview Box with position and style
        this.previewBox = this.renderer.createElement('rect', SVG_NS);
        this.renderer.setAttribute(this.previewBox, 'x', this.getXPos(event.clientX).toString());
        this.renderer.setAttribute(this.previewBox, 'y', this.getYPos(event.clientY).toString());
        this.renderer.setAttribute(this.previewBox, HTMLAttribute.stroke, 'black');
        this.renderer.setAttribute(this.previewBox, HTMLAttribute.stroke_width, '1');
        this.renderer.setAttribute(this.previewBox, HTMLAttribute.fill, 'none');

        this.renderer.appendChild(this.gWrap, this.previewBox);
        this.renderer.appendChild(this.gWrap, this.textBox);

        this.renderer.appendChild(this.elementRef.nativeElement, this.gWrap);
    }

    onMouseUp(event: MouseEvent): void {
        
    }
    onMouseEnter(event: MouseEvent): void {
    }
    onMouseLeave(event: MouseEvent): void {
    }
    onKeyDown(event: KeyboardEvent): void {
        this.text += event.key;
        this.renderer.setProperty(this.textBox, 'innerHTML', this.text);
        this.updatePreviewBox();
    }
    onKeyUp(event: KeyboardEvent): void {
    }
    cleanUp(): void {
    }

    

    
}
