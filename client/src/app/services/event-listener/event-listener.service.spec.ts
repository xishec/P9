import { TestBed } from '@angular/core/testing';

import { EventListenerService } from '../event-listener.service';

fdescribe('EventListenerService', () => {
    beforeEach(() => TestBed.configureTestingModule({}));

    it('should be created', () => {
        const service: EventListenerService = TestBed.get(EventListenerService);
        expect(service).toBeTruthy();
    });
});
