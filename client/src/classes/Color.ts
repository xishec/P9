export class Color {
    hex = 'ffffffff';

    constructor(hex?: string) {
        if (hex) {
            this.hex = hex;
        }
    }
}
