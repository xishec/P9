export class Coords2D {
    x: number;
    y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    distanceTo(point: Coords2D): number {
        return Math.sqrt((Math.abs(point.x - this.x) ^ 2) + (Math.abs(point.y - this.y) ^ 2));
    }
}
