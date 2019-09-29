import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

import { DrawingInfo } from '../../../classes/DrawingInfo';
import { DEFAULT_WHITE } from 'src/constants/color-constants';

@Injectable({
    providedIn: 'root',
})
export class DrawingModalWindowService {
    private displayNewDrawingModalWindow: BehaviorSubject<boolean> = new BehaviorSubject(false);
    private blankDrawingZone = new BehaviorSubject(true);

    drawingInfo: BehaviorSubject<DrawingInfo> = new BehaviorSubject<DrawingInfo>(new DrawingInfo(0, 0, DEFAULT_WHITE));
    currentDisplayNewDrawingModalWindow: Observable<boolean> = this.displayNewDrawingModalWindow.asObservable();
    currentBlankDrawingZone: Observable<boolean> = this.blankDrawingZone.asObservable();

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
