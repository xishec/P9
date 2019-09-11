import {Coordinate} from './coordinate';

export class Stroke {
    coordinates: Coordinate[];
    constructor(x: number, y: number) {
        this.coordinates = []; // NOT SURE IF NECESSARY
        this.addCoordinate(x, y);
    }

    addCoordinate(x: number, y: number) {
        this.coordinates.push(new Coordinate(x, y));
    }
}
