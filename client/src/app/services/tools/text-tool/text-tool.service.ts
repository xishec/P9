import { Injectable, ElementRef, Renderer2 } from '@angular/core';
import { AbstractToolService } from '../abstract-tools/abstract-tool.service';
import { DrawStackService } from '../../draw-stack/draw-stack.service';
import { SVG_NS } from 'src/constants/constants';
import { HTMLAttribute } from 'src/constants/tool-constants';
import { ShortcutManagerService } from '../../shortcut-manager/shortcut-manager.service';
import { AttributesManagerService } from '../attributes-manager/attributes-manager.service';

@Injectable({
    providedIn: 'root',
})

export class TextToolService extends AbstractToolService {

    elementRef: ElementRef<SVGElement>;
    renderer: Renderer2;
    drawStack: DrawStackService;

    attributesManagerService: AttributesManagerService;

    fontType: string;
    fontSize: number;
    fontAlign: string;

    gWrap: SVGGElement;
    previewBox: SVGRectElement;
    textBox: SVGTextElement;
    currentLine: SVGTSpanElement;
    text = '';

    xPosition: number;
    yPosition: number;
    
    isWriting = false;

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

    initializeAttributesManagerService (attributeManagerService: AttributesManagerService){
        this.attributesManagerService = attributeManagerService;
        
        this.attributesManagerService.currentFont.subscribe((font) => {
            this.updateFont(font);
            
        });
        this.attributesManagerService.currentFontSize.subscribe((size) => {
            this.updateFontSize(size);
        });
        this.attributesManagerService.currenTfontAlign.subscribe((align) => {
            this.updateAlign(align);
        });
    }

    updateFont(font: string) {
        this.fontType = font;
        if (this.isWriting) {
            this.renderer.setAttribute(this.textBox, 'font-family', this.fontType);
            this.updatePreviewBox();
        };
    }

    updateFontSize(size: number) {
        this.fontSize = size;
        if (this.isWriting) {
            this.renderer.setAttribute(this.textBox, 'font-size', this.fontSize.toString());
            this.updatePreviewBox();
        }
    }

    updateAlign(align : string) {
        this.fontAlign = align;
        if (this.isWriting) {
            this.textBox.childNodes.forEach((tspan: SVGTSpanElement) => {
                this.renderer.setAttribute(tspan, 'text-anchor', this.fontAlign);
            });
            this.updatePreviewBox();
        }
    }

    onMouseMove(event: MouseEvent): void {
        // nothing
    }

    updatePreviewBox() {
        // after the text is appended, get the bounding box of the text element and update the preview rectangle
        const textBBox = this.textBox.getBBox();
        this.renderer.setAttribute(this.previewBox, HTMLAttribute.width, textBBox.width.toString());
        this.renderer.setAttribute(this.previewBox, HTMLAttribute.height, textBBox.height.toString());
        this.renderer.setAttribute(this.previewBox, 'x', this.xPosition.toString());
        this.renderer.setAttribute(this.previewBox, 'y', this.yPosition.toString());
    }

    createPreviewRect(x: number, y: number) {
        this.previewBox = this.renderer.createElement('rect', SVG_NS);
        this.renderer.setAttribute(this.previewBox, 'x', x.toString());
        this.renderer.setAttribute(this.previewBox, 'y', y.toString());
        this.renderer.setAttribute(this.previewBox, HTMLAttribute.stroke, 'black');
        this.renderer.setAttribute(this.previewBox, HTMLAttribute.stroke_width, '1');
        this.renderer.setAttribute(this.previewBox, HTMLAttribute.fill, 'none');
        this.renderer.setAttribute(this.previewBox, HTMLAttribute.stroke_dasharray, '5 5');
    }

    createTextBox(x: number, y: number) {
        console.log('size : ' + this.fontSize);
        this.textBox = this.renderer.createElement('text', SVG_NS);
        this.renderer.setAttribute(this.textBox, 'x', x.toString());
        this.renderer.setAttribute(this.textBox, 'y', y.toString());
        this.renderer.setAttribute(this.textBox, 'font-family', this.fontType);
        this.renderer.setAttribute(this.textBox, 'font-size', this.fontSize.toString());

        
    }

    createNewLine() {
        this.text = '';
        this.currentLine = this.renderer.createElement('tspan', SVG_NS);
        this.renderer.setAttribute(this.currentLine, 'text-anchor', this.fontAlign);
        this.renderer.setAttribute(this.currentLine, 'x', this.xPosition.toString());
        this.renderer.setAttribute(this.currentLine, 'dy', '1em');
        this.renderer.appendChild(this.textBox, this.currentLine);
    }

    onMouseDown(event: MouseEvent): void {
        if(!this.isWriting) {

            this.shortCutManagerService.changeIsOnInput(true);

            this.xPosition = this.getXPos(event.clientX);
            this.yPosition = this.getYPos(event.clientY);

            // init the text box with position and style
            this.createTextBox(this.xPosition,this.yPosition);

            // init the preview Box with position and style
            this.createPreviewRect(this.xPosition,this.yPosition);

            this.createNewLine();

            this.gWrap = this.renderer.createElement('g', SVG_NS);

            this.renderer.appendChild(this.gWrap, this.previewBox);
            this.renderer.appendChild(this.gWrap, this.textBox);

            this.renderer.appendChild(this.elementRef.nativeElement, this.gWrap);
            this.isWriting = true;
        } else {
            this.renderer.removeChild(this.gWrap, this.previewBox);
            this.isWriting = false;
        }
        
    }

    onMouseUp(event: MouseEvent): void {
        
    }
    onMouseEnter(event: MouseEvent): void {
    }
    onMouseLeave(event: MouseEvent): void {
    }
    onKeyDown(event: KeyboardEvent): void {
        if(!this.isWriting || event.ctrlKey || event.shiftKey) {
            return;
        }

        if(event.key == 'Enter') {
            this.createNewLine();
        } else {
            this.text += event.key;
            this.renderer.setProperty(this.currentLine, 'innerHTML', this.text);
            this.updatePreviewBox();
        }
    }
    onKeyUp(event: KeyboardEvent): void {
    }
    cleanUp(): void {
    }

    

    
}
