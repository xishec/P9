import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog, MatSnackBar } from '@angular/material';

import { FillAttributesComponent } from './fill-attributes.component';

describe('FillAttributesComponent', () => {
    let component: FillAttributesComponent;
    let fixture: ComponentFixture<FillAttributesComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [FillAttributesComponent],
            schemas: [NO_ERRORS_SCHEMA],
            providers: [
                FormBuilder,
                {
                    provide: MatDialog,
                    useValue: {},
                },
                {
                    provide: MatSnackBar,
                    useValue: {},
                },
            ],
        }).compileComponents();
        fixture = TestBed.createComponent(FillAttributesComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
