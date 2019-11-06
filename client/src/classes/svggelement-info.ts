export class SVGGElementInfo {
    borderColor: string;
    borderWidth: string;

    constructor(borderColor?: string | undefined, borderWidth?: string | undefined) {
        if (borderColor !== undefined) {
            this.borderColor = borderColor;
        }
        if (borderWidth !== undefined) {
            this.borderWidth = borderWidth;
        }
    }
}
