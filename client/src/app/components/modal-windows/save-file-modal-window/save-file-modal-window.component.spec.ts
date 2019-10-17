import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SaveFileModalWindowComponent } from './save-file-modal-window.component';

describe('SaveFileModalWindowComponent', () => {
  let component: SaveFileModalWindowComponent;
  let fixture: ComponentFixture<SaveFileModalWindowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SaveFileModalWindowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SaveFileModalWindowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
