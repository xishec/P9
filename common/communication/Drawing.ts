import { DrawingInfo } from './DrawingInfo';

export class Drawing {
	name: string;
	labels: string[];
	svg: string;
	idStack: string[];
	drawingInfo: DrawingInfo;

	constructor(name: string, labels: string[], svg: string, idStack: string[], drawingInfo: DrawingInfo) {
		this.name = name;
		this.labels = labels;
		this.svg = svg;
		this.idStack = idStack;
		this.drawingInfo = drawingInfo;
	}
}
