import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SprayCanAttributesComponent } from './spray-can-attributes.component';

describe('SprayCanAttributesComponent', () => {
  let component: SprayCanAttributesComponent;
  let fixture: ComponentFixture<SprayCanAttributesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SprayCanAttributesComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SprayCanAttributesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
