import { Drawing } from '../../../common/communication/Drawing';

export interface DrawingState {
    drawing: Drawing;
    pasteOffset?: number;
    duplicateOffset?: number;
    clippings?: Set<SVGElement>;
}
