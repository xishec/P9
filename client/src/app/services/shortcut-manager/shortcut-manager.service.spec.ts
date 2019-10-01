import { TestBed } from '@angular/core/testing';

import { ShortcutManagerService } from './shortcut-manager.service';

fdescribe('ShortcutManagerService', () => {
    beforeEach(() => TestBed.configureTestingModule({}));

    it('should be created', () => {
        const service: ShortcutManagerService = TestBed.get(ShortcutManagerService);
        expect(service).toBeTruthy();
    });

    it('should be created', () => {
        const service: ShortcutManagerService = TestBed.get(ShortcutManagerService);
        service[`isOnInput`].next = () => {};
        const SPY = spyOn(service[`isOnInput`], 'next');
        service.changeIsOnInput(true);
        expect(SPY).toHaveBeenCalledWith(true);
    });
});
