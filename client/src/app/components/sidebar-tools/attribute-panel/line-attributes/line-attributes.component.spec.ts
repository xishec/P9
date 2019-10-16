import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LineAttributesComponent } from './line-attributes.component';

describe('LineAttributesComponent', () => {
  let component: LineAttributesComponent;
  let fixture: ComponentFixture<LineAttributesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LineAttributesComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LineAttributesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
