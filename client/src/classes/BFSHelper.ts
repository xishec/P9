import { AttributesManagerService } from 'src/app/services/tools/attributes-manager/attributes-manager.service';
import { Coords2D } from './Coords2D';

export class BFSHelper {
    maxX: number;
    maxY: number;
    context2D: CanvasRenderingContext2D;
    visited: Set<string>;
    queue: Coords2D[];
    bodyGrid: Map<number, number[]>;
    strokeGrid: Map<number, number[]>;
    tolerance: number;
    mostLeft: number;
    mostRight: number;
    data: Uint8ClampedArray;

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
        this.bodyGrid = new Map([]);
        this.strokeGrid = new Map([]);
        this.mostLeft = this.maxX;
        this.mostRight = 0;

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

            this.mostLeft = pixel.x < this.mostLeft ? pixel.x : this.mostLeft;
            this.mostRight = pixel.x > this.mostRight ? pixel.x : this.mostRight;

            if (this.isSameColor(this.getPixelColor(pixel), targetColor)) {
                this.addPixelToMap(pixel, this.bodyGrid);
            } else {
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
                    this.addPixelToMap(pixel, this.strokeGrid);
                    break;
                }
                if (this.isSameColor(this.getPixelColor(neighborPixel), targetColor)) {
                    this.queue.push(neighborPixel);
                    this.visited.add(`${neighborPixel.x} ${neighborPixel.y}`);
                } else {
                    this.addPixelToMap(pixel, this.strokeGrid);
                    break;
                }
            }
        }
        this.sortBodyGrid();
    }

    sortBodyGrid(): void {
        this.bodyGrid.forEach((el) => {
            el.sort((a: number, b: number) => {
                return a < b ? -1 : 1;
            });
        });
    }

    addPixelToMap(pixel: Coords2D, map: Map<number, number[]>): void {
        if (map.has(pixel.x)) {
            (map.get(pixel.x) as number[]).push(pixel.y);
        } else {
            map.set(pixel.x, [pixel.y]);
        }
    }

    isSameColor(color1: number[], color2: number[]): boolean {
        if (this.tolerance === 0) {
            this.tolerance = 0.5;
        }
        const difference = Math.sqrt(
            Math.pow(color1[0] - color2[0], 2) +
                Math.pow(color1[1] - color2[1], 2) +
                Math.pow(color1[2] - color2[2], 2),
        );
        const sum = 255 * 3;
        return difference <= (this.tolerance / 100) * sum;
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
