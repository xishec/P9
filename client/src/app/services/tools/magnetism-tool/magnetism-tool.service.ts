import { Injectable, OnInit } from '@angular/core';
import { CONTROL_POINTS } from 'src/constants/tool-constants';
import { GridToolService } from '../grid-tool/grid-tool.service';
import { SelectionToolService } from '../selection-tool/selection-tool.service';
import { Coords2D } from 'src/classes/Coords2D';

@Injectable({
    providedIn: 'root',
})
export class MagnetismToolService implements OnInit {
    currentPoint: CONTROL_POINTS;
    currentPointPosition: Coords2D;
    currentGridSize: number;

    magnetize(deltaX: number, deltaY: number) {}
    constructor(private gridToolService: GridToolService, private selectionToolService: SelectionToolService) {
        // Prendre du tool selector si ca chie
        this.currentPointPosition = new Coords2D(0, 0);
    }

    ngOnInit() {
        this.gridToolService.size.subscribe((size: number) => {
            this.currentGridSize = size;
        });
    }

    updateControlPointPosition(): void {
        if (this.currentPoint === CONTROL_POINTS.CenterMiddle) {
            const selectionBox: SVGRectElement = this.selectionToolService.selection.selectionBox;
            const x = (selectionBox.x.baseVal.value + selectionBox.width.baseVal.value) / 2;
            const y = (selectionBox.y.baseVal.value + selectionBox.height.baseVal.value) / 2;
            this.currentPointPosition.x = x;
            this.currentPointPosition.y = y;
        } else {
            const x = this.selectionToolService.selection.controlPoints[this.currentPoint].cx.baseVal.value;
            const y = this.selectionToolService.selection.controlPoints[this.currentPoint].cy.baseVal.value;
            this.currentPointPosition.x = x;
            this.currentPointPosition.y = y;
        }
    }
}
