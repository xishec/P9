import { ElementRef } from '@angular/core';

export abstract class AbstractShapeTool {
	protected currentMouseX: number;
	protected currentMouseY: number;
	protected initialMouseX: number;
	protected initialMouseY: number;
	protected svgReference: ElementRef<SVGElement>;
	protected previewRectangle: SVGRectElement;
	protected isPreviewing: boolean;
	protected isGone: boolean;
	protected isIn: boolean;

	constructor(elementReference: ElementRef<SVGElement>) {
		this.currentMouseX = 0;
		this.currentMouseY = 0;
		this.initialMouseX = 0;
		this.initialMouseY = 0;
		this.isPreviewing = false;
		this.svgReference = elementReference;
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
				this.svgReference.nativeElement.removeChild(this.previewRectangle);
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
			case 0 && this.isIn:
				this.isPreviewing = true;
				this.initialMouseX = this.currentMouseX;
				this.initialMouseY = this.currentMouseY;
				this.buildPreviewRectangle();
				this.svgReference.nativeElement.appendChild(this.previewRectangle);
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
		this.isIn = true;
		this.isGone = false;
	}

	onMouseLeave(event: MouseEvent): void{
		this.isGone = true;
		this.isIn = false;
	}

	private buildPreviewRectangle(): void {
		this.previewRectangle = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
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
			this.previewRectangle.setAttribute('x', (x - w).toString());
			this.previewRectangle.setAttribute('width', w.toString());
		} else {
			this.previewRectangle.setAttribute('x', x.toString());
			this.previewRectangle.setAttribute('width', w.toString());
		}
		// adjust y
		if (h < 0) {
			h *= -1;
			this.previewRectangle.setAttribute('y', (y - h).toString());
			this.previewRectangle.setAttribute('height', h.toString());
		} else {
			this.previewRectangle.setAttribute('y', y.toString());
			this.previewRectangle.setAttribute('height', h.toString());
		}
		this.previewRectangle.setAttribute('fill', 'white');
		this.previewRectangle.setAttribute('fill-opacity', '0.3');
		this.previewRectangle.setAttribute('stroke', 'black');
	}
}
