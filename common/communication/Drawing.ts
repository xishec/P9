import { DrawingInfo } from 'src/classes/DrawingInfo';

export interface Drawing {
	name: string;
	labels: string[];
	svg: string;
	idStack: string[];
	drawingInfo: DrawingInfo;
}
