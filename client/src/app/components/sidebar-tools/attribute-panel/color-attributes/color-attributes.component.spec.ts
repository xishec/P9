import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ColorAttributesComponent } from './color-attributes.component';

describe('ColorAttributesComponent', () => {
  let component: ColorAttributesComponent;
  let fixture: ComponentFixture<ColorAttributesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ColorAttributesComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ColorAttributesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
