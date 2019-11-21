import { DrawingInfo } from './DrawingInfo';

export interface Drawing {
    id: string;
    name: string;
    labels: string[];
    svg: string;
    idStack: string[];
    drawingInfo: DrawingInfo;
    lastModified: number
}
