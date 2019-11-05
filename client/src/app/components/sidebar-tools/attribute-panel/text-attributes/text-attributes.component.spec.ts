import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TextAttributesComponent } from './text-attributes.component';

describe('TextAttributesComponent', () => {
  let component: TextAttributesComponent;
  let fixture: ComponentFixture<TextAttributesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TextAttributesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TextAttributesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
