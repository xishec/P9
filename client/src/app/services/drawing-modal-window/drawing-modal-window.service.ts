import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

import { Color } from '../../../classes/Color';
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
    private activeColor: BehaviorSubject<Color> = new BehaviorSubject(COLORS[0]);

    currentInfo: Observable<DrawingInfo> = this.infoSource.asObservable();
    currentDisplayNewDrawingModalWindow: Observable<boolean> = this.displayNewDrawingModalWindow.asObservable();
    currentActiveColor: Observable<Color> = this.activeColor.asObservable();

    changeInfo(drawingInfo: DrawingInfo) {
        this.infoSource.next(drawingInfo);
    }
    changeDisplayNewDrawingModalWindow(displayNewDrawingModalWindow: boolean) {
        this.displayNewDrawingModalWindow.next(displayNewDrawingModalWindow);
    }
    changeActiveColor(activeColor: Color) {
        this.activeColor.next(activeColor);
    }
}
