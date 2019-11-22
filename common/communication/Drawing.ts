import { DrawingInfo } from './DrawingInfo';

export interface Drawing {
    name: string;
    labels: string[];
    svg: string;
    idStack: string[];
    drawingInfo: DrawingInfo;
    createdOn: number;
    lastModified: number
}
