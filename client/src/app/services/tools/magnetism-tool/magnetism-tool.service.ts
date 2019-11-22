import { Injectable, OnInit } from '@angular/core';
import { CONTROL_POINTS, GRID_SIZE } from 'src/constants/tool-constants';
import { GridToolService } from '../grid-tool/grid-tool.service';
import { SelectionToolService } from '../selection-tool/selection-tool.service';
import { Coords2D } from 'src/classes/Coords2D';
import { BehaviorSubject } from 'rxjs';
import { DrawingLoaderService } from '../../server/drawing-loader/drawing-loader.service';

@Injectable({
    providedIn: 'root',
})
export class MagnetismToolService implements OnInit {
    currentPoint: CONTROL_POINTS;
    currentPointPosition: Coords2D;
    currentGridSize: number;

    state: BehaviorSubject<boolean> = new BehaviorSubject(false);

    magnetize(deltaX: number, deltaY: number) {}
    constructor(
        private gridToolService: GridToolService,
        private selectionToolService: SelectionToolService,
        private drawingLoaderService: DrawingLoaderService,
    ) {
        // Prendre du tool selector si ca chie
        this.currentPoint = CONTROL_POINTS.TopLeft;
        this.currentPointPosition = new Coords2D(0, 0);
        this.currentGridSize = GRID_SIZE.Default;
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

    changeState(state: boolean): void {
        if (!this.drawingLoaderService.untouchedWorkZone.value) {
            this.state.next(state);
        }
    }

    switchState(): void {
        this.state.value ? this.changeState(false) : this.changeState(true);
    }
}
