import { BehaviorSubject } from 'rxjs';

import { AttributesManagerService } from 'src/app/services/tools/attributes-manager/attributes-manager.service';
import { BFSHelper } from './BFSHelper';
import { Coords2D } from './Coords2D';

describe('Selection', () => {
    let bfsHelper: BFSHelper;

    beforeEach(() => {
        const mockContext = ({
            drawImage: () => null,
            getImageData: (x: number, y: number, sw: number, sh: number) => {
                const mockImageData = {};
                return (mockImageData as unknown) as ImageData;
            },
        } as unknown) as CanvasRenderingContext2D;
        const attributesManagerService = { tolerance: new BehaviorSubject(1) } as AttributesManagerService;

        bfsHelper = new BFSHelper(10, 10, mockContext, attributesManagerService);
    });

    it('should be created', () => {
        expect(bfsHelper).toBeTruthy();
    });

    it('should return false on call isSameColor with tolerance 0', () => {
        bfsHelper[`tolerance`] = 0;
        expect(bfsHelper[`isSameColor`]([0, 0, 0], [10, 110, 11])).toEqual(false);
    });
    it('should return true on call isSameColor with tolerance 0', () => {
        bfsHelper[`tolerance`] = 0;
        expect(bfsHelper[`isSameColor`]([10, 110, 11], [10, 110, 11])).toEqual(true);
    });

    it('should return false on call isSameColor with tolerance 20', () => {
        bfsHelper[`tolerance`] = 20;
        expect(bfsHelper[`isSameColor`]([0, 0, 0], [200, 200, 200])).toEqual(false);
    });
    it('should return true on call isSameColor with tolerance 20', () => {
        bfsHelper[`tolerance`] = 20;
        expect(bfsHelper[`isSameColor`]([10, 110, 11], [10, 110, 12])).toEqual(true);
    });

    it('should return true on call isValidPosition', () => {
        bfsHelper[`maxX`] = 100;
        bfsHelper[`maxY`] = 100;
        expect(bfsHelper[`isValidPosition`](new Coords2D(0, 0))).toEqual(true);
    });
    it('should return false on call isValidPosition', () => {
        bfsHelper[`maxX`] = 100;
        bfsHelper[`maxY`] = 100;
        expect(bfsHelper[`isValidPosition`](new Coords2D(1110, 1110))).toEqual(false);
    });

    it('should return color on call getPixelColor', () => {
        bfsHelper[`data`] = ([0, 1, 2] as unknown) as Uint8ClampedArray;
        bfsHelper[`maxX`] = 0;
        const data = bfsHelper[`getPixelColor`](new Coords2D(0, 0));
        expect(data[0]).toEqual(0);
        expect(data[1]).toEqual(1);
        expect(data[2]).toEqual(2);
    });

    it('should compute BFS on call computeBFS', () => {
        bfsHelper[`getPixelColor`] = () => [10, 110, 11];
        let counter = 0;
        bfsHelper[`isSameColor`] = () => {
            return counter++ < 2;
        };
        bfsHelper[`isValidPosition`] = () => {
            return true;
        };

        const spy = spyOn<any>(bfsHelper, 'createPathToFill');
        bfsHelper.computeBFS(new Coords2D(1110, 1110));
        expect(spy).toHaveBeenCalled();
    });

    it('should compute BFS on call computeBFS and call continue', () => {
        bfsHelper[`getPixelColor`] = () => [10, 110, 11];
        bfsHelper[`isSameColor`] = () => false;

        const spy = spyOn<any>(bfsHelper, 'createPathToFill');
        bfsHelper.computeBFS(new Coords2D(1110, 1110));
        expect(spy).toHaveBeenCalled();
    });

    it('should compute BFS on call computeBFS having a visited node', () => {
        bfsHelper[`getPixelColor`] = () => [10, 110, 11];
        bfsHelper[`isSameColor`] = () => true;
        bfsHelper[`visited`].add(`1109 1110`);

        const spy = spyOn<any>(bfsHelper, 'createPathToFill');
        bfsHelper.computeBFS(new Coords2D(1110, 1110));
        expect(spy).toHaveBeenCalled();
    });

    it('should search in array on call searchIn', () => {
        const pixel1 = new Coords2D(1110, 1110);
        const pixel2 = new Coords2D(11, 1110);
        const closestNeighbor = new Coords2D(-1, -1);
        bfsHelper[`strokesSet`] = new Set([`${pixel2.x} ${pixel2.y}`]);
        bfsHelper[`searchIn`]([pixel1, pixel2], closestNeighbor);
        expect(closestNeighbor.x).toEqual(11);
        expect(closestNeighbor.y).toEqual(1110);
    });

    it('should search In Direct Neighbors on call searchInDirectNeighbors', () => {
        const closestNeighbor = new Coords2D(-1, -1);
        bfsHelper[`strokesSet`] = new Set([`1110 1111`]);
        bfsHelper[`searchInDirectNeighbors`](new Coords2D(1110, 1110), closestNeighbor);
        expect(closestNeighbor.x).toEqual(1110);
        expect(closestNeighbor.y).toEqual(1111);
    });

    it('should search In Indirect Neighbors on call searchInIndirectNeighbors', () => {
        const closestNeighbor = new Coords2D(-1, -1);
        bfsHelper[`strokesSet`] = new Set([`1111 1111`]);
        bfsHelper[`searchInIndirectNeighbors`](new Coords2D(1110, 1110), closestNeighbor);
        expect(closestNeighbor.x).toEqual(1111);
        expect(closestNeighbor.y).toEqual(1111);
    });

    it('should find Closest Pixel on call findClosestPixel', () => {
        const closestNeighbor = new Coords2D(-1, -1);
        bfsHelper[`strokes`] = [new Coords2D(1, 2), new Coords2D(0, 1)];
        bfsHelper[`visited`] = new Set([]);
        bfsHelper[`pathsToFill`] = [];
        bfsHelper[`tmpPath`] = [];
        bfsHelper[`findClosestPixel`](new Coords2D(1, 1), closestNeighbor);
        expect(closestNeighbor.x).toEqual(1);
        expect(closestNeighbor.y).toEqual(2);
        expect(bfsHelper.pathsToFill.length).toEqual(0);
    });

    it('should update the Closest Neighbor on call updateClosestNeighbor', () => {
        const closestNeighbor = new Coords2D(-1, -1);
        bfsHelper[`searchInDirectNeighbors`] = () => null;
        bfsHelper[`searchInIndirectNeighbors`] = () => null;
        bfsHelper[`findClosestPixel`] = () => null;
        const spy1 = spyOn<any>(bfsHelper, 'searchInDirectNeighbors');
        const spy2 = spyOn<any>(bfsHelper, 'searchInIndirectNeighbors');
        const spy3 = spyOn<any>(bfsHelper, 'findClosestPixel');
        bfsHelper[`updateClosestNeighbor`](new Coords2D(1110, 1110), closestNeighbor);
        expect(spy1).toHaveBeenCalled();
        expect(spy2).toHaveBeenCalled();
        expect(spy3).toHaveBeenCalled();
    });

    it('should update the Closest Neighbor on call updateClosestNeighbor, and found with searchInDirectNeighbors', () => {
        const closestNeighbor = new Coords2D(-1, -1);
        closestNeighbor.isValid = () => {
            return true;
        };
        const spy1 = spyOn<any>(bfsHelper, 'searchInDirectNeighbors');
        const spy2 = spyOn<any>(bfsHelper, 'searchInIndirectNeighbors');
        const spy3 = spyOn<any>(bfsHelper, 'findClosestPixel');
        bfsHelper[`updateClosestNeighbor`](new Coords2D(1110, 1110), closestNeighbor);
        expect(spy1).toHaveBeenCalled();
        expect(spy2).not.toHaveBeenCalled();
        expect(spy3).not.toHaveBeenCalled();
    });

    it('should update the Closest Neighbor on call updateClosestNeighbor, and found with searchInIndirectNeighbors', () => {
        const closestNeighbor = new Coords2D(-1, -1);
        let counter = 0;
        closestNeighbor.isValid = () => {
            return counter++ > 0;
        };
        const spy1 = spyOn<any>(bfsHelper, 'searchInDirectNeighbors');
        const spy2 = spyOn<any>(bfsHelper, 'searchInIndirectNeighbors');
        const spy3 = spyOn<any>(bfsHelper, 'findClosestPixel');
        bfsHelper[`updateClosestNeighbor`](new Coords2D(1110, 1110), closestNeighbor);
        expect(spy1).toHaveBeenCalled();
        expect(spy2).toHaveBeenCalled();
        expect(spy3).not.toHaveBeenCalled();
    });

    it('should create Path To Fill on call createPathToFill', () => {
        bfsHelper[`strokes`] = [new Coords2D(1, 1), new Coords2D(1, 2)];
        bfsHelper[`createPathToFill`]();
        expect(bfsHelper.pathsToFill.length).toEqual(2);
    });

    it('should not create Path To Fill on call createPathToFill', () => {
        bfsHelper[`strokes`] = [];
        bfsHelper.pathsToFill = [];
        bfsHelper[`createPathToFill`]();
        expect(bfsHelper.pathsToFill.length).toEqual(0);
    });
});
