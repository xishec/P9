import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class AttributesManagerService {
    private thickness: BehaviorSubject<number> = new BehaviorSubject(2);
    private traceType: BehaviorSubject<string> = new BehaviorSubject("Contour");
    currentThickness: Observable<number> = this.thickness.asObservable();
    currentTraceType: Observable<string> = this.traceType.asObservable();

    changeThickness(thickness: number): void {
        this.thickness.next(thickness);
    }

    changeTraceType(traceType: string):void {
        this.traceType.next(traceType);
    }
}
