import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { GridOpacity, GridSize } from 'src/constants/tool-constants';
import { DrawingModalWindowService } from '../../drawing-modal-window/drawing-modal-window.service';

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

    changeState(state: boolean) {
        if (this.workzoneIsEmpty === false) {
            this.state.next(state);
        }
    }

    changeSize(size: number) {
        this.size.next(size);
    }

    changeOpacity(opacity: number) {
        this.opacity.next(opacity);
    }
}
