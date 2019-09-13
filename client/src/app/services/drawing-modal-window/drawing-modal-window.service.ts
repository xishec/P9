import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { DrawingInfo } from '../../../classes/DrawingInfo';
import { CONSTANTS } from '../../components/app/CONSTANTS';

@Injectable({
    providedIn: 'root',
})
export class DrawingModalWindowService {
    private infoSource: BehaviorSubject<DrawingInfo> = new BehaviorSubject({
        width: 0,
        height: 0,
        color: CONSTANTS.COLORS[0],
        opacity: 1,
    });
    private ifShowWindow: BehaviorSubject<boolean> = new BehaviorSubject(true);

    currentInfo = this.infoSource.asObservable();
    currentIfShowWindow = this.ifShowWindow.asObservable();

    changeInfo(drawingInfo: DrawingInfo) {
        this.infoSource.next(drawingInfo);
    }
    changeIfShowWindow(ifShowWindow: boolean) {
        this.ifShowWindow.next(ifShowWindow);
    }
}
