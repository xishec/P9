import { ElementRef } from "@angular/core";
import { Keys } from "src/app/keys.enum";
import { AbstractShapeTool } from "../AbstractShapeTool/abstract-shape-tool";

export class RectangleTool extends AbstractShapeTool {
	private fillColor: string;
	private strokeColor: string;
	private strokeWidth: number;

	constructor(elementReference: ElementRef<SVGElement>) {
		super(elementReference);
		this.fillColor = "red";
		this.strokeColor = "black";
		this.strokeWidth = 1;
	}

	onKeyDown(event: KeyboardEvent): void {
		const key = event.key;
		switch (key) {
			case Keys.Shift:
				console.log(key + " -> Adjusting rectangle to a square");
				if (this.isPreviewing) {
					const minLen = Math.min(
						this.previewRectangle.width.baseVal.value,
						this.previewRectangle.height.baseVal.value
					);
					this.previewRectangle.setAttribute("width", minLen.toString());
					this.previewRectangle.setAttribute("height", minLen.toString());
				}
				break;

			default:
				console.log(key + " -> Key not handled");
				break;
		}
	}

	onKeyUp(event: KeyboardEvent): void {
		const key = event.key;

		switch (key) {
			case Keys.Shift:
				if (this.isPreviewing) {
					this.updatePreviewRectangle();
				}
				break;
			default:
				break;
		}
	}

	createSVG(): void {
		const el = document.createElementNS("http://www.w3.org/2000/svg", "rect");
		el.setAttribute("x", this.previewRectangle.x.baseVal.valueAsString);
		el.setAttribute("y", this.previewRectangle.y.baseVal.valueAsString);
		el.setAttribute("width", this.previewRectangle.width.baseVal.valueAsString);
		el.setAttribute("height", this.previewRectangle.height.baseVal.valueAsString);
		el.setAttribute("fill", this.fillColor.toString());
		el.setAttribute("stroke", this.strokeColor.toString());
		el.setAttribute("stroke-width", this.strokeWidth.toString());
		el.addEventListener("mousedown", () => {
			el.setAttribute("fill", "blue");
		});
		this.svgReference.nativeElement.appendChild(el);
	}

	// private updatePreviewSquare(): void{}
}
