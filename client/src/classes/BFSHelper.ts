import { Coords2D } from './Coords2D';
import { AttributesManagerService } from 'src/app/services/tools/attributes-manager/attributes-manager.service';

export class BFSHelper {
    maxX: number;
    maxY: number;
    context2D: CanvasRenderingContext2D;
    visited: Set<string>;
    queue: Array<Coords2D>;
    bodyGrid: Map<number, Array<number>>;
    strokeGrid: Map<number, Array<number>>;
    tolerance: number;
    mostLeft: number;
    mostRight: number;

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
        let targetColor: Uint8ClampedArray = this.getPixelColor(clickPosition);

        this.visited.add(JSON.stringify(clickPosition));
        this.queue.push(clickPosition);

        while (this.queue.length > 0) {
            let pixel: Coords2D = this.queue.shift()!;

            this.mostLeft = pixel.x < this.mostLeft ? pixel.x : this.mostLeft;
            this.mostRight = pixel.x > this.mostRight ? pixel.x : this.mostRight;

            if (this.isSameColor(this.getPixelColor(pixel), targetColor)) {
                this.addPixelToMap(pixel, this.bodyGrid);
            } else {
                continue;
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
                if (!this.isValidPosition(neighborPixel)) {
                    this.addPixelToMap(neighborPixel, this.strokeGrid);
                    continue;
                }
                if (this.isSameColor(this.getPixelColor(neighborPixel), targetColor)) {
                    this.queue.push(neighborPixel);
                    this.visited.add(JSON.stringify(neighborPixel));
                } else {
                    this.addPixelToMap(neighborPixel, this.strokeGrid);
                }
            }
        }
    }

    addPixelToMap(pixel: Coords2D, map: Map<number, Array<number>>): void {
        if (map.has(pixel.x)) {
            map.get(pixel.x)!.push(pixel.y);
        } else {
            map.set(pixel.x, [pixel.y]);
        }
    }

    isSameColor(color1: Uint8ClampedArray, color2: Uint8ClampedArray): boolean {
        if (this.tolerance === 0) {
            return color1[0] === color2[0] && color1[1] === color2[1] && color1[2] === color2[2];
        } else {
            let difference = Math.sqrt(
                (Math.abs(color1[0] - color2[0]) ^ 2) +
                    (Math.abs(color1[1] - color2[1]) ^ 2) +
                    (Math.abs(color1[2] - color2[2]) ^ 2),
            );
            let sommum = 255 * 3;
            return difference <= (this.tolerance / 100) * sommum;
        }
    }

    isStroke(pixel: Coords2D, targetColor: Uint8ClampedArray): boolean {
        let neighborPixels = [
            new Coords2D(pixel.x - 1, pixel.y),
            new Coords2D(pixel.x + 1, pixel.y),
            new Coords2D(pixel.x, pixel.y - 1),
            new Coords2D(pixel.x, pixel.y + 1),
        ];
        let isStroke = false;
        neighborPixels.forEach((neighborPixel: Coords2D) => {
            if (!this.isSameColor(this.getPixelColor(neighborPixel), targetColor)) {
                isStroke = true;
            }
        });

        return isStroke;
    }

    isValidPosition(pixel: Coords2D): boolean {
        return pixel.x >= 0 && pixel.x < this.maxX && pixel.y >= 0 && pixel.y < this.maxY;
    }

    getPixelColor(clickPosition: Coords2D): Uint8ClampedArray {
        return this.context2D.getImageData(clickPosition.x, clickPosition.y, 1, 1).data;
    }
}
