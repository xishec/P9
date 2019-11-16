import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { MatDialog, MatSnackBar } from '@angular/material';

import { SprayCanAttributesComponent } from './spray-can-attributes.component';

describe('SprayCanAttributesComponent', () => {
    let component: SprayCanAttributesComponent;
    let fixture: ComponentFixture<SprayCanAttributesComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [SprayCanAttributesComponent],
            providers: [
                FormBuilder,
                SprayCanAttributesComponent,
                {
                    provide: MatDialog,
                },
                {
                    provide: MatSnackBar,
                    useValue: {},
                },
            ],
            schemas: [NO_ERRORS_SCHEMA],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(SprayCanAttributesComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
