import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class ModalManagerService {
    modalIsDisplayed: BehaviorSubject<boolean> = new BehaviorSubject(false);
    currentModalIsDisplayed: Observable<boolean> = this.modalIsDisplayed.asObservable();

    setModalIsDisplayed(isDisplayed: boolean) {
        this.modalIsDisplayed.next(isDisplayed);
    }
}
