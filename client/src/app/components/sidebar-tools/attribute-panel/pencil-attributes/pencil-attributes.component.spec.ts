import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PencilAttributesComponent } from './pencil-attributes.component';

describe('PencilAttributesComponent', () => {
  let component: PencilAttributesComponent;
  let fixture: ComponentFixture<PencilAttributesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PencilAttributesComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PencilAttributesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
