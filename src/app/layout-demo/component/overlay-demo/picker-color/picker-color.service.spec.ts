import { TestBed } from '@angular/core/testing';

import { PickerColorService } from './picker-color.service';

describe('PickerColorService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PickerColorService = TestBed.get(PickerColorService);
    expect(service).toBeTruthy();
  });
});
