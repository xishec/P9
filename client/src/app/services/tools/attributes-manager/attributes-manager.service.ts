import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class AttributesManagerService {
    private thickness: BehaviorSubject<number> = new BehaviorSubject(2);
    private style: BehaviorSubject<number> = new BehaviorSubject(1);

    currentThickness: Observable<number> = this.thickness.asObservable();
    currentStyle: Observable<number> = this.style.asObservable();

    changeThickness(thickness: number): void {
        this.thickness.next(thickness);
    }

    changeStyle(style: number): void {
        this.style.next(style);
    }
}
