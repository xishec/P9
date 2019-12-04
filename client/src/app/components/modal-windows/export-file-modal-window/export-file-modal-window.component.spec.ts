import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, FormsModule } from '@angular/forms';
import { MatDialogRef, MatSnackBar } from '@angular/material';

import { ModalManagerService } from 'src/app/services/modal-manager/modal-manager.service';
import { ExportFileModalWindowComponent } from './export-file-modal-window.component';

describe('ExportFileModalWindowComponent', () => {
    let component: ExportFileModalWindowComponent;
    let fixture: ComponentFixture<ExportFileModalWindowComponent>;

    const dialogMock = {
        close: () => null,
    };

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ExportFileModalWindowComponent],
            providers: [
                FormBuilder,
                {
                    provide: MatDialogRef,
                    useValue: {},
                },
            ],
            schemas: [NO_ERRORS_SCHEMA],
        })
            .overrideComponent(ExportFileModalWindowComponent, {
                set: {
                    providers: [
                        FormBuilder,
                        FormsModule,
                        {
                            provide: MatDialogRef,
                            useValue: dialogMock,
                        },
                        {
                            provide: ModalManagerService,
                            useValue: {
                                setModalIsDisplayed: () => null,
                            },
                        },
                        {
                            provide: MatSnackBar,
                            useValue: {
                                open: () => null,
                            },
                        },
                    ],
                },
            })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ExportFileModalWindowComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
