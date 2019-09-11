import { ElementRef } from "@angular/core";

export abstract class AbstractShapeTool {
	protected currentMouseX: number;
	protected currentMouseY: number;
	protected initialMouseX: number;
	protected initialMouseY: number;
	protected svgReference: ElementRef<SVGElement>;
	protected previewRectangle: SVGRectElement;
	protected isPreviewing: boolean;
	protected previewIsDecenteredX: boolean;
	protected previewIsDecenteredY: boolean;

	constructor(elementReference: ElementRef<SVGElement>) {
		this.currentMouseX = 0;
		this.currentMouseY = 0;
		this.initialMouseX = 0;
		this.initialMouseY = 0;
		this.isPreviewing = false;
		this.previewIsDecenteredX = false;
		this.previewIsDecenteredY = false;
		this.svgReference = elementReference;
	}

	abstract onKeyDown(event: KeyboardEvent): void;
	abstract onKeyUp(event: KeyboardEvent): void;
	abstract createSVG(): void;

	onMouseUp(event: MouseEvent): void {
		let button = event.button;

		switch (button) {
			case 0:
				this.createSVG();
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
		let button = event.button;

		switch (button) {
			case 0:
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

	private buildPreviewRectangle(): void {
		this.previewRectangle = document.createElementNS("http://www.w3.org/2000/svg", "rect");
		this.updatePreviewRectangle();
	}

	protected updatePreviewRectangle(): void {
		let x = this.initialMouseX;
		let y = this.initialMouseY;
		let w = this.currentMouseX - this.initialMouseX;
		let h = this.currentMouseY - this.initialMouseY;
		// adjust x
		if (w < 0) {
			w *= -1;
			this.previewRectangle.setAttribute("x", (x - w).toString());
			this.previewRectangle.setAttribute("width", w.toString());
			this.previewIsDecenteredX = true;
		} else {
			this.previewRectangle.setAttribute("x", x.toString());
			this.previewRectangle.setAttribute("width", w.toString());
			this.previewIsDecenteredX = false;
		}
		// adjust y
		if (h < 0) {
			h *= -1;
			this.previewRectangle.setAttribute("y", (y - h).toString());
			this.previewRectangle.setAttribute("height", h.toString());
			this.previewIsDecenteredY = true;
		} else {
			this.previewRectangle.setAttribute("y", y.toString());
			this.previewRectangle.setAttribute("height", h.toString());
			this.previewIsDecenteredY = false;
		}
		this.previewRectangle.setAttribute("fill", "white");
		this.previewRectangle.setAttribute("fill-opacity", "0.3");
		this.previewRectangle.setAttribute("stroke", "black");
	}
}
