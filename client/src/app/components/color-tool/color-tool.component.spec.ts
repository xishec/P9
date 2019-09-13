import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ColorToolComponent } from './color-tool.component';

describe('ColorToolComponent', () => {
  let component: ColorToolComponent;
  let fixture: ComponentFixture<ColorToolComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ColorToolComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ColorToolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
