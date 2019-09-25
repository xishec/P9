import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BrushAttributesComponent } from './brush-attributes.component';

describe('BrushAttributesComponent', () => {
  let component: BrushAttributesComponent;
  let fixture: ComponentFixture<BrushAttributesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BrushAttributesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BrushAttributesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
