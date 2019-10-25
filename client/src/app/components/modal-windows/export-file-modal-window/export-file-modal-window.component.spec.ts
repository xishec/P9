import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExportFileModalWindowComponent } from './export-file-modal-window.component';

describe('ExportFileModalWindowComponent', () => {
  let component: ExportFileModalWindowComponent;
  let fixture: ComponentFixture<ExportFileModalWindowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExportFileModalWindowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExportFileModalWindowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
