import { TestBed } from '@angular/core/testing';

import { DrawStackService } from './draw-stack.service';

fdescribe('DrawStackService', () => {
  let service: DrawStackService;


  //beforeEach(() => TestBed.configureTestingModule({}));

  beforeEach(() => {
    service = new DrawStackService();
  })

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
