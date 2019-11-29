import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material';

import { BehaviorSubject } from 'rxjs';
import { Coords2D } from 'src/classes/Coords2D';
import { Selection } from 'src/classes/selection/selection';
import { CONTROL_POINTS, GRID_SIZE, MAGNETISM_STATE, SNACKBAR_DURATION } from 'src/constants/tool-constants';
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
    alignX = 0;
    alignY = 0;

    selection: Selection;

    isMagnetic: BehaviorSubject<boolean> = new BehaviorSubject(false);

    constructor(
        private gridToolService: GridToolService,
        public drawingLoaderService: DrawingLoaderService,
        private snackBar: MatSnackBar,
    ) {
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
        const stateTranslation = this.isMagnetic.value ? MAGNETISM_STATE.active : MAGNETISM_STATE.inactive;
        this.snackBar.open(`Le magnétisme est ${stateTranslation}`, '', {
            duration: SNACKBAR_DURATION,
        });
    }

    magnetizeXY(deltaX: number, deltaY: number): Coords2D {
        this.updateControlPointPosition();

        const magnetizedCoords = new Coords2D(0, 0);

        const remainderX = this.currentPointPosition.x % this.currentGridSize;
        const remainderY = this.currentPointPosition.y % this.currentGridSize;

        this.alignX = remainderX < this.currentGridSize / 2 ? -remainderX : this.currentGridSize - remainderX;
        this.alignY = remainderY < this.currentGridSize / 2 ? -remainderY : this.currentGridSize - remainderY;

        magnetizedCoords.x = this.magnetizeX(deltaX);
        magnetizedCoords.y = this.magnetizeY(deltaY);

        return magnetizedCoords;
    }

    magnetizeX(deltaX: number): number {
        this.totalDeltaX += deltaX;

        if (this.alignX !== 0) {
            return this.alignX;
        }

        if (Math.abs(this.totalDeltaX) < this.currentGridSize) {
            return 0;
        } else {
            const oldTotalDeltaX = this.totalDeltaX;
            console.log(this.totalDeltaX);

            const multipierX = Math.abs(Math.floor(this.totalDeltaX / this.currentGridSize));

            this.totalDeltaX =
                this.totalDeltaX < 0
                    ? this.totalDeltaX + this.currentGridSize * multipierX
                    : this.totalDeltaX - this.currentGridSize * multipierX;

            return oldTotalDeltaX > 0 ? this.currentGridSize * multipierX : -this.currentGridSize * multipierX;
        }
    }

    magnetizeY(deltaY: number): number {
        this.totalDeltaY += deltaY;

        if (this.alignY !== 0) {
            return this.alignY;
        }

        if (Math.abs(this.totalDeltaY) < this.currentGridSize) {
            return 0;
        } else {
            const oldTotalDeltaY = this.totalDeltaY;

            const multipierY = Math.abs(Math.floor(this.totalDeltaY / this.currentGridSize));

            this.totalDeltaY =
                this.totalDeltaY < 0
                    ? this.totalDeltaY + this.currentGridSize * multipierY
                    : this.totalDeltaY - this.currentGridSize * multipierY;

            return oldTotalDeltaY > 0 ? this.currentGridSize * multipierY : -this.currentGridSize * multipierY;
        }
    }
}
