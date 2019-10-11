import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PolygonAttributesComponent } from './polygon-attributes.component';

describe('PolygonAttributesComponent', () => {
  let component: PolygonAttributesComponent;
  let fixture: ComponentFixture<PolygonAttributesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PolygonAttributesComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PolygonAttributesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
