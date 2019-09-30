import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { MatDialogRef } from '@angular/material';

import { DrawingModalWindowComponent } from './drawing-modal-window.component';

describe('DrawingModalWindowComponent', () => {
    let component: DrawingModalWindowComponent;
    let fixture: ComponentFixture<DrawingModalWindowComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [DrawingModalWindowComponent],
            providers: [{
                provide: MatDialogRef,
                useValue: { },
            }, {
                provide: FormBuilder,
                useValue: { },
            }],
            schemas: [NO_ERRORS_SCHEMA],
        }).compileComponents();

        fixture = TestBed.createComponent(DrawingModalWindowComponent);
        component = fixture.componentInstance;

    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
