import { Injectable } from '@angular/core';

import { BehaviorSubject } from 'rxjs';
import { Coords2D } from 'src/classes/Coords2D';
import { Selection } from 'src/classes/selection/selection';
import { CONTROL_POINTS, GRID_SIZE } from 'src/constants/tool-constants';
import { DrawingLoaderService } from '../../server/drawing-loader/drawing-loader.service';
import { GridToolService } from '../grid-tool/grid-tool.service';

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

    constructor(private gridToolService: GridToolService, public drawingLoaderService: DrawingLoaderService) {
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

        if (this.needToAlign(isFirstSelection)) {
            this.lastControlPoint = this.currentPoint;
            this.lastGridSize = this.currentGridSize;

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

    needToAlign(isFirstSelection: boolean): boolean {
        return (
            isFirstSelection ||
            this.lastControlPoint !== this.currentPoint ||
            this.lastGridSize !== this.currentGridSize
        );
    }

    magnetizeX(deltaX: number): number {
        this.totalDeltaX += deltaX;

        if (Math.abs(this.totalDeltaX) < this.currentGridSize) {
            return 0;
        } else {
            const tempTotalDelta = this.totalDeltaX;
            if (this.totalDeltaX < 0) {
                this.totalDeltaX = this.totalDeltaX + this.currentGridSize;
            } else {
                this.totalDeltaX = this.totalDeltaX - this.currentGridSize;
            }

            return tempTotalDelta > 0 ? this.currentGridSize : -this.currentGridSize;
        }
    }

    magnetizeY(deltaY: number): number {
        this.totalDeltaY += deltaY;

        if (Math.abs(this.totalDeltaY) < this.currentGridSize) {
            return 0;
        } else {
            const tempTotalDelta = this.totalDeltaY;
            if (this.totalDeltaY < 0) {
                this.totalDeltaY = this.totalDeltaY + this.currentGridSize;
            } else {
                this.totalDeltaY = this.totalDeltaY - this.currentGridSize;
            }

            return tempTotalDelta > 0 ? this.currentGridSize : -this.currentGridSize;
        }
    }
}
