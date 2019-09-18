import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WelcomeModalWindowComponent } from './welcome-modal-window.component';

describe('WelcomeModalWindowComponent', () => {
  let component: WelcomeModalWindowComponent;
  let fixture: ComponentFixture<WelcomeModalWindowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WelcomeModalWindowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WelcomeModalWindowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
