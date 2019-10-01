import { getTestBed, TestBed } from '@angular/core/testing';

import { WelcomeModalWindowService } from './welcome-modal-window.service';

describe('WelcomeModalWindowService', () => {
    let injector: TestBed;
    let service: WelcomeModalWindowService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [WelcomeModalWindowService],
        });

        injector = getTestBed();
        service = injector.get(WelcomeModalWindowService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('when setValueToLocalStorage with true then displayWelcomeModalWindow is true', () => {
        service.setValueToLocalStorage('true');

        expect(service[`displayWelcomeModalWindow`].value).toBeTruthy();
    });

    it('when setValueToLocalStorage with false then displayWelcomeModalWindow is false', () => {
        service.setValueToLocalStorage('false');

        expect(service[`displayWelcomeModalWindow`].value).toBeFalsy();
    });

    it('when getValueFromLocalStorage if key is true then displayWelcomeModalWindow is true', () => {
        localStorage.setItem(service.storageKey, 'true');

        service.getValueFromLocalStorage();

        expect(service[`displayWelcomeModalWindow`].value).toBeTruthy();
    });

    it('when getValueFromLocalStorage if key is false then displayWelcomeModalWindow is false', () => {
        localStorage.setItem(service.storageKey, 'false');

        service.getValueFromLocalStorage();

        expect(service[`displayWelcomeModalWindow`].value).toBeFalsy();
    });
});
