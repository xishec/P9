import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class ShortcutsManagerService {
    private isOnInput: BehaviorSubject<boolean> = new BehaviorSubject(false);

    currentIsOnInput: Observable<boolean> = this.isOnInput.asObservable();

    changeIsOnInput(isOnInput: boolean) {
        this.isOnInput.next(isOnInput);
    }
}
