import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class AttributesManagerService {
    private thickness: BehaviorSubject<number> = new BehaviorSubject(2);

    currentThickness = this.thickness.asObservable();

    changeThickness(thickness: number) {
        this.thickness.next(thickness);
    }
}
