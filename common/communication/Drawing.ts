import { DrawingInfo } from './DrawingInfo';

export interface IDrawing {
    name: string;
    labels: string[];
    svg: string;
    idStack: string[];
    drawingInfo: DrawingInfo;
}

export interface Drawing {
    name: string;
    labels: string[];
    svg: string;
    idStack: string[];
    drawingInfo: DrawingInfo;
    timeStamp: number;
}
