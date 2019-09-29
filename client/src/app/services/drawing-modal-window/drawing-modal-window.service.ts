import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

import { COLORS } from 'src/constants/color-constants';
import { DrawingInfo } from '../../../classes/DrawingInfo';

@Injectable({
    providedIn: 'root',
})
export class DrawingModalWindowService {
    private drawingInfo: BehaviorSubject<DrawingInfo> = new BehaviorSubject({
        width: 0,
        height: 0,
        color: COLORS[0],
    });
    private displayNewDrawingModalWindow: BehaviorSubject<boolean> = new BehaviorSubject(false);
    private blankDrawingZone = new BehaviorSubject(true);

    currentInfo: Observable<DrawingInfo> = this.drawingInfo.asObservable();
    currentDisplayNewDrawingModalWindow: Observable<boolean> = this.displayNewDrawingModalWindow.asObservable();
    currentBlankDrawingZone: Observable<boolean> = this.blankDrawingZone.asObservable();

    changeInfo(drawingInfo: DrawingInfo) {
        this.drawingInfo.next(drawingInfo);
    }

    changeDrawingInfoWidthHeight(width: number, height: number) {
        this.drawingInfo.value.width = width;
        this.drawingInfo.value.height = height;
        this.drawingInfo.next(this.drawingInfo.value);
    }

    changeDisplayNewDrawingModalWindow(displayNewDrawingModalWindow: boolean) {
        this.displayNewDrawingModalWindow.next(displayNewDrawingModalWindow);
    }

    setBlankDrawingZone(isBlank: boolean): void {
        this.blankDrawingZone.next(isBlank);
    }
}
