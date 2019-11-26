export class Coords2D {
    x: number;
    y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    distanceTo(point: Coords2D): number {
        return Math.pow(point.x - this.x, 2) + Math.pow(point.y - this.y, 2);
    }

    isValide(): boolean {
        return this.x >= 0 && this.y >= 0;
    }

    setCoords(coords2D: Coords2D): void {
        this.x = coords2D.x;
        this.y = coords2D.y;
    }

    clone(): Coords2D {
        return new Coords2D(this.x, this.y);
    }
}
