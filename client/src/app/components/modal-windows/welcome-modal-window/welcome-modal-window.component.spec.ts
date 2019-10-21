import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { MatDialogRef } from '@angular/material';

import { WelcomeModalWindowService } from 'src/app/services/welcome-modal-window/welcome-modal-window.service';
import { WelcomeModalWindowComponent } from './welcome-modal-window.component';

describe('WelcomeModalWindowComponent', () => {
    let component: WelcomeModalWindowComponent;
    let fixture: ComponentFixture<WelcomeModalWindowComponent>;
    let welcomeModalService: WelcomeModalWindowService;

    const dialogMock = {
        close: () => null,
    };

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [WelcomeModalWindowComponent],
            providers: [
                {
                    provide: MatDialogRef,
                    useValue: dialogMock,
                },
                {
                    provide: FormBuilder,
                    useValue: {},
                },
            ],
            schemas: [NO_ERRORS_SCHEMA],
        })
            .overrideComponent(WelcomeModalWindowComponent, {
                set: {
                    providers: [
                        {
                            provide: WelcomeModalWindowService,
                            useValue: {
                                changeWelcomeModalWindowClosed: () => null,
                            },
                        },
                    ],
                },
            })
            .compileComponents();

        fixture = TestBed.createComponent(WelcomeModalWindowComponent);
        component = fixture.componentInstance;

        welcomeModalService = fixture.debugElement.injector.get(WelcomeModalWindowService);
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should close dialog when form is submitted', () => {
        const SPY = spyOn(component[`dialogRef`], 'close');
        component.submitForm();
        expect(SPY).toHaveBeenCalled();
    });

    it('should set Welcome Modal Window Closed flag to true when form is submitted', () => {
        const SPY = spyOn(welcomeModalService, 'changeWelcomeModalWindowClosed');
        component.submitForm();
        expect(SPY).toHaveBeenCalledWith(true);
    });
});
