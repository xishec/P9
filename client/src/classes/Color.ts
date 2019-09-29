import { DEFAULT_COLOR } from '../constants/color-constants';

export class Color {
    hex = DEFAULT_COLOR;

    constructor(hex?: string) {
        if (hex) {
            this.hex = hex;
        }
    }
}
