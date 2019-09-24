import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class AttributesManagerService {
    private thickness: BehaviorSubject<number> = new BehaviorSubject(2);

    currentThickness: Observable<number> = this.thickness.asObservable();

    changeThickness(thickness: number): void {
        this.thickness.next(thickness);
    }
}
