import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NO_ERRORS_SCHEMA } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog, MatSnackBar } from '@angular/material';
import { PolygonAttributesComponent } from './polygon-attributes.component';

describe('PolygonAttributesComponent', () => {
    let component: PolygonAttributesComponent;
    let fixture: ComponentFixture<PolygonAttributesComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [PolygonAttributesComponent],
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
        });
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(PolygonAttributesComponent);
        component = fixture.componentInstance;

        component.ngOnInit();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
