import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StampAttributesComponent } from './stamp-attributes.component';

import { FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('StampAttributesComponent', () => {
    let component: StampAttributesComponent;
    let fixture: ComponentFixture<StampAttributesComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [StampAttributesComponent],
            schemas: [NO_ERRORS_SCHEMA],
            providers: [
                FormBuilder,
                {
                    provide: MatDialog,
                    useValue: {},
                },
            ],
        });
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(StampAttributesComponent);
        component = fixture.componentInstance;
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
