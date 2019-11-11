import { getTestBed, TestBed } from '@angular/core/testing';

import { BehaviorSubject } from 'rxjs';
import { GRID_SIZE_DECREMENT, GRID_SIZE_INCREMENT, GridOpacity, GridSize } from 'src/constants/tool-constants';
import { DrawingLoaderService } from '../../server/drawing-loader/drawing-loader.service';
import { GridToolService } from './grid-tool.service';

describe('GridToolService', () => {
    let injector: TestBed;
    let service: GridToolService;
    const AVERAGE_SIZE = (GridSize.Min + GridSize.Max) / 2;
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
        const ARGUMENT = AVERAGE_SIZE === GridSize.Default ? AVERAGE_SIZE / 2 : AVERAGE_SIZE;
        const OLD_VALUE = service.size.value;

        service.changeSize(ARGUMENT);

        expect(service.size.value).toEqual(ARGUMENT);
        expect(service.size.value).not.toEqual(OLD_VALUE);
    });

    // tslint:disable-next-line: max-line-length
    it(`incrementSize should call changeSize with argument size + ${GRID_SIZE_INCREMENT} if size + ${GRID_SIZE_INCREMENT}  <= ${GridSize.Max}`, () => {
        const SPY = spyOn(service, 'changeSize');
        service.size.next(GridSize.Default);
        const ARGUMENT = service.size.value + GRID_SIZE_INCREMENT;

        service.incrementSize();

        expect(SPY).toHaveBeenCalledWith(ARGUMENT);
    });

    it(`incrementSize should call changeSize with argument ${GridSize.Max} if size + ${GRID_SIZE_INCREMENT}  > ${GridSize.Max}`, () => {
        const SPY = spyOn(service, 'changeSize');
        service.size.next(GridSize.Default + GridSize.Max);

        service.incrementSize();

        expect(SPY).toHaveBeenCalledWith(GridSize.Max);
    });

    // tslint:disable-next-line: max-line-length
    it(`decrementSize should call changeSize with argument size - ${GRID_SIZE_DECREMENT} if size - ${GRID_SIZE_DECREMENT}  >= ${GridSize.Min}`, () => {
        const SPY = spyOn(service, 'changeSize');
        service.size.next(GridSize.Default);
        const ARGUMENT = service.size.value - GRID_SIZE_DECREMENT;

        service.decrementSize();

        expect(SPY).toHaveBeenCalledWith(ARGUMENT);
    });

    it(`decrementSize should call changeSize with argument ${GridSize.Min} if size - ${GRID_SIZE_DECREMENT}  < ${GridSize.Max}`, () => {
        const SPY = spyOn(service, 'changeSize');
        service.size.next(GridSize.Default - GridSize.Min);

        service.decrementSize();

        expect(SPY).toHaveBeenCalledWith(GridSize.Min);
    });

    it('changeOpacity should change the opacity with value of his argument', () => {
        const AVERAGE_OPACITY = (GridOpacity.Min + GridOpacity.Max) / 2;
        const OLD_VALUE = service.opacity.value;

        service.changeOpacity(AVERAGE_OPACITY);

        expect(service.opacity.value).toEqual(AVERAGE_OPACITY);
        expect(service.opacity.value).not.toEqual(OLD_VALUE);
    });
});
