import { Drawing } from '../../../common/communication/Drawing';

export class DrawingState {
    drawing: Drawing;
    pasteOffset?: number;
    duplicateOffset?: number;
    clippings?: Set<SVGElement>;

    constructor(drawing: Drawing, pasteOffset?: number, duplicateOffset?: number, clippings?: Set<SVGElement>) {
        this.drawing = drawing;
        if (pasteOffset) this.pasteOffset = pasteOffset;
        if (duplicateOffset) this.duplicateOffset = duplicateOffset;
        if (clippings) this.clippings = clippings;
    }
}
