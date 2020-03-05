import { TestBed } from '@angular/core/testing';

import { DNDContainterService } from './dndcontainer.service';

describe('DNDContainterService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DNDContainterService = TestBed.get(DNDContainterService);
    expect(service).toBeTruthy();
  });
});
