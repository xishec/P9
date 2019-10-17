import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EllipsisAttributesComponent } from './ellipsis-attributes.component';

describe('EllipsisAttributesComponent', () => {
  let component: EllipsisAttributesComponent;
  let fixture: ComponentFixture<EllipsisAttributesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EllipsisAttributesComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EllipsisAttributesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
