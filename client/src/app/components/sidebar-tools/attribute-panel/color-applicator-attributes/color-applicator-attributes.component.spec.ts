import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ColorApplicatorAttributesComponent } from './color-applicator-attributes.component';

describe('ColorApplicatorAttributesComponent', () => {
  let component: ColorApplicatorAttributesComponent;
  let fixture: ComponentFixture<ColorApplicatorAttributesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ColorApplicatorAttributesComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ColorApplicatorAttributesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
