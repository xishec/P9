import { ElementRef, Renderer2 } from '@angular/core';

export abstract class AbstractShapeTool {
	protected currentMouseX: number;
	protected currentMouseY: number;
	protected initialMouseX: number;
	protected initialMouseY: number;
    protected svgReference: ElementRef<SVGElement>;
    protected renderer: Renderer2;
	protected previewRectangle: SVGRectElement;
	protected isPreviewing: boolean;

	constructor(elementReference: ElementRef<SVGElement>, renderer: Renderer2) {
		this.currentMouseX = 0;
		this.currentMouseY = 0;
		this.initialMouseX = 0;
		this.initialMouseY = 0;
		this.isPreviewing = false;
        this.svgReference = elementReference;
        this.renderer = renderer;
	}

	abstract onKeyDown(event: KeyboardEvent): void;
	abstract onKeyUp(event: KeyboardEvent): void;
	abstract createSVG(): void;

	onMouseUp(event: MouseEvent): void {
        const button = event.button;

		switch (button) {
			case 0:
				if(this.previewRectangle.width.baseVal.value > 0 || this.previewRectangle.height.baseVal.value > 0){
					this.createSVG();
				}
                this.isPreviewing = false;
                this.renderer.removeChild(this.svgReference.nativeElement, this.previewRectangle);
				// this.svgReference.nativeElement.removeChild(this.previewRectangle);
				break;

			case 1:
				break;

			default:
				break;
		}
	}

	onMouseDown(event: MouseEvent): void {
		const button = event.button;

		switch (button) {
			case 0:
				this.isPreviewing = true;
				this.initialMouseX = this.currentMouseX;
				this.initialMouseY = this.currentMouseY;
                this.buildPreviewRectangle();
                this.renderer.appendChild(this.svgReference.nativeElement, this.previewRectangle);
				// this.svgReference.nativeElement.appendChild(this.previewRectangle);
				break;

			case 1:
				break;

			default:
				break;
		}
	}

	onMouseMove(event: MouseEvent): void {
		this.currentMouseX = event.offsetX;
		this.currentMouseY = event.offsetY;
		if (this.isPreviewing) {
			this.updatePreviewRectangle();
		}
	}

	onMouseEnter(event: MouseEvent): void{
	}

	onMouseLeave(event: MouseEvent): void{
	}

	private buildPreviewRectangle(): void {
        this.previewRectangle = this.renderer.createElement('rect', 'http://www.w3.org/2000/svg');
		// this.previewRectangle = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
		this.updatePreviewRectangle();
	}

	protected updatePreviewRectangle(): void {
		const x = this.initialMouseX;
		const y = this.initialMouseY;
		let w = this.currentMouseX - this.initialMouseX;
		let h = this.currentMouseY - this.initialMouseY;
		// adjust x
		if (w < 0) {
            w *= -1;
            this.renderer.setAttribute(this.previewRectangle, 'x', (x - w).toString());
            this.renderer.setAttribute(this.previewRectangle, 'width', w.toString());
			// this.previewRectangle.setAttribute('x', (x - w).toString());
			// this.previewRectangle.setAttribute('width', w.toString());
		} else {
            this.renderer.setAttribute(this.previewRectangle, 'x', x.toString());
            this.renderer.setAttribute(this.previewRectangle, 'width', w.toString());
			// this.previewRectangle.setAttribute('x', x.toString());
			// this.previewRectangle.setAttribute('width', w.toString());
		}
		// adjust y
		if (h < 0) {
            h *= -1;
            this.renderer.setAttribute(this.previewRectangle, 'y', (y - h).toString());
            this.renderer.setAttribute(this.previewRectangle, 'height', h.toString());
            // this.previewRectangle.setAttribute('y', (y - h).toString());
			// this.previewRectangle.setAttribute('height', h.toString());
		} else {
            this.renderer.setAttribute(this.previewRectangle, 'y', y.toString());
            this.renderer.setAttribute(this.previewRectangle, 'height', h.toString());
            // this.previewRectangle.setAttribute('y', y.toString());
			// this.previewRectangle.setAttribute('height', h.toString());
        }
        this.renderer.setAttribute(this.previewRectangle, 'fill', 'white');
        this.renderer.setAttribute(this.previewRectangle, 'fill-opacity', '0.3');
        this.renderer.setAttribute(this.previewRectangle, 'stroke', 'black');
		// this.previewRectangle.setAttribute('fill', 'white');
		// this.previewRectangle.setAttribute('fill-opacity', '0.3');
		// this.previewRectangle.setAttribute('stroke', 'black');
	}
}
