import { AttributesManagerService } from 'src/app/services/tools/attributes-manager/attributes-manager.service';
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
        this.strokes = [];
        this.strokesSet = new Set([]);

        attributesManagerService.tolerance.subscribe((tolerance: number) => {
            this.tolerance = tolerance;
        });
    }

    computeBFS(clickPosition: Coords2D): void {
        console.time('bfs');
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
        console.timeEnd('bfs');

        console.time('dfs');
        this.dfs();
        console.timeEnd('dfs');
    }

    dfs() {
        this.pathsToFill = [];
        let tmp = [];
        this.visited = new Set([]);

        let pixel: Coords2D = new Coords2D(-1, -1);
        for (let el of this.strokes) {
            if (!this.visited.has(`${el.x} ${el.y}`)) {
                pixel = el;
                break;
            }
        }
        this.visited.add(`${pixel.x} ${pixel.y}`);

        while (pixel.x >= 0 && pixel.x >= 0) {
            tmp.push(pixel);
            let closestNeighbor: Coords2D = new Coords2D(-1, -1);

            const neighborPixels = [
                new Coords2D(pixel.x - 1, pixel.y),
                new Coords2D(pixel.x + 1, pixel.y),
                new Coords2D(pixel.x, pixel.y - 1),
                new Coords2D(pixel.x, pixel.y + 1),
            ];
            neighborPixels.forEach((neighborPixel: Coords2D) => {
                if (
                    this.strokesSet.has(`${neighborPixel.x} ${neighborPixel.y}`) &&
                    !this.visited.has(`${neighborPixel.x} ${neighborPixel.y}`)
                ) {
                    closestNeighbor = neighborPixel;
                }
            });

            if (closestNeighbor.x === -1 && closestNeighbor.x === -1) {
                const neighborPixels = [
                    new Coords2D(pixel.x - 1, pixel.y - 1),
                    new Coords2D(pixel.x - 1, pixel.y + 1),
                    new Coords2D(pixel.x + 1, pixel.y - 1),
                    new Coords2D(pixel.x + 1, pixel.y + 1),
                ];
                neighborPixels.forEach((neighborPixel: Coords2D) => {
                    if (
                        this.strokesSet.has(`${neighborPixel.x} ${neighborPixel.y}`) &&
                        !this.visited.has(`${neighborPixel.x} ${neighborPixel.y}`)
                    ) {
                        closestNeighbor = neighborPixel;
                    }
                });
            }

            if (closestNeighbor.x === -1 && closestNeighbor.x === -1) {
                let closestNeighborDistance = Number.MAX_SAFE_INTEGER;
                this.strokes.forEach((el: Coords2D) => {
                    if (!this.visited.has(`${el.x} ${el.y}`)) {
                        let distance = el.distanceTo(pixel);

                        if (distance < closestNeighborDistance) {
                            closestNeighborDistance = distance;
                            closestNeighbor = el;
                        }
                    }
                });

                if (closestNeighborDistance > 100) {
                    this.pathsToFill.push(tmp);
                    tmp = [];
                }
            }

            this.visited.add(`${closestNeighbor.x} ${closestNeighbor.y}`);
            pixel = closestNeighbor;
        }

        this.pathsToFill.push(tmp);
        tmp = [];
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
