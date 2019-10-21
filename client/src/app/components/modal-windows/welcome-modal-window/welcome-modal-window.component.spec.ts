import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { MatDialogRef } from '@angular/material';

import { WelcomeModalWindowComponent } from './welcome-modal-window.component';
import { ModalManagerService } from 'src/app/services/modal-manager/modal-manager.service';

describe('WelcomeModalWindowComponent', () => {
    let component: WelcomeModalWindowComponent;
    let fixture: ComponentFixture<WelcomeModalWindowComponent>;
    let modalManagerService: ModalManagerService;

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
                            provide: ModalManagerService,
                            useValue: {
                                setModalIsDisplayed: () => null,
                            },
                        },
                    ],
                },
            })
            .compileComponents();

        fixture = TestBed.createComponent(WelcomeModalWindowComponent);
        component = fixture.componentInstance;

        modalManagerService = fixture.debugElement.injector.get(ModalManagerService);
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should close dialog when form is submitted', () => {
        const SPY = spyOn(component[`dialogRef`], 'close');
        component.submitForm();
        expect(SPY).toHaveBeenCalled();
    });

    it('should set modal display flag to false when form is submitted', () => {
        const SPY = spyOn(modalManagerService, 'setModalIsDisplayed');
        component.submitForm();
        expect(SPY).toHaveBeenCalledWith(false);
    });
});
