import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DragAngDropDemoComponent } from './drag-ang-drop-demo.component';

describe('DragAngDropDemoComponent', () => {
  let component: DragAngDropDemoComponent;
  let fixture: ComponentFixture<DragAngDropDemoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DragAngDropDemoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DragAngDropDemoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
