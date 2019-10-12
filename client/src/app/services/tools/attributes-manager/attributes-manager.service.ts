import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

import { Thickness, TraceType, StampScaling, StampAngleOrientation } from 'src/constants/tool-constants';

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
    private scaling: BehaviorSubject<number> = new BehaviorSubject(StampScaling.Default);
    private angle: BehaviorSubject<number> = new BehaviorSubject(StampAngleOrientation.Default);

    currentThickness: Observable<number> = this.thickness.asObservable();
    currentTraceType: Observable<string> = this.traceType.asObservable();
    currentStyle: Observable<number> = this.style.asObservable();

    changeThickness(thickness: number): void {
        this.thickness.next(thickness);
    }

    changeTraceType(traceType: string): void {
        this.traceType.next(traceType);
    }

    changeStyle(style: number): void {
        this.style.next(style);
    }

    changeScaling(scaling: number): void {
        this.scaling.next(scaling);
    }

    changeAngle(angle: number): void {
        this.angle.next(angle);
    }
}
