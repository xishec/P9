import { Drawing } from '../../../common/communication/Drawing';

export class DrawingState {
    drawing: Drawing;
    pasteOffset?: number;
    duplicateOffset?: number;
    clippings?: Set<SVGElement>;

    constructor(drawing: Drawing) {
        this.drawing = drawing;
    }
}
