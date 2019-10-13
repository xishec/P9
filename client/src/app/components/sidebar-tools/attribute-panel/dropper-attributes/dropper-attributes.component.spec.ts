import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DropperAttributesComponent } from './dropper-attributes.component';

describe('DropperAttributesComponent', () => {
  let component: DropperAttributesComponent;
  let fixture: ComponentFixture<DropperAttributesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DropperAttributesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DropperAttributesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
