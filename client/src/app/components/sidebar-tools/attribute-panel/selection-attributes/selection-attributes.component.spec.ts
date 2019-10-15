import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectionAttributesComponent } from './selection-attributes.component';

describe('SelectionAttributesComponent', () => {
  let component: SelectionAttributesComponent;
  let fixture: ComponentFixture<SelectionAttributesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectionAttributesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectionAttributesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
