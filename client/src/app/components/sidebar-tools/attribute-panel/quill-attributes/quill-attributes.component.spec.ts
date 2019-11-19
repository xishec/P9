import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuillAttributesComponent } from './quill-attributes.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog, MatSnackBar } from '@angular/material';

describe('QuillAttributesComponent', () => {
    let component: QuillAttributesComponent;
    let fixture: ComponentFixture<QuillAttributesComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ QuillAttributesComponent ],
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
            ]
        })
        .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(QuillAttributesComponent);
        component = fixture.componentInstance;
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
