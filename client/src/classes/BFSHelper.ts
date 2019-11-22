import { AttributesManagerService } from 'src/app/services/tools/attributes-manager/attributes-manager.service';
import { Coords2D } from './Coords2D';

export class BFSHelper {
    maxX: number;
    maxY: number;
    context2D: CanvasRenderingContext2D;
    visited: Set<string>;
    queue: Coords2D[];
    strokes: Set<string>;
    tolerance: number;
    data: Uint8ClampedArray;
    pathsToFill: Array<Coords2D[]>;

    constructor(
        maxX: number,
        maxY: number,
        context2D: CanvasRenderingContext2D,
        attributesManagerService: AttributesManagerService,
    ) {
        this.maxX = maxX;
        this.maxY = maxY;
        this.context2D = context2D;
        this.visited = new Set([]);
        this.queue = [];
        this.strokes = new Set([]);

        attributesManagerService.tolerance.subscribe((tolerance: number) => {
            this.tolerance = tolerance;
        });
    }

    computeBFS(clickPosition: Coords2D): void {
        const imageData: ImageData = this.context2D.getImageData(0, 0, this.maxX, this.maxY);
        this.data = imageData.data;

        const targetColor: number[] = this.getPixelColor(clickPosition);
        this.queue.push(clickPosition);

        while (this.queue.length > 0) {
            const pixel: Coords2D = this.queue.pop() as Coords2D;

            if (!this.isSameColor(this.getPixelColor(pixel), targetColor)) {
                continue;
            }

            const neighborPixels = [
                new Coords2D(pixel.x - 1, pixel.y),
                new Coords2D(pixel.x + 1, pixel.y),
                new Coords2D(pixel.x, pixel.y - 1),
                new Coords2D(pixel.x, pixel.y + 1),
            ];

            for (const neighborPixel of neighborPixels) {
                if (this.visited.has(`${neighborPixel.x} ${neighborPixel.y}`)) {
                    continue;
                }
                if (!this.isValidPosition(neighborPixel)) {
                    this.strokes.add(`${pixel.x} ${pixel.y}`);
                    break;
                }
                if (this.isSameColor(this.getPixelColor(neighborPixel), targetColor)) {
                    this.queue.push(neighborPixel);
                    this.visited.add(`${neighborPixel.x} ${neighborPixel.y}`);
                } else {
                    this.strokes.add(`${pixel.x} ${pixel.y}`);
                    break;
                }
            }
        }
        this.dfs();
    }

    dfs() {
        this.pathsToFill = [];
        let tmp = [];
        this.visited = new Set([]);

        while (this.visited.size < this.strokes.size) {
            let pixelString = '';

            for (let el of this.strokes) {
                if (!this.visited.has(el)) {
                    pixelString = el;
                    break;
                }
            }

            let pixel: Coords2D = new Coords2D(
                Number(pixelString.substr(0, pixelString.indexOf(' '))),
                Number(pixelString.substr(pixelString.indexOf(' ') + 1)),
            );
            this.visited.add(`${pixel.x} ${pixel.y}`);
            tmp.push(pixel);
            this.queue = [];
            this.queue.push(pixel);

            while (this.queue.length > 0) {
                pixel = this.queue.pop()!;

                const neighborPixels = [
                    new Coords2D(pixel.x + 1, pixel.y),
                    new Coords2D(pixel.x + 2, pixel.y),
                    new Coords2D(pixel.x, pixel.y + 1),
                    new Coords2D(pixel.x, pixel.y + 2),
                    new Coords2D(pixel.x + 1, pixel.y + 2),
                    new Coords2D(pixel.x + 2, pixel.y + 1),
                    new Coords2D(pixel.x + 1, pixel.y + 1),
                    new Coords2D(pixel.x + 2, pixel.y + 2),
                    new Coords2D(pixel.x - 1, pixel.y),
                    new Coords2D(pixel.x - 2, pixel.y),
                    new Coords2D(pixel.x, pixel.y - 1),
                    new Coords2D(pixel.x, pixel.y - 2),
                    new Coords2D(pixel.x - 1, pixel.y - 2),
                    new Coords2D(pixel.x - 2, pixel.y - 1),
                    new Coords2D(pixel.x - 1, pixel.y - 1),
                    new Coords2D(pixel.x - 2, pixel.y - 2),
                    new Coords2D(pixel.x + 1, pixel.y - 2),
                    new Coords2D(pixel.x + 2, pixel.y - 1),
                    new Coords2D(pixel.x + 1, pixel.y - 1),
                    new Coords2D(pixel.x + 2, pixel.y - 2),
                    new Coords2D(pixel.x - 1, pixel.y + 2),
                    new Coords2D(pixel.x - 2, pixel.y + 1),
                    new Coords2D(pixel.x - 1, pixel.y + 1),
                    new Coords2D(pixel.x - 2, pixel.y + 2),
                ];

                for (const neighborPixel of neighborPixels) {
                    if (
                        this.strokes.has(`${neighborPixel.x} ${neighborPixel.y}`) &&
                        !this.visited.has(`${neighborPixel.x} ${neighborPixel.y}`)
                    ) {
                        this.visited.add(`${neighborPixel.x} ${neighborPixel.y}`);
                        tmp.push(neighborPixel);
                        this.queue.push(neighborPixel);
                    }
                }
            }

            this.pathsToFill.push(tmp);
            tmp = [];
        }
        console.log(this.pathsToFill);
    }

    isSameColor(color1: number[], color2: number[]): boolean {
        if (this.tolerance === 0) {
            return color1[0] === color2[0] && color1[1] === color2[1] && color1[2] === color2[2];
        } else {
            const difference = Math.sqrt(
                Math.pow(color1[0] - color2[0], 2) +
                    Math.pow(color1[1] - color2[1], 2) +
                    Math.pow(color1[2] - color2[2], 2),
            );
            const sum = 255 * 3;
            return difference <= (this.tolerance / 100) * sum;
        }
    }

    isValidPosition(pixel: Coords2D): boolean {
        return pixel.x >= 0 && pixel.x < this.maxX && pixel.y >= 0 && pixel.y < this.maxY;
    }

    getPixelColor(pixel: Coords2D): number[] {
        let index: number = 4 * (pixel.x + pixel.y * this.maxX);
        const r: number = this.data[index++];
        const g: number = this.data[index++];
        const b: number = this.data[index];
        return [r, g, b];
    }
}
