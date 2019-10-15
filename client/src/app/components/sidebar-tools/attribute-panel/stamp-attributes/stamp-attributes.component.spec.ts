import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StampAttributesComponent } from './stamp-attributes.component';

describe('StampAttributesComponent', () => {
  let component: StampAttributesComponent;
  let fixture: ComponentFixture<StampAttributesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StampAttributesComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StampAttributesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
