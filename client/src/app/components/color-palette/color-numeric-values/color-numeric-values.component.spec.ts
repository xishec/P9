import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ColorNumericValuesComponent } from './color-numeric-values.component';

describe('ColorNumericValuesComponent', () => {
  let component: ColorNumericValuesComponent;
  let fixture: ComponentFixture<ColorNumericValuesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ColorNumericValuesComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ColorNumericValuesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
