export class Color {
    hex = 'ffffff';

    constructor(hex?: string) {
        if (hex) {
            this.hex = hex;
        }
    }
}
