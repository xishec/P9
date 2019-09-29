import { Color } from './Color';

export class DrawingInfo {
    width: number;
    height: number;
    color: Color;
    constructor(width: number, height: number, color: Color){
        this.width = width;
        this.height = height;
        this.color = color;
    };
}
