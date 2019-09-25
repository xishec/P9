import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

import { TraceType, Thickness } from '../../constants';

@Injectable({
    providedIn: 'root',
})
export class AttributesManagerService {
    private thickness: BehaviorSubject<number> = new BehaviorSubject(Thickness.Default);
    private traceType: BehaviorSubject<string> = new BehaviorSubject(TraceType.Outline);
    currentThickness: Observable<number> = this.thickness.asObservable();
    currentTraceType: Observable<string> = this.traceType.asObservable();

    changeThickness(thickness: number): void {
        this.thickness.next(thickness);
    }

    changeTraceType(traceType: string): void {
        this.traceType.next(traceType);
    }
}
