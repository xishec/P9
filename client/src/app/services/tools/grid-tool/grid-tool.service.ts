import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { GridOpacity, GridSize, GRID_SIZE_INCREMENT, GRID_SIZE_DECREMENT } from 'src/constants/tool-constants';
import { DrawingModalWindowService } from '../../drawing-modal-window/drawing-modal-window.service';
import { MatSliderChange } from '@angular/material';

@Injectable({
    providedIn: 'root',
})
export class GridToolService {
    workzoneIsEmpty = true;

    constructor(private drawingModalWindowService: DrawingModalWindowService) {
        this.drawingModalWindowService.drawingInfo.subscribe(() => {
            this.workzoneIsEmpty = false;
        });
        this.workzoneIsEmpty = true;
    }

    state: BehaviorSubject<boolean> = new BehaviorSubject(false);
    size: BehaviorSubject<number> = new BehaviorSubject(GridSize.Default);
    opacity: BehaviorSubject<number> = new BehaviorSubject(GridOpacity.Max);

    currentState: Observable<boolean> = this.state.asObservable();
    currentSize: Observable<number> = this.size.asObservable();
    currentOpacity: Observable<number> = this.opacity.asObservable();

    eventIsValid<T>(event: MatSliderChange, range: T): boolean {
        const value = event.value;
        // @ts-ignore
        if (value !== null) {
            return this.IsBetween(value, range);
        } else {
            return false;
        }
    }

    IsBetween<T>(value: number | boolean, range: T): boolean {
        // @ts-ignore
        return value >= range.Min && value <= range.Max;
    }

    changeState(state: boolean) {
        if (this.workzoneIsEmpty === false) {
            this.state.next(state);
        }
    }

    switchState() {
        this.state.value ? this.changeState(false) : this.changeState(true);
    }

    changeSize(size: number) {
        this.size.next(size);
    }

    incrementSize() {
        const gridSize = this.size.value;
        if (this.size.value + GRID_SIZE_INCREMENT <= GridSize.Max) {
            this.changeSize(gridSize + GRID_SIZE_INCREMENT);
        } else {
            this.changeSize(GridSize.Max);
        }
    }

    decrementSize() {
        const gridSize = this.size.value;
        if (gridSize - GRID_SIZE_DECREMENT >= GridSize.Min) {
            this.changeSize(gridSize - GRID_SIZE_DECREMENT);
        } else {
            this.changeSize(GridSize.Min);
        }
    }

    changeOpacity(opacity: number) {
        this.opacity.next(opacity);
    }
}
