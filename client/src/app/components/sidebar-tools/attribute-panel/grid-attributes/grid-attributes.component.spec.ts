import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GridAttributesComponent } from './grid-attributes.component';

describe('GridAttributesComponent', () => {
  let component: GridAttributesComponent;
  let fixture: ComponentFixture<GridAttributesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GridAttributesComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GridAttributesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
