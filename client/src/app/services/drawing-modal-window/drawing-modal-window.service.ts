import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { Color } from '../../../class/Color';
import { DrawingInfo } from '../../../class/DrawingInfo';

@Injectable({
    providedIn: 'root',
})
export class DrawingModalWindow {
    colors: Color[] = [
        { hex: 'ffffff' },
        { hex: 'bbbbbb' },
        { hex: '888888' },
        { hex: '000000' },
        { hex: 'a970eb' },
        { hex: 'eb70e9' },
        { hex: 'eb70a7' },
        { hex: 'eb7070' },
        { hex: 'fec771' },
        { hex: 'e6e56c' },
        { hex: '64e291' },
        { hex: '07e4f0' },
        { hex: '077bf0' },
        { hex: '5057de' },
    ];

    private infoSource: BehaviorSubject<DrawingInfo> = new BehaviorSubject({
        width: 0,
        height: 0,
        color: this.colors[0],
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
