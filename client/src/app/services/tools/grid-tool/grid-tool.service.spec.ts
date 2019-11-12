import { getTestBed, TestBed } from '@angular/core/testing';


import { BehaviorSubject } from 'rxjs';
import { DrawingLoaderService } from '../../server/drawing-loader/drawing-loader.service';
import { GRID_OPACITY, GRID_SIZE, GRID_SIZE_DECREMENT, GRID_SIZE_INCREMENT } from 'src/constants/tool-constants';
import { GridToolService } from './grid-tool.service';

describe('GridToolService', () => {
    let injector: TestBed;
    let service: GridToolService;
    const AVERAGE_SIZE = (GRID_SIZE.Min + GRID_SIZE.Max) / 2;
    let drawingLoaderService: DrawingLoaderService;


    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                GridToolService,
                {
                    provide: DrawingLoaderService,
                    useValue: {
                        emptyDrawStack: new BehaviorSubject<boolean>(true),
                    },
                },
            ],
        });
        injector = getTestBed();
        service = injector.get(GridToolService);
        drawingLoaderService = injector.get(DrawingLoaderService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('changeState should change the state if workzone is not empty', () => {
        drawingLoaderService.emptyDrawStack.next(false);
        service.changeState(true);

        expect(service.state.value).toBeTruthy();
    });

    it('changeState should not change the state if workzone is empty', () => {
        drawingLoaderService.emptyDrawStack.next(true);
        service.changeState(true);

        expect(service.state.value).toBeFalsy();
    });

    it('switchState should call changeState with the argument false if state is true', () => {
        const SPY = spyOn(service, 'changeState');

        service.state.next(true);

        service.switchState();

        expect(SPY).toHaveBeenCalledWith(false);
    });

    it('switchState should call changeState with the argument true if state is false', () => {
        const SPY = spyOn(service, 'changeState');

        service.state.next(false);

        service.switchState();

        expect(SPY).toHaveBeenCalledWith(true);
    });

    it('changeSize should change the size with value of his argument', () => {
        const ARGUMENT = AVERAGE_SIZE === GRID_SIZE.Default ? AVERAGE_SIZE / 2 : AVERAGE_SIZE;
        const OLD_VALUE = service.size.value;

        service.changeSize(ARGUMENT);

        expect(service.size.value).toEqual(ARGUMENT);
        expect(service.size.value).not.toEqual(OLD_VALUE);
    });

    // tslint:disable-next-line: max-line-length
    it(`incrementSize should call changeSize with argument size + ${GRID_SIZE_INCREMENT} if size + ${GRID_SIZE_INCREMENT}  <= ${GRID_SIZE.Max}`, () => {
        const SPY = spyOn(service, 'changeSize');
        service.size.next(GRID_SIZE.Default);
        const ARGUMENT = service.size.value + GRID_SIZE_INCREMENT;

        service.incrementSize();

        expect(SPY).toHaveBeenCalledWith(ARGUMENT);
    });

    it(`incrementSize should call changeSize with argument ${GRID_SIZE.Max} if size + ${GRID_SIZE_INCREMENT}  > ${GRID_SIZE.Max}`, () => {
        const SPY = spyOn(service, 'changeSize');
        service.size.next(GRID_SIZE.Default + GRID_SIZE.Max);

        service.incrementSize();

        expect(SPY).toHaveBeenCalledWith(GRID_SIZE.Max);
    });

    // tslint:disable-next-line: max-line-length
    it(`decrementSize should call changeSize with argument size - ${GRID_SIZE_DECREMENT} if size - ${GRID_SIZE_DECREMENT}  >= ${GRID_SIZE.Min}`, () => {
        const SPY = spyOn(service, 'changeSize');
        service.size.next(GRID_SIZE.Default);
        const ARGUMENT = service.size.value - GRID_SIZE_DECREMENT;

        service.decrementSize();

        expect(SPY).toHaveBeenCalledWith(ARGUMENT);
    });

    it(`decrementSize should call changeSize with argument ${GRID_SIZE.Min} if size - ${GRID_SIZE_DECREMENT}  < ${GRID_SIZE.Max}`, () => {
        const SPY = spyOn(service, 'changeSize');
        service.size.next(GRID_SIZE.Default - GRID_SIZE.Min);

        service.decrementSize();

        expect(SPY).toHaveBeenCalledWith(GRID_SIZE.Min);
    });

    it('changeOpacity should change the opacity with value of his argument', () => {
        const AVERAGE_OPACITY = (GRID_OPACITY.Min + GRID_OPACITY.Max) / 2;
        const OLD_VALUE = service.opacity.value;

        service.changeOpacity(AVERAGE_OPACITY);

        expect(service.opacity.value).toEqual(AVERAGE_OPACITY);
        expect(service.opacity.value).not.toEqual(OLD_VALUE);
    });
});
