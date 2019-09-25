import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ColorQueueComponent } from './color-queue.component';

describe('ColorQueueComponent', () => {
  let component: ColorQueueComponent;
  let fixture: ComponentFixture<ColorQueueComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ColorQueueComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ColorQueueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
