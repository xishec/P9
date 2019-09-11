import { Component, OnInit } from '@angular/core';

import { DrawingInfo } from '../../../../class/DrawingInfo';
import { DrawingModalWindow } from '../../../services/drawing-modal-window/drawing-modal-window.service';

@Component({
    selector: 'app-work-zone',
    templateUrl: './work-zone.component.html',
    styleUrls: ['./work-zone.component.scss'],
})
export class WorkZoneComponent implements OnInit {
    drawingModalWindow: DrawingModalWindow;
    drawingInfo: DrawingInfo;

    constructor(drawingModalWindow: DrawingModalWindow) {
        this.drawingModalWindow = drawingModalWindow;
    }

    ngOnInit() {
        this.drawingModalWindow.currentInfo.subscribe((drawingInfo) => {
            this.drawingInfo = drawingInfo;
        });
    }

    changeStyle() {
        return {
            fill: '#' + this.drawingInfo.color.hex,
            'fill-opacity': this.drawingInfo.opacity,
            height: this.drawingInfo.height,
            width: this.drawingInfo.width,
        };
    }
}
