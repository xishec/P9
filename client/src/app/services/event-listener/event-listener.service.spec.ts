import { TestBed } from '@angular/core/testing';

import { EventListenerService } from '../event-listener/event-listener.service';
import { ElementRef } from '@angular/core';
import { MatDialog } from '@angular/material';

fdescribe('EventListenerService', () => {

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                {
                    provide: ElementRef,
                    useValue : {

                    }
                },
                {
                    provide: MatDialog,
                    useValue: {

                    }
                }
            ]
        });
    });

    it('should be created', () => {
        const service: EventListenerService = TestBed.get(EventListenerService);
        expect(service).toBeTruthy();
    });
});
