import { Injectable } from '@angular/core';
import { CONTROL_POINTS, GRID_SIZE } from 'src/constants/tool-constants';
import { GridToolService } from '../grid-tool/grid-tool.service';
//import { SelectionToolService } from '../selection-tool/selection-tool.service';
import { Coords2D } from 'src/classes/Coords2D';
import { BehaviorSubject } from 'rxjs';
import { DrawingLoaderService } from '../../server/drawing-loader/drawing-loader.service';
import { Selection } from 'src/classes/selection/selection';

@Injectable({
    providedIn: 'root',
})
export class MagnetismToolService {
    currentPoint: CONTROL_POINTS;
    currentPointPosition: Coords2D;
    currentGridSize: number;
    totalDeltaX = 0;
    totalDeltaY = 0;
    lastControlPoint = 0;
    lastGridSize = GRID_SIZE.Default;

    selection: Selection;

    isMagnetic: BehaviorSubject<boolean> = new BehaviorSubject(false);

    constructor(
        private gridToolService: GridToolService,

        private drawingLoaderService: DrawingLoaderService,
    ) {
        // Prendre du tool selector si ca chie
        this.currentPoint = CONTROL_POINTS.TopLeft;
        this.currentPointPosition = new Coords2D(0, 0);
        this.currentGridSize = GRID_SIZE.Default;

        this.gridToolService.size.subscribe((size: number) => {
            this.currentGridSize = size;
        });
    }

    initializeService(selection: Selection) {
        this.selection = selection;
    }

    updateControlPointPosition(): void {
        console.log('current point:' + this.currentPoint);

        if (this.currentPoint === CONTROL_POINTS.CenterMiddle) {
            const selectionBox: SVGRectElement = this.selection.selectionBox;
            const x = selectionBox.x.baseVal.value + selectionBox.width.baseVal.value / 2;
            const y = selectionBox.y.baseVal.value + selectionBox.height.baseVal.value / 2;
            this.currentPointPosition.x = x;
            this.currentPointPosition.y = y;
        } else {
            const x = this.selection.controlPoints[this.currentPoint].cx.baseVal.value;
            const y = this.selection.controlPoints[this.currentPoint].cy.baseVal.value;
            this.currentPointPosition.x = x;
            this.currentPointPosition.y = y;
        }
    }

    changeState(state: boolean): void {
        if (!this.drawingLoaderService.untouchedWorkZone.value) {
            this.isMagnetic.next(state);
        }
    }

    switchState(): void {
        this.isMagnetic.value ? this.changeState(false) : this.changeState(true);
    }

    magnetizeXY(deltaX: number, deltaY: number, isFirstSelection: boolean): Coords2D {
        this.updateControlPointPosition();

        const magnetizedCoords = new Coords2D(0, 0);

        if (
            isFirstSelection ||
            this.lastControlPoint !== this.currentPoint ||
            this.lastGridSize !== this.currentGridSize
        ) {
            this.lastControlPoint = this.currentPoint;
            this.lastGridSize = this.currentGridSize;

            console.log('XFIRST SELECTION');

            const remainderX = this.currentPointPosition.x % this.currentGridSize;
            const remainderY = this.currentPointPosition.y % this.currentGridSize;

            magnetizedCoords.x =
                remainderX < this.currentGridSize / 2 ? -remainderX : this.currentGridSize - remainderX;
            magnetizedCoords.y =
                remainderY < this.currentGridSize / 2 ? -remainderY : this.currentGridSize - remainderY;
            return magnetizedCoords;
        }

        magnetizedCoords.x = this.magnetizeX(deltaX);
        magnetizedCoords.y = this.magnetizeY(deltaY);

        return magnetizedCoords;
    }

    magnetizeX(deltaX: number): number {
        this.totalDeltaX += deltaX;

        this.currentPointPosition.x = Math.round(this.currentPointPosition.x);

        if (Math.abs(this.totalDeltaX) < this.currentGridSize) {
            return 0;
        } else {
            console.log('total deltaX: ' + this.totalDeltaX);

            const tempTotalDelta = this.totalDeltaX;
            this.totalDeltaX = 0;
            if (tempTotalDelta > 0) {
                return this.currentGridSize;
            } else {
                return -this.currentGridSize;
            }
        }
    }

    magnetizeY(deltaY: number): number {
        this.totalDeltaY += deltaY;

        this.currentPointPosition.y = Math.round(this.currentPointPosition.y);

        if (Math.abs(this.totalDeltaY) < this.currentGridSize) {
            return 0;
        } else {
            console.log('total deltaY: ' + this.totalDeltaY);

            const tempTotalDelta = this.totalDeltaY;
            this.totalDeltaY = 0;
            if (tempTotalDelta > 0) {
                return this.currentGridSize;
            } else {
                return -this.currentGridSize;
            }
        }
    }
}
