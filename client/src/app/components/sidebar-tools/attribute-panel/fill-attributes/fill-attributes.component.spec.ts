import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FillAttributesComponent } from './fill-attributes.component';

describe('FillAttributesComponent', () => {
  let component: FillAttributesComponent;
  let fixture: ComponentFixture<FillAttributesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FillAttributesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FillAttributesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
