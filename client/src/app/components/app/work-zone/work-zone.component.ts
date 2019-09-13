import { Component, OnInit } from '@angular/core';

import { DrawingInfo } from '../../../../classes/DrawingInfo';
import { DrawingModalWindowService } from '../../../services/drawing-modal-window/drawing-modal-window.service';

@Component({
    selector: 'app-work-zone',
    templateUrl: './work-zone.component.html',
    styleUrls: ['./work-zone.component.scss'],
})
export class WorkZoneComponent implements OnInit {
    drawingModalWindowService: DrawingModalWindowService;
    drawingInfo: DrawingInfo;
    ifShowWindow: boolean;

    constructor(drawingModalWindowService: DrawingModalWindowService) {
        this.drawingModalWindowService = drawingModalWindowService;
    }

    ngOnInit() {
        this.drawingModalWindowService.currentInfo.subscribe((drawingInfo) => {
            this.drawingInfo = drawingInfo;
        });
        this.drawingModalWindowService.currentIfShowWindow.subscribe((ifShowWindow) => {
            this.ifShowWindow = ifShowWindow;
        });
    }

    changeStyle(): Object {
        return {
            fill: '#' + this.drawingInfo.color.hex,
            'fill-opacity': this.drawingInfo.opacity,
            height: this.drawingInfo.height,
            width: this.drawingInfo.width,
        };
    }
}
