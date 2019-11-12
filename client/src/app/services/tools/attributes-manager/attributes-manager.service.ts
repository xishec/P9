import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import {
    BRUSH_STYLE,
    ERASER_SIZE,
    FONT_ALIGN,
    FONT_SIZE,
    LINE_JOINT_TYPE,
    LINE_STROKE_TYPE,
    STAMP_ANGLE_ORIENTATION,
    STAMP_SCALING,
    STAMP_TYPES,
    THICKNESS,
    TRACE_TYPE,
} from 'src/constants/tool-constants';

@Injectable({
    providedIn: 'root',
})
export class AttributesManagerService {
    private thicknessValue: BehaviorSubject<number> = new BehaviorSubject(THICKNESS.Default);
    get thickness(): BehaviorSubject<number> {
        return this.thicknessValue;
    }
    set thickness(value: BehaviorSubject<number>) {
        this.thicknessValue = value;
    }

    private minThickness: BehaviorSubject<number> = new BehaviorSubject(1);
    private traceType: BehaviorSubject<string> = new BehaviorSubject(TRACE_TYPE.Outline);
    private style: BehaviorSubject<BRUSH_STYLE> = new BehaviorSubject(BRUSH_STYLE.type1);
    private nbVertices: BehaviorSubject<number> = new BehaviorSubject(3);
    private lineStrokeType: BehaviorSubject<LINE_STROKE_TYPE> = new BehaviorSubject(LINE_STROKE_TYPE.Continuous);
    private lineJointType: BehaviorSubject<LINE_JOINT_TYPE> = new BehaviorSubject(LINE_JOINT_TYPE.Curvy);
    private circleJointDiameter: BehaviorSubject<number> = new BehaviorSubject(THICKNESS.Default);
    private scaling: BehaviorSubject<number> = new BehaviorSubject(STAMP_SCALING.Default);
    private angle: BehaviorSubject<number> = new BehaviorSubject(STAMP_ANGLE_ORIENTATION.Default);
    private stampType: BehaviorSubject<string> = new BehaviorSubject(STAMP_TYPES[0]);
    private eraserSize: BehaviorSubject<number> = new BehaviorSubject(ERASER_SIZE.Default);

    private boldState: BehaviorSubject<boolean> = new BehaviorSubject(false);
    private italicState: BehaviorSubject<boolean> = new BehaviorSubject(false);
    private font: BehaviorSubject<string> = new BehaviorSubject('Times New Roman, serif');
    private fontSize: BehaviorSubject<number> = new BehaviorSubject(FONT_SIZE.Default);
    private fontAlign: BehaviorSubject<FONT_ALIGN> = new BehaviorSubject(FONT_ALIGN.Start);
    private isWritingState: BehaviorSubject<boolean> = new BehaviorSubject(false);
    get isWriting(): boolean {
        return this.isWritingState.value;
    }

    currentThickness: Observable<number> = this.thickness.asObservable();
    currentMinThickness: Observable<number> = this.minThickness.asObservable();
    currentTraceType: Observable<string> = this.traceType.asObservable();
    currentStyle: Observable<BRUSH_STYLE> = this.style.asObservable();
    currentNbVertices: Observable<number> = this.nbVertices.asObservable();
    currentLineStrokeType: Observable<LINE_STROKE_TYPE> = this.lineStrokeType.asObservable();
    currentLineJointType: Observable<LINE_JOINT_TYPE> = this.lineJointType.asObservable();
    currentCircleJointDiameter: Observable<number> = this.circleJointDiameter.asObservable();
    currentAngle: Observable<number> = this.angle.asObservable();
    currentScaling: Observable<number> = this.scaling.asObservable();
    currentStampType: Observable<string> = this.stampType.asObservable();
    currentEraserSize: Observable<number> = this.eraserSize.asObservable();

    currentBoldState: Observable<boolean> = this.boldState.asObservable();
    currentItalicState: Observable<boolean> = this.italicState.asObservable();
    currentFont: Observable<string> = this.font.asObservable();
    currentFontSize: Observable<number> = this.fontSize.asObservable();
    currenTfontAlign: Observable<FONT_ALIGN> = this.fontAlign.asObservable();
    currentIsWriting: Observable<boolean> = this.isWritingState.asObservable();

    changeLineStrokeType(lineStrokeType: LINE_STROKE_TYPE): void {
        this.lineStrokeType.next(lineStrokeType);
    }

    changeLineJointType(lineJointType: LINE_JOINT_TYPE): void {
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

    changeStyle(style: BRUSH_STYLE): void {
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
    changeFontAlign(fontAlign: FONT_ALIGN) {
        this.fontAlign.next(fontAlign);
    }

    changeIsWriting(isWriting: boolean) {
        this.isWritingState.next(isWriting);
    }
    changeEraserSize(size: number): void {
        this.eraserSize.next(size);
    }
}
