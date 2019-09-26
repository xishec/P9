import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

import { DrawingInfo } from '../../../classes/DrawingInfo';
import { COLORS } from '../constants';

@Injectable({
    providedIn: 'root',
})
export class DrawingModalWindowService {
    private infoSource: BehaviorSubject<DrawingInfo> = new BehaviorSubject({
        width: 0,
        height: 0,
        color: COLORS[0],
        opacity: 1,
    });
    private displayNewDrawingModalWindow: BehaviorSubject<boolean> = new BehaviorSubject(false);

    currentInfo: Observable<DrawingInfo> = this.infoSource.asObservable();
    currentDisplayNewDrawingModalWindow: Observable<boolean> = this.displayNewDrawingModalWindow.asObservable();

    changeInfo(drawingInfo: DrawingInfo) {
        this.infoSource.next(drawingInfo);
    }
    changeDisplayNewDrawingModalWindow(displayNewDrawingModalWindow: boolean) {
        this.displayNewDrawingModalWindow.next(displayNewDrawingModalWindow);
    }
}
