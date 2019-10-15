import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { DEFAULT_WHITE } from 'src/constants/color-constants';
import { DrawingInfo } from '../../../classes/DrawingInfo';

@Injectable({
    providedIn: 'root',
})
export class DrawingModalWindowService {
    drawingInfo: BehaviorSubject<DrawingInfo> = new BehaviorSubject<DrawingInfo>(new DrawingInfo(0, 0, DEFAULT_WHITE));
    blankDrawingZone: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);

    changeDrawingInfoWidthHeight(width: number, height: number) {
        this.drawingInfo.value.width = width;
        this.drawingInfo.value.height = height;
        this.drawingInfo.next(this.drawingInfo.value);
    }
}
