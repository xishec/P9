import { Injectable, ElementRef, Renderer2 } from '@angular/core';
import { AbstractToolService } from '../abstract-tools/abstract-tool.service';
import { DrawStackService } from '../../draw-stack/draw-stack.service';
import { SVG_NS } from 'src/constants/constants';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

@Injectable({
    providedIn: 'root',
})

export class TextToolService extends AbstractToolService {

    elementRef: ElementRef<SVGElement>;
    renderer: Renderer2;
    drawStack: DrawStackService;

    text: string;
    textBox : SVGTextElement

    constructor() {
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

    onMouseDown(event: MouseEvent): void {
        // create the rectangle
        // disable shortcuts until on mouse down outside
        console.log('mouse down on text');
        this.textBox = this.renderer.createElement('text', SVG_NS);

        this.renderer.setAttribute(this.textBox, 'x', this.getXPos(event.clientX).toString());
        this.renderer.setAttribute(this.textBox, 'y', this.getYPos(event.clientY).toString());
        this.renderer.setAttribute(this.textBox, 'font-family', 'Verdana');
        this.renderer.setAttribute(this.textBox, 'font-size', '55');
        this.renderer.setProperty(this.textBox, 'innerHTML', 'bonjour');

        this.renderer.appendChild(this.elementRef.nativeElement, this.textBox);



    }
    onMouseUp(event: MouseEvent): void {
        
    }
    onMouseEnter(event: MouseEvent): void {
    }
    onMouseLeave(event: MouseEvent): void {
    }
    onKeyDown(event: KeyboardEvent): void {
        // update the text
    }
    onKeyUp(event: KeyboardEvent): void {
    }
    cleanUp(): void {
    }

    

    
}
