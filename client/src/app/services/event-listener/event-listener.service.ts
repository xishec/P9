import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class EventListenerService {

    constructor() { 
        console.log('constructing service');
        window.addEventListener('mousedown', (event) => {
            console.log('event is listening');
        });
    }
}
