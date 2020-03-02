import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NgDragAndDropComponent } from './ng-drag-and-drop.component';

describe('NgDragAndDropComponent', () => {
  let component: NgDragAndDropComponent;
  let fixture: ComponentFixture<NgDragAndDropComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NgDragAndDropComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NgDragAndDropComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
