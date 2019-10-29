import { Renderer2 } from '@angular/core';
import { HTMLAttribute } from 'src/constants/tool-constants';
import { SVG_NS, SIDEBAR_WIDTH } from 'src/constants/constants';
import { MouseCoords } from 'src/app/services/tools/abstract-tools/abstract-tool.service';

export class Selection {
    renderer: Renderer2;
    svgRef: SVGElement;

    selection: Set<SVGGElement> = new Set();
    selectionBox: SVGRectElement;
    controlPoints: SVGCircleElement[] = new Array(8);

    isAppended = false;

    constructor(renderer: Renderer2, svgReference: SVGElement) {
        this.renderer = renderer;
        this.svgRef = svgReference;

        this.initFullSelectionBox();
    }

    cleanUp(): void {
        this.removeFullSelectionBox();
        this.emptySelection();
        this.isAppended = false;
    }

    initFullSelectionBox(): void {
        this.selectionBox = this.renderer.createElement('rect', SVG_NS);
        this.renderer.setAttribute(this.selectionBox, HTMLAttribute.stroke, 'purple');
        this.renderer.setAttribute(this.selectionBox, HTMLAttribute.fill, 'none');
        for (let i = 0; i < 8; i++) {
            this.controlPoints[i] = this.renderer.createElement('circle', SVG_NS);
            this.renderer.setAttribute(this.controlPoints[i], 'r', '5');
            this.renderer.setAttribute(this.controlPoints[i], HTMLAttribute.stroke, 'purple');
            this.renderer.setAttribute(this.controlPoints[i], HTMLAttribute.fill, 'white');
        }
    }

    removeFullSelectionBox(): void {
        if (this.isAppended) {
            this.renderer.removeChild(this.svgRef, this.selectionBox);
            for (const ctrlPt of this.controlPoints) {
                this.renderer.removeChild(this.svgRef, ctrlPt);
            }
            this.isAppended = false;
        }
    }

    appendFullSelectionBox(): void {
        if (!this.isAppended) {
            this.renderer.appendChild(this.svgRef, this.selectionBox);
            for (const ctrlPt of this.controlPoints) {
                this.renderer.appendChild(this.svgRef, ctrlPt);
            }
            this.isAppended = true;
        }
    }

    getDOMRect(el: SVGGElement): DOMRect {
        return el.getBoundingClientRect() as DOMRect;
    }

    getStrokeWidth(el: SVGGElement): number {
        if (el.getAttribute(HTMLAttribute.stroke_width)) {
            return parseInt(el.getAttribute(HTMLAttribute.stroke_width) as string, 10);
        }

        return 0;
    }

    mouseIsInSelectionBox(currentMouseCoords: MouseCoords): boolean {
        const selectionBoxLeft = this.getDOMRect(this.selectionBox).x + window.scrollX - SIDEBAR_WIDTH;
        const selectionBoxRight =
            this.getDOMRect(this.selectionBox).x +
            window.scrollX -
            SIDEBAR_WIDTH +
            this.getDOMRect(this.selectionBox).width;
        const selectionBoxTop = this.getDOMRect(this.selectionBox).y + window.scrollY;
        const selectionBoxBottom =
            this.getDOMRect(this.selectionBox).y + window.scrollY + this.getDOMRect(this.selectionBox).height;
        return (
            currentMouseCoords.x >= selectionBoxLeft &&
            currentMouseCoords.x <= selectionBoxRight &&
            currentMouseCoords.y >= selectionBoxTop &&
            currentMouseCoords.y <= selectionBoxBottom &&
            this.isAppended
        );
    }

    mouseIsInControlPoint(currentMouseCoords: MouseCoords): boolean {
        for (const ctrlPt of this.controlPoints) {
            const cx = ctrlPt.cx.baseVal.value;
            const cy = ctrlPt.cy.baseVal.value;
            const r = ctrlPt.r.baseVal.value;

            const distX = currentMouseCoords.x - cx;
            const distY = currentMouseCoords.y - cy;

            if (Math.abs(distX) <= r && Math.abs(distY) <= r && this.isAppended) {
                return true;
            }
        }

        return false;
    }

    findLeftMostCoord(): number {
        const leftCoords: number[] = new Array();

        for (const el of this.selection) {
            leftCoords.push(this.getDOMRect(el).x + window.scrollX - SIDEBAR_WIDTH - this.getStrokeWidth(el) / 2);
        }

        return Math.min.apply(Math, leftCoords);
    }

    findRightMostCoord(): number {
        const rightCoords: number[] = new Array();

        for (const el of this.selection) {
            rightCoords.push(
                this.getDOMRect(el).x +
                    window.scrollX -
                    SIDEBAR_WIDTH +
                    this.getDOMRect(el).width +
                    this.getStrokeWidth(el) / 2
            );
        }

        return Math.max.apply(Math, rightCoords);
    }

    findTopMostCoord(): number {
        const topCoords: number[] = new Array();

        for (const el of this.selection) {
            topCoords.push(this.getDOMRect(el).y + window.scrollY - this.getStrokeWidth(el) / 2);
        }

        return Math.min.apply(Math, topCoords);
    }

    findBottomMostCoord(): number {
        const bottomCoords: number[] = new Array();

        for (const el of this.selection) {
            bottomCoords.push(
                this.getDOMRect(el).y + window.scrollY + this.getDOMRect(el).height + this.getStrokeWidth(el) / 2
            );
        }

        return Math.max.apply(Math, bottomCoords);
    }

