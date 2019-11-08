import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

import {
    FontSize,
    EraserSize,
    LineJointType,
    LineStrokeType,
    STAMP_TYPES,
    StampAngleOrientation,
    StampScaling,
    Thickness,
    TraceType,
} from 'src/constants/tool-constants';

@Injectable({
    providedIn: 'root',
})
export class AttributesManagerService {
    private thicknessValue: BehaviorSubject<number> = new BehaviorSubject(Thickness.Default);
    get thickness(): BehaviorSubject<number> {
        return this.thicknessValue;
    }
    set thickness(value: BehaviorSubject<number>) {
        this.thicknessValue = value;
    }

    private minThickness: BehaviorSubject<number> = new BehaviorSubject(1);
    private traceType: BehaviorSubject<string> = new BehaviorSubject(TraceType.Outline);
    private style: BehaviorSubject<number> = new BehaviorSubject(1);
    private nbVertices: BehaviorSubject<number> = new BehaviorSubject(3);
    private lineStrokeType: BehaviorSubject<LineStrokeType> = new BehaviorSubject(LineStrokeType.Continuous);
    private lineJointType: BehaviorSubject<LineJointType> = new BehaviorSubject(LineJointType.Curvy);
    private circleJointDiameter: BehaviorSubject<number> = new BehaviorSubject(Thickness.Default);
    private scaling: BehaviorSubject<number> = new BehaviorSubject(StampScaling.Default);
    private angle: BehaviorSubject<number> = new BehaviorSubject(StampAngleOrientation.Min);
    private stampType: BehaviorSubject<string> = new BehaviorSubject(STAMP_TYPES[0]);
    private eraserSize: BehaviorSubject<number> = new BehaviorSubject(EraserSize.Default);

    private boldState: BehaviorSubject<boolean> = new BehaviorSubject(false);
    private italicState: BehaviorSubject<boolean> = new BehaviorSubject(false);
    private font: BehaviorSubject<string> = new BehaviorSubject('Times New Roman, serif');
    private fontSize: BehaviorSubject<number> = new BehaviorSubject(FontSize.Default);
    private fontAlign: BehaviorSubject<string> = new BehaviorSubject('left');
    private _isWriting: BehaviorSubject<boolean> = new BehaviorSubject(false);
    get isWriting(): boolean {
        return this._isWriting.value;
    }

    currentThickness: Observable<number> = this.thickness.asObservable();
    currentMinThickness: Observable<number> = this.minThickness.asObservable();
    currentTraceType: Observable<string> = this.traceType.asObservable();
    currentStyle: Observable<number> = this.style.asObservable();
    currentNbVertices: Observable<number> = this.nbVertices.asObservable();
    currentLineStrokeType: Observable<LineStrokeType> = this.lineStrokeType.asObservable();
    currentLineJointType: Observable<LineJointType> = this.lineJointType.asObservable();
    currentCircleJointDiameter: Observable<number> = this.circleJointDiameter.asObservable();
    currentAngle: Observable<number> = this.angle.asObservable();
    currentScaling: Observable<number> = this.scaling.asObservable();
    currentStampType: Observable<string> = this.stampType.asObservable();
    currentEraserSize: Observable<number> = this.eraserSize.asObservable();

    currentBoldState: Observable<boolean> = this.boldState.asObservable();
    currentItalicState: Observable<boolean> = this.italicState.asObservable();
    currentFont: Observable<string> = this.font.asObservable();
    currentFontSize: Observable<number> = this.fontSize.asObservable();
    currenTfontAlign: Observable<string> = this.fontAlign.asObservable();
    currentIsWriting: Observable<boolean> = this._isWriting.asObservable();

    changeLineStrokeType(lineStrokeType: LineStrokeType): void {
        this.lineStrokeType.next(lineStrokeType);
    }

    changeLineJointType(lineJointType: LineJointType): void {
        this.lineJointType.next(lineJointType);
    }

    changeCircleJointDiameter(circleJointDiameter: number): void {
        this.circleJointDiameter.next(circleJointDiameter);
    }

    changeThickness(thickness: number): void {
        this.thickness.next(thickness);
    }

    changeMinThickness(thickness: number): void {
        this.minThickness.next(thickness);
    }

    changeTraceType(traceType: string): void {
        this.traceType.next(traceType);
    }

    changeStyle(style: number): void {
        this.style.next(style);
    }

    changeNbVertices(sideNum: number): void {
        this.nbVertices.next(sideNum);
    }

    changeScaling(scaling: number): void {
        this.scaling.next(scaling);
    }

    changeAngle(angle: number): void {
        this.angle.next(angle);
    }

    changeStampType(stampType: string): void {
        this.stampType.next(stampType);
    }

    changeBoldState(boldState: boolean) {
        this.boldState.next(boldState);
    }
    changeItalicState(italicState: boolean) {
        this.italicState.next(italicState);
    }
    changeFont(font: string) {
        this.font.next(font);
    }
    changeFontSize(fontSize: number) {
        this.fontSize.next(fontSize);
    }
    changeFontAlign(fontAlign: string) {
        this.fontAlign.next(fontAlign);
    }

    changeIsWriting(isWriting: boolean) {
        this._isWriting.next(isWriting);
    }
    changeEraserSize(size: number): void {
        this.eraserSize.next(size);
    }
}
