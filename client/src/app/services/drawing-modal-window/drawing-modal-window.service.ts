import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

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
    private activeColor: BehaviorSubject<Color> = new BehaviorSubject(new Color());

    currentInfo = this.infoSource.asObservable();
    currentDisplayNewDrawingModalWindow = this.displayNewDrawingModalWindow.asObservable();
    currentActiveColor = this.activeColor.asObservable();

    changeInfo(drawingInfo: DrawingInfo) {
        this.infoSource.next(drawingInfo);
    }
    changeDisplayNewDrawingModalWindow(displayNewDrawingModalWindow: boolean) {
        this.displayNewDrawingModalWindow.next(displayNewDrawingModalWindow);
    }
    changeActiveColor(activeColor: Color) {
        this.activeColor.next(activeColor);
    }

    rgbToHex(R: number, G: number, B: number): string {
        let r = Number(Math.ceil(R)).toString(16);
        let g = Number(Math.ceil(G)).toString(16);
        let b = Number(Math.ceil(B)).toString(16);
        if (r.length === 1) {
            r = '0' + r;
        }
        if (g.length === 1) {
            g = '0' + g;
        }
        if (b.length === 1) {
            b = '0' + b;
        }
        return r + g + b;
    }
}
