import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class WelcomeModalWindowService {
    readonly storageKey = 'display welcome modal';
    private displayWelcomeModalWindow: BehaviorSubject<boolean> = new BehaviorSubject(true);

    currentDisplayWelcomeModalWindow: Observable<boolean> = this.displayWelcomeModalWindow.asObservable();

    getValueFromLocalStorage(): boolean {
        if (localStorage.getItem(this.storageKey)) {
            let key = localStorage.getItem(this.storageKey);
            if (key === 'true') {
                this.displayWelcomeModalWindow.next(true);
            }
            if (key === 'false') {
                this.displayWelcomeModalWindow.next(false);
            }
        }

        return this.displayWelcomeModalWindow.value;
    }

    setValueToLocalStorage(value: string): void {
        localStorage.setItem(this.storageKey, value);
        if (value === 'true') {
            this.displayWelcomeModalWindow.next(true);
        } else if (value == 'false') {
            this.displayWelcomeModalWindow.next(false);
        }
    }
}
