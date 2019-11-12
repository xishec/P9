import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { GRID_SIZE_DECREMENT, GRID_SIZE_INCREMENT, GridOpacity, GridSize } from 'src/constants/tool-constants';
import { DrawingModalWindowService } from '../../drawing-modal-window/drawing-modal-window.service';

@Injectable({
    providedIn: 'root',
})
export class GridToolService {
    constructor(private drawingModalWindowService: DrawingModalWindowService) {
        this.drawingModalWindowService.drawingInfo.subscribe(() => {
            this.workzoneIsEmpty.next(false);
        });
        this.workzoneIsEmpty.next(true);
    }

    state: BehaviorSubject<boolean> = new BehaviorSubject(false);
    size: BehaviorSubject<number> = new BehaviorSubject(GridSize.Default);
    opacity: BehaviorSubject<number> = new BehaviorSubject(GridOpacity.Max);
    workzoneIsEmpty: BehaviorSubject<boolean> = new BehaviorSubject(true);

    currentState: Observable<boolean> = this.state.asObservable();
    currentSize: Observable<number> = this.size.asObservable();
    currentOpacity: Observable<number> = this.opacity.asObservable();
    currentWorkzoneIsEmpty: Observable<boolean> = this.workzoneIsEmpty.asObservable();

    changeState(state: boolean): void {
        if (!this.workzoneIsEmpty.value) {
            this.state.next(state);
        }
    }

    switchState(): void {
        this.state.value ? this.changeState(false) : this.changeState(true);
    }

    changeSize(size: number): void {
        this.size.next(size);
    }

    incrementSize(): void {
        const gridSize = this.size.value;
        if (this.size.value + GRID_SIZE_INCREMENT <= GridSize.Max) {
            this.changeSize(gridSize + GRID_SIZE_INCREMENT);
        } else {
            this.changeSize(GridSize.Max);
        }
    }

    decrementSize(): void {
        const gridSize = this.size.value;
        if (gridSize - GRID_SIZE_DECREMENT >= GridSize.Min) {
            this.changeSize(gridSize - GRID_SIZE_DECREMENT);
        } else {
            this.changeSize(GridSize.Min);
        }
    }

    changeOpacity(opacity: number): void {
        this.opacity.next(opacity);
    }
}
