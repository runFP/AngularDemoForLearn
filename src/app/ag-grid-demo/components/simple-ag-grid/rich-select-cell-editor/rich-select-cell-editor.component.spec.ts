import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RichSelectCellEditorComponent } from './rich-select-cell-editor.component';

describe('RichSelectCellEditorComponent', () => {
  let component: RichSelectCellEditorComponent;
  let fixture: ComponentFixture<RichSelectCellEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RichSelectCellEditorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RichSelectCellEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
