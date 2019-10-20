import { TestBed, getTestBed } from '@angular/core/testing';

import { GridToolService } from './grid-tool.service';
import { GridSize, GRID_SIZE_INCREMENT, GRID_SIZE_DECREMENT, GridOpacity } from 'src/constants/tool-constants';

describe('GridToolService', () => {
    let injector: TestBed;
    let service: GridToolService;
    const AVERAGE_SIZE = (GridSize.Min + GridSize.Max) / 2;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [GridToolService],
        });
        injector = getTestBed();
        service = injector.get(GridToolService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('changeState should change the state if workzone is not empty', () => {
        service.workzoneIsEmpty.next(false);

        service.changeState(true);

        expect(service.state.value).toBeTruthy();
    });

    it('changeState should not change the state if workzone is empty', () => {
        service.workzoneIsEmpty.next(true);

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
