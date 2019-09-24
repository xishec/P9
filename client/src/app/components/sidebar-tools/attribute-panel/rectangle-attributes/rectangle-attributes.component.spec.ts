import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RectangleAttributesComponent } from './rectangle-attributes.component';

describe('RectangleAttributesComponent', () => {
  let component: RectangleAttributesComponent;
  let fixture: ComponentFixture<RectangleAttributesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RectangleAttributesComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RectangleAttributesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
