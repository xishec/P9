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

    changeDrawingInfo(width: number, height: number, color: string) {
        this.drawingInfo.value.width = width;
        this.drawingInfo.value.height = height;
        this.drawingInfo.value.color = color;
        this.drawingInfo.next(this.drawingInfo.value);
    }
}
