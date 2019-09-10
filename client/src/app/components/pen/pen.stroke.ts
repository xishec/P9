import { Coordinate } from './pen.coordinate';

export class Stroke {
    coordinates: Coordinate[];
    pathString: string;
    width: number;
    constructor(x: number, y: number, width: number) {
        this.width = width;
        this.coordinates = []; // IS THIS NECESSARY ?
        this.addCoordinate(x, y);
        this.pathString = `M${x} ${y}`;
    }
    addCoordinate(x: number, y: number){
        this.coordinates.push(new Coordinate(x, y));
        this.pathString += ` L${x} ${y}`;
    }
}
