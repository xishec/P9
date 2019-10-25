import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root';
})
export class UndoRedoerService {

    statesArray = new Array<>();

    saveCurrentState(): void {
        // this should add the current state of the work-zone into the statesArray[];
    }

    loadPreviousState(): void {
        // when pressing control+z the previous state should load (if there is a previous state);
        // current state should be updated
    }

    loadNextState(): void {
        // when pressing control-y the next state should load (if there is a next state);
        // current state should be updated
    }

    constructor() { };
}