    updateFullSelectionBox(): void {
        if (!(this.selection.size > 0)) {
            this.removeFullSelectionBox();
            return;
        }
        const left = this.findLeftMostCoord();
        const right = this.findRightMostCoord();
        const top = this.findTopMostCoord();
        const bottom = this.findBottomMostCoord();

        this.renderer.setAttribute(this.selectionBox, 'x', left.toString());
        this.renderer.setAttribute(this.selectionBox, 'y', top.toString());
        this.renderer.setAttribute(this.selectionBox, HTMLAttribute.width, (right - left).toString());
        this.renderer.setAttribute(this.selectionBox, HTMLAttribute.height, (bottom - top).toString());

        this.updateControlPoints();
    }

    updateControlPoints(): void {
        // Top left corner
        this.renderer.setAttribute(
            this.controlPoints[0],
            HTMLAttribute.cx,
            this.selectionBox.x.baseVal.value.toString()
        );
        this.renderer.setAttribute(
            this.controlPoints[0],
            HTMLAttribute.cy,
            this.selectionBox.y.baseVal.value.toString()
        );

        // Top side
        this.renderer.setAttribute(
            this.controlPoints[1],
            HTMLAttribute.cx,
            (this.selectionBox.x.baseVal.value + this.selectionBox.width.baseVal.value / 2).toString()
        );
        this.renderer.setAttribute(
            this.controlPoints[1],
            HTMLAttribute.cy,
            this.selectionBox.y.baseVal.value.toString()
        );

        // Top right corner
        this.renderer.setAttribute(
            this.controlPoints[2],
            HTMLAttribute.cx,
            (this.selectionBox.x.baseVal.value + this.selectionBox.width.baseVal.value).toString()
        );
        this.renderer.setAttribute(
            this.controlPoints[2],
            HTMLAttribute.cy,
            this.selectionBox.y.baseVal.value.toString()
        );

        // Right side
        this.renderer.setAttribute(
            this.controlPoints[3],
            HTMLAttribute.cx,
            (this.selectionBox.x.baseVal.value + this.selectionBox.width.baseVal.value).toString()
        );
        this.renderer.setAttribute(
            this.controlPoints[3],
            HTMLAttribute.cy,
            (this.selectionBox.y.baseVal.value + this.selectionBox.height.baseVal.value / 2).toString()
        );

        // Bottom right corner
        this.renderer.setAttribute(
            this.controlPoints[4],
            HTMLAttribute.cx,
            (this.selectionBox.x.baseVal.value + this.selectionBox.width.baseVal.value).toString()
        );
        this.renderer.setAttribute(
            this.controlPoints[4],
            HTMLAttribute.cy,
            (this.selectionBox.y.baseVal.value + this.selectionBox.height.baseVal.value).toString()
        );

        // Bottom side
        this.renderer.setAttribute(
            this.controlPoints[5],
            HTMLAttribute.cx,
            (this.selectionBox.x.baseVal.value + this.selectionBox.width.baseVal.value / 2).toString()
        );
        this.renderer.setAttribute(
            this.controlPoints[5],
            HTMLAttribute.cy,
            (this.selectionBox.y.baseVal.value + this.selectionBox.height.baseVal.value).toString()
        );

        // Bottom left corner
        this.renderer.setAttribute(
            this.controlPoints[6],
            HTMLAttribute.cx,
            this.selectionBox.x.baseVal.value.toString()
        );
        this.renderer.setAttribute(
            this.controlPoints[6],
            HTMLAttribute.cy,
            (this.selectionBox.y.baseVal.value + this.selectionBox.height.baseVal.value).toString()
        );

        // Left side
        this.renderer.setAttribute(
            this.controlPoints[7],
            HTMLAttribute.cx,
            this.selectionBox.x.baseVal.value.toString()
        );
        this.renderer.setAttribute(
            this.controlPoints[7],
            HTMLAttribute.cy,
            (this.selectionBox.y.baseVal.value + this.selectionBox.height.baseVal.value / 2).toString()
        );
    }

    addToSelection(element: SVGGElement): void {
        this.selection.add(element);
        this.updateFullSelectionBox();
        if (this.selection.size > 0) {
            this.appendFullSelectionBox();
        }
    }

    removeFromSelection(element: SVGGElement): void {
        this.selection.delete(element);
        this.updateFullSelectionBox();
        if (this.selection.size == 0) {
            this.removeFullSelectionBox();
        }
    }

    emptySelection(): void {
        this.removeFullSelectionBox();
        this.selection.clear();
    }

    moveBy(currentMouseCoords: MouseCoords, lastMouseCoords: MouseCoords): void {
        const deltaX = currentMouseCoords.x - lastMouseCoords.x;
        const deltaY = currentMouseCoords.y - lastMouseCoords.y;
        for (const el of this.selection) {
            const transformsList = el.transform.baseVal;
            if (
                transformsList.numberOfItems === 0 ||
                transformsList.getItem(0).type !== SVGTransform.SVG_TRANSFORM_TRANSLATE
            ) {
                const svg: SVGSVGElement = this.renderer.createElement('svg', SVG_NS);
                const translateToZero = svg.createSVGTransform();
                translateToZero.setTranslate(0, 0);
                el.transform.baseVal.insertItemBefore(translateToZero, 0);
            }

            const initialTransform = transformsList.getItem(0);
            const offsetX = -initialTransform.matrix.e;
            const offsetY = -initialTransform.matrix.f;
            el.transform.baseVal.getItem(0).setTranslate(deltaX - offsetX, deltaY - offsetY);
        }

        this.updateFullSelectionBox();
    }
}
