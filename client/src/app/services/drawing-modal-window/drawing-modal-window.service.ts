import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

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

    private displayNewDrawingModalWindow: BehaviorSubject<boolean> = new BehaviorSubject(true);

    currentInfo = this.infoSource.asObservable();
    currentDisplayNewDrawingModalWindow = this.displayNewDrawingModalWindow.asObservable();

    changeInfo(drawingInfo: DrawingInfo) {
        this.infoSource.next(drawingInfo);
    }
    changeIfShowWindow(displayNewDrawingModalWindow: boolean) {
        this.displayNewDrawingModalWindow.next(displayNewDrawingModalWindow);
    }
}
