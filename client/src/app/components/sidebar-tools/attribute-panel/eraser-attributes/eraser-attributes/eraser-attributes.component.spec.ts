import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EraserAttributesComponent } from './eraser-attributes.component';

describe('EraserAttributesComponent', () => {
  let component: EraserAttributesComponent;
  let fixture: ComponentFixture<EraserAttributesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EraserAttributesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EraserAttributesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
