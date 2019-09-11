import { ElementRef } from '@angular/core';
import { Keys } from 'src/app/keys.enum';
import { AbstractShapeTool } from '../AbstractShapeTool/abstract-shape-tool';

export class RectangleTool extends AbstractShapeTool {
	private fillColor: string;
	private strokeColor: string;
	private strokeWidth: number;
	private isSquarePreview: boolean;

	constructor(elementReference: ElementRef<SVGElement>) {
		super(elementReference);
		this.fillColor = 'red';
		this.strokeColor = 'black';
		this.strokeWidth = 1;
		this.isSquarePreview = false;
	}

	onMouseMove(event: MouseEvent): void {
		this.currentMouseX = event.offsetX;
		this.currentMouseY = event.offsetY;
		if (this.isPreviewing) {
			if (this.isSquarePreview) {
				this.updatePreviewSquare();
			} else {
				this.updatePreviewRectangle();
			}
		}
	}

	onMouseUp(event: MouseEvent): void {
		const button = event.button;

		switch (button) {
			case 0:
				this.createSVG();
				this.isPreviewing = false;
				this.isSquarePreview = false;
				this.svgReference.nativeElement.removeChild(this.previewRectangle);
				break;

			case 1:
				break;

			default:
				break;
		}
	}

	onKeyDown(event: KeyboardEvent): void {
		const key = event.key;
		switch (key) {
			case Keys.Shift:
				console.log(key + ' -> Adjusting rectangle to a square');
				if (this.isPreviewing) {
					this.isSquarePreview = true;
					this.updatePreviewSquare();
				}
				break;

			default:
				console.log(key + ' -> Key not handled');
				break;
		}
	}

	onKeyUp(event: KeyboardEvent): void {
		const key = event.key;

		switch (key) {
			case Keys.Shift:
				if (this.isPreviewing) {
					this.isSquarePreview = false;
					this.updatePreviewRectangle();
				}
				break;
			default:
				break;
		}
	}

	createSVG(): void {
		const el = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
		el.setAttribute('x', this.previewRectangle.x.baseVal.valueAsString);
		el.setAttribute('y', this.previewRectangle.y.baseVal.valueAsString);
		el.setAttribute('width', this.previewRectangle.width.baseVal.valueAsString);
		el.setAttribute('height', this.previewRectangle.height.baseVal.valueAsString);
		el.setAttribute('fill', this.fillColor.toString());
		el.setAttribute('stroke', this.strokeColor.toString());
		el.setAttribute('stroke-width', this.strokeWidth.toString());
		el.addEventListener('mousedown', () => {
			el.setAttribute('fill', 'blue');
		});
		this.svgReference.nativeElement.appendChild(el);
	}

	private updatePreviewSquare(): void {
		const x = this.initialMouseX;
		const y = this.initialMouseY;
		let w = this.currentMouseX - this.initialMouseX;
		let h = this.currentMouseY - this.initialMouseY;
		const minLen = Math.min(w, h);

		// adjust x
		if (w < 0) {
			w *= -1;
			this.previewRectangle.setAttribute('x', x.toString());
			this.previewRectangle.setAttribute('width', minLen.toString());
		} else {
			this.previewRectangle.setAttribute('x', x.toString());
			this.previewRectangle.setAttribute('width', minLen.toString());
		}

		// adjust y
		if (h < 0) {
			h *= -1;
			this.previewRectangle.setAttribute('y', y.toString());
			this.previewRectangle.setAttribute('height', minLen.toString());
		} else {
			this.previewRectangle.setAttribute('y', y.toString());
			this.previewRectangle.setAttribute('height', minLen.toString());
		}
	}
}
