import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OpenFileModalWindowComponent } from './open-file-modal-window.component';

describe('OpenFileModalWindowComponent', () => {
  let component: OpenFileModalWindowComponent;
  let fixture: ComponentFixture<OpenFileModalWindowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OpenFileModalWindowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OpenFileModalWindowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
