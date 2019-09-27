import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

import { Thickness, TraceType } from '../../../../constants/constants';

@Injectable({
    providedIn: 'root',
})
export class AttributesManagerService {
    private thickness: BehaviorSubject<number> = new BehaviorSubject(Thickness.Default);
    private traceType: BehaviorSubject<string> = new BehaviorSubject(TraceType.Outline);
    private style: BehaviorSubject<number> = new BehaviorSubject(1);

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
}
