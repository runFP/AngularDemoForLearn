import { TestBed } from '@angular/core/testing';

import { NgDragAndDropService } from './ng-drag-and-drop.service';

describe('NgDragAndDropService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: NgDragAndDropService = TestBed.get(NgDragAndDropService);
    expect(service).toBeTruthy();
  });
});
