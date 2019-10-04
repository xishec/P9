import { Injectable } from '@angular/core';
import { ColorToolService } from '../color-tool/color-tool.service';

@Injectable({
    providedIn: 'root',
})
export class PolygonToolService {
    colorToolService: ColorToolService;
    fillColor = '';
    strokeColor = '';

    constructor() {}

    initializeColorToolService(colorToolService: ColorToolService) {
        this.colorToolService = colorToolService;
        this.colorToolService.primaryColor.subscribe((fillColor: string) => {
            this.fillColor = fillColor;
            //this.updateTraceType(this.traceType);
        });
        this.colorToolService.secondaryColor.subscribe((strokeColor: string) => {
            this.strokeColor = strokeColor;
            //this.updateTraceType(this.traceType);
        });
    }
}
