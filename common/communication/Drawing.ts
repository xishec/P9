import { DrawingInfo } from './DrawingInfo';

export interface IDrawing {
    name: string;
    labels: string[];
    svg: string;
    idStack: string[];
    drawingInfo: DrawingInfo;
}

export class Drawing implements IDrawing {
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
