import { Coords2D } from './Coords2D';

export class BFSHelper {
    maxX: number;
    maxY: number;
    context2D: CanvasRenderingContext2D;
    visited: Set<string>;
    queue: Array<Coords2D>;
    toFill: Array<Coords2D>;

    constructor(maxX: number, maxY: number, context2D: CanvasRenderingContext2D) {
        this.maxX = maxX;
        this.maxY = maxY;
        this.context2D = context2D;
        this.visited = new Set([]);
        this.queue = [];
        this.toFill = [];
    }

    computeBFS(clickPosition: Coords2D): void {
        let targetColor: Uint8ClampedArray = this.getPixelColor(clickPosition);

        this.visited.add(JSON.stringify(clickPosition));
        this.queue.push(clickPosition);

        while (this.queue.length > 0) {
            let pixel: Coords2D = this.queue.shift()!;

            if (this.isSameColor(this.getPixelColor(pixel), targetColor)) {
                this.toFill.push(pixel);
            }

            let neighborPixels = [
                new Coords2D(pixel.x - 1, pixel.y),
                new Coords2D(pixel.x + 1, pixel.y),
                new Coords2D(pixel.x, pixel.y - 1),
                new Coords2D(pixel.x, pixel.y + 1),
            ];
            for (let i = 0; i < neighborPixels.length; ++i) {
                let neighborPixel: Coords2D = neighborPixels[i];
                if (this.visited.has(JSON.stringify(neighborPixel))) {
                    continue;
                }
                let neighborPixelColor = this.getPixelColor(neighborPixel);
                // console.log(this.isValidPosition(neighborPixel), this.isSameColor(neighborPixelColor, targetColor));
                if (this.isValidPosition(neighborPixel) && this.isSameColor(neighborPixelColor, targetColor)) {
                    this.queue.push(neighborPixel);
                    this.visited.add(JSON.stringify(neighborPixel));
                }
            }
        }

        // console.log(this.toFill);
    }

    isSameColor(color1: Uint8ClampedArray, color2: Uint8ClampedArray): boolean {
        return color1[0] === color2[0] && color1[1] === color2[1] && color1[2] === color2[2];
    }

    isValidPosition(pixel: Coords2D): boolean {
        return pixel.x > 0 && pixel.x < this.maxX && pixel.y > 0 && pixel.y < this.maxY;
    }

    getPixelColor(clickPosition: Coords2D): Uint8ClampedArray {
        return this.context2D.getImageData(clickPosition.x, clickPosition.y, 1, 1).data;
    }
}
