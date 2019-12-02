import { AttributesManagerService } from 'src/app/services/tools/attributes-manager/attributes-manager.service';
import { MAX_RGB_NUMBER, RGBA_ARRAY_LENGTH } from 'src/constants/color-constants';
import { MAX_PATH_DISTANCE, MAX_PERCENTAGE } from 'src/constants/tool-constants';
import { Coords2D } from './Coords2D';

export class BFSHelper {
    maxX: number;
    maxY: number;
    context2D: CanvasRenderingContext2D;
    visited: Set<string>;
    queue: Coords2D[];
    strokes: Coords2D[];
    strokesSet: Set<string>;
    tolerance: number;
    data: Uint8ClampedArray;
    pathsToFill: Coords2D[][];
    tmpPath: Coords2D[];

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
        this.strokes = [];
        this.strokesSet = new Set([]);

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
                    this.strokes.push(pixel);
                    this.strokesSet.add(`${pixel.x} ${pixel.y}`);
                    break;
                }
                if (this.isSameColor(this.getPixelColor(neighborPixel), targetColor)) {
                    this.queue.push(neighborPixel);
                    this.visited.add(`${neighborPixel.x} ${neighborPixel.y}`);
                } else {
                    this.strokes.push(neighborPixel);
                    this.strokesSet.add(`${neighborPixel.x} ${neighborPixel.y}`);
                    break;
                }
            }
        }
        this.createPathToFill();
    }

    searchIn(neighborPixels: Coords2D[], closestNeighbor: Coords2D): void {
        neighborPixels.forEach((neighborPixel: Coords2D) => {
            if (
                this.strokesSet.has(`${neighborPixel.x} ${neighborPixel.y}`) &&
                !this.visited.has(`${neighborPixel.x} ${neighborPixel.y}`)
            ) {
                closestNeighbor.setCoords(neighborPixel);
            }
        });
    }

    searchInDirectNeighbors(pixel: Coords2D, closestNeighbor: Coords2D): void {
        const neighborPixels = [
            new Coords2D(pixel.x - 1, pixel.y),
            new Coords2D(pixel.x + 1, pixel.y),
            new Coords2D(pixel.x, pixel.y - 1),
            new Coords2D(pixel.x, pixel.y + 1),
        ];
        this.searchIn(neighborPixels, closestNeighbor);
    }

    searchInIndirectNeighbors(pixel: Coords2D, closestNeighbor: Coords2D): void {
        const neighborPixels = [
            new Coords2D(pixel.x - 1, pixel.y - 1),
            new Coords2D(pixel.x - 1, pixel.y + 1),
            new Coords2D(pixel.x + 1, pixel.y - 1),
            new Coords2D(pixel.x + 1, pixel.y + 1),
        ];
        this.searchIn(neighborPixels, closestNeighbor);
    }

    findClosestPixel(pixel: Coords2D, closestNeighbor: Coords2D): void {
        let closestNeighborDistance = Number.MAX_SAFE_INTEGER;
        this.strokes.forEach((el: Coords2D) => {
            if (!this.visited.has(`${el.x} ${el.y}`)) {
                const distance = el.distanceTo(pixel);
                if (distance < closestNeighborDistance) {
                    closestNeighborDistance = distance;
                    closestNeighbor.setCoords(el);
                }
            }
        });

        if (closestNeighborDistance > MAX_PATH_DISTANCE && this.tmpPath.length > 0) {
            this.pathsToFill.push(this.tmpPath);
            this.tmpPath = [];
        }
    }

    updateClosestNeighbor(pixel: Coords2D, closestNeighbor: Coords2D): void {
        this.searchInDirectNeighbors(pixel, closestNeighbor);
        if (!closestNeighbor.isValid()) {
            this.searchInIndirectNeighbors(pixel, closestNeighbor);
        }
        if (!closestNeighbor.isValid()) {
            this.findClosestPixel(pixel, closestNeighbor);
        }
    }

    createPathToFill() {
        if (this.strokes.length === 0) {
            return;
        }

        this.pathsToFill = [];
        this.visited = new Set([]);
        this.tmpPath = [];

        const pixel: Coords2D = this.strokes[0];
        this.visited.add(`${pixel.x} ${pixel.y}`);

        while (pixel.isValid()) {
            this.tmpPath.push(pixel.clone());

            const closestNeighbor: Coords2D = new Coords2D(-1, -1);
            this.updateClosestNeighbor(pixel, closestNeighbor);

            this.visited.add(`${closestNeighbor.x} ${closestNeighbor.y}`);
            pixel.setCoords(closestNeighbor);
        }

        this.pathsToFill.push(this.tmpPath);
        this.tmpPath = [];
    }

    isSameColor(color1: number[], color2: number[]): boolean {
        if (this.tolerance === 0) {
            return color1[0] === color2[0] && color1[1] === color2[1] && color1[2] === color2[2];
        } else {
            const difference =
                Math.abs(color1[0] - color2[0]) + Math.abs(color1[1] - color2[1]) + Math.abs(color1[2] - color2[2]);

            const sum = MAX_RGB_NUMBER * color1.length;
            return difference <= (this.tolerance / MAX_PERCENTAGE) * sum;
        }
    }

    isValidPosition(pixel: Coords2D): boolean {
        return pixel.x >= 0 && pixel.x < this.maxX && pixel.y >= 0 && pixel.y < this.maxY;
    }

    getPixelColor(pixel: Coords2D): number[] {
        let index: number = RGBA_ARRAY_LENGTH * (pixel.x + pixel.y * this.maxX);
        const r: number = this.data[index++];
        const g: number = this.data[index++];
        const b: number = this.data[index];
        return [r, g, b];
    }
}
