import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class GridToolService {
    state: BehaviorSubject<boolean> = new BehaviorSubject(false);

    currentState: Observable<boolean> = this.state.asObservable();

    changeState(state: boolean) {
        this.state.next(state);
        console.log(state);
    }
}
