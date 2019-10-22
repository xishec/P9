import { TestBed, getTestBed } from '@angular/core/testing';

import { EventListenerService } from '../event-listener/event-listener.service';
import { ElementRef, Type, Renderer2 } from '@angular/core';
import { MatDialog } from '@angular/material';

describe('EventListenerService', () => {

    let injector: TestBed;
    let service: EventListenerService;
    let rendererMock: Renderer2;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                {
                    provide: ElementRef,
                    useValue : {
                        nativeElement : {
                            addEventListener: () => null,
                        }

                    }
                },
                {
                    provide: Renderer2,
                    useValue: {
                        createElement: () => null,
                        setAttribute: () => null,
                        appendChild: () => null,
                        listen: () => null,
                    },
                },
                {
                    provide: MatDialog,
                    useValue: {

                    }
                }
            ]
        });

        injector = getTestBed();
        service = TestBed.get(EventListenerService);

        rendererMock = injector.get<Renderer2>(Renderer2 as (unknown) as Type<Renderer2>);
    });

    

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('shouldAllowShortcut should return true when !isOnInput', () => {
        service.isOnInput = false;

        let result = service.shouldAllowShortcuts();

        expect(result).toBeTruthy();
    });

    it('shouldAllowShortcut should return false when isOnInput', () => {
        service.isOnInput = true;

        let result = service.shouldAllowShortcuts();

        expect(result).toBeFalsy();
    });
    
    it('addEventListeners should call listen 9 times', () => {
        const spyOnListen = spyOn(rendererMock, 'listen');

        service.addEventListeners();

        expect(spyOnListen).toHaveBeenCalledTimes(9);
    })
});
