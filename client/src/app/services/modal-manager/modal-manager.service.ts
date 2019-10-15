import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class ModalManagerService {
    private modalIsDisplayed: BehaviorSubject<boolean> = new BehaviorSubject(false);
    currentDisplayNewDrawingModalWindow: Observable<boolean> = this.modalIsDisplayed.asObservable();

    setModalIsDisplayed(isDisplayed: boolean) {
        this.modalIsDisplayed.next(isDisplayed);
    }
}
