import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MagnetismAttributesComponent } from './magnetism-attributes.component';

describe('MagnetismAttributesComponent', () => {
  let component: MagnetismAttributesComponent;
  let fixture: ComponentFixture<MagnetismAttributesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MagnetismAttributesComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MagnetismAttributesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
