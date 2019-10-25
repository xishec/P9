import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PenAttributesComponent } from './pen-attributes.component';

describe('PenAttributesComponent', () => {
  let component: PenAttributesComponent;
  let fixture: ComponentFixture<PenAttributesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PenAttributesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PenAttributesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
