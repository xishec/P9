// import { BehaviorSubject } from 'rxjs';

// import { AttributesManagerService } from 'src/app/services/tools/attributes-manager/attributes-manager.service';
// import { BFSHelper } from './BFSHelper';
// import { Coords2D } from './Coords2D';

// describe('Selection', () => {
//     let bfsHelper: BFSHelper;

//     beforeEach(() => {
//         const mockContext = ({
//             drawImage: () => null,
//             getImageData: (x: number, y: number, sw: number, sh: number) => {
//                 const mockImageData = {};
//                 return (mockImageData as unknown) as ImageData;
//             },
//         } as unknown) as CanvasRenderingContext2D;
//         const attributesManagerService = { tolerance: new BehaviorSubject(1) } as AttributesManagerService;

//         bfsHelper = new BFSHelper(10, 10, mockContext, attributesManagerService);
//     });

//     it('should be created', () => {
//         expect(bfsHelper).toBeTruthy();
//     });

//     it('should sort BodyGrid on call sortBodyGrid', () => {
//         bfsHelper.bodyGrid = new Map([[1, [7, 9, 8]]]);
//         bfsHelper.sortBodyGrid();
//         const sorted = bfsHelper.bodyGrid.get(1) as number[];
//         expect(sorted).toEqual([7, 8, 9]);
//     });

//     it('should add Pixel To Map with push on call addPixelToMap', () => {
//         bfsHelper.bodyGrid = new Map([[1, [7, 9, 8]]]);
//         bfsHelper.addPixelToMap(new Coords2D(1, 1), bfsHelper.bodyGrid);
//         const data = bfsHelper.bodyGrid.get(1) as number[];
//         expect(data).toEqual([7, 9, 8, 1]);
//     });
//     it('should add Pixel To Map with set on call addPixelToMap', () => {
//         bfsHelper.bodyGrid = new Map([[1, [7, 9, 8]]]);
//         bfsHelper.addPixelToMap(new Coords2D(2, 1), bfsHelper.bodyGrid);
//         const data = bfsHelper.bodyGrid.get(2) as number[];
//         expect(data).toEqual([1]);
//     });

//     it('should return false on call isSameColor with tolerance 0', () => {
//         bfsHelper.tolerance = 0;
//         expect(bfsHelper.isSameColor([0, 0, 0], [10, 110, 11])).toEqual(false);
//     });
//     it('should return true on call isSameColor with tolerance 0', () => {
//         bfsHelper.tolerance = 0;
//         expect(bfsHelper.isSameColor([10, 110, 11], [10, 110, 11])).toEqual(true);
//     });

//     it('should return false on call isSameColor with tolerance 20', () => {
//         bfsHelper.tolerance = 20;
//         expect(bfsHelper.isSameColor([0, 0, 0], [200, 200, 200])).toEqual(false);
//     });
//     it('should return true on call isSameColor with tolerance 20', () => {
//         bfsHelper.tolerance = 20;
//         expect(bfsHelper.isSameColor([10, 110, 11], [10, 110, 12])).toEqual(true);
//     });

//     it('should return true on call isValidPosition', () => {
//         bfsHelper.maxX = 100;
//         bfsHelper.maxY = 100;
//         expect(bfsHelper.isValidPosition(new Coords2D(0, 0))).toEqual(true);
//     });
//     it('should return false on call isValidPosition', () => {
//         bfsHelper.maxX = 100;
//         bfsHelper.maxY = 100;
//         expect(bfsHelper.isValidPosition(new Coords2D(1110, 1110))).toEqual(false);
//     });

//     it('should return color on call getPixelColor', () => {
//         bfsHelper.data = ([0, 1, 2] as unknown) as Uint8ClampedArray;
//         bfsHelper.maxX = 0;
//         const data = bfsHelper.getPixelColor(new Coords2D(0, 0));
//         expect(data[0]).toEqual(0);
//         expect(data[1]).toEqual(1);
//         expect(data[2]).toEqual(2);
//     });

//     it('should compute BFS on call computeBFS', () => {
//         bfsHelper.getPixelColor = () => [10, 110, 11];
//         let counter = 0;
//         bfsHelper.isSameColor = () => {
//             return counter++ < 2;
//         };
//         bfsHelper.isValidPosition = (point: Coords2D) => {
//             return point.x === 1110 || point.x === 1111;
//         };

//         const spy = spyOn(bfsHelper, 'sortBodyGrid');
//         bfsHelper.computeBFS(new Coords2D(1110, 1110));
//         expect(spy).toHaveBeenCalled();
//     });

//     it('should compute BFS on call computeBFS and call continue', () => {
//         bfsHelper.getPixelColor = () => [10, 110, 11];
//         bfsHelper.isSameColor = () => false;

//         const spy = spyOn(bfsHelper, 'sortBodyGrid');
//         bfsHelper.computeBFS(new Coords2D(1110, 1110));
//         expect(spy).toHaveBeenCalled();
//     });

//     it('should compute BFS on call computeBFS having a visited node', () => {
//         bfsHelper.getPixelColor = () => [10, 110, 11];
//         bfsHelper.isSameColor = () => true;
//         const point: Coords2D = new Coords2D(1111, 1110);
//         bfsHelper.visited.add(JSON.stringify(point));

//         const spy = spyOn(bfsHelper, 'sortBodyGrid');
//         bfsHelper.computeBFS(new Coords2D(1110, 1110));
//         expect(spy).toHaveBeenCalled();
//     });
// });
