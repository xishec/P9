import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

import { Thickness, TraceType, LineStrokeType } from 'src/constants/tool-constants';

@Injectable({
    providedIn: 'root',
})
export class AttributesManagerService {
    // tslint:disable-next-line: variable-name
    private _thickness: BehaviorSubject<number> = new BehaviorSubject(Thickness.Default);
    get thickness(): BehaviorSubject<number> {
        return this._thickness;
    }
    set thickness(value: BehaviorSubject<number>) {
        this._thickness = value;
    }
    private traceType: BehaviorSubject<string> = new BehaviorSubject(TraceType.Outline);
    private style: BehaviorSubject<number> = new BehaviorSubject(1);

    currentThickness: Observable<number> = this.thickness.asObservable();
    currentTraceType: Observable<string> = this.traceType.asObservable();
    currentStyle: Observable<number> = this.style.asObservable();

    // Added for line
    private lineStrokeType: BehaviorSubject<LineStrokeType> = new BehaviorSubject(LineStrokeType.Continuous);
    currentLineStrokeType: Observable<LineStrokeType> = this.lineStrokeType.asObservable();
    private lineJointType: BehaviorSubject<number> = new BehaviorSubject(1);
    currentLineJointType: Observable<number> = this.lineJointType.asObservable();
    private circleJointDiameter: BehaviorSubject<number> = new BehaviorSubject(Thickness.Default);
    currentCircleJointDiameter: Observable<number> = this.circleJointDiameter.asObservable();

    changeLineStrokeType(lineStrokeType: LineStrokeType): void {
        this.lineStrokeType.next(lineStrokeType);
    }
    changeLineJointType(lineJointType: number): void {
        this.lineJointType.next(lineJointType);
    }
    changeCircleJointDiameter(circleJointDiameter: number): void {
        this.circleJointDiameter.next(circleJointDiameter);
    }
    //
    changeThickness(thickness: number): void {
        this.thickness.next(thickness);
    }

    changeTraceType(traceType: string): void {
        this.traceType.next(traceType);
    }

    changeStyle(style: number): void {
        this.style.next(style);
    }
}
