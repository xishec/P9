import { Drawing } from './Drawing';

export class DrawingState {
    drawing: Drawing;
    pasteOffset?: number;
    duplicateOffset?: number;
    clippings?: Set<SVGElement>;

    constructor(drawing: Drawing) {
        this.drawing = drawing;
    }
}
