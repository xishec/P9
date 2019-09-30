import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WelcomeModalWindowComponent } from './welcome-modal-window.component';
import { MatDialogRef } from '@angular/material';
import { FormBuilder } from '@angular/forms';
import { NO_ERRORS_SCHEMA } from '@angular/core';

fdescribe('WelcomeModalWindowComponent', () => {
  let component: WelcomeModalWindowComponent;
  let fixture: ComponentFixture<WelcomeModalWindowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WelcomeModalWindowComponent ],
      providers: [{
        provide: MatDialogRef,
        useValue: { }
      },{
        provide: FormBuilder,
        useValue: { },
      }],
    schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(WelcomeModalWindowComponent);
    component = fixture.componentInstance;

  }));
  
  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
