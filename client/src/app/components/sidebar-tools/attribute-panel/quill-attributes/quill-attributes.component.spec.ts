import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuillAttributesComponent } from './quill-attributes.component';

describe('QuillAttributesComponent', () => {
  let component: QuillAttributesComponent;
  let fixture: ComponentFixture<QuillAttributesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuillAttributesComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuillAttributesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
