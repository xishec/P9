import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

import { Thickness, TraceType } from 'src/constants/tool-constants';

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
    private nbVertices: BehaviorSubject<number> = new BehaviorSubject(7);

    currentThickness: Observable<number> = this.thickness.asObservable();
    currentTraceType: Observable<string> = this.traceType.asObservable();
    currentStyle: Observable<number> = this.style.asObservable();
    currentNbVertices: Observable<number> = this.nbVertices.asObservable();

    changeThickness(thickness: number): void {
        this.thickness.next(thickness);
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
}
