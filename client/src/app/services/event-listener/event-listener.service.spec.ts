import { TestBed, getTestBed } from '@angular/core/testing';

import { EventListenerService } from '../event-listener/event-listener.service';
import { ElementRef, Type, Renderer2 } from '@angular/core';
import { MatDialog } from '@angular/material';

describe('EventListenerService', () => {

    let injector: TestBed;
    let service: EventListenerService;
    let elementRef: ElementRef<SVGElement>

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
        elementRef = injector.get<ElementRef>(ElementRef as Type<ElementRef>);
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
    
    it('addEventListeners should call addEventListener 7 times', () => {
        const spyOnAddEventListener = spyOn(elementRef.nativeElement, 'addEventListener');

        service.addEventListeners();

        expect(spyOnAddEventListener).toHaveBeenCalledTimes(7);
    })
});
