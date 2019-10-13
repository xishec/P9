import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EyedropperAttributesComponent } from './dropper-attributes.component';

describe('EyedropperAttributesComponent', () => {
  let component: EyedropperAttributesComponent;
  let fixture: ComponentFixture<EyedropperAttributesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EyedropperAttributesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EyedropperAttributesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
